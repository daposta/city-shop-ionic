import { Component, Input } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  productForm: FormGroup;
  product: any;

  @Input() text: string;
  @Input() limit: number = 250;
  truncating: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController, public fb: FormBuilder) {

    this.product = this.navParams.get('product');
    console.log(this.product);

    this.productForm = this.fb.group({
      // color: ['WHITE', Validators.required],
      qty: ['1', Validators.required]
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product) {

    // console.log(product);

    this.storage.get('cart').then((data) => {

      if (data == null || data == undefined || data.length == 0) {

        data = [];

        data.push({
          "product": product,
          "amount": parseFloat(product.price),
          "qty": parseInt(this.productForm.controls['qty'].value),
        });

      } else {

        let added = 0;

        // for (let i = 0; i < data.length; i++) {

        //   if (product.id == data[i].product.id) {

        //     console.log("product is already in cart");

        //     let qty = data[i].qty;
        //     data[i].qty = qty + this.productForm.controls['qty'].value;
        //     data[i].size = 
        //     data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
        //     added = 1;
        //   }
        // }

        if (added == 0) {

          data.push({
            "product": product,
            "amount": parseFloat(product.price),
            "qty": parseInt(this.productForm.controls['qty'].value)
          });
        }
      }

      this.storage.set("cart", data).then( () => {

        console.log("cart updated");
        console.log(data);

        this.toastCtrl.create({
          message: "Cart Updated",
          position: 'bottom',
          duration: 3000,
        }).present();
      })
    })
  }

  openCart() {
    
    this.modalCtrl.create(CartPage).present();
  }

}
