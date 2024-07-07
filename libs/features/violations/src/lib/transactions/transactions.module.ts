import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDcComponent } from './transaction-dc.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme/src';
import { TRANSACTIONS_COMPONENTS } from './components';

@NgModule({
  declarations: [TransactionDcComponent, ...TRANSACTIONS_COMPONENTS],
  imports: [CommonModule, TransactionsRoutingModule, ThemeModule, SharedModule, IconsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionsModule {}
