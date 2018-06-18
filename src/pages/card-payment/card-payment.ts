import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import * as WC from 'woocommerce-api';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-card-payment',
  templateUrl: 'card-payment.html'
})
export class CardPaymentPage {

  WooCommerce: any;
  cardNumber: string;
  cardMonth: number;
  cardYear: number;
  cardCVV: string;
  orderData: any;
  order: any;
  card_token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public stripe: Stripe, public alertCtrl: AlertController) {

    this.WooCommerce = WC({

      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.storage.get('orderData').then( (orderData) => {
      this.orderData = orderData;
      console.log(this.orderData);
    })

    this.storage.get('order').then((order) => {
      this.order = order;
      console.log(this.order);
    })

    this.storage.get('token').then((token) => {
      this.card_token = token;
    })

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad CardPaymentPage');
    this.stripe.setPublishableKey('pk_test_NPc0NaA0tWA7vPfySW6G14pT');
  }


  validateCard() {
    let card = {
      number: this.cardNumber,
      expMonth: this.cardMonth,
      expYear: this.cardYear,
      cvc: this.cardCVV
    };

    this.stripe.createCardToken(card)
      .then(token => {

        console.log(token);
        this.storage.set('token', token);

        var data = {
          status: 'processing',
          payment_method: this.orderData['payment_details'].method_id,
          payment_method_title: this.orderData['payment_details'].method_title,
          transaction_id: token.id,
        }

        let id = this.order.id;
        console.log(id);

        this.WooCommerce.putAsync('orders/' + id, data).then( (res) => {

          console.log(res.body.json());
          
          this.alertCtrl.create({
            title: 'Processing',
            message: 'Your order is being processed',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.navCtrl.setRoot(HomePage)
              }
            }]
          }).present();
        }).catch( (err) => {

          console.log(err);
        })

      }).catch(error => {

        console.log(error);
      })

  }

}
