import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaiveEstablishmentPenaltyScComponent } from './components/waive-establishment-penalty/waive-establishment-penalty-sc/waive-establishment-penalty-sc.component';
import { TransactionTrackingDcComponent } from './transaction-tracking-dc.component';
import { InstallmentDetailsScComponent } from './components/installment/installment-details-sc/installment-details-sc.component';
import { CreditRefundEstablishmentViewScComponent } from './components/credit-refund-establishment/credit-refund-establishment-view-sc/credit-refund-establishment-view-sc.component';
import { CreditRefundVicViewScComponent } from './components/credit-refund-establishment/credit-refund-vic-view-sc/credit-refund-vic-view-sc.component';
import { CreditTransferScComponent } from './components/credit-transfer/credit-transfer-sc/credit-transfer-sc.component';
import { ReceivePaymentScComponent } from './components/receive-payment/receive-payment-sc/receive-payment-sc.component';
import { MiscellaneousAdjustmentViewScComponent} from "./components/miscellaneous-adjustment/miscellaneous-adjustment-view-sc/miscellaneous-adjustment-view-sc.component";

const routes: Routes = [
  {
    path: '',
    component: TransactionTrackingDcComponent,
    children: [
      {
        path: 'late-fees',
        component: WaiveEstablishmentPenaltyScComponent
      },
      {
        path: 'installment',
        component: InstallmentDetailsScComponent
      },
      {
        path: 'credit-refund',
        component: CreditRefundEstablishmentViewScComponent
      },
      {
        path: 'credit-refund-vic',
        component: CreditRefundVicViewScComponent
      },
      {
        path: 'credit-transfer',
        component: CreditTransferScComponent
      },
      {
        path: 'receive-payment',
        component: ReceivePaymentScComponent
      },
      {
        path: 'miscellaneous-adjustment',
        component: MiscellaneousAdjustmentViewScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionTrackingRoutingModule {}
