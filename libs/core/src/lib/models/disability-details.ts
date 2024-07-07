/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

// import {  DisabledPart, DisabledParts, GosiCalendar, Person, RequireVisitingDoctor } from '@gosi-ui/core';
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';
import { DisabledPart, DisabledParts, RequireVisitingDoctor } from './medical-assessment';
import { Person } from './person';

export class DisabilityDetails {
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
  hospitalProvider?: BilingualText;
  city?: BilingualText;
  role: string | BilingualText;
  description: string;
  primaryAssessmentDetails?: PrimaryAssessmentDetails;
  descriptionEarly?: String;
  commentsEarly?: String;
  reasonEarly?: BilingualText;
  reasonAppeal?: BilingualText;
  commentsAppeal?: String;
  descriptionAppeal?: String;
  requestDate?: GosiCalendar;
  disabilityDate?: GosiCalendar;
  docReferenceNo?:number;
  reqReferenceNo?:number;
  assessmentId?:number;
}

export class PrimaryAssessmentDetails {
  disabilityAssessmentId: number;
  mbAssessmentRequestId: number;
}

export class BodyPartsList {
  category: BilingualText;
  bodyParts: BilingualText[];
  bodypartCategory: BilingualText;
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
export class AssessmentDetail {
  assessedBy?: AssessedDoctorDetails[];
  assessmentDate?: GosiCalendar = new GosiCalendar();
  assessmentChannel?: BilingualText = new BilingualText();
  assessmentResult?: BilingualText = new BilingualText();
  assessmentTime?: string;
  assessmentType?: BilingualText = new BilingualText();
  bodyPartsList?: BodyPartsList[];
  caseDescription?: string;
  disabilityDate?: GosiCalendar = new GosiCalendar();
  disabilityPercentage?: number;
  disbAssmtId?: number;
  healthcareProvider?: BilingualText = new BilingualText();
  helperStartDate?: GosiCalendar = new GosiCalendar();
  injuryId?: number;
  isConveyanceRequired?: BilingualText = new BilingualText();
  isHelperAllowanceRequired?: boolean;
  isHelperRequired?: BilingualText = new BilingualText();
  locationType?: BilingualText = new BilingualText();
  nextAssessmentDate?: GosiCalendar = new GosiCalendar();
  nextAssessmentSpeciality?: BilingualText = new BilingualText();
  officeLocation?: BilingualText = new BilingualText();
  participantLocation?: string;
  reasonForHelper?: BilingualText[];
  referenceNo?: number;
  rescheduleReason?: BilingualText = new BilingualText();
  rescheduleReasonDesc?: string;
  sessionId?: number;
  benefitRequestId?: number;
  assessmentRequestId?: number;
  heirDependantDetails?: HeirDependantDetails;
  originLongitude?: string;
  originLatitude?: string;
  reasonForAppeal?: BilingualText;
  isCompanionConveyanceRequired?: BilingualText;
  modifiedDetails?: ModificationDetails;
  reasonForDisability?: string;
  secReasonForDisability?: string;
  primaryGosiDr: PrimaryGosiDoctor;
  mainReason?: string;
  secondaryReason?: string;
  requestedDocs: BilingualText[];
  reqDocs: BilingualText[];
  assessmentStatus: BilingualText;
}
export class AssessedDoctorDetails {
  contractType: BilingualText = new BilingualText();
  mbProfessionId: number = undefined;
  name: BilingualText = new BilingualText();
  specialty: BilingualText[];
  identifier: number;
}
export class HeirDependantDetails {
  dob: GosiCalendar = new GosiCalendar();
  identity: IdentityType;
  mobileNo: number;
  region: BilingualText = new BilingualText();
  name?: string;
}
export class ModificationDetails {
  caseDescription: string;
  mainReason?: string;
  secondaryReason?: string;
  reasonForDisability?: string;
  secReasonForDisability: string;
  assessmentResult: BilingualText = new BilingualText();
  bodyParts: BodyPartsList[];
  disabilityPercentage: number;
  bodyPartsLists: BodyPartsList[];
  isHelperAllowanceRequired?: boolean;
  isHelperRequired?: BilingualText = new BilingualText();
  locationType?: BilingualText = new BilingualText();
  nextAssessmentDate?: GosiCalendar = new GosiCalendar();
  reasonForHelper?: BilingualText[];
  disabilityDate?: GosiCalendar = new GosiCalendar();
}
export class IdentityType {
  idType: string;
  nationality: BilingualText;
  personIdentifier: string;
  mobileNo: string;
}
export class PrimaryGosiDoctor {
  contractType: BilingualText = new BilingualText();
  mbProfessionId: number = undefined;
  name: BilingualText = new BilingualText();
  specialty: BilingualText[];
  identifier: number;
}
export class DisabilityDetailsDtos {
  transactionTraceId: string = undefined;
  isParticipantAttendanceRequired: string;
  isVdRequired: boolean = undefined;
  specialtyList: SpecialtyList[];
  bodyPartsList: DisabledPart[] | DisabledParts[]= [];
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
export class InjuryHistoryResponse {
  totalCount: number = undefined;
  injuryHistory: InjuryHistory[] = [];
  diseasePresent: boolean;
}
export class InjuryHistory {
  injuryNo: number = undefined;
  injuryId: number = undefined;
  date: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
  injuryType: BilingualText = new BilingualText();
  actualStatus?: BilingualText = new BilingualText();
  injuryReason: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  place?: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  establishmentName: BilingualText = new BilingualText();
  complication?: InjuryHistory[];
  disableId?: boolean;
  engagementId: number = undefined;
  establishmentRegNo: number = undefined;
  addComplicationAllowed: boolean;
}
export class AnnuityResponseDtos {
  benefitType: BilingualText;
  disabilityDescription?: string;
}

export class VicContributorDetails {
  person: Person = new Person();
  contributorType: string = undefined;
  socialInsuranceNo: number = undefined;
  hasActiveWorkFlow? = false;
  vicIndicator = false;
  active = false;
  statusType: string;
  hasActiveTerminatedOrCancelled? = false;

  /**
   * Creates an instance of Contributor.
   *
   * @memberof Contributor
   */
  constructor() {}

  fromJsonToObject(json: VicContributorDetails) {
    Object.keys(new VicContributorDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
