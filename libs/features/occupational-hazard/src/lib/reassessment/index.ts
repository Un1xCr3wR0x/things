import { ContributorAssessmentScComponent } from './contributor-assessment-sc/contributor-assessment-sc.component';
import { DisabilityDescriptionDcComponent } from './disability-description-dc/disability-description-dc.component';
import { EarlyDisabilityDetailsDcComponent } from './early-disability-details-dc/early-disability-details-dc.component';
import { EarlyParticipantReassessmentScComponent } from './early-participant-reassessment-sc/early-participant-reassessment-sc.component';
import { MedicalReportRequestDcComponent } from './medical-report-request-dc/medical-report-request-dc.component';
import { reassessmentDcComponent } from './reassessment-dc.component';
import { ReportFormDcComponent } from './report-form-dc/report-form-dc.component';

export const REASSESSMENT_COMPONENTS = [
  ContributorAssessmentScComponent,
  MedicalReportRequestDcComponent,
  DisabilityDescriptionDcComponent,
  reassessmentDcComponent, EarlyParticipantReassessmentScComponent, EarlyDisabilityDetailsDcComponent, ReportFormDcComponent
];

export * from './contributor-assessment-sc/contributor-assessment-sc.component';
export * from './disability-description-dc/disability-description-dc.component';
export * from './medical-report-request-dc/medical-report-request-dc.component';
export * from './reassessment-dc.component';
export * from './early-participant-reassessment-sc/early-participant-reassessment-sc.component';
export * from './early-disability-details-dc/early-disability-details-dc.component'
export * from './report-form-dc/report-form-dc.component'
