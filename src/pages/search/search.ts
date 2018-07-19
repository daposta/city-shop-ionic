import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';

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

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products?filter[q]=' + this.searchQuery).then((searchData) => {

      this.products = JSON.parse(searchData.body);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event) {
    this.WooCommerce.getAsync('products?filter[q]=' + this.searchQuery + '&page=' + this.page).then((searchData) => {

      this.products = this.products.concat(JSON.parse(searchData.body));

      if (JSON.parse(searchData.body).length < 10) {
        event.enable(false);

        this.toastCtrl.create({
          message: 'No more products',
          duration: 5000
        }).present();
      }

      event.complete();
      this.page++
    })


  }

  openProductPage(product) {

    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
