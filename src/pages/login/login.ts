import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage'
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { SignupPage } from '../signup/signup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
// import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})
export class LoginPage {

  FB_APP_ID: number = 508513642936137;

  username: string;
  password: string;
  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  isLoggedIn: boolean = false;
  errMsg: string = '';
  user: any;
  woocommerceUser: any;
  WooCommerce: any;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public alertCtrl: AlertController, public storage: Storage, public modalCtrl: ModalController, public fb: FormBuilder, public facebook: Facebook, public nativeStorage: NativeStorage, public googlePlus: GooglePlus, public loadingCtrl: LoadingController) {

    this.username = '';
    this.password = '';

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    if (this.loginForm.valid) {

      this.loading = true;

      this.http.post("https://blesscity.com/wp-json/jwt-auth/v1/token", { username: this.username, password: this.password }).subscribe((res) => {

        // console.log(res.json());
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
        });
        this.loading = false;
      }, err => {
        console.log(err.json());
        this.errMsg = err.json().message;
        this.toastCtrl.create({
          message: err.message,
          duration: 5000
        }).present();
        this.loading = false;
      })
    }

  };

  openRegister() {

    // this.modalCtrl.create(RegisterPage).present();
    this.modalCtrl.create(SignupPage).present();
  }

  fbLogin() {
    this.loader.present();
    this.facebook.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid) {
    this.facebook.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then(res => {
        console.log(res);
        this.user = res;

        this.getWooCommerceUser(res.email);
      })
      .catch(e => {
        console.log(e);
        this.loader.dismiss();
      });
  }

  googleLogin() {
    this.loader.present();
    this.googlePlus.login({})
      .then(res => {
        // console.log(res);
        this.getWooCommerceUser(res.email);
        this.isLoggedIn = true;
      })
      .catch(err => console.error(err));
  };

  getWooCommerceUser(email) {
    this.WooCommerce.getAsync('customers/?email=' + email).then((data) => {
      // console.log(data.body);

      this.woocommerceUser = JSON.parse(data.body);
      // console.log(this.woocommerceUser);

      if (this.woocommerceUser.length < 1) {

        this.loader.dismiss();
        this.toastCtrl.create({
          message: 'User does not exist',
          duration: 5000
        }).present();
      } else {

        let _loggedUser = this.woocommerceUser[0]
        this.storage.set("loggedUser", _loggedUser);
        if (this.navParams.get("next")) {
          this.navCtrl.push(this.navParams.get("next"));
        } else {
          this.navCtrl.pop();
        }
        this.loader.dismiss();
      };

    })
  };
}
