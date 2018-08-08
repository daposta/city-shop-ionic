import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { SubCategoriesPage } from '../sub-categories/sub-categories';
import { Http } from '@angular/http';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  WooCommerce: any;
  categories: any[] = [];
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public platform: Platform, public http: Http) {

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
    console.log('ionViewDidLoad CategoriesPage');

    this.loader.present();
    this.WooCommerce.getAsync('products/categories?per_page=100').then((data) => {

      let temp: any[] = JSON.parse(data.body);
      for (let i = 0; i < temp.length; i++) {

        if (temp[i].parent == 0) {

          this.categories.push(temp[i]);
        };
      }

      // console.log(this.categories);
      this.loader.dismiss();
    }, error => {

      console.log(error);
      this.loader.dismiss();
    });
  }

  ionViewDidLeave() {
    this.loader.dismiss();
  }

  openSubCat(category) {

    this.navCtrl.push(SubCategoriesPage, { 'category': category });
  }

}
