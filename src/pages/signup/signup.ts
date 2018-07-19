import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';

import * as WC from 'woocommerce-api'
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public viewCtrl: ViewController) {

    this.newUser.billing = {};
    this.newUser.shipping = {};
    this.billing_shipping_same = false;

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail() {

    let validEmail = false;
    let reg = /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

    if (reg.test(this.newUser.email)) {

      // Email looks valid
      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then((data) => {
      // this.WooCommerce.getAsync('customers?email=' + this.newUser.email).then((data) => {
        let res = (JSON.parse(data.body));

        if (res.error) {

          validEmail = true;

          this.toastCtrl.create({
            message: "Congratulations, Email is valid.",
            duration: 3000,
          }).present();
        } else {

          validEmail = false;
          this.toastCtrl.create({
            message: "Email already registered, please check.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);
      })
    } else {

      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid email, please check.",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }
  }

  signup() {

    let customerData = {
      customer: {}
    }

    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.billing.address_1,
        "address_2": this.newUser.billing.address_2,
        "city": this.newUser.billing.city,
        "state": this.newUser.billing.state,
        "postcode": this.newUser.billing.postcode,
        "country": this.newUser.billing.country,
        "email": this.newUser.email,
        "phone": this.newUser.phone,
      },
      "shipping": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping.address_1,
        "address_2": this.newUser.shipping.address_2,
        "city": this.newUser.shipping.city,
        "state": this.newUser.shipping.state,
        "postcode": this.newUser.shipping.postcode,
        "country": this.newUser.shipping.country
      }
    }

    if (this.billing_shipping_same) {
      this.newUser.shipping = this.newUser.billing;
    }

    this.WooCommerce.postAsync('customers', customerData.customer).then( (data) => {
      let res = (JSON.parse(data.body));

      if (res.role === 'customer') {
        this.alertCtrl.create({
          title: 'Account Created',
          message: 'Your account has been created successfully! Please login to proceed.',
          buttons: [{
            text: 'Login',
            handler: () => {
              //TODO
              this.navCtrl.setRoot(LoginPage);
            }
          }]
        }).present();
      } else if (res.errors) {
        this.toastCtrl.create({
          message: res.errors[0].message,
          showCloseButton: true
        }).present();
      }
      else {
        this.toastCtrl.create({
          message: res.message,
          showCloseButton: true
        }).present();
      }
    })
  };

  back() {

    this.viewCtrl.dismiss();
  }

}
