import { ReceivePaymentScComponent } from './receive-payment-sc/receive-payment-sc.component';
import { ReceivePaymentDetailsDcComponent } from './receive-payment-details-dc/receive-payment-details-dc.component';
import { ViewBranchAmountDcComponent } from './payment-branch-amount-details-dc/payment-branch-amount-details-dc.component';
import { ReceivePaymentEstDetailsDcComponent } from './receive-payment-est-details-dc/receive-payment-est-details-dc.component';
import { ViewReceivePaymentDcComponent } from './view-receive-payment-dc/view-receive-payment-dc.component';

export const BILLING_RECEIVE_PAYMENT_COMPONENTS = [
  ReceivePaymentScComponent,
  ReceivePaymentDetailsDcComponent,
  ViewBranchAmountDcComponent,
  ReceivePaymentEstDetailsDcComponent,
  ViewReceivePaymentDcComponent
];

export * from './receive-payment-sc/receive-payment-sc.component';
export * from './receive-payment-details-dc/receive-payment-details-dc.component';
export * from './payment-branch-amount-details-dc/payment-branch-amount-details-dc.component';
export * from './receive-payment-est-details-dc/receive-payment-est-details-dc.component';
export * from './view-receive-payment-dc/view-receive-payment-dc.component';
