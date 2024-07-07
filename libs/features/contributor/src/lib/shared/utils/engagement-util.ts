/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  BorderNumber,
  GccCountryEnum,
  IdentityTypeEnum,
  Iqama,
  LegalEntitiesEnum,
  NIN,
  NationalId,
  Passport,
  bindToObject,
  startOfDay
} from '@gosi-ui/core';
import { ContributorTypesEnum, DocumentTransactionType, YesOrNo } from '../../shared/enums';
import {
  Contributor,
  EngagementDetails,
  EngagementPeriod,
  PersonalInformation,
  SystemParameter
} from '../../shared/models';

/**
 * This method to mark all the fields in a form as touched and dirty
 * @param formGroup
 * @param data
 */
export const createEngagementForm = function (
  fb: FormBuilder,
  isContributorActive = true,
  disableContributorActive = false,
  isContractActive = false,
  disableContractActive = false
) {
  return fb.group({
    joiningDate: fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: ['', { validators: Validators.required, updateOn: 'blur' }],
      entryFormat: [null]
    }),
    leavingDate: fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: ['', { validators: Validators.required, updateOn: 'blur' }],
      entryFormat: [null]
    }),
    leavingReason: fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: ['']
    }),
    formSubmissionDate: fb.group({
      gregorian: [null],
      hijiri: ['']
    }),
    workType: fb.group({
      english: [
        null,
        {
          validators: Validators.compose([Validators.required]),
          updateOn: 'blur'
        }
      ],
      arabic: null
    }),
    companyWorkerNumber: [null, { updateOn: 'blur' }],
    isContributorActive: { value: isContributorActive, disabled: disableContributorActive },
    isContractActive: { value: isContractActive, disabled: disableContractActive },

    contributorAbroad: fb.group({
      english: ['No', { validators: Validators.required, updateOn: 'blur' }],
      arabic: null
    }),
    penaltyIndicator: [false]
  });
};
/**Method to disable wage add section if joiningdate ,leaving date , leaving reason are not present */
export const checkWageAddSection = function (periodDetailForm: FormGroup): boolean {
  const leavingDateFormControl = periodDetailForm.get('leavingDate.gregorian') as FormControl;
  const leavingReasonFormControl = periodDetailForm.get('leavingReason')?.get('english') as FormControl;
  const joiningDateFormControl = periodDetailForm.get('joiningDate.gregorian') as FormControl;
  const ContributorActiveFormControl = periodDetailForm.get('isContributorActive') as FormControl;
  let disableWageAddSection: boolean;
  if (joiningDateFormControl.valid && joiningDateFormControl.value) {
    if (!ContributorActiveFormControl.value) {
      if (!leavingDateFormControl.invalid && leavingDateFormControl.value && leavingReasonFormControl.value) {
        disableWageAddSection = false;
      } else {
        disableWageAddSection = true;
      }
    } else {
      disableWageAddSection = false;
    }
  } else {
    disableWageAddSection = true;
  }
  return disableWageAddSection;
};

/** Method to remove empty or null identities while saving contributor (Needs required changes to be done in API to handle null identity values). */
export const removeNullIdentities = function (identities) {
  return (identities = identities.filter(item => {
    if (item.idType === IdentityTypeEnum.BORDER || item.idType === IdentityTypeEnum.NATIONALID) {
      if (item.id !== '') return true;
    } else if (item.idType === IdentityTypeEnum.IQAMA) {
      if (item.iqamaNo !== '') return true;
    } else if (item.idType === IdentityTypeEnum.PASSPORT) {
      if (item.passportNo !== '') return true;
    } else if (item.idType === IdentityTypeEnum.NIN) {
      if (item.newNin !== '') return true;
    }
  }));
};

