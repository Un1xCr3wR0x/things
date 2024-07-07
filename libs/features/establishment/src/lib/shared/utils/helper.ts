/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  BilingualText,
  BorderNumber,
  convertToStringDDMMYYYY,
  convertToStringYYYYMMDD,
  DocumentItem,
  DropdownItem,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusCodeEnum,
  EstablishmentStatusEnum,
  getIdentityValue,
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  Lov,
  LovList,
  NationalId,
  NationalityTypeEnum,
  NIN,
  Passport,
  Person,
  WizardItem
} from '@gosi-ui/core';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { SafetyInspectionConstants } from '../constants';
import { EstablishmentConstants } from '../constants/establishment-constants';
import {
  EstablishmentStatusErrorEnum,
  EstablishmentTransEnum,
  FilterKeyEnum,
  LegalEntityEnum,
  NationalityCategoryEnum
} from '../enums';
import {
  BranchFilter,
  BranchRequest,
  FilterKeyValue,
  GenericValidationKey,
  Owner,
  PersonSearchQueryParam,
  RestrictOwner,
  SubmittedCheckList
} from '../models';
import { isLegalEntityPartnership } from './establishment-util';

/**
 * Method to check if recruitment no has changed
 * @param initialValue
 * @param changedValue
 */
export const hasNumberFieldChange = (initialValue: number, changedValue: number): boolean => {
  if (!initialValue) {
    if (!changedValue) {
      return false;
    } else {
      return true;
    }
  }
  if (initialValue !== changedValue) {
    return true;
  }
  return false;
};

/**
 * Method to filter the identities which are empty
 * @param identities
 */
export const filterIdentities = (identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) => {
  return identities.filter(identity => {
    if (identity.idType === IdentityTypeEnum.IQAMA) {
      identity = <Iqama>identity;
      return identity.iqamaNo && identity.iqamaNo?.toString() !== '' ? true : false;
    } else if (identity.idType === IdentityTypeEnum.PASSPORT) {
      identity = <Passport>identity;
      return identity.passportNo && identity.passportNo?.toString() !== '' ? true : false;
    } else if (identity.idType === IdentityTypeEnum.BORDER) {
      identity = <BorderNumber>identity;
      return identity.id && identity.id?.toString() !== '' ? true : false;
    } else {
      return true;
    }
  });
};

/**
 * Method to check if the token carries the expected values
 * @param estToken
 * @param resourceType
 */
export const isEstablishmentTokenValid = (estToken: EstablishmentRouterData, resourceType: string): boolean => {
  return estToken && estToken.registrationNo && estToken.resourceType === resourceType;
};

/**
 * Method to check if the draft transaction
 * @param estToken
 * @param resourceType
 */
export const isTransactionDraft = (estToken: EstablishmentRouterData, transactionId: string): boolean => {
  return estToken && estToken.registrationNo && estToken.isDraft && estToken.transactionId.toString() === transactionId;
};

/**
 * Method to check if establishment has crn
 * @param establishment
 */
export const hasCrn = (establishment: Establishment): boolean => {
  if (establishment?.crn && establishment.crn?.number) {
    return true;
  } else {
    return false;
  }
};

/**
 * Method to check if establishment has unn
 * @param establishment
 */
