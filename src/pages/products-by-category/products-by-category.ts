import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[] = [];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {

    this.page = 1;
    this.category = this.navParams.get('category');
    console.log(this.category);

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    let loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });

    loader.present();
    this.WooCommerce.getAsync('products?category=' + this.category.id).then((data) => {

      this.products = JSON.parse(data.body);
      console.log(this.products);
      loader.dismiss();
    }, error => {

      console.log(error);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  openProductPage(product) {

    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
