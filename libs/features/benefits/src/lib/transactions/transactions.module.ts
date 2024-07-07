import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDcComponent } from './transaction-dc.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { TRANSACTIONS_COMPONENTS } from './components';
import { ValidatorModule } from '../validator/validator.module';
//import { HeirDirectPaymentScComponent } from './components/heir-direct-payment-sc/heir-direct-payment-sc.component';

@NgModule({
  declarations: [TransactionDcComponent, ...TRANSACTIONS_COMPONENTS],
  imports: [CommonModule, TransactionsRoutingModule, ThemeModule, SharedModule, ValidatorModule]
})
export class TransactionsModule {}
