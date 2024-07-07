import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ContactModule, BankDetailsModule } from '@gosi-ui/foundation/form-fragments';
import { SHARED_COMPONENTS } from './components';
import { ConfirmDeactivateGuard } from './guards/person-wage-guard';
import { EngagementActionGuard } from './guards/engagement-action-guard';

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  providers: [ConfirmDeactivateGuard, EngagementActionGuard],
  imports: [CommonModule, ThemeModule, IconsModule, AddressModule, ContactModule, BankDetailsModule],
  exports: [ThemeModule, AddressModule, ContactModule, SHARED_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
