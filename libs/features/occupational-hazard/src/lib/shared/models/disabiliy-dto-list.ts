/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class disabiliyDtoList {
  bodyPartsList: bodyPartsList[];
  specialtyList: specialtyList[];
  vdDetails: vdDetails;
  injuryId: number;
  isVdRequired: boolean;
  socialInsuranceNo: number;
  disabilityType: BilingualText;
  personId?: number;
  sessionId?: number;
  benefitRequestId?: number;
  inviteeId?: number;
  disabilityDescription?: string;
  medicalBoard?: BilingualText;
  participantStatus?: BilingualText;
  participantType?: BilingualText;
  foCode: BilingualText;
  referenceNo: number;
  ohType?: number;
  isVDRequired: boolean;
  socialInsuranceNumber: number;
  complicationInjuryId?: number;
  injuryNumber?: number;
  isParticipantAttendanceRequired: boolean;
  earlyReAssessmentType?: BilingualText;
  mbAssessmentRequestId?: number;
  mbContractId?: number;
  mbProfessionalId?: number;
  appealedParty: string;
  reason: BilingualText;
  comments: string;
  registrationNumber?: number;
  slotSequence?: number;
  assessmentType?: BilingualText;
  provider?: BilingualText;
}
export class bodyPartsList {
  category: BilingualText;
  bodyParts: BilingualText[];
}

export class specialtyList {
  isMainSpecialty: boolean;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
}
export class vdDetails {
  vdReason: BilingualText;
  vdReasonDescription: string;
  vdSpecialties: BilingualText[];
}

