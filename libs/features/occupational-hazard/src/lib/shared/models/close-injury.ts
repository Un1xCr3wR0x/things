import { BilingualText } from "@gosi-ui/core";

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class CloseInjury {
  SINumber: number = undefined;
  closeDay: number = undefined;
  closeMonth: number = undefined;
  closeStatus: number = undefined;
  closeYear: number = undefined;
  deathDay: number = undefined;
  deathMonth: number = undefined;
  deathReason: string = undefined;
  deathYear: number = undefined;
  finalDiagnosis: string = undefined;
  injuryId: number = undefined;
  lineOfTreatment: number = undefined;
  tpaCode: number = undefined;
}
export class DependentDetails {
  // id?: number;
  id: number = undefined;
  motherId: number;
  editStatus?: string;
  editMode: boolean;
  nameInEnglish: string;
  nameInArabic: string;
  actionType: string = undefined;
  isExistingDependent?: boolean;
  authorizedPersonId?: number = undefined;
  authorizationDetailsId?: number = undefined;
  lastModifiedAuthPersonId?: number;
  bankModifiedFor?: number;
  disabilityDescription: string;
  //  eligibilityList : HeirEligibilityDetails[];
  eligibilityMessage: BilingualText;
  eligibilityStatus: BilingualText;
  heading: BilingualText;
  gender: BilingualText;
  nameBilingual: BilingualText;
  relationship: BilingualText;
  nationality: BilingualText;
  personId: number = undefined;
  age: number;
  gregorianAge: number;
  // birthDate: GosiCalendar;
  heirStatus: BilingualText;
  newHeirStatus?: BilingualText;
  maritalStatus: BilingualText;
  maritalStatusFromNicMoj?: boolean;
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
  bankName?: BilingualText;
  hasMandatoryDetails: boolean;
  paymentMode: BilingualText = undefined;
  payee: BilingualText = undefined; //TODO: Remove
  payeeType: BilingualText = undefined;
  guardianPersonId?: number = undefined;
  guardianSource: string = undefined;
  valid: boolean;
  monthlyWage: number;
  benefitRequestId?: number;
  errorMsg?: BilingualText;
  income?: number;
  status: BilingualText;
  showGreenBorder?: boolean;
  reasonForModification: BilingualText;
  referenceNo?: number;
  newlyAdded?: boolean;
  benefitAmount: number;
  notes?: string;
  benefitWaivedTowards?: BilingualText;
  isUnborn: boolean;
  existingIncome: number;
  otherBenefits: BilingualText;
  enableEditAddress: boolean;
  newDependentStatus: BilingualText;
  lifeStatus: string = undefined;
  maritalStatusValue: string;
  payeeTypeValue: string;
  paymentModeValue: string;
  recordActionType: string;
  beneficiaryType?: BilingualText = undefined;
  showBorder?: boolean;
  divorcedOrWidowed?: boolean;
  marriedWife?: boolean;
  maritalStatusDateUpdatedFromUi?: boolean;
  backdated = true;
  statusAfterValidation: BilingualText;
  isHold: boolean;
  isDirectPayment: boolean;
  showMandatoryDetails = false;
  eligibleHeir: boolean;
  beneficiaryId: number;
  noOfChildren: number;
  newBorn: boolean;
  replaceItemWithIndex: number;
  hijiriAgeInMonths: number;
  nonSaudiDependentAdded = false;
  nonSaudiHeirAdded = false;
  unbornModificationReason: BilingualText;
  samaVerification?: BilingualText = new BilingualText();
  disabilityStatus: BilingualText;
  benefitStatus: BilingualText;
}