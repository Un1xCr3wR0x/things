/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdminTransactionDetailsDcComponent } from './admin-transaction-details-dc/admin-transaction-details-dc.component';
import { EstablishmentRegistrationDetailsDcComponent } from './establishment-registration-details-dc/establishment-registration-details-dc.component';
import { OwnerTransactionDetailsDcComponent } from './owner-transaction-details-dc/owner-transaction-details-dc.component';
import { PaymentTransactionDetailsDcComponent } from './payment-transaction-details-dc/payment-transaction-details-dc.component';
import { RegisterEstablishmentTransactionsScComponent } from './register-establishment-transactions-sc/register-establishment-transactions-sc.component';

export const REGISTER_ESTABLISMENT_TRANSACTIONS_COMPONENTS = [
  RegisterEstablishmentTransactionsScComponent,
  EstablishmentRegistrationDetailsDcComponent,
  PaymentTransactionDetailsDcComponent,
  AdminTransactionDetailsDcComponent,
  OwnerTransactionDetailsDcComponent
];

export * from './admin-transaction-details-dc/admin-transaction-details-dc.component';
export * from './establishment-registration-details-dc/establishment-registration-details-dc.component';
export * from './owner-transaction-details-dc/owner-transaction-details-dc.component';
export * from './payment-transaction-details-dc/payment-transaction-details-dc.component';
export * from './register-establishment-transactions-sc/register-establishment-transactions-sc.component';
