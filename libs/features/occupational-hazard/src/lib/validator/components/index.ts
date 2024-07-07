/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ValidatorDcComponent } from '../validator-dc.component';
import { AddComplicationScComponent } from './add-complication-sc/add-complication-sc.component';
import { AddInjuryScComponent } from './add-injury-sc/add-injury-sc.component';
import { AllowanceDetailsScComponent } from './allowance-details-sc/allowance-details-sc.component';
import { CityMapDcComponent } from './city-map-dc/city-map-dc.component';
import { CloseInjuryScComponent } from './close-injury-sc/close-injury-sc.component';
import { ComplicationDetailsTimelineDcComponent } from './complication-details-timeline-dc/complication-details-timeline-dc.component';
import { ContactDetailsDcComponent } from './contact-details-dc/contact-details-dc.component';
import { InjuryDetailsDcComponent } from './injury-details-dc/injury-details-dc.component';
import { InjuryDetailsTimelineDcComponent } from './injury-details-timeline-dc/injury-details-timeline-dc.component';
import { InjuryStatisticsSummaryDcComponent } from './injury-statistics-summary-dc/injury-statistics-summary-dc.component';
import { ModifyComplicationScComponent } from './modify-complication-sc/modify-complication-sc.component';
import { ModifyInjuryScComponent } from './modify-injury-sc/modify-injury-sc.component';
import { PersonalDetailsDcComponent } from './personal-details-dc/personal-details-dc.component';
import { RejectComplicationScComponent } from './reject-complication-sc/reject-complication-sc.component';
import { RejectInjuryScComponent } from './reject-injury-sc/reject-injury-sc.component';
import { ReopenInjuryScComponent } from './reopen-injury-sc/reopen-injury-sc.component';
import { ModifyCloseInjuryScComponent } from './modify-close-injury-sc/modify-close-injury-sc.component';
import { CloseComplicationScComponent } from './close-complication-sc/close-complication-sc.component';
import { ModifyCloseComplicationScComponent } from './modify-close-complication-sc/modify-close-complication-sc.component';
import { AllowancePayeeScComponent } from './allowance-payee-sc/allowance-payee-sc.component';
import { HoldAndResumeAllowanceScComponent } from './hold-and-resume-allowance-sc/hold-and-resume-allowance-sc.component';
import { ClaimsValidatorScComponent } from './claims-validator-sc/claims-validator-sc.component';
import { AuditorClaimDetailsScComponent } from './auditor-claim-details-sc/auditor-claim-details-sc.component';
import { AllowanceAuditScComponent } from './allowance-audit-sc/allowance-audit-sc.component';
import { ReimbursementDetailsScComponent } from './reimbursement-details-sc/reimbursement-details-sc.component';
import { AddDiseaseScComponent } from './disease/add-disease-sc/add-disease-sc.component';
import { OccupationalDiseaseDetailsDcComponent } from './disease/occupational-disease-details-dc/occupational-disease-details-dc.component';
import { EstablishmentOccupationDetailsDcComponent } from './disease/establishment-occupation-details-dc/establishment-occupation-details-dc.component';
import { OccupationalDiseaseAssessmentDetailsDcComponent } from './disease/occupational-disease-assessment-details-dc/occupational-disease-assessment-details-dc.component';
import { HealthInspectionDetailsDcComponent } from './disease/health-inspection-details-dc/health-inspection-details-dc.component';
import { AllowanceAuditOhScComponent } from './allowance-audit-oh-sc/allowance-audit-oh-sc.component';
import { TransferInjuryDetailsDcComponent } from './disease/transfer-injury-details-dc/transfer-injury-details-dc.component';
import { ModifyCloseDiseaseScComponent } from './disease/modify-close-disease-sc/modify-close-disease-sc.component';
// import { VisitingDoctorDcComponent } from './disease/oh-visiting-doctor-dc/oh-visiting-doctor-dc.component';
import { MedicalReportScComponent } from './medical-report-sc/medical-report-sc.component';
import { EarlyReassessmentScComponent } from './early-reassessment-sc/early-reassessment-sc.component';
import { DeadBodyRepatriationScComponent } from './dead-body-repatriation-sc/dead-body-repatriation-sc.component';
import { RepatriationExpensesDcComponent } from './repatriation-expenses-dc/repatriation-expenses-dc.component';


