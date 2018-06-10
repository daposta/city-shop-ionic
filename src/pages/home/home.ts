import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { ProductDetailsPage } from '../product-details/product-details'

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  categories: string = "new";

  @ViewChild('productSlides') productSlides: Slides;
  @ViewChild('bannerSlides') bannerSlides: Slides;
  // @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController) {
    this.page = 2;

    this.WooCommerce = WC({
      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.loadMoreProduct();

    this.WooCommerce.getAsync('products').then((data) => {
      this.products = JSON.parse(data.body);
      console.log(this.products);

      // this.products.forEach(item => {
      //   console.log(item);
      // })
    }, (err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    setInterval(() => {
      if (this.productSlides.getActiveIndex() == this.productSlides.length() - 1) {
        this.productSlides.slideTo(0)
      }
      this.productSlides.slideNext();
    }, 3000)
  }

  slideChanged() {
    let currentIndex = this.bannerSlides.getActiveIndex();
    if (currentIndex == 4) {
      this.bannerSlides.stopAutoplay();
    }
  }

  loadMoreProduct() {
    this.WooCommerce.getAsync('products?page=' + this.page).then((data) => {
      this.moreProducts = JSON.parse(data.body);
      console.log(this.moreProducts);
    }, (err) => {
      console.log(err);
    })
  }

  openProductPage(product) {
    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
