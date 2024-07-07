import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ERegistrationRoutingModule } from './e-registration-routing.module';
import { ADD_EREG_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ADD_EREG_COMPONENTS],
  imports: [
    CommonModule,
    ERegistrationRoutingModule, ThemeModule, AddressModule, ContactModule, SharedModule,
  ],
  exports: [ADD_EREG_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ERegistrationModule { }
