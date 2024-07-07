import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { ContributionPaymentScComponent, CancelReceiptScComponent } from './components';

const routes: Routes = [
  { path: 'establishment-payment', component: ContributionPaymentScComponent },
  { path: 'mof-payment', component: ContributionPaymentScComponent },
  { path: 'establishment-payment/edit', component: ContributionPaymentScComponent },
  { path: 'mof-payment/edit', component: ContributionPaymentScComponent },
  { path: 'cancel-establishment-payment', component: CancelReceiptScComponent },
  { path: 'cancel-establishment-payment/edit', component: CancelReceiptScComponent },
  { path: 'refresh', component: RefreshDcComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionPaymentRoutingModule {}
