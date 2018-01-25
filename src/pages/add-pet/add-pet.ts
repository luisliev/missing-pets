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
  locationValue: any;
  petTypeList: Array<{ value: string, text: string, checked: boolean }> = [];
  NewPet: Array<{ type: string, lostFound: string, picture: string, extraInfo: string, petLocation: any }> = [];

  calle: any;
  numeroCasa: any;
  colonia: any;
  ciudad: any;
  codigoPostal: any;

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

  ionViewDidLeave(){
    this.map.setVisible(false);
  }

  ionViewDidEnter(){
    this.map.setVisible(true);
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

        this.getAddress(loc);

        //We add a marker to the location where the user is
        this.map.addMarker({
          position: loc,
          animation: 'DROP',
          draggable: true,
          zIndex: 99,
          //should add here an info window that says "You are here"
        }).then(marker => {     
          //After the marker is added we animate the camera and 
          //get the address where the marker is located
          marker.on(plugin.google.maps.event.MARKER_DRAG_END).subscribe((markerData) => {
            console.log("MARKER DATA -> " + markerData);
            this.animateCamera(markerData[0]);
            this.getAddress(markerData[0]);
          });
        });
        }).catch( err => {
        console.log('---ERROR---');
        console.error(err);
        alert("ERROR -> " + err);
        });

        //If we clicked anywhere in the map, a marker will be added and
        //we'll get the address of the location of the marker
        this.map.on(plugin.google.maps.event.MAP_CLICK).subscribe((data) => {
          console.log("DATA -> " + data);
          this.map.clear();
          this.map.addMarker({
            position: data[0],
            animation: 'DROP',
            draggable: true
          }).then(marker => {         
            marker.on(plugin.google.maps.event.MARKER_DRAG_END).subscribe((markerData) => {
              console.log("MARKER DATA -> " + markerData);
              this.animateCamera(markerData[0]);
              this.getAddress(data[0]);
            });
          }).catch(error => {
            console.error(error);
          });    

          this.getAddress(data[0]);

        });
    }).catch(error => {
      alert('MAP ERROR. ERROR -> ' + error);
      console.error(error);
    });
  }

  myLocation(){
    let loc: LatLng;
    this.map.clear();

    this.getLocation().then(res =>{
      //Once the location is gotten we set the location on camera
      loc = new LatLng(res.coords.latitude, res.coords.longitude);

      this.animateCamera(loc);
      this.map.addMarker({
        position: loc,
        animation: 'DROP',
        draggable: true,
      });
      this.getAddress(loc);
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

  getLocation(){
    return this.geo.getCurrentPosition();
  }
  
  getAddress(LatLng){
    //given the latitude and longitude whe can get the address
    this.nativeGeocoder.reverseGeocode(LatLng.lat, LatLng.lng).then((result: NativeGeocoderReverseResult) => {
    
    this.checkIfExists(result);
    
    this.locationValue = this.address;
    console.log(JSON.stringify(result));
    alert(JSON.stringify(result));
    this.petAddress = result;
    }).catch((error: any) => {
      console.log('---GET ADDRESS ERROR---');
      console.error(error);
      alert('ADDRESS ERROR -> ' + error);
    });    
  }

  checkIfExists(address: any){
    if(address != null){
      if(address.thoroughfare == null){
        this.calle = "";
      }else{
        this.calle = address.thoroughfare + ', ';
      }
      if(address.subThoroughfare == null){
        this.numeroCasa = "";
      }else{
        this.numeroCasa = address.subThoroughfare + ', ';
      }
      if(address.subLocality == null){
        this.colonia = "";
      }else{
        this.colonia = address.subLocality + ', ';
      }
      if(address.locality == null){
        this.ciudad = "";
      }else{
        this.ciudad = address.locality + ', ';
      }
      if(address.postalCode == null){
        this.codigoPostal = "No P.C.";
      }else{
        this.codigoPostal = address.postalCode;
      }

      this.address = this.calle + this.numeroCasa + this.colonia + this.ciudad + this.codigoPostal;
    }
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
