import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@Angular/common/http';
import { Observable, throwError } from 'rxjs';
import{catchError,tap,map} from 'rxjs/operators';
import { CountryInfo } from '../country-info';


@Injectable({
    providedIn:'root'
})
export class ArcGisService{
    private gisUrl = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=(Confirmed > 0)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Deaths desc,Country_Region asc,Province_State asc&outSR=102100&resultOffset=0&resultRecordCount=250&cacheHint=true';
    //this below URL is created just for testing
    //private gisUrl = 'api/dummy-testing-url.json';
    constructor(private http:HttpClient){}

    //getAllCountryInfo() : Observable<any>{
    getAllCountryInfo() : Observable<CountryInfo[]>{
        //return this.http.get<any>(this.gisUrl).pipe(
        return this.http.get<CountryInfo[]>(this.gisUrl).pipe(   
            map(response  => {
                return response['features']
                .map(eachFeature => {
                    let country = {};
                    country['country'] = eachFeature.attributes.Country_Region,
                    country['confirmed'] = eachFeature.attributes.Confirmed,
                    country['state'] = eachFeature.attributes.Province_State,
                    country['recovered'] = eachFeature.attributes.Recovered,
                    country['deaths'] = eachFeature.attributes.Deaths,
                    country['active'] = eachFeature.attributes.Active,
                    country['lat'] =  eachFeature.attributes.Lat,
                    country['long'] = eachFeature.attributes.Long_

                   // console.log("each country = ",country);
                    return country;
                }); 
                
                
                //as CountryInfo[];
            }),
            tap(data => console.log(`will print something later`)),
            catchError(this.handleError)
        );

       
    }

   private handleError(err:HttpErrorResponse){
    let errorMessage = '';
    if(err.error instanceof ErrorEvent){
        errorMessage = `An error has occurred ${err.error.message}`;
    }else{
        errorMessage = `server returned code: ${err.status}, error message is: ${err.message} `;
    }

    console.error(errorMessage);
    return throwError(errorMessage);

   }
}