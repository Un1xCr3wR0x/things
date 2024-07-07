/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AddressTransactionViewDcComponent } from './address-transaction-view-dc/address-transaction-view-dc.component';
import { OwnerPersonDetailsDcComponent } from './owner-person-details-dc/owner-person-details-dc.component';
import { TransactionEstablishmentDetailsDcComponent } from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
import { TransactionEstablishmentListDcComponent } from './transaction-establishment-list-dc/transaction-establishment-list-dc.component';
import { TransactionOwnerDetailsDcComponent } from './transaction-owner-details-dc/transaction-owner-details-dc.component';
import { TransactionOwnerListDcComponent } from './transaction-owner-list-dc/transaction-owner-list-dc.component';
import { TransactionsAccordionDcComponent } from './transactions-accordion-dc/transactions-accordion-dc.component';

export const SHARED_TRANSACTIONS_COMPONENTS = [
  TransactionsAccordionDcComponent,
  OwnerPersonDetailsDcComponent,
  TransactionOwnerDetailsDcComponent,
  TransactionOwnerListDcComponent,
  TransactionEstablishmentDetailsDcComponent,
  TransactionEstablishmentListDcComponent,
  AddressTransactionViewDcComponent
];

export * from './owner-person-details-dc/owner-person-details-dc.component';
export * from './transaction-establishment-details-dc/transaction-establishment-details-dc.component';
export * from './transaction-establishment-list-dc/transaction-establishment-list-dc.component';
export * from './transaction-owner-details-dc/transaction-owner-details-dc.component';
export * from './transaction-owner-list-dc/transaction-owner-list-dc.component';
export * from './transactions-accordion-dc/transactions-accordion-dc.component';
