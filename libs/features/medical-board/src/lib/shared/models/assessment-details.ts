/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, BorderNumber, GosiCalendar, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { BodyPartsList } from './disabiliy-dto-list';

/**To get assessment details */
export class AssessmentDetail {
  assessedBy?: AssessedDoctorDetails[];
  assessmentDate?: GosiCalendar = new GosiCalendar();
  assessmentChannel?: BilingualText = new BilingualText();
  assessmentResult?: BilingualText = new BilingualText();
  assessmentTime?: string;
  assessmentType?: BilingualText = new BilingualText();
  bodyPartsList?: BodyPartsList[];
  caseDescription?: string;
  caseDescriptions?: string[];
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
  disabilityEndDate: GosiCalendar = new GosiCalendar();
  medicalBoardType: string;
  disabilityAssmtId: number;
  appealComment: string;
  regNo: number;
  ohType: number;
  isParticipantPresent: boolean;
  conveyanceAmount:number;
  isSaudi:boolean;
  docReferenceNo?:number;
  isVdRequired?: boolean;
}
export class PrimaryGosiDoctor {
  contractType: BilingualText = new BilingualText();
  mbProfessionId: number = undefined;
  name: BilingualText = new BilingualText();
  specialty: BilingualText[];
  identifier: number;
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
  assessmentChannel?: BilingualText = new BilingualText();
  assessedBy?: AssessedDoctorDetails[];
  rescheduleReason?: BilingualText = new BilingualText();
  isCompanionConveyanceRequired?: BilingualText;
  primaryGosiDr: PrimaryGosiDoctor;
  originLongitude?: string;
  originLatitude?: string;
  officeLocation?: BilingualText = new BilingualText();
  helperStartDate?: GosiCalendar = new GosiCalendar();
  isParticipantPresent: boolean;
  healthcareProvider?: BilingualText = new BilingualText();
}
export class IdentityType {
  idType: string;
  nationality: BilingualText;
  personIdentifier: string;
  mobileNo: string;
}
