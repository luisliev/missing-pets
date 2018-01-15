import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Platform } from 'ionic-angular';
import { storage } from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Geocoder,
  BaseArrayClass,
  GeocoderResult,
  Marker,
  LatLng
} from '@ionic-native/google-maps';

declare var plugin: any;

@IonicPage()
@Component({
  selector: 'page-add-pet',
  templateUrl: 'add-pet.html',
})
export class AddPetPage {

  @ViewChild('map_canvas') element: ElementRef;

  map: GoogleMap;
  address: string;
  markerlatlng: LatLng;
  value: string = null;
  petTypeList: Array<{ value: string, text: string, checked: boolean }> = [];
  NewPet: Array<{ type: string, lostFound: string, picture: string, extraInfo: string, petLocation: any }> = [];

  petType: any;
  lostOrFound: any;
  photo: any;
  moreInfo: any;
  petAddress: any;

  constructor(
    private camera: Camera, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController,
    private geo: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private plt: Platform,
    private googleMaps: GoogleMaps) {

    this.petTypeList.push({value: "dog", text: "Dog", checked: false});
    this.petTypeList.push({value: "cat", text: "Cat", checked: false});
    this.petTypeList.push({value: "bird", text: "Bird", checked: false});
    this.petTypeList.push({value: "rabbit", text: "Rabbit", checked: false});
    this.petTypeList.push({value: "snake", text: "Snake", checked: false});
    this.petTypeList.push({value: "horse", text: "Horse", checked: false});
    this.petTypeList.push({value: "other", text: "Other", checked: false});
    
    this.plt.ready().then(() => {
      this.showMap();
    });
  }


  showMap(){
    let loc: LatLng;
    this.map = GoogleMaps.create('map_canvas');
    //wait for map to be ready
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready');
      this.map.setMyLocationEnabled(false);
      this.getLocation().then( res => {
        //Once the location is gotten we set the location on camera
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.animateCamera(loc);
        this.map.addMarker({
          position: loc,
          animation: 'DROP',
          draggable: true,
        })
        }).catch( err => {
        console.log('---ERROR---');
        console.error(err);
        alert("ERROR -> " + err);
        });
        
        try{
          this.map.addEventListener(plugin.google.maps.event.MARKER_DRAG_END).subscribe((latLng: LatLng) => {
            alert('DRAG END. DATA: ' + latLng);
            let dragCoords: LatLng = new LatLng(latLng.lat, latLng.lng);
            let toast = this.toastCtrl.create({
              message: 'LatLng: ' + latLng,
              duration: 3000
            });
            toast.present();
            this.moveCamera(dragCoords);
          });
        }
        catch(err){
          alert('MARKER_DRAG_END ERROR -> ' + err);
        }



        //this.map.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe((data) => {
         // alert('DRAG END. DATA: ' + data);
          //this.moveCamera(data.coords.LatLng);
        //})

        this.map.addEventListener(plugin.google.maps.event.MAP_CLICK).subscribe((latLng: LatLng) => {
          alert('DATA: ' + latLng);
          loc = latLng;
          this.map.addMarker({
            'position': loc,
            'draggable': true,
            'animation': 'BOUNCE'
          }).catch(error => {
            alert('MARKER_ERROR -> ' + error);
            console.error(error);
          });
         /* this.map.clear().then(() => {

          }).catch(error => {
            alert('MAP_CLICK ERROR -> ' + error);
            console.error(error);
          });  */        
        });
    }).catch(error => {
      alert('MAP ERROR. ERROR -> ' + error);
      console.error(error);
    });
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

    //let user know that he updated his position
    let toast = this.toastCtrl.create({
      message: 'Update my location',
      duration: 3000
    });
    toast.present();
  }

  getLocation(){
    return this.geo.getCurrentPosition();
  }
  
  getAddress(LatLng){
    //given the latitude and longitude whe can get the address
    this.nativeGeocoder.reverseGeocode(LatLng.lat, LatLng.lng).then((result: NativeGeocoderReverseResult) => {
    this.address = result.countryName + ', ' + result.locality + ', ' + result.subLocality + ', ' + result.postalCode + '.';
    this.value = this.address;
    console.log(JSON.stringify(result));
    this.petAddress = result;
    }).catch((error: any) => {
      console.log('---GET ADDRESS ERROR---');
      console.error(error);
      let toast = this.toastCtrl.create({
        message: 'ADDRESS ERROR',
        duration: 3000
      });
      toast.present();
    });    
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

  //Method for taking pictures
  async takePhoto(){
    try{
    //Defining camera options

    const options: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    
    const result = await this.camera.getPicture(options);

    const image = `data:image/jpeg;base64,${result}`;

    const pictures = storage().ref('pictures');
    pictures.putString(image, 'data_url');
    }
    catch (e) {
      console.log('---CAMERA ERROR---');
      console.error(e);
    }
  }

  alert(titleText: string, message: string){
    this.alertCtrl.create({
        title: titleText,
        subTitle: message,
        buttons:['OK']
    }).present();
    }
  
    uploadPet(){
      this.alert("Upload Succesful!", "You've succesfully uploaded your pet");
      let toast = this.toastCtrl.create({
        message: 'Finished',
        duration: 3000
    });
    toast.present();
    }
}
