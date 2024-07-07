/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  GosiCalendar,
  Name,
  NIN,
  BilingualText,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  ContactDetails,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  Lov
} from '@gosi-ui/core';
import { PersonBankDetails } from './person-bank-details';
import { BenefitValues } from '../../enums/benefits/benefit-values';
import { PersonalInformation } from './personal-information';
import { AttorneyDetailsWrapper } from './attorney-details-wrapper';
import { EmploymentDetails } from './employment-details';
import { MarriageDetails } from './marriage-details';
import { HeirEvent } from './questions';
import { PersonalMaritalInfo } from './personal-marital-info';
import { AuthorizationDetailsDto } from './authorization-details';
import { HeirEligibilityDetails } from './heir-eligibility-details';
import { ValidateRequest } from './validate';
import { RestartHoldDetails } from './restart-hold-details';

export class DependentDetails extends PersonalInformation {
  // id?: number;
  id: number = undefined;
  motherId: number;
  editStatus?: string;
  editMode: boolean;
  nameInEnglish: string;
  nameInArabic: string;
  actionType: string = undefined;
  attorneyDetails: AttorneyDetailsWrapper = undefined;
  authorizedPersonDetails?: AttorneyDetailsWrapper[]; //not available in api
  guardianPersonDetails?: AttorneyDetailsWrapper[]; //not available in api
  authDetails?: AuthorizationDetailsDto[];
  annualNotificationDate: GosiCalendar;
  authorizedPersonId?: number = undefined;
  authorizationDetailsId?: number = undefined;
  lastModifiedAuthPersonId?: number;
  bankModifiedFor?: number;
  dateOfBirth: GosiCalendar;
  disabilityDate: GosiCalendar;
  disabilityDescription: string;
  studyStartDate: GosiCalendar;
  disabilityStartDate: GosiCalendar;
  orphanDate?: GosiCalendar;
  //  eligibilityList : HeirEligibilityDetails[];
  eligibilityMessage: BilingualText;
  eligibilityStatus: BilingualText;
  eligibilityList: HeirEligibilityDetails[];
  eligiblePeriodEndDate: GosiCalendar;
  eligiblePeriodStartDate: GosiCalendar;
  employmentEvents: EmploymentDetails[];
  heading: BilingualText;
  lastStatusDate: GosiCalendar;
  gender: BilingualText;
  name: Name = new Name();
  nameBilingual: BilingualText;
  relationship: BilingualText;
  nationality: BilingualText;
  nin = new NIN();
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  dependentIdentifier: CommonIdentity | null;
  personId: number = undefined;
  age: number;
  gregorianAge: number;
  // birthDate: GosiCalendar;
  heirStatus: BilingualText;
  newHeirStatus?: BilingualText;
  maritalStatus: BilingualText;
  dependentSource: string = undefined;
  modifyPayeeEligible: boolean;
  disabled: boolean;
  divorced: boolean;
  widowed: boolean;
  married: boolean;
  student: boolean;
  unborn: boolean;
  orphan: boolean;
  pregnant: boolean;
  employed: boolean;
  sex: BilingualText;
  editable: boolean;
  statusEditable?: boolean;
  //TODO: remove this
  bankAccount = undefined;
  bankList?: PersonBankDetails[];
  contactDetail: ContactDetails;
  agentContactDetails?: ContactDetails = undefined;
  bankName?: BilingualText;
  hasMandatoryDetails: boolean;
  paymentMode: BilingualText = undefined;
  payee: BilingualText = undefined; //TODO: Remove
  payeeType: BilingualText = undefined;
  guardianPersonId?: number = undefined;
  guardianPersonName?: Name;
  guardianPersonIdentity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  guardianSource: string = undefined;
  valid: boolean;
  monthlyWage: number;
  benefitStartDate?: GosiCalendar;
  waiveStartDate?: GosiCalendar;
  waiveStopDate?: GosiCalendar;
  benefitEndDate?: GosiCalendar;
  errorMsg?: BilingualText;
  income?: number;
  status: BilingualText;
  statusDate: GosiCalendar;
  showGreenBorder?: boolean;
  reasonForModification: BilingualText;
  referenceNo?: number;
  newlyAdded?: boolean;
  lastPaidDate: GosiCalendar;
  benefitAmount: number;
  notes?: string;
  benefitWaivedTowards?: BilingualText;
  expectedDob?: GosiCalendar;
  isUnborn: boolean;
  existingIncome: number;
  otherBenefits: BilingualText;
  enableEditAddress: boolean;
  //To populate reason for modifcation in UI
  // reasonForModifyLov: Lov[];
  statusDateSelectedFromUi: GosiCalendar;
  maritalStatusDate?: GosiCalendar;
  // deathDate?: GosiCalendar;
  events?: HeirEvent[] = [];
  newDependentStatus: BilingualText;
  maritalInfos: PersonalMaritalInfo[];
  lifeStatus: string = undefined;
  maritalStatusValue: string;
  payeeTypeValue: string;
  paymentModeValue: string;
  recordActionType: string;
  beneficiaryType?: BilingualText = undefined;
  eventDate?: GosiCalendar;
  showBorder?: boolean;
  notificationDate: GosiCalendar;
  divorcedorwidowed?: boolean;
  marriedwife?: boolean;
  maritalStatusDateUpdatedFromUi?: boolean;
  backdated = true;
  employmentStartDate: GosiCalendar;
  statusAfterValidation: BilingualText;
  validateApiResponse: ValidateRequest;
  isHold: boolean;
  isDirectPayment: boolean;
  holdStopDetails?: RestartHoldDetails = new RestartHoldDetails();
  showMandatoryDetails = false;

