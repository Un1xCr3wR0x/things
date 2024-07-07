/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ComponentRef, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  BankAccount,
  BilingualText,
  ContactDetails,
  LegalEntitiesEnum,
  Lov,
  LovList,
  Person,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { tap } from 'rxjs/operators';
import { ContributorConstants } from '../../../shared/constants';
import { ContributionCategory, ContributorTypesEnum } from '../../../shared/enums';
import {
  ContributorDetailsWrapper,
  EngagementDetails,
  PersonalInformation,
  PersonBankDetails
} from '../../../shared/models';
import { removeNullIdentities } from '../../../shared/utils';
import {
  GccPersonDetailsDcComponent,
  ImmigratedTribePersonDetailsDcComponent,
  NonSaudiPersonDetailsDcComponent,
  SaudiPersonDetailsDcComponent,
  SplForeignerPersonDetailsDcComponent
} from '../person-details';
import { AddContributorScComponent } from './add-contributor-sc.component';

/** Method to get total tabs. */
export function getTotalTabs(isDocumentRequired: boolean, isContractRequired: boolean) {
  let totalTabs: number;
  if (isDocumentRequired) totalTabs = isContractRequired ? 6 : 3;
  else totalTabs = isContractRequired ? 5 : 2;
  return totalTabs;
}

/** Method to check for document section. */
export function checkForDocumentSection(appType: string, contributorType: string, isEdit: boolean, param: Date, data?) {
  let documentRequired: boolean;
  if (appType === ApplicationTypeEnum.PUBLIC && contributorType === ContributorTypesEnum.SAUDI && !isEdit) {
    if (data) documentRequired = data.isConActive ? moment(data.joiningDate).isBefore(param) : true;
    else documentRequired = false;
  } else documentRequired = true;
  return documentRequired;
}

/** Method to check for contract authentication. */
export function checkForContractAuthentication(
  contributorType: string,
  isEdit: boolean,
  legalEntity: string,
  backdatingIndicator: boolean,
  isActive?: boolean,
  isGccEstablishment?: boolean
) {
  return isEdit && backdatingIndicator
    ? false
    : legalEntity !== LegalEntitiesEnum.GOVERNMENT &&
      legalEntity !== LegalEntitiesEnum.SEMI_GOVERNMENT &&
      !isGccEstablishment
    ? isActive === undefined
      ? contributorType === ContributorTypesEnum.SAUDI
      : contributorType === ContributorTypesEnum.SAUDI && isActive
    : false;
}

/** Method to assemble initial state for template. */
export function assembleInitialState(person: PersonalInformation, engagement, isApiTriggered: boolean) {
  return {
    person: person,
    engagementPeriod: engagement?.wageDetails ? engagement?.wageDetails : engagement.engagementPeriod,
    isApiTriggered
  };
}

/** Method to get modal config. */
export function getModalConfig(initialState?) {
  const config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  return initialState ? { ...config, initialState } : config;
}

/** Method to assemble bank details. */
export function assembleBankDetails(data: PersonBankDetails) {
  if (data) {
    const bank = new BankAccount();
    bank.bankName = data.bankName;
    bank.ibanAccountNo = data.ibanBankAccountNo;
    bank.verificationStatus = data.verificationStatus;
    return bank;
  } else return undefined;
}

/** Method to get new IBAN. */
export function getNewIBAN(form: FormGroup, bank: BankAccount, isEditMode: boolean) {
  return isEditMode
    ? bank.ibanAccountNo
    : form.get('bankDetailsForm')
    ? form.get('bankDetailsForm.ibanAccountNo').value
    : null;
}

