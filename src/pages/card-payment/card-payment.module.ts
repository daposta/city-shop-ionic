import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardPaymentPage } from './card-payment';

import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    CardPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(CardPaymentPage),
    TextMaskModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CardPaymentModule {}
