/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';
import { SharedModule } from '../shared/shared.module';
import { ComplicationRoutingModule } from './complication-routing.module';
import { COMPLICATION_COMPONENTS } from './index';
import { MedicalboardAppealAssessmentsModule, MedicalboardAssessmentModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule as SharedFormFragments } from '@gosi-ui/foundation/form-fragments/lib/shared/shared.module';

@NgModule({
  declarations: [COMPLICATION_COMPONENTS],
  imports: [
    CommonModule,
    ComplicationRoutingModule,
    SharedModule,
    ThemeModule,
    MedicalboardAssessmentModule,
    SharedFormFragments,
    MedicalboardAppealAssessmentsModule
  ],
  exports: [COMPLICATION_COMPONENTS, MedicalboardAssessmentModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComplicationModule {}