export const hasUnn = (establishment: Establishment): boolean => {
  if (establishment?.unifiedNationalNumber !== null && establishment?.unifiedNationalNumber !== 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Method to check if establishment is from MCI
 * @param establishment
 */

export const mciEstablishment = (establishment: Establishment): boolean => {
  if (
    establishment?.crn?.number &&
    establishment?.crn?.number > 0 &&
    establishment?.unifiedNationalNumber !== null &&
    establishment?.unifiedNationalNumber !== 0
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Method to check if all the documents are valid and uploaded
 * @param documents
 */
export const isDocumentsValid = (documents: DocumentItem[]): boolean => {
  let isValid = true;
  documents?.forEach(document => {
    if (
      (!document.documentContent || document.documentContent === null || document.documentContent === 'NULL') &&
      document.required &&
      document.show
    ) {
      isValid = false;
      document.uploadFailed = true;
    } else {
      document.uploadFailed = false;
    }
  });
  return isValid;
};

/**
 * Method to get the document content ids
 */
export const getDocumentContentIds = (documents: DocumentItem[]): string[] => {
  if (documents?.length > 0) {
    return documents
      .filter(document => document.contentId !== null && document.show === true)
      .map(document => document.contentId);
  }
  return [];
};

export const getUnusedDocs = (documents: DocumentItem[]): DocumentItem[] => {
  return documents.filter(document => document?.contentId && document.show === false);
};

/**
 * Method to reset the owner form
 * @param ownerIndex
 */
export const resetOwner = (owner: Owner, form: FormGroup): void => {
  if (form) {
    form.get('isSaved').setValue(false);
    form.get('isVerified').setValue(false);
    form.get('personExists').setValue(false);
    owner.person.fromJsonToObject(new Person());
    owner.person.fromJsonToObject(form.get('search').value);
  }
};

/**
 * Method to show the user the message corresponding to the status of establishment
 */
export const getEstablishmentStatusErrorKey = (status: string): GenericValidationKey => {
  let statusErrorKey = new GenericValidationKey();
  switch (status) {
    case EstablishmentStatusEnum.UNDER_INSPECTION: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.UNDER_INSPECTION;
      statusErrorKey.valid = false;
      break;
    }
    case EstablishmentStatusEnum.CLOSING_IN_PROGRESS: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.CLOSING_IN_PROGRESS;
      statusErrorKey.valid = true;
      break;
    }
    case EstablishmentStatusEnum.CLOSED: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.CLOSED;
      statusErrorKey.valid = true;
      break;
    }
    case EstablishmentStatusEnum.CANCELLED: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.CANCELLED;
      statusErrorKey.valid = true;
      break;
    }
    case EstablishmentStatusEnum.CANCEL_UNDER_INSPECTION: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.CANCEL_UNDER_INSPECTION;
      statusErrorKey.valid = true;
      break;
    }
    case EstablishmentStatusEnum.REOPENING_IN_PROGRESS: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.REOPENING_IN_PROGRESS;
      statusErrorKey.valid = false;
      break;
    }
    case EstablishmentStatusEnum.OPENING_IN_PROGRESS: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.OPENING_IN_PROGRESS;
      statusErrorKey.valid = false;
      break;
    }
    case EstablishmentStatusEnum.UNDER_CLOSURE_WAITING_SETTLEMENT: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.UNDER_CLOSURE_WAITING_SETTLEMENT;
      statusErrorKey.valid = true;
      break;
    }
    case EstablishmentStatusEnum.OPENING_IN_PROGRESS_INT: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.OPENING_IN_PROGRESS_INT;
      statusErrorKey.valid = false;
      break;
    }
    case EstablishmentStatusEnum.DRAFT: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.DRAFT;
      statusErrorKey.valid = false;
      break;
    }
    case EstablishmentStatusEnum.OPENING_IN_PROGRESS_GOL_UPDATE: {
      statusErrorKey.key = EstablishmentStatusErrorEnum.OPENING_IN_PROGRESS_GOL_UPDATE;
      statusErrorKey.valid = false;
      break;
    }
    default: {
      statusErrorKey = undefined;
      break;
    }
  }
  return statusErrorKey;
};

/**
 * Method to get the status which can be viewed in group profile
 */
export function getStatusesAbleToView(): number[] {
  return (Object.values(EstablishmentStatusCodeEnum) as number[]).filter(
    value =>
      !isNaN(Number(value)) &&
      value !== EstablishmentStatusCodeEnum.CANCELLED &&
      value !== EstablishmentStatusCodeEnum.CLOSED &&
      value !== EstablishmentStatusCodeEnum.DRAFT
  );
}

/**
 * Method to create bilingual wrapper around english value
 * @param englishStatus
 */
export function getStatusAsBilingual(englishStatus): BilingualText {
  return { english: englishStatus, arabic: '' };
}

/**
 * Method to check if establishment is in progress
 * @param establishment
 */
