/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { VALIDATOR_COMPONENTS } from './index';
import { FormFragmentsModule } from '../form-fragments.module';

@NgModule({
  declarations: [VALIDATOR_COMPONENTS],
  imports: [CommonModule, FormFragmentsModule],
  exports: [VALIDATOR_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
