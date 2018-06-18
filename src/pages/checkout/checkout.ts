import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
// import { HomePage } from '../home/home';
import { CardPaymentPage } from '../card-payment/card-payment';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {

    this.newOrder = {};
    this.newOrder.billing = {};
    this.newOrder.shipping = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      { method_id: 'paypal', method_title: 'PayPal' },
      { method_id: 'stripe', method_title: 'Debit Card (Stripe integration)' }
    ];

    this.WooCommerce = WC({

      url: "https://shop.blesscity.com",
      consumerKey: "ck_16339179bd318b6fd62fba572bdf8811042789b2",
      consumerSecret: "cs_87c43a67a155b2299251eef9015797cd57994c68",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.storage.get('loggedUser').then( (loggedUser) => {

      this.userInfo = loggedUser;
      console.log(this.userInfo);
      // this.newOrder = this.userInfo;
      this.newOrder.first_name = this.userInfo.first_name;
      this.newOrder.last_name = this.userInfo.last_name;
      this.newOrder.username = this.userInfo.username;
      this.newOrder.email = this.userInfo.email;
      this.newOrder.billing.address_1 = this.userInfo['billing'].address_1;
      this.newOrder.billing.address_2 = this.userInfo['billing'].address_2;
      this.newOrder.billing.country = this.userInfo['billing'].country;
      this.newOrder.billing.state = this.userInfo['billing'].state;
      this.newOrder.billing.city = this.userInfo['billing'].city;
      this.newOrder.billing.phone = this.userInfo['billing'].phone;
      this.newOrder.billing.postcode = this.userInfo['billing'].postcode;
      this.newOrder.shipping.address_1 = this.userInfo['shipping'].address_1;
      this.newOrder.shipping.address_2 = this.userInfo['shipping'].address_2;
      this.newOrder.shipping.country = this.userInfo['shipping'].country;
      this.newOrder.shipping.state = this.userInfo['shipping'].state;
      this.newOrder.shipping.city = this.userInfo['shipping'].city;
      this.newOrder.shipping.phone = this.userInfo['shipping'].phone;
      this.newOrder.shipping.postcode = this.userInfo['shipping'].postcode;
    })

  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping = this.newOrder.billing;
    }
  }

  placeOrder() {

    let orderItems: any[] = [];
    let data: any = {};
    let paymentData: any = {};

    this.paymentMethods.forEach( (element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });

    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },
      
      billing: this.newOrder.billing,
      shipping: this.newOrder.shipping,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };

    // console.log(paymentData);
    // console.log(data);
    if (paymentData.method_id == 'paypal') {

      console.log('Paypal not supported yet');
      //TODO
    } else {

      this.storage.get('cart').then( (cart) => {

        cart.forEach( (element, index) => {
          orderItems.push({
            product_id: element['product'].id,
            quantity: element.qty,
            amount: element['product'].amount
          });
        });
        console.log(cart);

        data.line_items = orderItems;

        let orderData: any = {};

        orderData = data;
        console.log(orderData);
        this.storage.set('orderData', orderData);

        this.WooCommerce.postAsync('orders', orderData).then( (order) => {

          console.log(JSON.parse(order.body));

          let response = (JSON.parse(order.body));
          this.storage.set('order', response);
          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.id,
            buttons: [{
              text: 'Proceed To Payment',
              handler: () => {
                // this.navCtrl.setRoot(HomePage);
                this.navCtrl.setRoot(CardPaymentPage)
              }
            }]
          }).present();
        })
      })
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

}
