import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {

    console.log(this.navParams.get("searchQuery"));
    this.searchQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC({

      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products?filter[q]=' + this.searchQuery).then( (searchData) => {

      this.products = JSON.parse(searchData.body);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event) {
    this.WooCommerce.getAsync('products?filter[q]=' + this.searchQuery + '&page=' + this.page).then( (searchData) => {

      this.products = this.products.concat(JSON.parse(searchData.body));

      if (JSON.parse(searchData.body).length < 10) {
        event.enable(false);

        this.toastCtrl.create({
          message: 'No more products',
          duration: 5000
        }).present();
      }

      event.complete();
      this.page ++
    })


  }

}
