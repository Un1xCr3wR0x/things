import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { InstallmentRoutingModule } from './installment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { INSTALLMENT_COMPONENTS } from './components';

@NgModule({
  declarations: [...INSTALLMENT_COMPONENTS],
  imports: [ThemeModule, CommonModule, InstallmentRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstallmentModule {}
