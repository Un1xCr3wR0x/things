/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/lib/theme.module';

import { SanedRoutingModule } from './saned-routing.module';
import { SANED_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { SanedDcComponent } from './saned-dc.component';
import { SanedBenefitHistoryScComponent } from './saned-benefit-history-sc/saned-benefit-history-sc.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SanedPaymentDetailsScComponent } from './saned-payment-details-sc/saned-payment-details-sc.component';
import { JailedContributorBenefitDcComponent } from './benefit-estimation-sc/jailed-contributor-benefit-dc/jailed-contributor-benefit-dc.component';
import { BntAnnuitiesEstimationDcComponent } from './benefit-estimation-sc/bnt-annuities-estimation-dc/bnt-annuities-estimation-dc.component';
import { WomanLumpsumBenefitDcComponent } from './benefit-estimation-sc/woman-lumpsum-benefit-dc/woman-lumpsum-benefit-dc.component';
import { PensionEstimationScComponent } from './pension-estimation-sc/pension-estimation-sc.component';
import { AppealAssessmentFormScComponent } from "./appeal-assessment-form-sc/appeal-assessment-form-sc.component";
import { MedicalboardAppealAssessmentsModule } from "@gosi-ui/foundation/form-fragments/lib/medicalboard-appeal-assessments/medicalboard-appeal-assessments.module";

@NgModule({
  declarations: [
    SANED_COMPONENTS,
    SanedDcComponent,
    SanedBenefitHistoryScComponent,
    SanedPaymentDetailsScComponent,
    JailedContributorBenefitDcComponent,
    BntAnnuitiesEstimationDcComponent,
    WomanLumpsumBenefitDcComponent,
    PensionEstimationScComponent,
    AppealAssessmentFormScComponent
  ],
  imports: [CommonModule, SanedRoutingModule, ThemeModule, SharedModule, MedicalboardAppealAssessmentsModule, CarouselModule.forRoot()],
  exports: [SANED_COMPONENTS]
})
export class SanedModule {}
