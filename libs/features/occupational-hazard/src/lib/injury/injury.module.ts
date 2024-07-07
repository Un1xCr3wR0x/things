/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { INJURY_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { InjuryRoutingModule } from './injury-routing.module';
import { ComplicationModule } from '../complication/complication.module';
import { DiseaseModule } from '../disease/disease.module';
import { GroupInjuryModule } from '../group-injury/group-injury.module';
import { MedicalboardAssessmentModule } from '@gosi-ui/foundation/form-fragments/lib/medicalboard-assessment';
import { MedicalboardAppealAssessmentsModule } from '@gosi-ui/foundation/form-fragments/lib/medicalboard-appeal-assessments/medicalboard-appeal-assessments.module';
import { AppealAssessmentFormScComponent } from './appeal-assessment-form-sc/appeal-assessment-form-sc.component';
import { AppealReasonFormDcComponent } from './appeal-reason-form-dc/appeal-reason-form-dc.component';
import { SharedModule as SharedFormFragments } from '@gosi-ui/foundation/form-fragments/lib/shared/shared.module';

@NgModule({
  declarations: [...INJURY_COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    IconsModule,
    ThemeModule,
    InjuryRoutingModule,
    ComplicationModule,
    DiseaseModule,
    GroupInjuryModule,
    MedicalboardAssessmentModule,
    MedicalboardAppealAssessmentsModule,
    SharedFormFragments
  ],
  exports: [...INJURY_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InjuryModule {}
