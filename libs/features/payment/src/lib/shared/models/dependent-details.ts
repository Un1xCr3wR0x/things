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
  Lov,
  LovList
} from '@gosi-ui/core';
import { PersonBankDetails } from './person-bank-details';
import { BenefitValues } from '../enums/benefit-values';
import { PersonalInformation } from './personal-information';
import { AttorneyDetailsWrapper } from './attorney-details-wrapper';
import { EmploymentDetails } from './employment-details';
import { MarriageDetails } from './marriage-details';

export class DependentDetails {
  id?: number;
  motherId: number;
  editStatus?: string;
  nameInEnglish: string;
  nameInArabic: string;
  actionType: string;
  attorneyDetails: AttorneyDetailsWrapper;
  authorizedPersonId?: number;
  authorizationDetailsId?: number;
  lastModifiedAuthPersonId?: number;
  bankModifiedFor?: number;
  dateOfBirth: GosiCalendar;
  disabilityDate: GosiCalendar;
  disabilityDescription: string;
  studyStartDate: GosiCalendar;
  disabilityStartDate: GosiCalendar;
  // eligibilityList: Eligiblity[];
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
  personId: number;
  age: number;
  birthDate: GosiCalendar;
  heirStatus: BilingualText;
  newHeirStatus?: BilingualText;
  maritalStatus: BilingualText;
  dependentSource: string;
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
  bankAccount: PersonBankDetails;
  contactDetail?: ContactDetails;
  agentContactDetails?: ContactDetails;
  hasMandatoryDetails: boolean;
  paymentMode: BilingualText;
  payee: BilingualText; //TODO: Remove
  payeeType: BilingualText;
  guardianPersonId: number;
  guardianSource: string;
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
  newlyAdded?: boolean;
  lastPaidDate: GosiCalendar;
  benefitAmount: number;
  notes?: string;
  benefitWaivedTowards?: BilingualText;
  expectedDob?: GosiCalendar;
  isUnborn: boolean;
  existingIncome: number;
  otherBenefits: BilingualText;
  //To populate reason for modifcation in UI
  reasonForModifyLov: Lov[];

  constructor(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    this.identity = identity;
    if (identity) {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(identity);
      if (idObj) {
        this.nin.newNin = idObj.id; //TODO: future change to accept all identities
      }
    }
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
  actionType: string; //ADD, REMOVE, MODIFY
  dateOfBirth: GosiCalendar;
  personId: number;
  relationship: BilingualText;
  disabled: boolean;
  divorced: boolean;
  widowed: boolean;
  married: boolean; //remove
  student: boolean;
  employed: boolean;
  orphan?: boolean;
  unborn?: boolean;
  pregnant?: boolean;
  dependentSource: string;
  status: BilingualText;
  requestDate?: GosiCalendar;
  maritalStatus: BilingualText;
  marriageEvents: MarriageDetails[];
  benefitStartDate?: GosiCalendar;
  valid?: boolean;
  income?: Number;
  disabilityDescription?: string;
  reasonForModification: BilingualText;
  statusDate: GosiCalendar;
  notes?: string;
  studyStartDate?: GosiCalendar;
  disabilityStartDate?: GosiCalendar;
  expectedDob?: GosiCalendar;
  motherId?: number;
  constructor() {}
  assignValues(obj: DependentDetails) {
    this.actionType = obj.actionType;
    this.dateOfBirth = obj.dateOfBirth || obj.birthDate;
    this.personId = obj.personId;
    this.relationship = obj.relationship;
    this.disabled = obj.disabled;
    this.divorced = obj.divorced;
    this.widowed = obj.widowed;
    this.married = obj.married;
    this.student = obj.student;
    this.employed = obj.employed;
    this.reasonForModification = obj.reasonForModification;
    this.statusDate = obj.statusDate;
    this.orphan = obj.orphan;
    this.unborn = obj.unborn;
    this.pregnant = obj.pregnant;
    this.dependentSource = obj.dependentSource;
    this.maritalStatus = obj.maritalStatus;
    this.benefitStartDate = obj.benefitStartDate;
    this.studyStartDate = obj.studyStartDate;
    this.disabilityStartDate = obj.disabilityStartDate;
    this.valid = obj.valid;
    this.status = obj.status;
    this.income = obj.income;
    this.disabilityDescription = obj.disabilityDescription;
    this.notes = obj.notes;
    //Unborn
    this.motherId = obj.motherId;
    this.expectedDob = obj.expectedDob;
  }
}

export interface ValidateDependent {
  validateDependent: DependentModify;
  dependents: DependentModify[];
}

export class ValidateHeir {
  validateHeir: DependentModify;
  heirs: DependentModify[];
}
