/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */ import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule } from '../form-fragments.module';
import { PersonalDetailsDcComponent } from './personal-details-dc/personal-details-dc.component';

@NgModule({
  declarations: [PersonalDetailsDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [PersonalDetailsDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalDetailsModule {}
