import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Menu } from '../pages/menu/menu';

import * as WC from 'woocommerce-api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Menu;
  user: any;
  user_email: string;
  WooCommerce: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage) {
    this.user = {}
    this.initializeApp();

    this.WooCommerce = WC({

      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
