import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class MbAssessmentsubmitRequestDto {
  mbAssessmentRequestId: Number;
  sessionId: Number;
  mbContractId: Number;
  mbProfessionalId: Number;
  slotSequence: Number;
  assessmenttype: BilingualText;
  isReturn: boolean;
  isVDRequired: boolean;
  isRescheduled: boolean;
  disabilityAssessmentId: number;
  selectedAssessmentDate: GosiCalendar;
}
