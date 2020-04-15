export class entryType{
    country: string;
    confirmed : string;
    state : string;
    recovered:string;
    active : string;
    deaths:string;
    lat : number;
    long : number;


    constructor(country: string, state:string, confirmed: string, recovered:string, active:string,deaths:string,lat:number,long:number) {
        this.country = country;
        this.confirmed = confirmed;
        this.state = state;
        this.recovered = recovered;
        this.deaths = deaths;
        this.active = active;
        this.lat = lat;
        this.long = long;
    }
}