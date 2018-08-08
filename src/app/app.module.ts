import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Stripe } from '@ionic-native/stripe';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';


import { TruncateModule } from '@yellowspot/ng-truncate';
import { TextMaskModule } from 'angular2-text-mask';

import { MyApp } from './app.component';

import { Menu } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { CartPage } from '../pages/cart/cart';
import { IonicStorageModule } from '@ionic/storage';
import { CheckoutPage } from '../pages/checkout/checkout';
import { SearchPage } from '../pages/search/search';
import { CardPaymentPage } from '../pages/card-payment/card-payment';
import { HttpClientModule } from '@angular/common/http';
import { ProductsByCategoryPage } from '../pages/products-by-category/products-by-category';
import { CategoriesPage } from '../pages/categories/categories';
import { RegisterPage } from '../pages/register/register';
import { AccountPage } from '../pages/account/account';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { BrandNewPage } from '../pages/brand-new/brand-new';
import { SubCategoriesPage } from '../pages/sub-categories/sub-categories';
import { ShippingPage } from '../pages/shipping/shipping';
import { TermsPage } from '../pages/terms/terms';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { AccountDetailsPage } from '../pages/account-details/account-details';

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
    ProductsByCategoryPage,
    CategoriesPage,
    RegisterPage,
    AccountPage,
    ConfirmationPage,
    BrandNewPage,
    SubCategoriesPage,
    ShippingPage,
    TermsPage,
    OrderDetailPage,
    AccountDetailsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TruncateModule,
    TextMaskModule,
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
    ProductsByCategoryPage,
    CategoriesPage,
    RegisterPage,
    AccountPage,
    ConfirmationPage,
    BrandNewPage,
    SubCategoriesPage,
    ShippingPage,
    TermsPage,
    OrderDetailPage,
    AccountDetailsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    NativeStorage
  ]
})
export class AppModule { }
