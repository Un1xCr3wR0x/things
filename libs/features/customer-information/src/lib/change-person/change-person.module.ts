/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';
import { ChangePersonRoutingModule } from './change-person-routing.module';
import { CHANGE_PERSON_COMPONENTS } from './components';
import { ChangePersonService } from '../shared';

@NgModule({
  declarations: [...CHANGE_PERSON_COMPONENTS],
  imports: [CommonModule, SharedModule, ChangePersonRoutingModule, ContactModule, AddressModule, ThemeModule],
  providers: [ChangePersonService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangePersonModule {}
