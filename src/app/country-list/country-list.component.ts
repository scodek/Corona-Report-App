import { Component } from '@angular/core';
import { entryType } from '../entryType';
import { ArcGisService } from '../shared/arcgis.service';
import { CountryInfo } from '../country-info';

@Component({
    selector: 'country-list',
    templateUrl: './country-list.component.html'
})
export class CountryListComponent {

    pageTitle = 'List of Affected countires: ';
    result: CountryInfo[];
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
        
    }

    processResult(result) {
        //console.log("type of filteredResult =" + typeof this.filteredResult); 
        for (let eachObj of result) {
            
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


        }

    }

}