  constructor(identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    super();
    if (identity) {
      this.identity = identity;
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(identity);
      if (idObj) {
        this.nin.newNin = idObj.id; //TODO: future change to accept all identities
      }
    }
  }

  /**
   * Method to bind the document api response into Document item
   * @param json
   */
  fromJsonToObject(json: DependentDetails) {
    Object.keys(this).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }

  setValidatedValues(validatedDep: DependentModify, searchResult: PersonalInformation) {
    this.relationship = validatedDep.relationship;
    this.name = searchResult.name;
    this.dependentSource = BenefitValues.gosi;
    this.personId = searchResult.personId;
    this.birthDate = searchResult.birthDate;
    this.valid = true; //TODO: recheck this logic
    this.actionType = validatedDep.actionType;
    this.hasMandatoryDetails = true;
    this.disabilityDescription = validatedDep.disabilityDescription;
    this.gender = searchResult.sex;
    this.maritalStatus = searchResult.maritalStatus;
    this.statusDateSelectedFromUi = validatedDep.statusDate;
    this.orphanDate = validatedDep.statusDate; //to be removed
    this.studyStartDate = validatedDep.studyStartDate;
    this.monthlyWage = validatedDep.monthlyWage;
    this.disabilityStartDate = validatedDep.disabilityStartDate;
    this.notificationDate = validatedDep.notificationDate;
    this.maritalStatusDate = validatedDep.maritalStatusDate;
    this.married = validatedDep.married;
    this.divorcedorwidowed = validatedDep.divorcedorwidowed;
    this.marriedwife = validatedDep.marriedwife;
    this.maritalStatusDateUpdatedFromUi = validatedDep.maritalStatusDateUpdatedFromUi;
    this.employmentStartDate = validatedDep.employmentStartDate;
  }

  setSelectedStatus(validatedDep: DependentModify, heirStatusArr: string[]) {
    for (const eachStatus of heirStatusArr) {
      if (validatedDep[eachStatus]) {
        this[eachStatus] = validatedDep[eachStatus];
      } else {
        this[eachStatus] = null;
      }
    }
  }
}

export interface ValidatedDependents {
  name: Name;
  nin: NIN;
  relationship: BilingualText;
  personId: number;
}

