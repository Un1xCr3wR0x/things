import {
  BilingualText,
  DocumentSubmitItem,
  GosiCalendar,
  MobileDetails,
  TransactionReferenceData
} from '@gosi-ui/core';
import { Person } from './person';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ComplicationWrapper {
  complicationDetailsDto: Complication = new Complication();
  modifiedComplicationDetails: Complication = new Complication();
  establishmentRegNo: number = undefined;
}
export class Complication {
  allowancePayee: number;
  rejectionReason?: BilingualText = new BilingualText();
  reopenReason: BilingualText = new BilingualText();
  autoValidationComments?: ValidationComments[];
  autoValidationStatus?: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  complicationDate: GosiCalendar = new GosiCalendar();
  complicationId?: number = undefined;
  complicationToDeathIndicator = false;
  deathDate?: GosiCalendar = new GosiCalendar();
  complicationLeadsToDeathIndicator?: BilingualText = new BilingualText();
  treatmentCompletionIndicator?: BilingualText = new BilingualText();
  emergencyContactNo?: MobileDetails = new MobileDetails();
  employeeInformedDate: GosiCalendar = new GosiCalendar();
  employerInformedDate: GosiCalendar = new GosiCalendar();
  engagementFormSubmissionDate?: GosiCalendar = new GosiCalendar();
  engagementId?: number = undefined;
  engagementStartDate?: GosiCalendar = new GosiCalendar();
  finalDiagnosis: string = undefined;
  foregoExpenses?: Boolean;
  hasActiveEngagement?: Boolean;
  hasPendingChangeRequest?: Boolean;
  hasRejectionInprogress?: Boolean;
  isComplicationIsInInjuryEstablishment?: Boolean;
  injuryDate: GosiCalendar = new GosiCalendar();
  injuryDetails?: Injury = new Injury();
  injuryStatus?: BilingualText = new BilingualText();
  reasonForDelay: string = undefined;
  listOfTransactionReferenceData?: TransactionReferenceData[];
  lineOfTreatment: BilingualText = new BilingualText();
  modifyComplicationIndicator? = false;
  tpaCode?: string;
  requiredDocuments?: BilingualText[];
  scanDocuments?: DocumentSubmitItem[];
  status?: BilingualText = new BilingualText();
  reopenAllowedIndicator?: Boolean;
  reopenInitiatedDate: GosiCalendar = new GosiCalendar();
  rejectInitiatedDate?: GosiCalendar = new GosiCalendar();
  treatmentCompleted = false;
  workDisabilityDate?: GosiCalendar = new GosiCalendar();
  workFlowStatus?: number = undefined;
  comments?: string = undefined;
  injuryId: number = undefined;
  injuryNo: number = undefined;
  injuryHour: string = undefined;
  injuryMinute: string = undefined;
  injuryTime: string = undefined;
  establishmentRegNo: number = undefined;
  navigationIndicator?: number = undefined;
  auditStatus: string = undefined;
  parentInjuryRejectionInProgress = false;
  parentInjuryForegoExpenses?: Boolean;
  parentInjuryRejectionReason?: BilingualText = new BilingualText();

  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new Complication() && json[key]) {
        this[key] = json[key];
      }
    });
    return Object.assign({}, this);
  }
}
export const setResponse = function (object, data) {
  if (data && object) {
    Object.keys(object).forEach(item => {
      if (item in data) {
        if (data[item]) {
          if (item === 'treatmentCompleted') {
            object[item] = data[item]['english'] === 'No' ? false : true;
          } else {
            object[item] = data[item];
          }
        }
      }
    });
  }
  return { ...object };
};
export class ValidationComments {
  bilingualMessage: BilingualText[] = [];
  category: string = undefined;
  severity: string = undefined;
}
export class Injury {
  accidentType: BilingualText = new BilingualText();
  auditStatus: string = undefined;
  allowancePayee: number;
  rejectionAllowedIndicator?: boolean;
  autoValidationComments?: ValidationComments[] = [];
  city: BilingualText = new BilingualText();
  cityDistrict: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  engagementStartDate: GosiCalendar = new GosiCalendar();
  comments: string = undefined;
  country: BilingualText = new BilingualText();
  deathDate: GosiCalendar = new GosiCalendar();
  treatmentCompleted = false;
  detailedPlace: string = undefined;
  emergencyContactNo: MobileDetails = new MobileDetails();
  employeeInformedDate: GosiCalendar = new GosiCalendar();
  employerInformedDate: GosiCalendar = new GosiCalendar();
  engagementId: number = undefined;
  establishmentName?: BilingualText;
  finalDiagnosis: string = undefined;
  foregoExpenses?: Boolean;
  governmentSector: BilingualText = new BilingualText();
  hasRejectionInProgress?: Boolean;
  hasActiveEngagement?: Boolean;
  hasOpenComplication?: Boolean;
  hasRejectedComplication?: Boolean;
  hasPendingChangeRequest?: Boolean;
  injuryDetailsModifiedIndicator?: boolean;
  injuryLeadsToDeathIndicator?: BilingualText = new BilingualText();
  injuryDate: GosiCalendar = new GosiCalendar();
  injuryHour: string = undefined;
  injuryId?: number = undefined;
  injuryMinute: string = undefined;
  injuryNo: number = undefined;
  injuryReason: BilingualText = new BilingualText();
  injuryStatus: BilingualText;
  injuryTime: string = undefined;
  injuryToDeathIndicator = false;
  injuryType?: BilingualText;
  latitude: string = undefined;
  listOfTransactionReferenceData?: TransactionReferenceData[];
  lineOfTreatment: BilingualText = new BilingualText();
  modifyInjuryIndicator? = false;
  longitude: string = undefined;
  occupation: BilingualText = new BilingualText();
  place: BilingualText = new BilingualText();
  reopenAllowedIndicator?: Boolean;
  reasonForDelay: BilingualText = new BilingualText();
  rejectInitiatedDate: GosiCalendar = new GosiCalendar();
  reopenInitiatedDate: GosiCalendar = new GosiCalendar();
  rejectionReason: BilingualText = new BilingualText();
  reopenReason: BilingualText = new BilingualText();
  requiredDocuments: BilingualText[];
  scanDocuments: DocumentSubmitItem[];
  status: BilingualText = new BilingualText();
  totalInjuryCount?: number = undefined;
  tpaCode?: string;
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  workFlowStatus?: number = undefined;
  navigationIndicator?: number = undefined;
  modifiedInjuryDetails?: Injury;
  reasonActive?: Boolean;
  engagementDetails?: EngagementDetails;
}
export class EngagementDetails {
  engagementFormSubmissionDate: GosiCalendar = new GosiCalendar();
  engagementStartDate: GosiCalendar = new GosiCalendar();
  establishmentStartDate: GosiCalendar = new GosiCalendar();
  registrationNumber: number;
  establishmentName: BilingualText = new BilingualText();
}
export class InjuryWrapper {
  injuryDetailsDto: Injury = new Injury();
  modifiedInjuryDetails: Injury = new Injury();
  establishmentRegNo: number = undefined;
}