export const isEstablishmentOpeningInProgress = (establishmentStatus: string): boolean => {
  if (
    establishmentStatus === EstablishmentStatusEnum.OPENING_IN_PROGRESS ||
    establishmentStatus === EstablishmentStatusEnum.OPENING_IN_PROGRESS_INT
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Perform validations for add owner transaction
 * @param restrictOwner
 * @param establishment
 */
export const restrictOwner = (
  restrictOwner: RestrictOwner,
  establishment: Establishment
): Observable<RestrictOwner> => {
  if (establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
    restrictOwner.noOfTotalOwners >= 1 ? (restrictOwner.canAdd = false) : (restrictOwner.canAdd = true);
    return of(restrictOwner);
  }
  if (isLegalEntityPartnership(establishment.legalEntity.english)) {
    restrictOwner.noOfTotalOwners >= 5 ? (restrictOwner.canAdd = false) : (restrictOwner.canAdd = true);
    return of(restrictOwner);
  }
  restrictOwner.canAdd = true;
  restrictOwner.noOfTotalOwners = null;
  return of(restrictOwner);
};

/**
 * Method to select the wizard.
 * @param wizards
 * @param index
 */
export const activateWizard = (
  wizards: WizardItem[],
  index: number,
  restrictNextWizards: boolean = false
): WizardItem[] => {
  if (wizards) {
    for (let i = 0; i <= wizards.length - 1; i++) {
      if (i <= index) {
        wizards[i].isDone = true;
        wizards[i].isDisabled = false;
        wizards[i].isActive = false;
        if (i === index) {
          wizards[i].isActive = true;
          wizards[i].isDone = false;
        }
      } else {
        wizards[i].isActive = false;
        wizards[i].isDone = false;
        if (restrictNextWizards) {
          wizards[i].isDisabled = true;
        }
      }
    }
  }
  return wizards;
};
export function getDropDownItem(key: string, icon = undefined, value = undefined): DropdownItem {
  return {
    key: key,
    id: key,
    value: value,
    icon: icon
  };
}

/**
 * Method to get the params from object
 * @param key - param key :- value is object initally pass key as undefined
 * @param value - object or param value
 * @param params - http params instance
 */
export function getParams(key: string, value, params: HttpParams): HttpParams {
  if (Array.isArray(value)) {
    // params = params.append(key, value.join(', '));
    value.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(itemKey => {
          params = getParams(key ? key + '.' + itemKey : itemKey, item[itemKey], params);
        });
      } else {
        params = params.append(`${key}`, item);
      }
    });
    return params;
  } else if (typeof value === 'object' && value !== null) {
    Object.keys(value).forEach(valueKey => {
      params = getParams(key ? key + '.' + valueKey : valueKey, value[valueKey], params);
    });
    return params;
  } else if (value !== undefined && value !== null) {
    if (params?.get(key)) {
      return params.append(`${key}`, value);
    } else {
      return params.set(key, value);
    }
  } else {
    return params;
  }
}

/**
 * Method to get the required params for searching a person
 * @param person
 */
export function getPersonSearchQueryParams(person: Person): PersonSearchQueryParam {
  const personSearchParams = new PersonSearchQueryParam();
  if (person) {
    personSearchParams.birthDate = moment(person.birthDate.gregorian).format('YYYY-MM-DD');
    personSearchParams.personType = getNationalityCategoryType(person.nationality.english);
    personSearchParams.role = person.role;
    const ids = getPersonIdentifier(person);
    const [nin, id, iqamaNo, passportNo] = ids.reduce(
      (identifiers, value) => {
        identifiers[0] = (<NIN>getIdentityValue([value], IdentityTypeEnum.NIN))?.newNin || identifiers[0];
        identifiers[1] = (<NationalId>getIdentityValue([value], IdentityTypeEnum.NATIONALID))?.id || identifiers[1];
        identifiers[2] = (<Iqama>getIdentityValue([value], IdentityTypeEnum.IQAMA))?.iqamaNo || identifiers[2];
        identifiers[3] = (<Passport>getIdentityValue([value], IdentityTypeEnum.PASSPORT))?.passportNo || identifiers[3];
        return identifiers;
      },
      [undefined, undefined, undefined, undefined]
    );
    personSearchParams.NIN = nin;
    personSearchParams.gccId = id;
    personSearchParams.nationality = id ? person.nationality.english : undefined;
    personSearchParams.iqamaNo = iqamaNo;
    personSearchParams.passportNo = passportNo;
  }
  return personSearchParams;
}

/**
 * Method to get the which nationality category of the person
 * @param nationality
 */
export function getNationalityCategoryType(nationality: string): NationalityCategoryEnum {
  if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
    return NationalityCategoryEnum.SAUDI_PERSON;
  } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(nationality) !== -1) {
    return NationalityCategoryEnum.GCC_PERSON;
  } else {
    return NationalityCategoryEnum.NON_SAUDI;
  }
}

