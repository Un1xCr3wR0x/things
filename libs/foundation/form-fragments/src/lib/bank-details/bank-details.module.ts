import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDetailsDcComponent } from './bank-details-dc/bank-details-dc.component';
import { FormFragmentsModule } from '../form-fragments.module';

@NgModule({
  declarations: [BankDetailsDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [BankDetailsDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BankDetailsModule {}
