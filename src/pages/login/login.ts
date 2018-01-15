import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    
    @ViewChild('email') email;
    @ViewChild('password') password;

  constructor(private fire: AngularFireAuth, public alertCtrl: AlertController, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    /*
        facebookLogin(): Promise<any> {
        
        return this.facebook.login(['email'])
        .then(response => {
            const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
            
            firebase.auth().signInWithCredential(facebookCredential)
            .then(success => {
                console.log('Firebace succes: ' + JSON.stringify(success));
            });
        }).catch((error) => { console.log(error) });
    }
    */
    alert(titleText: string, message: string){
        this.alertCtrl.create({
            title: titleText,
            subTitle: message,
            buttons:['OK']
        }).present();
    }
    
    
    signInUser(){
        /*if(!this.email.value.match(/\S/) || !this.password.value.match(/\S/)){
            let toast = this.toastCtrl.create({
                message: 'You forgot to put your Username or Password',
                duration: 3000
            });
            toast.present();
        }else{
            this.fire.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
            .then(data => {
                console.log('got some data', data);
                this.alert('Logged In', 'Success! You are logged in');
                this.navCtrl.setRoot (TabsPage);
                //user is logged in
            })
            .catch(error =>{
                console.log('got an error', error);
                this.alert('Error!', error.message);
            })
            
            console.log('Would sign in with:', this.email.value, ' & ', this.password.value);
        }*/
        this.navCtrl.setRoot (TabsPage);

    }
    
    register(){
        this.navCtrl.push(RegisterPage);
    }

}
