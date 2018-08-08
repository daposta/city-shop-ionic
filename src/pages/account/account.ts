import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';
import { OrderDetailPage } from '../order-detail/order-detail';
import { AccountDetailsPage } from '../account-details/account-details';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  WooCommerce: any;
  myAccount: string = "accountSegment";
  loader: any;
  userId: any;
  user: any;
  myOrders: any;
  gettingOrders: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage, public modalCtrl: ModalController, private zone: NgZone) {

    platform.registerBackButtonAction(() => {
    }, 1);

    this.loader = this.loadingCtrl.create({
      cssClass: 'transparent',
    });

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

    this.WooCommerce = WC({

      url: "https://blesscity.com",
      consumerKey: "ck_2acbdb539cac3a9a8cc6c2197d6c4cc7374f054f",
      consumerSecret: "cs_f0157128a4195e62e7295553402b56691d474ef7",
      version: 'wc/v2',
      wpAPI: true,
      queryStringAuth: true,
    });

    this.storage.ready().then(() => {
      this.storage.get("loggedUser").then((user) => {
        if (user) {
          this.storage.get("orders").then((orders) => {
            if (orders) {
              this.myOrders = orders;
              // console.log(this.myOrders);
            } else {
              this.WooCommerce.getAsync('orders?customer_id=' + user.id).then((orders) => {
                this.storage.set("orders", JSON.parse(orders.body));
                this.myOrders = JSON.parse(orders.body);
                // console.log(this.myOrders);
              });
            }
          })

        } else if (!user) {
          this.storage.get("user").then((_user) => {
            if (_user) {
              this.WooCommerce.getAsync('customers?email=' + _user.user_email).then((data) => {
                this.storage.set("loggedUser", JSON.parse(data.body));
                let loggedUser = JSON.parse(data.body);

                this.WooCommerce.getAsync('orders?customer_id=' + loggedUser.id).then((orders) => {
                  this.storage.set("orders", JSON.parse(orders.body));
                  this.myOrders = JSON.parse(orders.body);
                  // console.log(this.myOrders);
                })
              })
            }
          })
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');

  }

  openOrderDetail(order) {

    this.navCtrl.push(OrderDetailPage, { "order": order });
  }

  openAccountDetails() {

    this.navCtrl.push(AccountDetailsPage);
  }

  segmentChanged(event) {
    // console.log("Segment clicked! " + event.value, this, event);
    this.zone.run(() => {
      this.myAccount = event.value;
    });
  }

}
