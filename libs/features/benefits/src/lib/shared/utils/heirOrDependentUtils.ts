/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitValues } from '../enum/benefit-values';
import {
  LovList,
  Name,
  Lov,
  BilingualText,
  getPersonArabicName,
  getPersonEnglishName,
  GosiCalendar,
  TransactionStatus,
  AddressTypeEnum,
  NationalityTypeEnum,
  ContactDetails
} from '@gosi-ui/core';
import { getArabicFullName, deepCopy, isHeirLumpsum } from './benefitUtil';
import { FormArray } from '@angular/forms';
import { HeirDebitDetails } from '../models/heir-debit';
import {
  PaymentAndBenefitStatusDtos,
  EventValidated,
  DependentDetails,
  HeirDetailsRequest,
  AuthorizationDetailsDto,
  AttorneyDetailsWrapper,
  AttorneyDetails,
  Eligiblity,
  HeirEligibilityDetails,
  ReCalculationDetails,
  BenefitDetails,
  ValidateRequest,
  DependentModify
} from '../models';
import { HeirEvent, Question } from '../models/questions';
import { DependentHeirConstants } from '../constants/dependent-heir-constants';
import moment from 'moment';
import { getDuplicateEvents } from './eventsUtils';
import {
  ActionType,
  BenefitStatus,
  EventCategory,
  EventsType,
  HeirStatus,
  QuestionTypes,
  RelationShipCode
} from '../enum';
import { EventsConstants } from '../constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { eventsByStartDateDecending, getOldestEventFromResponse } from './eventsUtils';

export const getMotherList = function (heirDetails = []): LovList {
  let heirList = new LovList([]);
  heirDetails.forEach(heir => {
    if (heir.relationship?.english === BenefitValues.wife) {
      const name: Name = new Name().fromJsonToObject(heir.name);
      const bilingual = new BilingualText();
      bilingual.arabic = getPersonArabicName(name.arabic);
      bilingual.english = getPersonEnglishName(name.english);
      bilingual.english = !bilingual.english ? bilingual.arabic : bilingual.english;

      heirList.items.push({
        value: bilingual,
        code: heir.personId,
        sequence: 0
      });
    }
  });
  return heirList;
};

export const disableLovItems = function (toBeDisabled: string[], list: LovList): LovList {
  let modifiedArray: Lov[] = [];
  let modifiedList: LovList = deepCopy(list);
  list.items.forEach(element => {
    if (toBeDisabled.includes(element.code.toString())) {
      element['disabled'] = true;
      modifiedArray.push(element);
    } else {
      modifiedArray.push(element);
    }
  });
  modifiedList.items = modifiedArray;
  return modifiedList;
};

export const setHeirDebitDetails = function (formArray: FormArray = new FormArray([])): HeirDebitDetails[] {
  return formArray?.getRawValue();
};

export const getHeirPaymentRequestBody = function (
  formArray: FormArray = new FormArray([])
): PaymentAndBenefitStatusDtos[] {
  const paymentArray: PaymentAndBenefitStatusDtos[] = [];
  formArray.controls.forEach(eachControl => {
    if (eachControl.get('adjustmentDetails')) paymentArray.push(eachControl.get('adjustmentDetails').value);
  });
  return paymentArray;
};

export const getDependentHeirEligibilityStatus = function (
  events: Array<EventValidated | HeirEvent> = [],
  valid: boolean,
  currentDate: GosiCalendar,
  isHeir: boolean,
  eachDep?: DependentDetails | ValidateRequest | DependentModify,
  isModify?: boolean
): BilingualText {
  if (!isModify && !isHeir && (!eachDep?.actionType || eachDep?.actionType === ActionType.NO_ACTION)) {
    //not required for Heir
    return valid ? DependentHeirConstants.eligible() : DependentHeirConstants.notEligible();
  } else if (valid || valid === null) {
    // all events true eligible, all event false not eligible, latest event false at least one event true backdated
    if (events?.every(event => event.valid)) {
      return DependentHeirConstants.eligible();
    } else if (events?.every(event => !event.valid)) {
      return DependentHeirConstants.notEligible();
    } else {
      //get latest event
      const sortedEvents: Array<EventValidated | HeirEvent> = eventsByStartDateDecending(events || []);
      if (sortedEvents[0]?.valid) {
        return DependentHeirConstants.eligible();
      } else if (events?.find(event => event.valid)) {
        return DependentHeirConstants.eligibleForBackdated();
      } else {
        // TODO: remove this events are mandatory for Heirs Added for proactive Heir as there is no events
        return DependentHeirConstants.eligible();
      }
    }
  } else {
    return DependentHeirConstants.notEligible();
  }
};