/** Method  to get navigation indicator. */
export function getNavigationIndicator(isAdminEdit: boolean, isValidatorEdit: boolean) {
  return isAdminEdit
    ? ContributorConstants.NAV_ADMIN_EDIT_SUBMIT
    : isValidatorEdit
    ? ContributorConstants.NAV_FIRST_VAL_SUBMIT
    : null;
}
/** Method to assemble contributor details */
export function assembleContributorDetails(
  newPerson: Person,
  oldPerson: Person,
  contributorType: string,
  isEdit: boolean
) {
  newPerson.identity = removeNullIdentities(newPerson.identity);
  const contributorDetails = new ContributorDetailsWrapper();
  contributorDetails.person = setResponse(new Person(), newPerson);
  contributorDetails.person.personId = oldPerson.personId;
  contributorDetails.person.birthDate = oldPerson.birthDate;
  contributorDetails.contributorType = contributorType;
  if (contributorDetails.person?.birthDate?.gregorian && !isEdit) {
    contributorDetails.person.birthDate.gregorian = startOfDay(contributorDetails.person.birthDate.gregorian);
  }
  return contributorDetails;
}

/** Method to bind form data to model */
function setResponse(object, data) {
  if (data && object) {
    Object.keys(object).forEach(key => {
      if (key in data) {
        if (data[key]) {
          if (key === 'prisoner' || key === 'student') {
            object[key] = data[key]['english'] === 'No' ? false : true;
          } else if (key === 'identity') {
            data[key].forEach(identity => {
              Object.keys(identity).forEach(val => {
                if (val === 'expiryDate' || val === 'issueDate')
                  if (identity[val]) identity[val].gregorian = startOfDay(identity[val].gregorian);
              });
            });
            object[key] = data[key];
          } else {
            object[key] = data[key];
          }
        }
      }
    });
  }
  return { ...object };
}

/** Method to get coverage type form. */
export function getCoverageTypeForm() {
  return new FormGroup({
    english: new FormControl(null, Validators.required),
    arabic: new FormControl({})
  });
}

/** Method to assemble coverage type lov. */
export function assembleCoverageTypeLov(coverages: BilingualText[]) {
  return new LovList(
    coverages.map((cov, index) => {
      return { value: cov, sequence: index };
    })
  );
}

/** Method to set coverage from on edit. */
export function setCoverageFormOnEdit(engagement: EngagementDetails, coverageForm: FormGroup) {
  if (
    engagement.engagementPeriod[0]?.coverageType?.length === 1 &&
    engagement.engagementPeriod[0].coverageType[0].english === ContributionCategory.OH
  )
    coverageForm.get('english').setValue(ContributionCategory.OH);
  else if (engagement.engagementPeriod[0]?.coverageType?.length === 2)
    coverageForm.get('english').setValue(ContributionCategory.OH_ANNUITY);
}

/** Method to get age from start of the year. */
export function getAgeFromYearStart(birthDate: Date) {
  const startDateOfYear = new Date(new Date().getFullYear(), 0, 1);
  return birthDate ? moment(startDateOfYear).diff(moment(birthDate), 'years') : 0;
}

/** Method to create person component based on contributor type. */
export function createPersonComponent(contributorType: string, _self: AddContributorScComponent) {
  let componentRef;
  switch (contributorType.toLowerCase()) {
    case ContributorTypesEnum.SAUDI.toLowerCase(): {
      componentRef = resolveComponent(SaudiPersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self);
        componentRef.instance.booleanList = _self.yesOrNoList$;
        if (!(_self.isEditAdmin || _self.isValidatorEdit)) setSaudiAddress(componentRef, _self);
      }
      break;
    }
    case ContributorTypesEnum.NON_SAUDI.toLowerCase(): {
      componentRef = resolveComponent(NonSaudiPersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self);
        setGenderAndMaritalInputsPersonDetails(componentRef, _self);
      }
      break;
    }
    case ContributorTypesEnum.IMMIGRATED_TRIBE.toLowerCase(): {
      componentRef = resolveComponent(ImmigratedTribePersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self);
        setGenderAndMaritalInputsPersonDetails(componentRef, _self);
      }
      break;
    }
    case ContributorTypesEnum.SPECIAL_FOREIGNER.toLowerCase(): {
      componentRef = resolveComponent(SplForeignerPersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self);
        setGenderAndMaritalInputsPersonDetails(componentRef, _self);
        componentRef.instance.isSpecialResidents = false;
      }
      break;
    }
    case ContributorTypesEnum.GCC.toLowerCase(): {
      componentRef = resolveComponent(GccPersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self, true);
        setGenderAndMaritalInputsPersonDetails(componentRef, _self);
      }
      break;
    }
    case ContributorTypesEnum.PREMIUM_RESIDENTS.toLowerCase(): {
      componentRef = resolveComponent(SplForeignerPersonDetailsDcComponent, _self);
      if (componentRef) {
        setInputsforPersonDetails(componentRef, _self);
        setGenderAndMaritalInputsPersonDetails(componentRef, _self);
        componentRef.instance.isSpecialResidents = true;
      }
      break;
    }
    default:
      break;
  }
  return componentRef;
}

