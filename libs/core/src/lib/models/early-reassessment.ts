import { BilingualText } from './bilingual-text';

export class EarlyReassessmentDto {
  description: string;
  disabilityAssessmentId: number;
  disabilityType: BilingualText;
  reason: BilingualText;
  comments: string;
  hospitalProvider?: BilingualText;
}
export class EarlyReassessmentResponseDto {
  mbReassessmentReqId: number;
  disabilityType: BilingualText;
  transactionTraceId: number;
  disabilityAssessmentId: number;
}
export class SubmitResponse {
  disabilityAssessmentId: number;
  mbAssessmentReqId: number;
  message: BilingualText;
  transactionTraceId: number;
}
export class SelectedParticipantDetails {
  assessmentDate: Date;
  assessmentId: number;
  disabilityType: BilingualText;
  assessmentType: BilingualText;
  assessmentResult: BilingualText;
  componentAmount: number;
  medicalBoardType: BilingualText;
  disabilityPercentage: number;
  status: string | BilingualText;
  nextAssessmentDate: Date;
  injuryId?: number;
  benefitReqId?: number;
  assessmentTime: string;
  helperRequired: boolean;
  helperStartDate: Date;
  socInsNo: number;
  isContributor: boolean;
  isMBO: boolean;
  identitynumber: number;
  personId: number;
}
export class NewReportDetails {
  regNo: number;
  socNo: number;
  injId: number;
  identityNumber: number;
  mbAssessmentRequestId: number;
  refNo: number;
  resourceType: string;
}
export class TPAReportDetails {
  investigationDetails: InvestigationReport = new InvestigationReport();
  requireReports: RequireReports[];
}
export class InvestigationReport {
  investigationDocType: BilingualText[];
  reportDetails: string;
}

export class RequireReports {
  specialty: BilingualText;
  requiredDocumentsList?: BilingualText;
  reportDetails: string;
}
export class ReportsResponse {
  investigationDocumentDetails: InvestigationDocDetail[];
  requestDocumentsDetails: RequestDocDetail[];
}
export class InvestigationDocDetail {
  investigationReportName: BilingualText;
  reportDetails: string;
  requiredDocumentsList: BilingualText;
}
export class RequestDocDetail {
  reportDetails: string;
  requiredDocumentsList: BilingualText[];
  specialty: BilingualText;
}
