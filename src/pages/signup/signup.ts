import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';

import * as WC from 'woocommerce-api'
import { LoginPage } from '../login/login';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};
  billing_shipping_same: boolean;
  loading: boolean = false;
  WooCommerce: any;

  states: any[] = [];

  @ViewChild('userForm') form: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public viewCtrl: ViewController, public http: Http) {

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

    this.http.get('assets/states.json').map(res => res.json()).subscribe(data => {
      this.states = data;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  signup() {

    if (this.billing_shipping_same) {
      this.newUser.shipping = this.newUser.billing;
    }

    if (this.form.valid) {

      let customerData = {
        customer: {}
      }

      customerData.customer = {
        "email": this.newUser.email,
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "username": this.newUser.username,
        "password": this.newUser.password,
        "phone": this.newUser.phone,
        "billing": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
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
          "address_1": this.newUser.shipping.address_1,
          "address_2": this.newUser.shipping.address_2,
          "city": this.newUser.shipping.city,
          "state": this.newUser.shipping.state,
          "postcode": this.newUser.shipping.postcode,
          "country": this.newUser.shipping.country
        }
      }

      // console.log(customerData.customer);

      this.loading = true;

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
          this.loading = false;
        } else if (res.errors) {
          this.toastCtrl.create({
            message: res.errors[0].message,
            showCloseButton: true
          }).present();
          this.loading = false;
        }
        else {
          this.toastCtrl.create({
            message: res.message,
            showCloseButton: true
          }).present();
          this.loading = false;
        }
      })
    };
  }


  back() {

    this.viewCtrl.dismiss();
  }

  numbersOnly(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
