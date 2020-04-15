import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ArcGisService } from '../shared/arcgis.service';
import { entryType } from '../entryType';
import { KeyValue } from '@angular/common';
import { } from 'googlemaps';
/*import { GoogleMapApiService } from '../shared/google-map-api.service';*/
import { } from 'googlemaps';
import { CountryInfo } from '../country-info';

@Component({
    selector: 'affected-countries',
    templateUrl: './all-countries.component.html',
    styleUrls: ['./all-countries.component.css']

})
export class AllCountriesComponent implements OnInit {
    pageTitle: string = "Corona Report";
    @ViewChild('gmap', { static: true }) gmapElement: ElementRef;
    map: google.maps.Map;

    marker = new google.maps.Marker({});
    markers = [];

    result: CountryInfo[];
    errorMessage: string;
    filteredResult: entryType[] = [];
    filteredResultFinal: {};
    latLongObj = {};
    totalDeaths: number = 0;
    totalRecovered: number = 0;

    //I had to add this code fragment otherwise, my sorted order depending on confirmed cases 
    //passed from the component was not displayed in the template 
    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }

    //arcGisService service is defined in '../shared/arcgis.service'
    constructor(private arcGisService: ArcGisService) { }
    //constructor(private arcGisService : ArcGisService, private googleMapService : GoogleMapApiService){}
    ngOnInit(): void {

        this.arcGisService.getAllCountryInfo().subscribe({
            next: result => {
                this.result = result,
                console.log("result : ",result);
                    this.filteredResultFinal = this.processResult(this.result),
                    this.getGoogleMap(),
                    this.markAffectedArea()

            },
            error: err => this.errorMessage = err
        });


        //throw new Error("Throwing error from here : Method not implemented.");

    }


    //This function will process all the country specific information
    //and create a sorted list of decending order depending on the 
    //number of confirmed cases 
    processResult(result) {
        let res = {};
        let k = 0;
        // console.log("type of filteredResult =" + typeof this.filteredResult); 

        //result.features.forEach((eachObj) => {
        result.forEach((eachObj) => {
            //console.log("geaths : ", eachObj.deaths);
            this.totalDeaths += parseInt(eachObj.deaths, 10);
            this.totalRecovered += parseInt(eachObj.recovered, 10);
            let tempObj = {
                'country': eachObj.country,
                'confirmed': eachObj.confirmed,
                'state': eachObj.state,
                'recovered': eachObj.recovered,
                'deaths': eachObj.deaths,
                'active': eachObj.active,
                'lat': eachObj.lat,
                'long': eachObj.long
            };

            this.filteredResult.push(tempObj);

            if (!this.latLongObj.hasOwnProperty(eachObj.country)) {
                this.latLongObj[eachObj.country] = { lat: eachObj.lat, long: eachObj.long };
            }
            //Since the arcgis brings sometimes multiple entries (state specific) for some big countries such
            // as China, US so I here calculated total confirmed cases
            if (res.hasOwnProperty(eachObj.country)) {
                res[eachObj.country] += eachObj.confirmed;
            } else {
                res[eachObj.country] = eachObj.confirmed;
            }


        });

        return Object
            .keys(res)
            .sort((country1, country2) => parseInt(res[country2]) - parseInt(res[country1]))
            .reduce((_sortedObj, key) => ({
                ..._sortedObj,
                [key]: res[key]
            }), {});
    }



    getGoogleMap() {
        let mapProp = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    }

    markAffectedArea() {

        Object.keys(this.latLongObj).forEach((eachCountry) => {

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.latLongObj[eachCountry].lat, this.latLongObj[eachCountry].long),
                map: this.map,
                title: eachCountry
            });

            //Each place marker will appear with place name and number of
            //confirmed cases
            let content = '<div style="height:50px:width:50px"><strong style="color:red">' + '<' + marker.getTitle() + '>' +
                '<p>Name : ' + eachCountry + '</p>' +
                '<p>Confirmed : ' + this.filteredResultFinal[eachCountry] + '</p>' +
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


}