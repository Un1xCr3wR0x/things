/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VALIDATORCOMPONENTS } from './components';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ReopenComplicationScComponent } from './components/reopen-complication-sc/reopen-complication-sc.component';
import { InjuryModule } from '../injury/injury.module';
import { DisabledPartsDcComponent } from './components/disabled-parts-dc/disabled-parts-dc.component';
// import { VisitingDoctorDcComponent } from './components/visiting-doctor-dc/visiting-doctor-dc.component';
import { DisabilityAssessmentDetailsDcComponent } from './components/disability-assessment-details-dc/disability-assessment-details-dc.component';
import { PreviousAssessmentModalDcComponent } from './components/previous-assessment-modal-dc/previous-assessment-modal-dc.component';
import { DisabilitySpecialityDetailsDcComponent } from './components/disability-speciality-details-dc/disability-speciality-details-dc.component';
import { HeirDisabilityDetailsDcComponent } from './components/heir-disability-details-dc/heir-disability-details-dc.component';
import { PreviousAssessmentDcComponent } from './components/previous-assessment-dc/previous-assessment-dc.component';
import { EarlyReassessmentScComponent } from './components/early-reassessment-sc/early-reassessment-sc.component';
import { SharedModule as FormSharedModule } from '@gosi-ui/foundation/form-fragments/lib/shared/shared.module';
import { OccupationalDiseaseDetailsDcComponent } from './components/disease/occupational-disease-details-dc/occupational-disease-details-dc.component';
import { EstablishmentOccupationDetailsDcComponent } from './components/disease/establishment-occupation-details-dc/establishment-occupation-details-dc.component';
import { AddDiseaseScComponent } from './components/disease/add-disease-sc/add-disease-sc.component';
import { OccupationalDiseaseAssessmentDetailsDcComponent } from './components/disease/occupational-disease-assessment-details-dc/occupational-disease-assessment-details-dc.component';
import { HealthInspectionDetailsDcComponent } from './components/disease/health-inspection-details-dc/health-inspection-details-dc.component';
import { TransferInjuryDetailsDcComponent } from './components/disease/transfer-injury-details-dc/transfer-injury-details-dc.component';
import { MbConveyanceAllowanceScComponent } from './components/mb-conveyance-allowance-sc/mb-conveyance-allowance-sc.component';
import { RequestNewReportsScComponent } from './components/request-new-reports-sc/request-new-reports-sc.component';
import { DeadBodyRepatriationScComponent } from './components/dead-body-repatriation-sc/dead-body-repatriation-sc.component';
import { RepatriationExpensesDcComponent } from './components/repatriation-expenses-dc/repatriation-expenses-dc.component';

@NgModule({
  declarations: [
    ...VALIDATORCOMPONENTS,
    ReopenComplicationScComponent,
    EstablishmentOccupationDetailsDcComponent,
    OccupationalDiseaseDetailsDcComponent,
    AddDiseaseScComponent,
    OccupationalDiseaseAssessmentDetailsDcComponent,
    HealthInspectionDetailsDcComponent,
     DisabledPartsDcComponent, DisabilityAssessmentDetailsDcComponent, PreviousAssessmentModalDcComponent, DisabilitySpecialityDetailsDcComponent, HeirDisabilityDetailsDcComponent, PreviousAssessmentDcComponent, EarlyReassessmentScComponent, MbConveyanceAllowanceScComponent, RequestNewReportsScComponent, DeadBodyRepatriationScComponent, RepatriationExpensesDcComponent
       ],
  imports: [CommonModule, SharedModule, ThemeModule, ValidatorRoutingModule, InjuryModule,FormSharedModule],
  exports: [...VALIDATORCOMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}

