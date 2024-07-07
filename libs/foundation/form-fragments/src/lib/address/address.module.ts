// TODO: Add disclaimer and comments
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADDRESS_COMPONENTS } from './index';
import { FormFragmentsModule } from '../form-fragments.module';
import { ViewAddressDcComponent } from './view-address-dc/view-address-dc.component';

@NgModule({
  declarations: [ADDRESS_COMPONENTS, ViewAddressDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [ADDRESS_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddressModule {}
