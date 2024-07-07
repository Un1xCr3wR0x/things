import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ContactModule, BankDetailsModule } from '@gosi-ui/foundation/form-fragments';
import { SHARED_MEDICAL_COMPONENTS } from './components';

@NgModule({
  declarations: [...SHARED_MEDICAL_COMPONENTS],
  imports: [CommonModule, ThemeModule, IconsModule, AddressModule, ContactModule, BankDetailsModule],
  exports: [ThemeModule, AddressModule, ContactModule, SHARED_MEDICAL_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