export function convertBilingualListToLovList(bilingualList: BilingualText[]): Observable<LovList> {
  const lovs: Array<Lov> =
    bilingualList?.map((bilingualValue, index) => ({
      ...new Lov(),
      ...{ value: bilingualValue, sequence: index }
    })) || [];
  const specificLovs = lovs.reduce((agg, item) => {
    if (agg.map(lov => lov.value?.english)?.indexOf(item?.value?.english) === -1) {
      agg.push(item);
    }
    return agg;
  }, []);
  return of(new LovList(specificLovs));
}
export function getBranchRequest(
  size: number = 10,
  pageNo: number = 0,
  statusFilter?: BilingualText[],
  hideMol?: boolean,
  searchParam?: string,
  filters?: Array<FilterKeyValue>,
  includeAllStatus?: boolean,
  adminId?: number,
  role?: number
): BranchRequest {
  const branchRequest = new BranchRequest();
  if (size === 0 && pageNo === 0) {
    branchRequest.page = null;
  } else {
    branchRequest.page.size = size;
    branchRequest.page.pageNo = pageNo;
  }
  if (statusFilter?.length > 0) {
    branchRequest.branchFilter.status = statusFilter;
  }
  if (hideMol !== undefined) {
    branchRequest.branchFilter.molEstIncluded = !hideMol;
  }
  if (adminId > 0) {
    branchRequest.branchFilter.adminId = adminId.toString();
  }
  if (role) {
    branchRequest.branchFilter.role = role;
  }
  if (searchParam !== undefined && searchParam !== '') {

    branchRequest.searchParam = searchParam;
  }
  if (filters?.length > 0) {
    branchRequest.branchFilter = applyBranchFilter(branchRequest.branchFilter, filters);
  }
  branchRequest.branchFilter.includeAllStatus = includeAllStatus;
  return branchRequest;
}

export function applyBranchFilter(branchFilter: BranchFilter, filters: Array<FilterKeyValue>) {
  const status = filters.filter(item => item.key === FilterKeyEnum.STATUS);
  const legalEntity = filters.filter(item => item.key === FilterKeyEnum.LEGAL_ENITY);
  const location = filters.filter(item => item.key === FilterKeyEnum.LOCATION);
  if (status?.length > 0) {
    branchFilter.status = [...status[0]?.bilingualValues];
  }
  if (legalEntity?.length > 0) {
    branchFilter.legalEntity = [...getBilingual(legalEntity[0]?.bilingualValues)];
  }
  if (location?.length > 0) {
    branchFilter.location = [...location[0].codes];
  }
  return branchFilter;
}

export function getBilingual(values) {
  return values.map(value => ({ english: value?.english, arabic: value?.arabic }));
}

export function bindTransactionMessageWithId(message: BilingualText, id: number): BilingualText {
  message = { english: message?.english + ' ' + id, arabic: message?.arabic };
  return message;
}

export function isInArray<T>(array: Array<T>, value: T): boolean {
  if (array?.length > 0) return array.indexOf(value) !== -1;
  return false;
}
export function setPreviousSubmissionDatesDropdown(allSubmissions: SubmittedCheckList[]): LovList {
  const items: Lov[] = [];
  allSubmissions?.forEach((submission, i) => {
    const submissionDate = submission?.requestSubmissionDate?.gregorian
      ? submission?.requestSubmissionDate?.gregorian
      : new Date();
    const lookUpValue = new Lov();
    lookUpValue.code = submission?.referenceNumber;
    lookUpValue.sequence = i;
    lookUpValue.value = {
      english: convertToStringDDMMYYYY(moment(submissionDate).toString()),
      arabic: convertToStringYYYYMMDD(moment(submissionDate).toString())
    };
    items.push(lookUpValue);
  });
  return new LovList(items);
}
export function navigateToTransactionTracking(refNumber,appToken): string {
  let url = '';
  if (appToken === ApplicationTypeEnum.PRIVATE) {
    url =
      '/establishment-private/#' +
      SafetyInspectionConstants.ROUTE_TRANSACTION_TRACKING(
        EstablishmentTransEnum.SC_EVALUATION_TRANSACTION.toString(),
        refNumber
      );
  } else {
    url =
      '/establishment-public/#' +
      SafetyInspectionConstants.ROUTE_TRANSACTION_TRACKING(
        EstablishmentTransEnum.SC_EVALUATION_TRANSACTION.toString(),
        refNumber
      );
  }
  return url;
}
export function compareIdNum(
  firstId: NIN | Iqama | NationalId | Passport | BorderNumber,
  secondId: NIN | Iqama | NationalId | Passport | BorderNumber
): boolean {
  switch (secondId.idType) {
    case IdentityTypeEnum.IQAMA:
      return Number((firstId as Iqama).iqamaNo) === Number((secondId as Iqama).iqamaNo);
    case IdentityTypeEnum.NIN:
      return Number((firstId as NIN).newNin) === Number((secondId as NIN).newNin);
    case IdentityTypeEnum.NATIONALID:
      return Number((firstId as NationalId).id) === Number((secondId as NationalId).id);
    case IdentityTypeEnum.PASSPORT:
      return (firstId as Passport).passportNo === (secondId as Passport).passportNo;
    case IdentityTypeEnum.BORDER:
      return (firstId as BorderNumber).id === (secondId as BorderNumber).id;
  }
}
