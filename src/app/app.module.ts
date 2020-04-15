import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@Angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AllCountriesComponent } from './allcountry/all-countries.component';
import { CountryListComponent } from './country-list/country-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { CountryDetailComponent } from './country-detail/country-detail.component';

const appRoutes : Routes = [
  {path:'home',component: AllCountriesComponent},
  {path : 'countries', component : CountryListComponent},
  {
		path: "",
		pathMatch: "full",
		redirectTo: "home"
	},
  { path: ' ', component: AllCountriesComponent },
  {path: 'country/:country',component:CountryDetailComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AllCountriesComponent,
    CountryListComponent,
    CountryDetailComponent,
    PageNotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
