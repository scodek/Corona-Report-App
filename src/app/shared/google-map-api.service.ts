/*import { Injectable } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { } from 'googlemaps';

@Injectable({
    providedIn:'root'
})
export class GoogleMapApiService{
    @ViewChild('gmap', {static: true}) gmapElement: ElementRef;
    map: google.maps.Map;
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(30.9756403482891, 112.270692167452),
        map: this.map,
      });

    getMap(){
        console.log("from getMap : this is called");
        let mapProp = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 1,
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.marker.setMap(this.map);
    }
}*/