import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import * as WC from 'woocommerce-api'
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-brand-new',
  templateUrl: 'brand-new.html',
})
export class BrandNewPage {

  WooCommerce: any;
  products: any[] = [];
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public platform: Platform) {

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

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandNewPage');


    this.loader.present();
    this.WooCommerce.getAsync('products').then((data) => {

      this.products = JSON.parse(data.body);
      // console.log(this.products);
      this.loader.dismiss();
    }, err => {

      console.log(err);
      this.loader.dismiss();
    })
  }

  ionViewDidLeave() {
    this.loader.dismiss();
  }

  openProductPage(product) {

    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
