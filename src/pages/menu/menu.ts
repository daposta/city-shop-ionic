import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup'
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category'
import { CategoriesPage } from '../categories/categories';

import * as WC from 'woocommerce-api';
import { AccountPage } from '../account/account';
import { ConfirmationPage } from '../confirmation/confirmation';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: any;
  WooCommerce: any;
  categories: any[] = [];
  menFashion: any[];
  electronics: any[];
  loggedIn: boolean;
  user: any;
  userData: any;
  user_email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {

    this.homePage = HomePage;
    // this.homePage = ConfirmationPage;
    this.user = {};
    this.userData = {};
    this.categories = [];
    this.menFashion = [];
    this.electronics = [];

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.WooCommerce.getAsync('products/categories?per_page=100').then((data) => {
      // this.WooCommerce.getAsync('products/categories').then((data) => {

      console.log(JSON.parse(data.body));
      let temp: any[] = JSON.parse(data.body);
      // this.categories = data.body;

      for (let i = 0; i < temp.length; i++) {

        if (temp[i].parent == 0) {

          this.categories.push(temp[i]);
        };
      }
      console.log(this.categories);
    }, err => {

      console.log(err);
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad MenuPage');
    // this.getUser();
  }

  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("user").then((user) => {
        if (user != null) {
          // console.log(user);

          console.log("user logged in");
          this.user = user;
          // console.log(this.user);
          this.loggedIn = true;
          this.WooCommerce.getAsync('customers?email=' + this.user.user_email).then((res) => {

            this.userData = (JSON.parse(res.body));
            // console.log(this.userData[0]);

            let loggedUser = this.userData[0];
            this.storage.set('loggedUser', loggedUser);
            // this.storage.get('loggedUser').then((loggedUser) => {
            //   console.log(loggedUser);
            // })
          }, err => {

            console.log(err);
          })
        } else {

          console.log("no user found");
          this.user = {};
          this.loggedIn = false;
        }

      })
    })
  }

  openCategoryPage(category) {

    // this.navCtrl.setRoot(ProductsByCategoryPage, {'category': category})
    this.navCtrl.push(ProductsByCategoryPage, {'category': category})
  }

  openHome() {

    this.navCtrl.push(HomePage);
  };

  openShop() {

    this.navCtrl.push(CategoriesPage);
  };

  openAccount() {

    this.storage.get("user").then( (data) => {

      if (data != null) {

        this.navCtrl.push(AccountPage);
      } else {

        this.navCtrl.push(LoginPage, {next: AccountPage})
      }
    })
  };

  openHelp() {

    // 
  }
  

  openPage(pageName: string) {

    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }
    this.user_email = this.user._body
    // this.WooCommerce.getAsync('customers?email=' + this.user_email).then((res) => {
    //   console.log(JSON.parse(res.body));
    // }, err => {
    //   console.log(err);
    // })
    if (pageName == 'login') {
      this.navCtrl.push(LoginPage);
    }

    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

    if (pageName == 'logout') {
      this.storage.remove('user');
      this.storage.remove('cart');
      this.storage.clear();
      this.user = {};
      this.loggedIn = false;
    }
  }

}
