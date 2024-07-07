/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VALIDATORCOMPONENTS } from './components';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [...VALIDATORCOMPONENTS],
  imports: [CommonModule, ThemeModule, ValidatorRoutingModule, CommonValidatorModule, SharedModule],
  exports: [...VALIDATORCOMPONENTS]
})
export class ValidatorModule {}
