import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  WooCommerce: any;
  categories: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {

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
    this.WooCommerce.getAsync('products/categories?per_page=20').then((data) => {

      this.categories = JSON.parse(data.body);
      console.log(this.categories);
      loader.dismiss();
    }, error => {

      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  openProdByCat(category) {

    this.navCtrl.push(ProductsByCategoryPage, {'category': category})
  }

}
