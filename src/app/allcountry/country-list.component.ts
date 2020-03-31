import { Component } from '@angular/core';
import { entryType } from './entryType';
import { ArcGisService } from '../shared/arcgis.service';

@Component({
    selector: 'country-list',
    templateUrl: './country-list.component.html'
})
export class CountryListComponent {

    pageTitle = 'List of Affected countires: ';
    result: any;
    errorMessage: string;
    filteredResult: entryType[] = [];
    res: {};
    filteredCountries = [];

    _listFilter: string;
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(_listFilter: string) {
        this._listFilter = _listFilter;
        this.filteredCountries = this._listFilter ? this.performFilter(this._listFilter) : this.filteredResult;
    }

    // THe filter functionality currently not working.Working on this now.
    performFilter(filterBy: string): entryType[] {

        filterBy = filterBy.toLocaleLowerCase().trim();
        //console.log("filterBy = ",filterBy);
        return this.filteredResult.filter((result) => {
            //console.log("filterBy = ",filterBy);
            //console.log("result.country.toLocaleLowerCase() =",result.country.toLocaleLowerCase());
            //return filterBy == result.country.toLocaleLowerCase()
            return result.country.toLocaleLowerCase().indexOf(filterBy) !== -1
        });

    }


    constructor(private arcGisService: ArcGisService) { }
    ngOnInit(): void {
        this.arcGisService.getAllCountryInfo().subscribe({
            next: result => {
                this.result = result,
                    this.processResult(this.result)
            },
            error: err => this.errorMessage = err
        });
        throw new Error("Method not implemented.");
    }

    processResult(result) {
        //console.log("type of filteredResult =" + typeof this.filteredResult); 
        for (let eachObj of result.features) {
            console.log("feature = " + eachObj.attributes.Country_Region);
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
            this.filteredResult.push(tempObj);


        }

    }

}