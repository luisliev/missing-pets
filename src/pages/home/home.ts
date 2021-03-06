import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, 
         GoogleMap,
         LatLng,
         CameraPosition,
         GoogleMapsEvent, 
         GoogleMapOptions,
         Marker,
         MarkerOptions} from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  status: boolean = true;
    
  @ViewChild('map') mapRef: ElementRef;
  public map: GoogleMap;
  
  lat: any;
  lng: any;

  myMarker: Marker;
  myMarkerOptions: MarkerOptions;
  
  constructor(
      public navCtrl: NavController, 
      public toastCtrl: ToastController, 
      private geo: Geolocation, 
      private googleMaps: GoogleMaps) {

  }

  ionViewDidLeave(){
    this.map.setVisible(false);
  }

  ionViewDidEnter(){
    this.map.setVisible(true);
  }

  ionViewDidLoad(){
        this.status = true;
        let loc: LatLng
        this.initMap();

        //once the map is ready move the camera into position
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
            this.map.setMyLocationEnabled(false);
            this.getLocation().then( res => {
                //Once the location is gotten we set the location on camera
                loc = new LatLng(res.coords.latitude, res.coords.longitude);
                
                this.animateCamera(loc);
                this.map.addMarker({
                    position: loc,
                    animation: 'DROP',
                    draggable: true,
                    });
            }).catch( err => {
                console.log(err);
                alert("ERROR -> " + err);
            });

            this.map.addEventListener(GoogleMapsEvent.MAP_CLICK).subscribe((latLng: LatLng) => {
                this.addMarker(latLng, this.map);
                alert("latLng: " + latLng);
            });
        });
    }

    initMap(){
        let element = this.mapRef.nativeElement;

        let mapOptions: GoogleMapOptions = {
          };        

        this.map = GoogleMaps.create(element, mapOptions);   
        
    }

    getLocation(){
        return this.geo.getCurrentPosition();
    }

    moveCamera(loc: LatLng){
      let options: CameraPosition<any> = {
          target: loc, 
          zoom: 15,
      };
      this.map.moveCamera(options);      
    }


    animateCamera(loc: LatLng){
        let options: CameraPosition<any> = {
        target: loc,
        zoom: 15,
        duration: 1000
        };
        this.map.animateCamera(options);
    }
    
    addMarker(position, map){
        if(this.myMarker != null){
            this.myMarker.setPosition(position);
        }else{
            return new google.maps.Marker({
                position,
                map
            });
        }     
    }

    myLocation(){
        let loc: LatLng;
        this.map.clear();
    
        //Method #3 for obtaining coordinates
        this.getLocation().then(res =>{
          //Once the location is gotten we set the location on camera
          loc = new LatLng(res.coords.latitude, res.coords.longitude);
    
          this.animateCamera(loc);
          this.map.addMarker({
            position: loc,
            animation: 'DROP',
            draggable: true,
          });
          }).catch( err => {
          console.log('---ERROR---');
          console.error(err);
          let toast = this.toastCtrl.create({
            message: 'GEOLOCATION ERROR',
            duration: 3000
          });
          toast.present();
        });
      }
    
}
        
