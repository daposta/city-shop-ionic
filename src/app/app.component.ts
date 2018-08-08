import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';
import { NativeStorage } from '@ionic-native/native-storage';
import { Menu } from '../pages/menu/menu';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  showSplash: boolean = true;
  rootPage: any = Menu;
  user: any;
  // user_email: string;

  constructor(public platform: Platform, public nativeStorage: NativeStorage, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.user = {}
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // let env = this;
      // this.nativeStorage.getItem('user')
      //   .then( function (data) {
      //     env.nav.push(HomePage);
      //     env.splashScreen.hide();
      //   }, function (err) {
      //     env.nav.push(LoginPage);
      //     env.splashScreen.hide();
      //   });

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false);
    });
  }
}
