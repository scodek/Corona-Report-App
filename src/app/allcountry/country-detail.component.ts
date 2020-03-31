import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArcGisService } from '../shared/arcgis.service';
import { entryType } from './entryType';
import { } from 'googlemaps';
import { NewsApiService } from '../shared/newsapi.service';


@Component({
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit {
  pageTitle: string = "Country Detail";
  result: any;
  newsResult: any;
  filteredNews = [];
  countryProvince: entryType[] = [];
  filteredResult: entryType[] = [];
  errorMessage: string;
  @ViewChild('gmap', { static: true }) gmapElement: ElementRef;
  map: google.maps.Map;

  marker = new google.maps.Marker({});
  markers = [];

  constructor(private arcGisService: ArcGisService, private newsAPIService: NewsApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    let countryName = this.route.snapshot.paramMap.get('country');
    //console.log("hello : " + countryName);
    //Here I will call the news API service. that will show country
    //specific news

    this.newsAPIService.getCountrySpecificNews(countryName).subscribe({
      next: result => {
        this.newsResult = result,
          this.filteredNews = this.processNews(countryName)
        //console.log("this.filteredNews : " ,this.filteredNews);


      },
      error: err => this.errorMessage = err
    });


    //Here I am calling arcGisService service to get specific country information
    //on Coronavirus and plot them on google map
    //console.log("hello : " + this.route.snapshot.paramMap.get('country'));

    //console.log('this.pageTitle ='+this.pageTitle);
    this.pageTitle += `: ${countryName}`;

    this.arcGisService.getAllCountryInfo().subscribe({
      next: result => {
        this.result = result,
          this.filteredResult = this.processCountries(this.result, countryName)
        //console.log("res : " , this.filteredResult);
        this.plotOnGoogleMap()
        // this.markAffectedArea()

      },
      error: err => this.errorMessage = err
    });
  }

  //This process will filter country specific news on Corona virus
  //Currently all the reports are considered
  //later more specific to current date will be considered
  processNews(countryName) {

    let tempObj = {};
    let processedNews = [];
    let todayObj = new Date();
    let month = todayObj.getUTCMonth() + 1; 
    let day = todayObj.getUTCDate();
    let year = todayObj.getUTCFullYear();

    let today = year + "-" + month + "-" + day;
    //let regex = new RegExp(countryName,'g');
    let regex = new RegExp('corona', 'gi');
    this.newsResult.articles.forEach(eachArticle => {
      let publishedDate = eachArticle.publishedAt.match(/^\s*\d\d\d\d\-\d\d\-\d\d/g)[0].trim();
      //console.log("publishedDate = "+publishedDate);
      //if(publishedDate == today){
      if (eachArticle.title.match(regex)) {
        tempObj['title'] = eachArticle.title;
        tempObj['url'] = eachArticle.url;
        tempObj['desc'] = eachArticle.description;
        //console.log("tempObj ",tempObj);
        processedNews.push(tempObj);
        tempObj = {};
      }

      // }
    });

    return processedNews;
  }

  //THis process will create process country specific information
  processCountries(result, countryName) {
    let temp = [];
    for (let eachObj of result.features) {
      // console.log("feature = "+ eachObj.attributes.Country_Region);
      if (eachObj.attributes.Country_Region === countryName) {

        let tempObj = {
          'country': eachObj.attributes.Country_Region,
          'confirmed': eachObj.attributes.Confirmed,
          'state': eachObj.attributes.Province_State,
          'recovered': eachObj.attributes.Recovered,
          'deaths': eachObj.attributes.Deaths,
          'active': eachObj.attributes.Active,
          'lat': eachObj.attributes.Lat,
          'long': eachObj.attributes.Long_
        };
        temp.push(tempObj);

      }

    }

    return temp;

  }

  //Some big countries has state specific result. Here the map will
  // show the state specific results too 
  plotOnGoogleMap() {

    let latInit = this.filteredResult[0].lat;
    let longInit = this.filteredResult[0].long;
    let mapProp = {
      center: new google.maps.LatLng(latInit, longInit),
      zoom: 1,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


    this.filteredResult.forEach((eachObj) => {

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(eachObj.lat, eachObj.long),
        map: this.map,
        title: eachObj.state
      });

      let locRes = '';
      if (eachObj.state) {
        // console.log("eachObj.state =",eachObj.state);
        locRes = "State: " + eachObj.state;
      } else {
        locRes = "Country: " + eachObj.country;
      }
      let content = '<div style="height:50px:width:50px"><strong style="color:red">' + '<' + marker.getTitle() + '>' +
        '<p>' + locRes + '</p>' +
        '<p>Confirmed : ' + eachObj.confirmed + '</p>' +
        '<p>Recovered : ' + eachObj.recovered + '</p>' +
        '<p>Deaths : ' + eachObj.deaths + '</p>' +
        '</div>';

      //creating a new info window with markers info
      const infoWindow = new google.maps.InfoWindow({
        content: content
      });

      //Add click event to open info window on marker
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      marker.setMap(this.map);

    });

    //console.log("From the end of the function markAffectedArea.");

  }

  onBack(): void {
    this.router.navigate(['/countries']);
  }

}
