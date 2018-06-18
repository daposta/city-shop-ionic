import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { Stripe } from '@ionic-native/stripe';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { CartPage } from '../pages/cart/cart';

import { Menu } from '../pages/menu/menu';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { CheckoutPage } from '../pages/checkout/checkout';
import { SearchPage } from '../pages/search/search';
import { CardPaymentPage } from '../pages/card-payment/card-payment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Menu,
    SignupPage,
    LoginPage,
    ProductDetailsPage,
    CartPage,
    CheckoutPage,
    SearchPage,
    CardPaymentPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Menu,
    SignupPage,
    LoginPage,
    ProductDetailsPage,
    CartPage,
    CheckoutPage,
    SearchPage,
    CardPaymentPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
