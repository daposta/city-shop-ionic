import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
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
  _showList: boolean = false;
  _showGrid: boolean = true;
  loader: any;
  showToggle: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public platform: Platform) {

    platform.registerBackButtonAction(() => {
    }, 1);

    this.loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.page = 1;
    this.category = this.navParams.get('category');
    // console.log(this.category);
    // console.log(this.page);

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
    console.log('ionViewDidLoad ProductsByCategoryPage');

    this.loader.present();
    this.WooCommerce.getAsync('products?category=' + this.category.id).then((data) => {

      this.products = JSON.parse(data.body);
      // console.log(this.products);
      this.loader.dismiss();
      this.showToggle = true;
      this.page++;
      // console.log(this.page);
    }, error => {

      console.log(error);
    });
  };

  ionViewDidLeave() {
    this.loader.dismiss();
  }

  showGrid() {
    this._showList = false;
    this._showGrid = true;
  }

  showList() {
    this._showGrid = false;
    this._showList = true;
  }

  openProductPage(product) {

    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

  loadMoreProducts(event) {
    // console.log(this.page);
    this.WooCommerce.getAsync('products?category=' + this.category.id + '&page=' + this.page).then((data) => {

      this.products = this.products.concat(JSON.parse(data.body));


      if (JSON.parse(data.body).length < 10) {
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

}
