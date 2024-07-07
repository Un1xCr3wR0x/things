import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { BILLING_SHARED } from './components';
import { InstallmentTabsetDcComponent } from './components/installment-tabset-dc/installment-tabset-dc.component';

@NgModule({
  declarations: [BILLING_SHARED, InstallmentTabsetDcComponent],
  imports: [CommonModule, ThemeModule, IconsModule],
  exports: [ThemeModule, BILLING_SHARED],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