export class DisabilityDetails {
  count: number;
  data: AssessmentDetails[];
}
export class AssessmentDetails {
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
  personId?: number;
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
  showEarlyReassessmentRequest?: boolean;
  startTimeAmOrPm: BilingualText;
  referenceNo?: number;
  isHelperRequired: BilingualText;
  ohType: number;
  showAppeal: boolean;
  showAccept: boolean;
  role: BilingualText;
  benefitAmount?: number;
  basicAmount?: number;
  helperAmount?: number;
  dependentAmount?: number;
  sin?:number;
}
export class Contributor {
  active = false;
  approvalStatus: string = undefined;
  engagements?: Engagement[];
  mergedSocialInsuranceNo: number = undefined;
  mergerStatus: string = undefined;
  person: Person = new Person();
  socialInsuranceNo: number = undefined;
  type: string = undefined;
  vicIndicator = false;
}
export class Engagement {
  approvalDate: GosiCalendar = new GosiCalendar();
  companyWorkerNumber: String;
  contributorAbroad = false;
  engagementPeriod: EngagementPeriod[] = [];
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  prisoner = false;
  proactive = false;
  scanDocuments: DocumentSubmitItem[] = [];
  student = false;
  transactionReferenceData?: TransactionReferenceData[] = [];
  workType: BilingualText = new BilingualText();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  isContributorActive = false;
  backdatingIndicator = false;
  penaltyIndicator = false;

