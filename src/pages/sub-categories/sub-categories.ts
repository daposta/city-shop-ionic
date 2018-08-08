import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-sub-categories',
  templateUrl: 'sub-categories.html',
})
export class SubCategoriesPage {

  WooCommerce: any;
  products: any[] = [];
  category: any;
  subCategories: any[] = [];
  loader: any;
  _showList: boolean = false;
  _showGrid: boolean = true;
  showToggle: boolean = false;
  page: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public platform: Platform, private zone: NgZone, public toastCtrl: ToastController) {

    platform.registerBackButtonAction(() => {
    }, 1);

    this.loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.category = this.navParams.get('category');
    // console.log(this.category);

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.page = 1;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubCategoriesPage');

    this.loader.present();
    this.WooCommerce.getAsync('products/categories?per_page=100').then((data) => {

      let temp: any[] = JSON.parse(data.body);
      // console.log(temp);
      for (let i = 0; i < temp.length; i++) {

        if (temp[i].parent === this.category.id) {

          this.subCategories.push(temp[i]);
        }
      }
      // console.log(this.products);
      this.showToggle = true;
      // console.log(this.subCategories);
      if (this.subCategories.length < 1) {
        this.loader.present();

        this.WooCommerce.getAsync('products?category=' + this.category.id).then((products) => {

          this.zone.run(() => {

            this.products = JSON.parse(products.body);
          })

          // console.log(this.products);
          this.showToggle = true;
          this.page++;
          this.loader.dismiss();
        })
      }
      this.loader.dismiss();
    }, err => {
      console.log(err);
      this.loader.dismiss();
    })
  };

  ionViewDidLeave() {
    this.loader.dismiss();
  }

  openProdByCat(category) {

    this.navCtrl.push(ProductsByCategoryPage, { 'category': category });
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
