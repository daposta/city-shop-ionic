import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  order: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

    this.storage.get('order').then((order) => {
      this.order = order;
      // console.log(this.order);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmationPage');

  }

  continue() {
    this.navCtrl.setRoot(HomePage);
  }

}
