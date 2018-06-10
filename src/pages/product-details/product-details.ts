import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage'

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    this.product = this.navParams.get('product');
    console.log(this.product);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product) {
    console.log(product);
  }

}
