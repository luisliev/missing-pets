import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    
    @ViewChild('password') password;
    @ViewChild('rePassword') repass;
    @ViewChild('email') email;
    @ViewChild('reEmail') reemail;
    @ViewChild('terms') terms;

  constructor(private fire: AngularFireAuth, private alertCtrl: AlertController, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
    
    alert(titleText: string, message: string){
        this.alertCtrl.create({
            title: titleText,
            subTitle: message,
            buttons:['OK']
        }).present();
    }
    
    registerUser(){
        
       
        
        if(!this.password.value.match(/\S/) || !this.repass.value.match(/\S/) || !this.email.value.match(/\S/) || !this.reemail.value.match(/\S/)){
           
            let toast = this.toastCtrl.create({
                message: 'Please fill all criteria',
                duration: 3000
            });
            toast.present();
            
           }else{
               if(this.password.value == this.repass.value){
            
                if(this.email.value == this.reemail.value){

                    if(this.terms){
                        
                             this.fire.auth.createUserWithEmailAndPassword(this.email.value, this.password.value)
                            .then(data =>{

                            console.log('got data ', data);
                            })
                            .catch(error =>{
                            console.log('got an error ', error);
                                 this.alert('Error!', error.message);
                            });   
                            
                            let toast = this.toastCtrl.create({
                                message:'Registration complete. Please check your email to verify your account',
                                duration: 3000
                            });
                            toast.present();
                            this.navCtrl.setRoot (LoginPage);
                            
                            console.log('Would register user with: ', this.email.value, ' ', this.password.value);
                            //Informar al usuario si se completo el registro exitosamente y regresarlo a la pagina de login o si hubo algun problema tambien decirle al usuario pero no regresar al login
                    }else{
                        let toast = this.toastCtrl.create({
                        message: 'Please accept terms and conditions',
                        duration: 3000
                        });
                        toast.present();
                    }

                }else{
                    let toast = this.toastCtrl.create({
                    message: 'Please verify if your email is correct',
                    duration: 3000
                    });
                    toast.present();
                   }
            }else{
                let toast = this.toastCtrl.create({
                message: 'Please verify if your password is correct',
                duration: 3000
                });
                toast.present();
                }
        }
        
    }
    
    jumpToTerms(){
        console.log('Here lies the terms and conditions of my future pet finder app');
    }

}