export const VALIDATORCOMPONENTS = [
  AddInjuryScComponent,
  AllowanceDetailsScComponent,
  AuditorClaimDetailsScComponent,
  ClaimsValidatorScComponent,
  InjuryStatisticsSummaryDcComponent,
  PersonalDetailsDcComponent,
  CityMapDcComponent,
  InjuryDetailsTimelineDcComponent,
  ContactDetailsDcComponent,
  AddComplicationScComponent,
  InjuryDetailsDcComponent,
  ComplicationDetailsTimelineDcComponent,
  RejectInjuryScComponent,
  ModifyInjuryScComponent,
  ReopenInjuryScComponent,
  RejectComplicationScComponent,
  ValidatorDcComponent,
  ModifyComplicationScComponent,
  ModifyCloseInjuryScComponent,
  CloseInjuryScComponent,
  CloseComplicationScComponent,
  ModifyCloseComplicationScComponent,
  AllowancePayeeScComponent,
  HoldAndResumeAllowanceScComponent,
  AllowanceAuditScComponent,
  ReimbursementDetailsScComponent,
  AddDiseaseScComponent,
  OccupationalDiseaseDetailsDcComponent,
  EstablishmentOccupationDetailsDcComponent,
  OccupationalDiseaseAssessmentDetailsDcComponent,
  HealthInspectionDetailsDcComponent,
  AllowanceAuditOhScComponent,
  TransferInjuryDetailsDcComponent,
  ModifyCloseDiseaseScComponent,
  ReimbursementDetailsScComponent,
  MedicalReportScComponent,
  EarlyReassessmentScComponent,
  DeadBodyRepatriationScComponent,
  RepatriationExpensesDcComponent];

export * from '../validator-dc.component';
export * from './add-complication-sc/add-complication-sc.component';
export * from './auditor-claim-details-sc/auditor-claim-details-sc.component';
export * from './add-injury-sc/add-injury-sc.component';
export * from './city-map-dc/city-map-dc.component';
export * from './close-injury-sc/close-injury-sc.component';
export * from './complication-details-timeline-dc/complication-details-timeline-dc.component';
export * from './contact-details-dc/contact-details-dc.component';
export * from './injury-details-dc/injury-details-dc.component';
export * from './injury-details-timeline-dc/injury-details-timeline-dc.component';
export * from './injury-statistics-summary-dc/injury-statistics-summary-dc.component';
export * from './claims-validator-sc/claims-validator-sc.component';
// export * from './reopen-injury-sc/reopen-injury-sc.component';
export * from './modify-complication-sc/modify-complication-sc.component';
export * from './modify-injury-sc/modify-injury-sc.component';
export * from './personal-details-dc/personal-details-dc.component';
export * from './reject-complication-sc/reject-complication-sc.component';
export * from './reject-injury-sc/reject-injury-sc.component';
export * from './close-injury-sc/close-injury-sc.component';
export * from './modify-close-injury-sc/modify-close-injury-sc.component';
export * from './close-complication-sc/close-complication-sc.component';
export * from './modify-close-complication-sc/modify-close-complication-sc.component';
export * from './allowance-details-sc/allowance-details-sc.component';
export * from './allowance-payee-sc/allowance-payee-sc.component';
export * from './hold-and-resume-allowance-sc/hold-and-resume-allowance-sc.component';
export * from './allowance-audit-sc/allowance-audit-sc.component';
export * from './reimbursement-details-sc/reimbursement-details-sc.component';
export * from './disease/add-disease-sc/add-disease-sc.component';
export * from './disease/occupational-disease-details-dc/occupational-disease-details-dc.component';
export * from './disease/establishment-occupation-details-dc/establishment-occupation-details-dc.component';
export * from './disease/occupational-disease-assessment-details-dc/occupational-disease-assessment-details-dc.component';
export * from './disease/health-inspection-details-dc/health-inspection-details-dc.component';
export * from './allowance-audit-oh-sc/allowance-audit-oh-sc.component';
export * from  './disease/transfer-injury-details-dc/transfer-injury-details-dc.component';
export * from  './disease/modify-close-disease-sc/modify-close-disease-sc.component';
// export * from './disease/oh-visiting-doctor-dc/oh-visiting-doctor-dc.component';
export * from './medical-report-sc/medical-report-sc.component';
export * from './early-reassessment-sc/early-reassessment-sc.component';
export * from './dead-body-repatriation-sc/dead-body-repatriation-sc.component';
export * from './repatriation-expenses-dc/repatriation-expenses-dc.component';
