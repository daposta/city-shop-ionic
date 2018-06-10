import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  menFashion: any[];
  electronics: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;
    this.categories = [];
    this.menFashion = [];
    this.electronics = [];

    this.WooCommerce = WC({
      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products/categories?per_page=100').then((data) => {
      console.log(JSON.parse(data.body));
      let temp: any[] = JSON.parse(data.body);

      for (let i = 0; i < temp.length; i++) {
        if(temp[i].parent == 0) {
          this.categories.push(temp[i]);
        };
        // if(temp[i].parent == 791) {  //Men Fashion
        //   this.menFashion.push(temp[i]);
        // };
        // if(temp[i].parent == 2352) {  //Electronics
        //   this.electronics.push(temp[i]);
        // };
      }
      console.log(this.categories);
      // console.log(this.menFashion);
      // console.log(this.electronics);
    }, err => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
