/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressModule, ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { ViolationValidatorDcComponent } from './violation-validator-dc.component';
import { VIOLATION_VALIDATOR_COMPONENTS } from './components';
import { ViolationValidatorRoutingModule } from './violation-validator-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [ViolationValidatorDcComponent, ...VIOLATION_VALIDATOR_COMPONENTS],
  imports: [
    CommonModule,
    ViolationValidatorRoutingModule,
    CommonValidatorModule,
    AddressModule,
    ThemeModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