/** This method is to assemble the  contributor employee wage details from form  to model. */
export const setWageDetails = function (engagementWageDetails, coverage?: BilingualText): EngagementDetails {
  const eng = new EngagementDetails();
  //setting contributor abroad
  if (engagementWageDetails.engagementDetails.contributorAbroad) {
    if (engagementWageDetails.engagementDetails.contributorAbroad.english === YesOrNo.NO) {
      engagementWageDetails.engagementDetails.contributorAbroad = false;
    } else {
      engagementWageDetails.engagementDetails.contributorAbroad = true;
    }
    if (engagementWageDetails.wageDetails && engagementWageDetails.wageDetails.length > 0) {
      engagementWageDetails.wageDetails.forEach(period => {
        period.contributorAbroad = engagementWageDetails.engagementDetails.contributorAbroad;
      });
    }
  }
  //Setting penalty indicator
  engagementWageDetails.engagementDetails.penaltyIndicator = engagementWageDetails.engagementDetails.penaltyIndicator
    ? 1
    : 0;
  //Due date issue(3 hr) setting to start of day
  engagementWageDetails.engagementDetails.joiningDate.gregorian = startOfDay(
    engagementWageDetails.engagementDetails.joiningDate.gregorian
  );
  if (engagementWageDetails.engagementDetails.leavingDate?.gregorian) {
    engagementWageDetails.engagementDetails.leavingDate.gregorian = startOfDay(
      engagementWageDetails.engagementDetails.leavingDate.gregorian
    );
  }
  engagementWageDetails.wageDetails.forEach(engPeriod => {
    engPeriod.startDate.gregorian = startOfDay(engPeriod.startDate.gregorian);
    if (engPeriod.endDate?.gregorian) {
      engPeriod.endDate.gregorian = startOfDay(engPeriod.endDate.gregorian);
    }
  });
  bindToObject(eng, engagementWageDetails.engagementDetails);
  engagementWageDetails.wageDetails.forEach(engPeriod => {
    engPeriod.coverage = coverage ? coverage : null;
    eng.engagementPeriod.push(bindToObject(new EngagementPeriod(), engPeriod));
  });
  return eng;
};

/** Method get transaction type for fetching documents */
export const getTransactionType = function (
  legalEntity: string,
  person: PersonalInformation,
  contributorType: string,
  isGccEstablishment: boolean
): string {
  let transactionType: string;
  if (contributorType === ContributorTypesEnum.GCC)
    transactionType = getTransactionTypeForGCC(person.nationality.english);
  else if (contributorType === ContributorTypesEnum.SAUDI) {
    if (isGccEstablishment) transactionType = DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_GCC;
    else {
      const deathDate = person?.deathDate?.gregorian;
      if (
        legalEntity &&
        (legalEntity === LegalEntitiesEnum.GOVERNMENT || legalEntity === LegalEntitiesEnum.SEMI_GOVERNMENT)
      ) {
        transactionType = deathDate
          ? DocumentTransactionType.REGISTER_DECEASED_CONTRIBUTOR_IN_GOVT
          : DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_GOVT;
      } else {
        if (deathDate && person.govtEmp)
          transactionType = DocumentTransactionType.REGISTER_DECEASED_GOVT_CONTRIBUTOR_IN_NON_GOVT;
        else if (deathDate) transactionType = DocumentTransactionType.REGISTER_DECEASED_CONTRIBUTOR_IN_NON_GOVT;
        else if (person.govtEmp) transactionType = DocumentTransactionType.REGISTER_GOVT_CONTRIBUTOR_IN_NON_GOVT_EST;
        else transactionType = DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_NON_GOVT;
      }
    }
  } else if (contributorType.toUpperCase() === ContributorTypesEnum.SPECIAL_FOREIGNER.toUpperCase()) {
    transactionType = DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_SPECIAL_FOREIGNER;
  } else if (
    contributorType &&
    contributorType !== ContributorTypesEnum.GCC &&
    contributorType !== ContributorTypesEnum.SAUDI &&
    contributorType !== ContributorTypesEnum.SPECIAL_RESIDENTS &&
    contributorType !== ContributorTypesEnum.PREMIUM_RESIDENTS &&
    contributorType.toUpperCase() !== ContributorTypesEnum.SPECIAL_FOREIGNER.toUpperCase()
  ) {
    transactionType = DocumentTransactionType.REGISTER_CONTRIBUTOR_IN_NON_SAUDI;
  } else if (
    contributorType &&
    (contributorType === ContributorTypesEnum.SPECIAL_RESIDENTS ||
      contributorType === ContributorTypesEnum.PREMIUM_RESIDENTS)
  )
    transactionType = DocumentTransactionType.PREMIUM_RESIDENTS;
  return transactionType;
};