/** Method to resolve component and return a reference to that dynamic component */
function resolveComponent(
  component: Type<
    | SaudiPersonDetailsDcComponent
    | NonSaudiPersonDetailsDcComponent
    | ImmigratedTribePersonDetailsDcComponent
    | SplForeignerPersonDetailsDcComponent
    | GccPersonDetailsDcComponent
  >,
  _self: AddContributorScComponent
) {
  const componentFactory = _self.componentFactoryResolver.resolveComponentFactory(component);
  const viewContainerRef = _self.gosiComponentHost.viewContainerRef;
  viewContainerRef.clear();
  const componentRef = viewContainerRef.createComponent(componentFactory);
  return componentRef;
}

/** Method to set common input variables for person details component */
function setInputsforPersonDetails(componentRef, _self: AddContributorScComponent, isGccNationsOnly = false) {
  componentRef.instance.cityList = _self.cityList$.pipe(
    tap(res => {
      _self.person.contactDetail?.addresses.forEach(response => {
        if (!res?.items.some(item => item.value.english === response?.city?.english))
          componentRef.instance.isPersonAddressNotPresent = true;
      });
    })
  );

  componentRef.instance.specializationList = _self.specializationList$
    .pipe(
      tap(res => {
        const specializationValue = new Lov();
        specializationValue.value = _self.person.specialization;
        if (specializationValue.value) {
          if (!res?.items.some(item => item.value.english === specializationValue?.value.english))
            res?.items.push(specializationValue);
        }
      })
    )
    .subscribe();
  componentRef.instance.specializationList = _self.specializationList$;
  componentRef.instance.educationList = _self.educationList$;
  componentRef.instance.nationalityList = isGccNationsOnly ? _self.gccCountryList$ : _self.nationalityList$;
  componentRef.instance.countryList = _self.countryList$;
  componentRef.instance.parentForm = _self.parentForm;
  componentRef.instance.personDetails = _self.person;
  componentRef.instance.isEditMode = _self.isValidatorEdit || _self.isEditAdmin;
  componentRef.instance.isApiTriggered = _self.isApiTriggered;
  componentRef.instance.isAppPrivate = _self.isPrivate;
  componentRef.instance.isNonSaudi = _self.isNonSaudi;
}
/** Method to set gender and marital status lookups */
function setGenderAndMaritalInputsPersonDetails(componentRef, _self: AddContributorScComponent) {
  componentRef.instance.genderList = _self.genderList$;
  componentRef.instance.maritalStatusList = _self.maritalStatusList$;
}

/** Method to set address for saudi person for not edit */
function setSaudiAddress(
  componentRef: ComponentRef<SaudiPersonDetailsDcComponent>,
  _self: AddContributorScComponent
): void {
  if (!(_self.isEditAdmin || _self.isValidatorEdit))
    if (!(_self.person.contactDetail?.addresses?.length > 0))
      if (_self.establishment.contactDetails?.addresses?.length > 0) {
        componentRef.instance.isEstablishmentAddress = true;
        componentRef.instance.personDetails.contactDetail = new ContactDetails();
        componentRef.instance.personDetails.contactDetail = _self.person.contactDetail;
        componentRef.instance.personDetails.contactDetail.addresses = _self.establishment.contactDetails.addresses;
        componentRef.instance.personDetails.contactDetail.currentMailingAddress =
          _self.establishment.contactDetails.currentMailingAddress;
      }
}
