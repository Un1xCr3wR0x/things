/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_COMPONENTS } from './component';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';

import {
  AddressModule,
  ValidatorModule as CommonValidatorModule,
  ContactModule,
  PersonalDetailsModule
} from '@gosi-ui/foundation/form-fragments';
import { AccordionViewDetailsDcComponent } from './component/accordion-view-details-dc/accordion-view-details-dc.component';
import { AllowanceCalculationDcComponent } from './component/allowance-calculation-dc/allowance-calculation-dc.component';
import { DailyWageValidatorWidgetComponent } from './component/daily-wage-validator-widget-dc/daily-wage-validator-widget-dc.component';
import { ReimbursementClaimsScComponent } from './component/reimbursement-claims-sc/reimbursement-claims-sc.component';
import { DocumentCategoryDcComponent } from './component/document-category-dc/document-category-dc.component';
import { AmountDetailsDcComponent } from './component/amount-details-dc/amount-details-dc.component';
import { AllowanceAuditOverviewDcComponent } from './component/allowance-audit-overview-dc/allowance-audit-overview-dc.component';
import { InjuryStatisticsDetailsDcComponent } from './component/injury-statistics-details-dc/injury-statistics-details-dc.component';
import { GroupInjuryPersonDetailsDcComponent } from './component/group-injury-person-details-dc/group-injury-person-details-dc.component';
import { InjuredContributorsDcComponent } from './component/injured-contributors-dc/injured-contributors-dc.component';
import { GroupinjuryDetailDcComponent } from './component/groupinjury-detail-dc/groupinjury-detail-dc.component';
import { PreviousMedicalboardAssessmentsDcComponent } from './component/previous-medicalboard-assessments-dc/previous-medicalboard-assessments-dc.component';
import { CloseDiseaseDcComponent } from './component/close-disease-dc/close-disease-dc.component';
import { PreviousAssessmentDetailsDcComponent } from './component/previous-assessment-details-dc/previous-assessment-details-dc.component';
import { DisabilityReassessmentInstructionDcComponent } from './component/disability-reassessment-instruction-dc/disability-reassessment-instruction-dc.component';
import { AddDocumentDcComponent } from './component/add-document-dc/add-document-dc.component';
import { ParticipantDetailsDcComponent } from './component/participant-details-dc/participant-details-dc.component';

@NgModule({
  declarations: [
    SHARED_COMPONENTS,
    AccordionViewDetailsDcComponent,
    AllowanceCalculationDcComponent,
    DailyWageValidatorWidgetComponent,
    ReimbursementClaimsScComponent,
    DocumentCategoryDcComponent,
    AmountDetailsDcComponent,
    AllowanceAuditOverviewDcComponent,
    InjuryStatisticsDetailsDcComponent,
    GroupInjuryPersonDetailsDcComponent,
    InjuredContributorsDcComponent,
    GroupinjuryDetailDcComponent,
    PreviousMedicalboardAssessmentsDcComponent,
    CloseDiseaseDcComponent,
    AllowanceAuditOverviewDcComponent,
    PreviousAssessmentDetailsDcComponent,
    DisabilityReassessmentInstructionDcComponent,
    AddDocumentDcComponent,
    ParticipantDetailsDcComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    AddressModule,
    ContactModule,
    IconsModule,
    PersonalDetailsModule,
    CommonValidatorModule
  ],
  exports: [
    SHARED_COMPONENTS,
    ThemeModule,
    AddressModule,
    ContactModule,
    IconsModule,
    PersonalDetailsModule,
    CommonValidatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}