/** Method to get transaction type for GCC. */
const getTransactionTypeForGCC = function (nationality: string): string {
  switch (nationality) {
    case GccCountryEnum.UAE:
      return DocumentTransactionType.REGISTER_CONTRIBUTOR_UAE;
    case GccCountryEnum.OMAN:
      return DocumentTransactionType.REGISTER_CONTRIBUTOR_OMAN;
    case GccCountryEnum.KUWAIT:
      return DocumentTransactionType.REGISTER_CONTRIBUTOR_KUWAIT;
    case GccCountryEnum.BAHRAIN:
      return DocumentTransactionType.REGISTER_CONTRIBUTOR_BAHRAIN;
    case GccCountryEnum.QATAR:
      return DocumentTransactionType.REGISTER_CONTRIBUTOR_QATAR;
  }
};

//Method to set identity objects
const getIdentityType = function (type: IdentityTypeEnum): NIN | Iqama | NationalId | Passport | BorderNumber {
  if (type === IdentityTypeEnum.NIN) {
    return new NIN();
  } else if (type === IdentityTypeEnum.IQAMA) {
    return new Iqama();
  } else if (type === IdentityTypeEnum.NATIONALID) {
    return new NationalId();
  } else if (type === IdentityTypeEnum.PASSPORT) {
    return new Passport();
  } else if (type === IdentityTypeEnum.BORDER) {
    return new BorderNumber();
  }
  return null;
};

const gccIdentites = [IdentityTypeEnum.PASSPORT, IdentityTypeEnum.IQAMA, IdentityTypeEnum.NATIONALID];
const nonSaudiIdentites = [IdentityTypeEnum.PASSPORT, IdentityTypeEnum.IQAMA, IdentityTypeEnum.BORDER];
const saudiIdentites = [IdentityTypeEnum.NIN];

// method to set gcc identities
export const getGccIdentity = function (contributor: Contributor, conType: string): Contributor {
  const idTypes = contributor.person.identity.map(item => item.idType);
  if (conType === 'GCC Contributor') {
    gccIdentites.forEach(idType => {
      if (idTypes.indexOf(idType) === -1) {
        contributor.person.identity.push(getIdentityType(idType));
      }
    });
  } else if (conType !== 'GCC Contributor' && conType !== 'engagement') {
    nonSaudiIdentites.forEach(idType => {
      if (idTypes.indexOf(idType) === -1) {
        contributor.person.identity.push(getIdentityType(idType));
      }
    });
  } else {
    saudiIdentites.forEach(idType => {
      if (idTypes.indexOf(idType) === -1) {
        contributor.person.identity.push(getIdentityType(idType));
      }
    });
  }
  return contributor;
};

/** Method to get period param. */
export const getPeriodParam = function (
  isAppPrivate: boolean,
  isRegular: boolean,
  systemParam: SystemParameter
): number {
  if (isRegular)
    return isAppPrivate
      ? systemParam.REG_CONT_MAX_REGULAR_PERIOD_IN_MONTHS_FO
      : systemParam.REG_CONT_MAX_REGULAR_PERIOD_IN_MONTHS_GOL;
  else
    return isAppPrivate
      ? systemParam.REG_CONT_MAX_BACKDATED_PERIOD_IN_MONTHS_FO
      : systemParam.REG_CONT_MAX_BACKDATED_PERIOD_IN_MONTHS_GOL;
};
/** Method to get NIN. */
export const getNin = function (identities: Array<NIN | Iqama | BorderNumber | Passport>): number {
  const index = identities.findIndex(item => item.idType === IdentityTypeEnum.NIN);
  return identities[index] ? (<NIN>identities[index]).newNin : null;
};
