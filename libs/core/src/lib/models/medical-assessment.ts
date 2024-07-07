/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
import { SpecialtyList } from './disability-details';
import { GosiCalendar } from './gosi-calendar';
export class MedicalAssessment {
  appealReason: string;
  assessmentDate: GosiCalendar = new GosiCalendar();
  assessmentRequestId: number;
  assessmentType: string;
  assessmnetTime: BilingualText = new BilingualText();
  isParticipantRequired: string;
  channelType: number;
  location: BilingualText = new BilingualText();
  fieldOfficeAddress: ServiceProviderAddressDto;
  reasonDescription: BilingualText = new BilingualText();
  contactNumber: string;
  invitedStatus: number;
  sessionId: number;
  inviteeId: number;
  medicalBoardType: BilingualText = new BilingualText();
  injuryId: number;
}
export class DisabilityData {
  count: number;
  data: AssessmentData[];
}
export class AssessmentData {
  assessmentDate: Date;
  assessmentId: number;
  // disabilityType: number;
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
  canAppeal: true;
  canWithdraw: true;
  appealedParty: string;
  reason: BilingualText;
  comments: string;
  mbAssessmentReqId: number;
  daysCompleted: boolean;
  greyOut: boolean;
  canEarlyReq: boolean;
  showEarlyReassessmentRequest? = false;
  startTimeAmOrPm: BilingualText;
  referenceNo?: number;
  isHelperRequired: BilingualText;
  ohType: number;
  showAppeal: boolean;
  showAccept: boolean;
  role: BilingualText;
  canAccept?: Boolean;
  paymentId?: number;
  benefitAmount?: number;
  basicAmount?: number;
  helperAmount?: number;
  dependentAmount?: number;
  disabilityAssessmentId?: number;
  occBenefitId?: number;
  statusCode?: number;
}
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
export class contributorAssessmentResponse {
  mbAssessmentRequestId: number;
  message: BilingualText;
}
export class ServiceProviderAddressDto {
  area: string;
  country: BilingualText;
  district: BilingualText;
  street: string;
  village: BilingualText;
}
export class DisabilityDetailsDto {
  count: number;
  data: AssessmentDetailsDto[];
}
export class AssessmentDetailsDto {
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
export class AssessmentResponseDto {
  disabilityAssessmentId: number;
  mbAssessmentReqId: number;
  message: BilingualText;
  transactionTraceId: number;
}
export class MedicalBoardAssessmentRequest {
  assessmentDate: string;
  status: BilingualText[];
  assessmentId: number;
  assessmentType: BilingualText[];
  identifier: number;
  medicalBoardType: BilingualText[];
  sessionPeriodFrom: Date = undefined;
  sessionPeriodTo: Date = undefined;
  pageNo: number = undefined;
  pageSize: number = undefined;
  searchKey: string = undefined;
  sortOrder: string = undefined;
}

export class MBPaymentHistory {
  name: BilingualText;
  sessionId: number;
  sessionDate: Date;
  sessionType: BilingualText;
  fieldfOffice: BilingualText;
  amount: number;
  paymentDate: Date;
  status: BilingualText;
}
export class DisabilityDetailsDtoList {
  transactionTraceId: string = undefined;
  isParticipantAttendanceRequired: string;
  isVdRequired: boolean = undefined;
  specialtyList: SpecialtyList[];
  bodyPartsList: DisabledPart[] | DisabledParts[];
  vdDetails: RequireVisitingDoctor;
  description?: string = undefined;
  assessmentType: string;
  comments?: string;
  disabilityReason?: string;
  disabilityType?: BilingualText;
  isReturn?: boolean;
  mbAssessmentRequestId?: number;
  mbContractId?: number;
  mbProfessionalId?: number;
  injuryId?: number;
  sessionId?: number;
  isVDRequired?: boolean;
  reassessmentDescription?: string;
  slotSequence?: number;
}

export class DisabledParts {
  bodypartCategory?: BilingualText;
  bodyParts?: BilingualText[];
  bodyPartsIndex?: number = undefined;
  category?: BilingualText;
}

export class DisabledPart {
  bodypartCategory?: BilingualText;
  bodyParts?: BilingualTextDupe[];
  bodyPartsIndex?: number = undefined;
  category?: BilingualText;
}

export class BilingualTextDupe {
  arabic?: string;
  english?;
  code?;
  sequence?: number = undefined;
}
export class RequireVisitingDoctor {
  vdreason: BilingualText;
  vdReasonDescription: string = undefined;
  vdSpecialties: BilingualText[];
  visitingDoctor: boolean = undefined;
  visitingDoctorSpecialty?; //To Redo change
}
export class BpmCoreDto {
  rejectionReason?: BilingualText;
  isExternalComment: boolean;
  comments?: string;
  returnReason?: BilingualText;
  taskId: string;
  outcome: string;
  user: string;
}

export class BulkParticipants {
  contractId?: number = undefined;
  assessmentType: BilingualText = new BilingualText();
  participantId: number = undefined;
  noOfDaysInQueue: number;
  mobileNumber: string;
  identityNumber: number = undefined;
  idType?: string = undefined;
  location: BilingualText;
  specialty?: BilingualText;
  sessionId?: number;
}
