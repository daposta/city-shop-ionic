import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';
import * as WC from 'woocommerce-api';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CardPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card-payment',
  templateUrl: 'card-payment.html'
})
export class CardPaymentPage {

  masks: any;
  WooCommerce: any;

  cardNumber: any;
  cardMonth: any;
  cardYear: any;
  cardCVV: any;

  orderData: any;
  order: any;
  card_token: any;

  cardPaymentForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public stripe: Stripe, public alertCtrl: AlertController, public fb: FormBuilder) {

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.storage.get('orderData').then((orderData) => {
      this.orderData = orderData;
      // console.log(this.orderData);
    })

    this.storage.get('order').then((order) => {
      this.order = order;
      // console.log(this.order);
    })

    this.storage.get('token').then((token) => {
      this.card_token = token;
    })

    this.masks = {
      cardnumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardmonth: [/\d/, /\d/],
      cardyear: [/\d/, /\d/],
      cardcvv: [/\d/, /\d/, /\d/]
    };

    this.cardPaymentForm = this.fb.group({
      cardNumber: ['', Validators.required],
      cardMonth: ['', Validators.required],
      cardYear: ['', Validators.required],
      cardCVV: ['', Validators.required]
    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad CardPaymentPage');
    this.stripe.setPublishableKey('pk_test_NPc0NaA0tWA7vPfySW6G14pT');
  }


  validateCard() {

    if (this.cardPaymentForm.valid) {

      let card = {
        // number: this.cardNumber,
        // expMonth: this.cardMonth,
        // expYear: this.cardYear,
        // cvc: this.cardCVV
        number: this.cardNumber.replace(/\D+/g, ''),
        expMonth: this.cardMonth.replace(/\D+/g, ''),
        expYear: this.cardYear.replace(/\D+/g, ''),
        cvc: this.cardCVV.replace(/\D+/g, '')
      };

      // console.log(card);

      this.stripe.createCardToken(card)
        .then(token => {

          // console.log(token);
          this.storage.set('token', token);

          var data = {
            status: 'processing',
            payment_method: this.orderData['payment_details'].method_id,
            payment_method_title: this.orderData['payment_details'].method_title,
            transaction_id: token.id,
          }

          let id = this.order.id;
          // console.log(id);

          this.WooCommerce.putAsync('orders/' + id, data).then((res) => {

            // console.log(res.body);

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
          }).catch((err) => {

            console.log(err);
          })

        }).catch(error => {

          console.log(error);
        })

    }

  }

}
