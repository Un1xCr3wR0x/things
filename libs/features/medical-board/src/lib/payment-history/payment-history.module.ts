import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryComponent } from './payment-history.component';
import { PaymentHistoryRoutingModule } from './payment-history-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PaymentHistoryViewDcComponent } from './payment-history-view-dc/payment-history-view-dc.component';


@NgModule({
  declarations: [PaymentHistoryComponent, PaymentHistoryViewDcComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaymentHistoryRoutingModule
  ]
})
export class PaymentHistoryModule { }
