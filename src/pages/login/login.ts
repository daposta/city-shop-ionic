import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public alertCtrl: AlertController, public storage: Storage) {

    this.username = '';
    this.password = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {

    this.http.post("https://shop.blesscity.com/wp-json/jwt-auth/v1/token", { username: this.username, password: this.password }).subscribe((res) => {
      console.log('here');

      console.log(res.json());
      this.storage.set("user", res.json()).then((data) => {
        this.alertCtrl.create({
          title: "Login Successful",
          message: "Log in successful",
          buttons: [{
            text: "OK",
            handler: () => {

              if (this.navParams.get("next")) {
                this.navCtrl.push(this.navParams.get("next"));
              } else {
                this.navCtrl.pop();
              }
            }
          }]
        }).present();
      })
    }, err => {

      console.log(err.json());
      this.toastCtrl.create({
        message: err.message,
        duration: 5000
      }).present();
    })
  }

}
