/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { CommonModule } from '@angular/common';
import { TransactionTracingDcComponent } from './transaction-tracing-dc.component';
import { TransactionTracingRoutingModule } from './transaction-tracing-routing.module';
import { TRANSACTION_COMPONENTS } from './components';
import { ReopenCompletedTransactionScComponent } from './components/reopen-completed-transaction-sc/reopen-completed-transaction-sc.component';
import { NotesHistoryDcComponent } from './components/notes-history-dc/notes-history-dc.component';

@NgModule({
  imports: [CommonModule, ThemeModule, TransactionTracingRoutingModule],
  declarations: [TransactionTracingDcComponent, ...TRANSACTION_COMPONENTS, ReopenCompletedTransactionScComponent, NotesHistoryDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TRANSACTION_COMPONENTS]
})
export class TransactionTracingModule {}