export const setStatusForNicDependents = function (
  dependents: DependentDetails[] = [],
  isValidatorEdit = false,
  isHeir: boolean,
  benefitStatus?: string,
  isModify?: boolean,
  currentDate?: GosiCalendar,
  requestDateChangedByValidator = false
): DependentDetails[] {
  // this.dependentDetails[0].statusAfterValidation = getDependentHeirEligibilityStatus(this.dependentDetails.);
  const depList = deepCopy(dependents);
  // const notEligibleBilingual = DependentHeirConstants.notEligible();
  depList.forEach(eachDep => {
    eachDep.statusAfterValidation = getDependentHeirEligibilityStatus(
      isHeir ? eachDep.events : eachDep.eligibilityList || eachDep.events,
      eachDep.valid,
      currentDate,
      isHeir,
      eachDep,
      isModify
    );
    if (!isValidatorEdit || requestDateChangedByValidator) {
      // Mandatory details to be entered for draft and normal apply scenario
      eachDep.showMandatoryDetails = true;
    }
  });
  return depList;
};

export const removeDuplicateMsg = function (events: EventValidated[]): EventValidated[] {
  return events?.filter(r => !events.some(f => f.message?.english === r.message?.english));
};

export const removeDuplicateMessages = function (events: EventValidated[] = []): EventValidated[] {
  return events.filter((value, index, self) => index === self.findIndex(t => t.message === value.message));
};

export const isHeirReasonForBenefitChanged = function (
  oldHeirDetailsData: HeirDetailsRequest,
  newHeirDetailsData: HeirDetailsRequest
): boolean {
  let changed = false;
  if (
    !oldHeirDetailsData?.requestDate?.gregorian ||
    !oldHeirDetailsData?.eventDate?.gregorian ||
    newHeirDetailsData.reason?.english !== oldHeirDetailsData?.reason?.english ||
    !moment(oldHeirDetailsData?.eventDate?.gregorian).isSame(moment(newHeirDetailsData.eventDate?.gregorian), 'day') ||
    !moment(oldHeirDetailsData?.requestDate?.gregorian).isSame(moment(newHeirDetailsData.requestDate?.gregorian), 'day')
  ) {
    changed = true;
  }
  return changed;
};

export const getPensionStatusLabel = function (heirPensionStatus: BilingualText, isDep: boolean): string {
  const backdated = DependentHeirConstants.eligibleForBackdated();
  const eligible = DependentHeirConstants.eligible();
  const notEligible = DependentHeirConstants.notEligible();
  if (!isDep) {
    switch (heirPensionStatus?.english) {
      case eligible.english:
        return 'BENEFITS.IS-ELIGIBLE';
      case notEligible.english:
        return 'BENEFITS.IS-NOT-ELIGIBLE';
      case backdated.english:
        return 'BENEFITS.HEIR-PARTIALLY-ELIGIBLE-MSG';
    }
  } else {
    switch (heirPensionStatus?.english) {
      case notEligible.english:
        return 'BENEFITS.DEP-NOT-ELIGIBLE-MSG';
      case backdated.english:
        return 'BENEFITS.DEP-PARTIALLY-ELIGIBLE-MSG';
    }
  }
};

export const getIsWifeUnborn = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() == RelationShipCode.WIFE ||
    selectedRelationship.code.toString() == RelationShipCode.UNBORN
  );
};
export const isFemale = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.MOTHER ||
    selectedRelationship.code.toString() === RelationShipCode.SISTER ||
    selectedRelationship.code.toString() === RelationShipCode.WIFE ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_MOTHER ||
    selectedRelationship.code.toString() === RelationShipCode.ORPHAN_DAUGHTER
  );
};
export const isSaudiMother = function (
  selectedRelationship: Lov,
  contactDetail: ContactDetails,
  nationality: BilingualText
): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.MOTHER &&
    contactDetail &&
    contactDetail.currentMailingAddress === AddressTypeEnum.OVERSEAS &&
    nationality &&
    nationality?.english === NationalityTypeEnum.SAUDI_NATIONAL
  );
};
export const isMotherOrGrandMother = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.MOTHER ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_MOTHER
  );
};
export const isDaughterSisterWifeGranddaughter = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.SISTER ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.WIFE
  );
};
export const isFatherGrandfatherHusband = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.FATHER ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_FATHER ||
    selectedRelationship.code.toString() === RelationShipCode.HUSBAND
  );
};
export const isSonGrandsonBrotherOrphanson = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.SON ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_SON ||
    selectedRelationship.code.toString() === RelationShipCode.BROTHER ||
    selectedRelationship.code.toString() === RelationShipCode.ORPHAN_SON
  );
};
export const getIsSonDaughter = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.SON ||
    selectedRelationship.code.toString() === RelationShipCode.DAUGHTER
  );
};
export const isDaughterSisterWifeGranddaugherOrphandaugher = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.SISTER ||
    selectedRelationship.code.toString() === RelationShipCode.WIFE ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.ORPHAN_DAUGHTER
  );
};
export const isSonGrandsonBrother = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.SON ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_SON ||
    selectedRelationship.code.toString() === RelationShipCode.BROTHER
  );
};

