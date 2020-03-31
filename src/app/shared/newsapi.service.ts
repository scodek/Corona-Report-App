import { Injectable } from "@angular/core";
import {HttpClient,HttpErrorResponse} from '@Angular/common/http';
import { Observable, throwError } from 'rxjs';
import{catchError,tap} from 'rxjs/operators';

@Injectable({
    providedIn : 'root'
})

export class NewsApiService{
    searchterm : string = '';
    private newsUrl : string = '';
    //The API key I received after registering to the site 'https://newsapi.org/s/google-news-api'
    //private newsUrl = `http://newsapi.org/v2/everything?q=${this.searchterm}&apiKey=b207cb3fc3e946cca65f829eaa54e6bb`;
    constructor(private http:HttpClient){}

    getCountrySpecificNews(countryName) : Observable<any>{
        this.searchterm = countryName;
        this.newsUrl = `http://newsapi.org/v2/everything?q=${this.searchterm}&apiKey=b207cb3fc3e946cca65f829eaa54e6bb`;
        console.log('countryName= '+countryName);
        console.log("URL is : ", this.newsUrl);
        return this.http.get<any>(this.newsUrl).pipe(
            /*tap(data => console.log(`returned data = ${JSON.stringify(data)}`)),*/
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



