/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressModule, ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { ValidatorDcComponent } from './validator-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';
import { VALIDATOR_COMPONENTS } from './components';
import { ValidatorRoutingModule } from './validator-routing.module';

@NgModule({
  declarations: [ValidatorDcComponent, VALIDATOR_COMPONENTS],
  imports: [CommonModule, ValidatorRoutingModule, CommonValidatorModule, AddressModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
