import { Component, Input } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  productForm: FormGroup;
  product: any;
  size: any[] = [];
  color: any[] = [];
  quantity: any;
  productPrice: any;

  @Input() text: string;
  @Input() limit: number = 250;
  truncating: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController, public fb: FormBuilder) {

    this.product = this.navParams.get('product');
    this.productPrice = parseFloat(this.product.price);
    // console.log(this.product);

    if (this.product.attributes) {
      // console.log(this.product.attributes);

      this.product.attributes.forEach(item => {
        if (item.name === 'Size') {
          // console.log(item.options);
          if (item.options.length > 1) {
            for (var i = 0; i < item.options.length; i++) {
              this.size.push(item.options[i]);
              // console.log(item.options[i]);
            }
            // console.log(this.size);
          }
        };

        if (item.name === 'Color') {
          // console.log(item.options);
          if (item.options.length > 1) {
            for (var j = 0; j < item.options.length; j++) {
              this.color.push(item.options[j]);
              // console.log(item.options[j]);
            }
            // console.log(this.color);
          }
        }
      })
    }

    this.productForm = this.fb.group({
      qty: ['1', Validators.required],
      size: ['', Validators.required],
      color: ['', Validators.required]
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
          "size": this.productForm.controls['size'].value,
          "color": this.productForm.controls['color'].value,
        });
        
        this.storage.set("cart", data).then(() => {
  
          console.log("cart updated");
          // console.log(data);
  
          this.toastCtrl.create({
            message: "Cart Updated",
            position: 'bottom',
            duration: 3000,
          }).present();
        })

      } else {

        data.push({
          "product": product,
          "amount": parseFloat(product.price),
          "qty": parseInt(this.productForm.controls['qty'].value),
          "size": this.productForm.controls['size'].value,
          "color": this.productForm.controls['color'].value,
        });

        this.storage.set("cart", data).then(() => {

          console.log("cart updated");
          // console.log(data);

          this.toastCtrl.create({
            message: "Cart Updated",
            position: 'bottom',
            duration: 3000,
          }).present();
        })
      }
    })
  }

  openCart() {

    this.modalCtrl.create(CartPage).present();
  }

  getQty(value: any) {
    this.quantity = value;

    this.getPrice();
  }

  getPrice() {
    this.productPrice = this.quantity * parseFloat(this.product.price);
    // console.log(this.productPrice);
  }

}
