import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ValidatePaymentScComponent,
  ValidateCancelReceiptScComponent,
  ValidateWaiveEstablishmentPenaltyScComponent,
  EstablishmentExceptionalPenaltyScComponent,
  VicExceptionalPenaltyScComponent,
  ExceptionalPenaltyBulkScComponent,
  CreditManagementViewScComponent,
  CreditRefundTransferViewScComponent,
  VicCreditRefundTransferViewScComponent,
  ValidateInstallmentScComponent,
  ValidateMiscellaneousAdjustmentScComponent,
  ViolationLateFeeScComponent
} from './components';
import { ValidateMaintainEventDateScComponent } from './components/maintain-event-date';
import { ContributorRefundViewScComponent } from './components/credit-management/contributor-refund/contributor-refund-view-sc/contributor-refund-view-sc.component';

const routes: Routes = [
  { path: 'payment', component: ValidatePaymentScComponent },
  { path: 'eventdate', component: ValidateMaintainEventDateScComponent },
  { path: 'cancel-receipt', component: ValidateCancelReceiptScComponent },
  { path: 'penalty-waiver', component: ValidateWaiveEstablishmentPenaltyScComponent },
  { path: 'exceptional-est-penalty-waiver', component: EstablishmentExceptionalPenaltyScComponent }, //single esta
  { path: 'exceptional-vic-penalty-waiver', component: VicExceptionalPenaltyScComponent }, //single vic
  { path: 'exceptional-bulk-penalty-waiver', component: ExceptionalPenaltyBulkScComponent }, //est seg,vic seg, all entity
  { path: 'credit-management', component: CreditManagementViewScComponent },
  { path: 'credit-refund-transfer-est', component: CreditRefundTransferViewScComponent },
  { path: 'credit-refund-transfer-vic', component: VicCreditRefundTransferViewScComponent },
  { path: 'contributor-refund', component: ContributorRefundViewScComponent },
  { path: 'installment', component: ValidateInstallmentScComponent },
  { path: 'miscellaneous-adjustment', component: ValidateMiscellaneousAdjustmentScComponent },
  { path: 'violation-late-fees', component: ViolationLateFeeScComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidatorRoutingModule {}
