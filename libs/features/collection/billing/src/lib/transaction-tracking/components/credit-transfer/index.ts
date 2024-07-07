import { CreditTransferEstDetailsDcComponent } from './credit-transfer-est-details-dc/credit-transfer-est-details-dc.component';
import { CreditTransferScComponent } from './credit-transfer-sc/credit-transfer-sc.component';
import { CreditTransferDetailsDcComponent } from './credit-transfer-details-dc/credit-transfer-details-dc.component';
import { RecepientEstablishmentDetailsDcComponent } from './recepient-establishment-details-dc/recepient-establishment-details-dc.component';
import { CurrentCreditTransferDetailsDcComponent } from './current-credit-transfer-details-dc/current-credit-transfer-details-dc.component';

export const BILLING_CREDIT_TRANSFER_COMPONENTS = [
  CreditTransferScComponent,
  CreditTransferEstDetailsDcComponent,
  CreditTransferDetailsDcComponent,
  RecepientEstablishmentDetailsDcComponent,
  CurrentCreditTransferDetailsDcComponent
];

export * from './credit-transfer-sc/credit-transfer-sc.component';
export * from './credit-transfer-est-details-dc/credit-transfer-est-details-dc.component';
export * from './credit-transfer-details-dc/credit-transfer-details-dc.component';
export * from './recepient-establishment-details-dc/recepient-establishment-details-dc.component';
export * from './current-credit-transfer-details-dc/current-credit-transfer-details-dc.component';
