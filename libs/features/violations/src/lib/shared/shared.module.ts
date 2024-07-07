import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, BankDetailsModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { SHARED_VIOLATION_COMPONENTS } from './components';

@NgModule({
  declarations: [...SHARED_VIOLATION_COMPONENTS],
  imports: [CommonModule, ThemeModule, AddressModule, ContactModule, IconsModule, ContactModule, BankDetailsModule],
  exports: [ThemeModule, AddressModule, ContactModule, IconsModule, ...SHARED_VIOLATION_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
