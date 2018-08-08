import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {

  WooCommerce: any;
  loader: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage) {

    platform.registerBackButtonAction(() => {
    }, 1);

    this.loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.storage.ready().then(() => {
      this.storage.get("loggedUser").then((user) => {
        this.user = user[0];
        // console.log(this.user);
      });
    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad AccountDetailsPage');
  }

  ionViewDidEnter() {

  }

}
