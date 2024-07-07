import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingRoutingModule } from './transaction-tracking-routing.module';
import { TransactionTrackingDcComponent } from './transaction-tracking-dc.component';
import { BILLING_WAIVE_ESTABLISHMENT_COMPONENTS } from './components/waive-establishment-penalty';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ValidatorModule as ValidatorTemplateModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { BILLING_INSTALLMENT_COMPONENTS } from './components/installment';
import { BILLING_CREDIT_REFUND_ESTABLISHMENT_COMPONENTS } from './components/credit-refund-establishment';
import { BILLING_CREDIT_TRANSFER_COMPONENTS } from './components/credit-transfer';
import { BILLING_RECEIVE_PAYMENT_COMPONENTS } from './components/receive-payment';
import { BILLING_MISCELLANEOUS_ADJUSTMENT_COMPONENTS } from "./components/miscellaneous-adjustment";
import {ValidatorModule} from "@gosi-ui/features/collection/billing/lib/validator";

@NgModule({
  declarations: [
    TransactionTrackingDcComponent,
    BILLING_WAIVE_ESTABLISHMENT_COMPONENTS,
    BILLING_INSTALLMENT_COMPONENTS,
    BILLING_CREDIT_REFUND_ESTABLISHMENT_COMPONENTS,
    BILLING_CREDIT_TRANSFER_COMPONENTS,
    BILLING_RECEIVE_PAYMENT_COMPONENTS,
    BILLING_MISCELLANEOUS_ADJUSTMENT_COMPONENTS
  ],
  imports: [CommonModule, TransactionTrackingRoutingModule, ThemeModule, ValidatorTemplateModule, SharedModule, ValidatorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionTrackingModule {}
