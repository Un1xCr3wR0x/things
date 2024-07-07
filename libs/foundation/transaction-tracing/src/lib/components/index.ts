/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TransactionHistoryScComponent } from './transaction-history-sc/transaction-history-sc.component';
import { TransactionHistoryItemDcComponent } from './transaction-history-item-dc/transaction-history-item-dc.component';
import { TransactionFilterDcComponent } from './transaction-filter-dc/transaction-filter-dc.component';
import { TransactionViewScComponent } from './transaction-view-sc/transaction-view-sc.component';
import { TransactionTabScComponent } from './transaction-tab-sc/transaction-tab-sc.component';
import { ESTABLISHMENT_TRANSACTION_HISTORY_COMPONENTS } from './establishment-transactions';
import { ReopenCompletedTransactionScComponent } from './reopen-completed-transaction-sc/reopen-completed-transaction-sc.component';
import { AppealFormDcComponent } from './appeal-form-dc/appeal-form-dc.component';
import { TimelineDcComponent } from './timeline-dc/timeline-dc.component';
import { NotesHistoryDcComponent } from './notes-history-dc/notes-history-dc.component';
export const TRANSACTION_COMPONENTS = [
  TransactionHistoryScComponent,
  TransactionHistoryItemDcComponent,
  TransactionFilterDcComponent,
  ReopenCompletedTransactionScComponent,
  TransactionViewScComponent,
  ...ESTABLISHMENT_TRANSACTION_HISTORY_COMPONENTS,
  TransactionTabScComponent,
  AppealFormDcComponent,
  TimelineDcComponent,
  NotesHistoryDcComponent,
];

export * from './transaction-history-sc/transaction-history-sc.component';
export * from './transaction-history-item-dc/transaction-history-item-dc.component';
export * from './transaction-filter-dc/transaction-filter-dc.component';
export * from './transaction-view-sc/transaction-view-sc.component';
export * from './establishment-transactions';
export * from './transaction-tab-sc/transaction-tab-sc.component';
export * from './reopen-completed-transaction-sc/reopen-completed-transaction-sc.component';
export * from './appeal-form-dc/appeal-form-dc.component';
export * from './timeline-dc/timeline-dc.component';
export * from './notes-history-dc/notes-history-dc.component';
