import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { TRANSACTIONS_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TransactionDcComponent } from './transaction-dc.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { ValidatorModule } from '../validator/validator.module';

@NgModule({
  declarations: [TransactionDcComponent, ...TRANSACTIONS_COMPONENTS],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ThemeModule,
    SharedModule,
    ValidatorModule,
    CommonValidatorModule,
    FormFragmentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionsModule {}