export const isSisterDaughter = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.DAUGHTER ||
    selectedRelationship.code.toString() === RelationShipCode.SISTER ||
    selectedRelationship.code.toString() === RelationShipCode.GRAND_DAUGHTER
  );
};

export const isWifeHusband = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.WIFE ||
    selectedRelationship.code.toString() === RelationShipCode.HUSBAND
  );
};


export const isFatherMother = function (selectedRelationship: Lov): boolean {
  return (
    selectedRelationship.code.toString() === RelationShipCode.FATHER ||
    selectedRelationship.code.toString() === RelationShipCode.MOTHER
  );
};

export const getEligibilityStatusForHeirPensionLumpsumFromValidateApi = function (
  events: Array<EventValidated | HeirEvent>,
  valid: boolean,
  benefitType: string,
  systemRunDate: GosiCalendar,
  eligibleHeir = true
): BilingualText {
  //!eligibleHeir - from save response for not eligible heir status
  if (!eligibleHeir) {
    return DependentHeirConstants.notEligible();
  }
  if (isHeirLumpsum(benefitType)) {
    const oldestEvent = getOldestEventFromResponse(events);
    return oldestEvent?.valid ? DependentHeirConstants.eligible() : DependentHeirConstants.notEligible();
  } else {
    return getDependentHeirEligibilityStatus(events, valid, systemRunDate, true);
  }
};

export const getAuthpersonDetails = function (authorizationDetails: AuthorizationDetailsDto, runDate: GosiCalendar) {
  const authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
  authorizationDetails.authorizationList.forEach(val => {
    if (
      val.authorizationType?.english === 'Attorney' &&
      (!val?.endDate || moment(runDate.gregorian).diff(moment(val?.endDate?.gregorian), 'days') < 0)
    ) {
      const authorizedPersonDetail = new AttorneyDetailsWrapper();
      //setting attorney details
      // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
      authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
      authorizedPersonDetail.name = val?.agent?.name;
      authorizedPersonDetail.identity = val?.agent?.identity;
      if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
      authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
      authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
      authorizedPersonDetails.push(authorizedPersonDetail);
    }
  });
  return authorizedPersonDetails;
};

export const getGuardianDetails = function (authorizationDetails: AuthorizationDetailsDto, runDate: GosiCalendar) {
  const guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
  authorizationDetails.authorizationList.forEach(val => {
    if (
      val.authorizationType?.english === 'Custody' &&
      (!val?.endDate || this.momentObj(runDate.gregorian).diff(this.momentObj(val?.endDate?.gregorian), 'days') < 0)
    ) {
      const authorizedPersonDetail = new AttorneyDetailsWrapper();
      authorizedPersonDetail.personId = val?.custodian?.id ? Number(val?.custodian?.id) : null;
      authorizedPersonDetail.name = val.custodian?.name;
      authorizedPersonDetail.identity = val.custodian?.identity;
      if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
      authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
      authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
      guardianPersonDetails.push(authorizedPersonDetail);
    }
  });
  return guardianPersonDetails;
};

export const getAuthorizedGuardianDetails = function (
  authorizationDetails: AuthorizationDetailsDto,
  runDate: GosiCalendar
) {
  const authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
  const guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
  authorizationDetails.authorizationList.forEach(val => {
    if (
      val.authorizationType?.english === 'Attorney' &&
      (!val.endDate || moment(val.endDate.gregorian).isSameOrAfter(moment(runDate.gregorian))) &&
      val.isBeneficiarysAuthorisedPerson &&
      val.isActive
    ) {
      const authorizedPersonDetail = new AttorneyDetailsWrapper();
      //setting attorney details
      // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
      authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
      authorizedPersonDetail.name = val?.agent?.name;
      authorizedPersonDetail.identity = val?.agent?.identity;
      if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
      authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
      authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
      authorizedPersonDetail.attorneyDetails.authorizationId = val?.authorizationId;
      authorizedPersonDetails.push(authorizedPersonDetail);
    }
    if (
      val.authorizationType?.english === 'Custody' &&
      (!val?.endDate || moment(val?.endDate?.gregorian).isSameOrAfter(moment(runDate.gregorian))) &&
      val.isActive
    ) {
      const authorizedPersonDetail = new AttorneyDetailsWrapper();
      authorizedPersonDetail.personId = val?.custodian?.id ? Number(val?.custodian?.id) : null;
      authorizedPersonDetail.name = val.custodian?.name;
      authorizedPersonDetail.identity = val.custodian?.identity;
      if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
      authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
      authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
      authorizedPersonDetail.attorneyDetails.authorizationId = val?.authorizationId;
      guardianPersonDetails.push(authorizedPersonDetail);
    }
  });
  return { authorizedPersonDetails: authorizedPersonDetails, guardianPersonDetails: guardianPersonDetails };
};

