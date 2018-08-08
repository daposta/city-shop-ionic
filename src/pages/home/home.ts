import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ModalController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProductDetailsPage } from '../product-details/product-details'
import { CartPage } from '../cart/cart';

import { SearchPage } from '../search/search';
import { CategoriesPage } from '../categories/categories';
import { AccountPage } from '../account/account';
import { LoginPage } from '../login/login';
import { BrandNewPage } from '../brand-new/brand-new';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  searchQuery: string = "";
  categories: string = "new";

  @ViewChild('productSlides') productSlides: Slides;
  @ViewChild('bannerSlides') bannerSlides: Slides;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storage: Storage, platform: Platform) {

    platform.registerBackButtonAction(() => {
    }, 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad', 'HomePage');
  }

  openProductPage(product) {

    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

  openCart() {

    this.modalCtrl.create(CartPage).present();
  }

  onSearch(event) {
    if (this.searchQuery.length > 0) {
      this.navCtrl.push(SearchPage, { "searchQuery": this.searchQuery })
    }
  }

  openShop() {

    this.navCtrl.push(CategoriesPage);
  }

  openAccount() {

    this.storage.get("user").then((data) => {

      if (data != null) {

        this.navCtrl.push(AccountPage);
      } else {

        this.navCtrl.push(LoginPage, { next: AccountPage })
      }
    })
  };

  opanBrandNew() {

    this.navCtrl.push(BrandNewPage);
  }



}