  constructor() {
    this.formSubmissionDate = { gregorian: new Date(), hijiri: '1430-05-10' };
  }
}
export class EngagementPeriod {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  occupation: BilingualText = new BilingualText();
  wage: EngagementWage = new EngagementWage();
  minDate?: Date = new Date();
  coverageType?: BilingualText = new BilingualText();
}
export class EngagementWage {
  basicWage: number = undefined;
  commission: number = undefined;
  housingBenefit: number = undefined;
  otherAllowance: number = undefined;
  totalWage: number = undefined;
  contributoryWage: number = undefined;
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
export class VisitingDoctor {
  nameOfVD: BilingualText = new BilingualText();
  nin: number;
  location: BilingualText = new BilingualText();
  specialty: BilingualText[];
  medicalProvider: string;
  contactNumber: number;
}
export class AssessmentDetailsResponse {
  assessmentType: BilingualText;
  appealReason: BilingualText;
  reasonDescription: string;
  isParticipantPresent: boolean;
}
export class AssessmentSuccessResponse {
  disabilityAssessmentId?: number;
  transactionTraceId: number;
  message?: BilingualText;
  isFinalReschedule?: boolean;
  sessionCompleted?: boolean;
}
export class SessionAssessments {
  occupationalDisability: Assessments[];
  nonOccupationalDisability: Assessments[];
  heirDisability: Assessments[];
}
export class Assessments {
  name: NameBilingual;
  identifier: Identifier;
  injuryId?: number;
  assessmentResult: BilingualText;
  assessmentChannel: BilingualText;
  disabilityPercentage?: number;
  isHelperRequired?: boolean;
  disabilityAssmtId: number;
  sin?: number;
  disabilityType?: string;
  assessmentRequestId?: number;
  referenceNo?: number;
  participantType?: BilingualText;
}
export class VisitingDoctorList {
  name: NameBilingual;
  identity: Identifier;
  region: BilingualText[];
  specialty: BilingualText;
  nameOfTheMedicalProvider: string;
  mobileNo: string;
  fee?: number;
}
export class Identifier {
  personIdentifier?: string;
  idType: string;
  nationality: BilingualText;
}
export class NameBilingual {
  arabic: {
    familyName: string;
    firstName: string;
    secondName: string;
    thirdName: string;
  };
  english: {
    name: string;
  };
}
export class OriginLocation {
  originLongitude: number;
  originLatitude: number;
}
export class AssessmentResponseDto {
  disabilityAssessmentId: number;
  mbAssessmentReqId: number;
  message: BilingualText;
  transactionTraceId: number;
}

export class DisabilityAssessment {
  count: number;
  data: AssessmentDetailDisability[];
}
export class AssessmentDetailDisability {
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
export class ValidateDateDto {
  assessmentReqId: string;
  isHelperRequired: string;
  assessmentResult: string;
}
export class AssessmentResponseDateDto {
  disabilityEndDateLowerLimit: string;
  disabilityEndDateUpperLimit: string;
  nextAssessmentDetails: NextAssessmentDetails;
  helperDetails: HelperDetails;
  conveyanceAllowanceDetails: ConveyanceAllowanceDetails;
  nextAssessmentRequired = false;
}
export class NextAssessmentDetails {
  assessmentDatelowerLimit: Date;
  assessmentDateUpperLimit: Date;
}
export class HelperDetails {
  helperStartDateLowerLimit: Date;
  helperStartDateUpperLimit: Date;
}
export class ConveyanceAllowanceDetails {
  participantConveyanceAllowance: number;
  companionConveyanceAllowance: number;
}
