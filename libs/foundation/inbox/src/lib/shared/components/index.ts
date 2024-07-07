/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { InboxEntriesDcComponent } from './inbox-entries-dc/inbox-entries-dc.component';
import { MyPerformanceDcComponent } from './my-performance-dc/my-performance-dc.component';
import { TransactionStatusDcComponent } from './transaction-status-dc/transaction-status-dc.component';
import { TransactionSummaryDcComponent } from './transaction-summary-dc/transaction-summary-dc.component';
import { InboxSearchFilterDcComponent } from './inbox-search-filter-dc/inbox-search-filter-dc.component';

export const INBOX_COMPONENTS = [
  InboxEntriesDcComponent,
  MyPerformanceDcComponent,
  TransactionStatusDcComponent,
  TransactionSummaryDcComponent,
  InboxSearchFilterDcComponent
];

export * from './inbox-entries-dc/inbox-entries-dc.component';
export * from './my-performance-dc/my-performance-dc.component';
export * from './transaction-status-dc/transaction-status-dc.component';
export * from './transaction-summary-dc/transaction-summary-dc.component';
export * from './base/inbox-base-sc.component';
export * from './inbox-search-filter-dc/inbox-search-filter-dc.component';
