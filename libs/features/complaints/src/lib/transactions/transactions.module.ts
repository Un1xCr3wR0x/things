/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';

import { SharedModule } from '../shared/shared.module';
import { TRANSACTIONS_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TransactionDcComponent } from './transaction-dc.component';

@NgModule({
  declarations: [TransactionDcComponent, ...TRANSACTIONS_COMPONENTS],
  imports: [CommonModule, TransactionsRoutingModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionsModule {}
