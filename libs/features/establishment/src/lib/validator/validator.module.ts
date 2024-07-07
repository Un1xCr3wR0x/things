/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AddressModule, ValidatorModule as ValidatorTemplateModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { VALIDATOR_COMPONENTS } from './components';
import { ValidatorDcComponent } from './validator-dc.component';
import { ValidatorRoutingModule } from './validator-routing.module';

@NgModule({
  declarations: [ValidatorDcComponent, ...VALIDATOR_COMPONENTS],
  imports: [CommonModule, ValidatorRoutingModule, ValidatorTemplateModule, AddressModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