export const renameObjectInArray = function (item: Object, replacements: any) {
  let replacedItems = Object.keys(item).map(key => {
    const newKey = replacements[key] || key;
    return { [newKey]: item[key] };
  });
  return replacedItems.reduce((a, b) => Object.assign({}, a, b));
};

export const getNewBornRelationships = function (): Observable<LovList> {
  const lovList: LovList = new LovList([]);
  const relationShips: Lov[] = [DependentHeirConstants.Son, DependentHeirConstants.Daughter];
  relationShips.forEach((eachLov, index) => {
    const lov = new Lov();
    lov.sequence = index;
    lov.value = eachLov.value;
    lov.code = eachLov.code;
    lovList.items.push(lov);
  });
  const lookupSubject = new BehaviorSubject<LovList>(lovList);
  // lookupSubject.next(lovList);
  return lookupSubject.asObservable();
};

export const getStatusBasedOnActionType = function (actionType: string): string {
  switch (actionType) {
    case ActionType.ADD:
      return 'BENEFITS.NEW';
    case ActionType.MODIFY:
      return 'BENEFITS.MODIFY';
    case HeirStatus.HOLD:
      return 'BENEFITS.HOLD-STATUS';
    case HeirStatus.RESTART:
      return 'BENEFITS.RESTART-STATUS';
    case HeirStatus.STOP:
      return 'BENEFITS.STOP-STATUS';
    case HeirStatus.START_WAIVE:
      return 'BENEFITS.BENEFIT-WAIVED';
    case HeirStatus.STOP_WAIVE:
      return 'BENEFITS.BENEFIT_WAIVE_STOPPED';
  }
};

export const maritalStatusForEventType = function (eventType: BilingualText): BilingualText {
  switch (eventType.english) {
    case EventsType.MARRIAGE:
      return EventsConstants.MARRIED;
    case EventsType.DIVORCE:
      return EventsConstants.DIVORCE;
    case EventsType.WIDOWHOOD:
      return EventsConstants.WIDOWHOOD;
  }
};

export const HeirEligibilityStatusWithOtherBenefits = function (
  data: DependentDetails | ValidateRequest,
  systemRunDate: GosiCalendar,
  calculateApiResponse: BenefitDetails,
  isHeirLumpsum = false,
  isValidator = false,
  isModify = false
) {
  if (isHeirLumpsum) {
    const oldestEvent = getOldestEventFromResponse(data.events);
    return oldestEvent?.valid ? DependentHeirConstants.eligible() : DependentHeirConstants.notEligible();
  } else {
    const status = getDependentHeirEligibilityStatus(
      data.events,
      isValidator ? true : data.valid,
      systemRunDate,
      true,
      data,
      isModify
    );
    if (status?.english !== DependentHeirConstants.notEligibleString && calculateApiResponse) {
      const calculationForHeir = calculateApiResponse.ineligibility?.find(inEligiblePeriod => {
        const id = data.personId || data.heirPersonId;
        return inEligiblePeriod.heirPersonId === id;
      });
      if (
        status.english === DependentHeirConstants.eligibleString &&
        calculationForHeir &&
        calculationForHeir?.period &&
        calculationForHeir?.period.find(element => {
          return !element.endDate;
        })
      ) {
        // Has period with end date null
        // if (index !== undefined)
        //   this.heirEligibilityDetails[index].showNotEligibleReason = true;
        if (calculationForHeir.hasEligiblePeriod) {
          return DependentHeirConstants.eligibleForBackdated();
        } else {
          return DependentHeirConstants.notEligible();
        }
      } else if (status.english === DependentHeirConstants.eligibleForBackdatedString) {
        // if (index !== undefined)
        //   this.heirEligibilityDetails[index].showNotEligibleReason = true;
        if (
          calculationForHeir &&
          calculationForHeir?.period &&
          calculationForHeir?.period.find(element => {
            return !element.endDate;
          })
        ) {
          // Period with end date null
          if (calculationForHeir.hasEligiblePeriod) {
            return DependentHeirConstants.eligibleForBackdated();
          } else {
            return DependentHeirConstants.notEligible();
          }
        } else if (
          calculationForHeir &&
          calculationForHeir?.period &&
          calculationForHeir?.period.every(period => !period.endDate) &&
          !calculationForHeir.hasEligiblePeriod
        ) {
          //if period has endDate for all items in period
          return DependentHeirConstants.notEligible();
        } else {
          //eligibleForBackdated
          return status;
        }
      } else {
        return status;
      }
    } else {
      return status;
    }
  }
};
