import { BilingualText } from '@gosi-ui/core';

export class ContributorAssessmenttRequestDto {
  mbAssessmentRequestId: Number;
  sessionId: Number;
  mbContractId: Number;
  mbProfessionalId: Number;
  slotSequence: Number;
  assessmenttype: BilingualText;
  isReturn: boolean;
  vdDescription: String;
  reassessmentDescription: string;
}
export class DisabilityDetails {
  count: number;
  data: AssessmentDetails[];
}
export class AssessmentDetails {
  appealedParty?: string;
  assessmentDate: Date;
  assessmentId: number;
  disabilityType: number | BilingualText;
  assessmentType: BilingualText;
  assessmentResult: BilingualText;
  componentAmount: number;
  medicalBoardType: BilingualText;
  disabilityPercentage: number;
  status: string | BilingualText;
  nextAssessmentDate: Date;
  reason?: BilingualText;
  comments?: string;
}