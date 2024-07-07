/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class DisabiliyDtoList {
  bodyPartsList: BodyPartsList[];
  specialtyList: SpecialtyList[];
  vdDetails: VdDetails;
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
  isParticipantAttendanceRequired: string;
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
  city?: BilingualText;
  hospitalProvider?: BilingualText;
  role: BilingualText;
  description: string;
  descriptionEarly?: String;
  commentsEarly?: String;
  reasonEarly?: BilingualText;
  reasonAppeal?: BilingualText;
  commentsAppeal?: String;
  descriptionAppeal?: String;
}
export class BodyPartsList {
  category: BilingualText;
  bodypartCategory: BilingualText;
  bodyParts: BilingualText[];
  bodyPartsIndex: number = undefined;
}

export class SpecialtyList {
  isMainSpecialty: boolean;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
}
export class VdDetails {
  vdReason: BilingualText;
  vdReasonDescription: string;
  vdSpecialties: BilingualText[];
}
export class ChangeMemberDto {
  office: BilingualText[] = [];
  availability: BilingualText[] = [];
}