export class DependentModify {
  //used for heir also
  actionType: string = undefined; //ADD, REMOVE, MODIFY
  dateOfBirth: GosiCalendar = undefined;
  personId: number = undefined;
  relationship: BilingualText = undefined;
  disabled: boolean = undefined;
  divorced: boolean = undefined;
  widowed: boolean = undefined;
  married: boolean = undefined; //remove
  student: boolean = undefined;
  employed: boolean = undefined;
  orphan?: boolean = undefined;
  unborn?: boolean = undefined;
  pregnant?: boolean = undefined;
  dependentSource: string = undefined;
  status: BilingualText = undefined;
  requestDate?: GosiCalendar = undefined;
  maritalStatus: BilingualText = undefined;
  marriageEvents: MarriageDetails[] = [];
  benefitStartDate?: GosiCalendar = undefined;
  valid?: boolean = undefined;
  income?: Number = undefined;
  disabilityDescription?: string = undefined;
  reasonForModification: BilingualText = undefined;
  statusDate: GosiCalendar = undefined;
  notes?: string = undefined;
  studyStartDate?: GosiCalendar = undefined;
  disabilityStartDate?: GosiCalendar = undefined;
  orphanDate?: GosiCalendar = undefined;
  expectedDob?: GosiCalendar = undefined;
  motherId?: number = undefined;
  events?: HeirEvent[] = [];
  deathDate?: GosiCalendar = undefined;
  notificationDate: GosiCalendar = undefined;
  monthlyWage: number = undefined;
  maritalStatusDate?: GosiCalendar = undefined;
  divorcedorwidowed?: boolean = undefined;
  marriedwife?: boolean = undefined;
  maritalStatusDateUpdatedFromUi?: boolean = undefined;
  backdated = true;
  employmentStartDate: GosiCalendar = undefined;
  hasMandatoryDetails: boolean = undefined;

  constructor() {}
  assignValues(obj: DependentDetails) {
    // this.actionType = obj.actionType;
    // this.dateOfBirth = obj.dateOfBirth || obj.birthDate;
    // this.personId = obj.personId;
    // this.relationship = obj.relationship;
    // this.disabled = obj.disabled;
    // this.divorced = obj.divorced;
    // this.widowed = obj.widowed;
    // this.married = obj.married;
    // this.student = obj.student;
    // this.employed = obj.employed;
    // this.reasonForModification = obj.reasonForModification;
    // this.statusDate = obj.statusDate;
    // this.orphan = obj.orphan;
    // this.unborn = obj.unborn;
    // this.pregnant = obj.pregnant;
    // this.dependentSource = obj.dependentSource;
    // this.maritalStatus = obj.maritalStatus;
    // this.benefitStartDate = obj.benefitStartDate;
    // this.studyStartDate = obj.studyStartDate;
    // this.disabilityStartDate = obj.disabilityStartDate;
    // this.orphanDate = obj.orphanDate;
    // this.valid = obj.valid;
    // this.status = obj.status;
    // this.income = obj.income;
    // this.disabilityDescription = obj.disabilityDescription;
    // this.notes = obj.notes;
    // //Unborn
    // this.motherId = obj.motherId;
    // this.expectedDob = obj.expectedDob;
    // this.events = obj.events;
    // this.deathDate = obj.deathDate;
    // this.maritalStatusDate = obj.maritalStatusDate;
    // this.divorcedorwidowed = obj.divorcedorwidowed;
    // this.marriedwife = obj.marriedwife;
    // this.maritalStatusDateUpdatedFromUi = obj.maritalStatusDateUpdatedFromUi;
    // this.hasMandatoryDetails = obj.hasMandatoryDetails;
    Object.keys(obj).forEach(key => {
      if (key in new DependentModify()) {
        this[key] = obj[key];
      }
    });
    // return this;
  }
}

export interface ValidateDependent {
  validateDependent: DependentModify;
  dependents: DependentModify[];
}

export class ValidateHeir {
  deathDate?: GosiCalendar;
  missingDate?: GosiCalendar;
  validateHeir: DependentModify;
  heirs?: DependentModify[];
}

export class Eligiblity {
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  eventName: BilingualText;
  status: BilingualText;
  statusDate: GosiCalendar;
  valid: boolean;
  eventCategory: string;
  eventSource: BilingualText;
  message: BilingualText;
  eventType: BilingualText;
}
