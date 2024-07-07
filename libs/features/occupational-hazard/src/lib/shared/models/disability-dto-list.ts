/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, BorderNumber, Iqama, NIN, Name, NationalId, Passport } from '@gosi-ui/core';

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
}
export class BodyPartsList {
  category: BilingualText;
  bodyParts: BilingualText[];
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
export class MemberRequest {
  filter: MemberFilter = new MemberFilter();
  pageNo: number = undefined;
  pageSize: number = undefined;
  searchKey: string = undefined;
  sortOrder: string = undefined;
  listOfDoctorType: BilingualText[] = [];
  listOfRegion: BilingualText[] = [];
  listOfStatus: BilingualText[] = [];
  listOfSpecialty: BilingualText[] = [];
}
export class MemberResponse {
  mbList: MbList[];
  totalNoOfRecords: number;
}
export class MbAssessmentsubmitRequestDto {
  mbAssessmentRequestId: Number;
  sessionId: Number;
  mbContractId: Number;
  mbProfessionalId: Number;
  slotSequence: Number;
  assessmenttype: BilingualText;
  isReturn: boolean;
}
export class assessmentResponse {
  mbAssessmentRequestId: number;
  message: BilingualText;
}
export class ParticipantSpeciality {
  specialitynumber: number[] = [] ; 
  subSpecialitynumber:  number[] = [];
  primarySpeciality:  BilingualText[] = [];
  fieloffice:BilingualText[] = [];
  noOfDaysInQueueparticipant: number[] = [] ; 
  assessmentType:BilingualText[] = [];
  identityNumber: number[] = [] ; 
  location: BilingualText[] = [];
  mobileNumber: string[] = [];
  participantId: number[] = [];
  name: BilingualText[] = [];
}
export class MemberFilter {
  doctorType: BilingualText[] = [];
  listOfRegion: BilingualText[] = [];
  listOfStatus: BilingualText[] = [];
  memberType: BilingualText[] = [];
  specialty: BilingualText[] = [];
  region: BilingualText[] = [];
  status: BilingualText[] = [];
}
export class MbList {
  doctorType: BilingualText;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  idType?: string;
  name: Name = new Name();
  region: BilingualText[];
  specialty: BilingualText;
  status: BilingualText;
  mobileNo?: string = undefined;
  fee?: number;
  nameOfTheMedicalProvider?: string = undefined;
  contractId?: number;
  mbProfessionId?: number;
}
