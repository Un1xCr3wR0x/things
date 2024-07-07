/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeEnum,
  Channel,
  DocumentItem,
  Name,
  Person,
  Role,
  getIdentityByType,
  getPersonArabicName,
  getPersonEnglishName,
  markFormGroupTouched,
  setAddressFormToAddresses,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ActiveFilterEnum,
  DocumentNameEnum,
  EstablishmentErrorKeyEnum,
  FilterKeyEnum,
  FilterKeyValue,
  hasCrn as estHasCrn,
  hasUnn as estHasUnn,
  filterIdentities,
  isGccEstablishment,
  isLegalEntityPartnership,
  isLegalEntityIndividual,
  LegalEntityEnum,
  Owner,
  OwnerFilter,
  OwnerResponse,
  NavigationIndicatorEnum
} from '../../../shared';
import { ChangeOwnerScComponent } from './change-owner-sc.component';

/**
 * Method to bind  DOM Model into Owner Model
 * @param owner
 * @param form
 * @param hasDate
 */
export const assembleFormToOwner = (owner: Owner, form: FormGroup, hasDate: boolean = false): Owner => {
  owner.person?.fromJsonToObject((form.get('person') as FormGroup)?.getRawValue());
  if (hasDate === true) {
    owner.startDate = form.get('person')?.get('startDate').value;
    if (owner.startDate?.gregorian) {
      owner.startDate.gregorian = startOfDay(owner.startDate.gregorian);
    }
    owner.endDate = form.get('person')?.get('endDate').value;
    if (owner.endDate?.gregorian) {
      owner.endDate.gregorian = startOfDay(owner.endDate.gregorian);
    }
  }
  if (owner.person?.birthDate.gregorian) {
    owner.person.birthDate.gregorian = startOfDay(owner.person.birthDate?.gregorian);
  }
  owner.person?.fromJsonToObject(form.getRawValue());
  owner.person.contactDetail.currentMailingAddress = (form.get('currentMailingAddress') as FormControl)?.value;
  owner.person.contactDetail.addresses = setAddressFormToAddresses(form);
  owner.person.identity = filterIdentities(owner.person.identity);
  return owner;
};

export const ownerForm = (): FormGroup => {
  const fb = new FormBuilder();
  return fb.group({
    person: fb.group({
      startDate: fb.group({
        gregorian: new Date(),
        hijiri: 'test'
      }),
      endDate: fb.group({
        gregorian: new Date(),
        hijiri: 'test'
      }),
      birthDate: fb.group({
        gregorian: new Date(),
        hijiri: 'test'
      })
    }),
    currentMailingAddress: 'test',
    isVerified: false,
    isSaved: false,
    role: 'Owner',
    personExists: false,
    hasModified: false,
    modificationSaved: true
  });
};

/**
 * Method to change do validation
 * @param documents
 */
export const changeDocumentValidation = (
  documents: DocumentItem[],
  isGcc: boolean,
  legalEntity: string,
  isFieldOffice: boolean,
  hasCrn: boolean,
  hasLicense: boolean,
  hasUnn: boolean
): DocumentItem[] => {
  if (documents) {
    const isPartnership = isLegalEntityPartnership(legalEntity);
    const isIndividual = isLegalEntityIndividual(legalEntity);

    documents.forEach(doc => {
      if (doc.name.english === DocumentNameEnum.PROOF_ESTABLISHMENT_OWNERSHIP) {
        doc.required = doc.show = isGcc;
      } else if (doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
        doc.show = isFieldOffice && !isGcc;
        doc.required = true;
      } else if (doc.name.english === DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT) {
        doc.show = isFieldOffice && isGcc;
        doc.required = true;
      } else if (doc.name.english === DocumentNameEnum.COMPANY_MEMO_DOCUMENT) {
        doc.show = isPartnership || isIndividual;
        doc.required = true;
      } else if (doc.name.english === DocumentNameEnum.LICENSE_DOCUMENT) {
        doc.show = !hasUnn && !isGcc && hasLicense;
        doc.required = true;
      } else if (doc.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT) {
        doc.show = !hasUnn && !isGcc && hasCrn;
        doc.required = true;
      } else if (doc.name.english === DocumentNameEnum.OWNERS_ID) {
        doc.show = isFieldOffice && isPartnership;
        doc.required = false;
      } else if (doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
        doc.show = isFieldOffice && !isGcc;
        doc.required = false;
      } else if (doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
        doc.show = isFieldOffice && !isGcc;
        doc.required = false;
      } else if (doc.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
        doc.show = true;
        doc.required = false;
      } else {
        doc.show = false;
        doc.required = false;
      }
    });
  }
  return documents;
};

export function createOwnerForm() {
  return new FormBuilder().group({
    isVerified: false,
    isSaved: false,
    role: 'Owner',
    personExists: false,
    hasModified: false,
    modificationSaved: true
  });
}

/**
 * Method to update owner dates and form
 * @param owner
 * @param form
 */
export function updateDatesOfOwner(owner: Owner, form: FormGroup) {
  if (owner && form) {
    owner.startDate = form.get('person')?.get('startDate').value;
    if (owner.startDate?.gregorian) {
      owner.startDate.gregorian = startOfDay(owner.startDate.gregorian);
    }
    owner.endDate = form.get('person')?.get('endDate').value;
    if (owner.endDate?.gregorian) {
      owner.endDate.gregorian = startOfDay(owner.endDate.gregorian);
    }
    form.get('hasModified').setValue(false);
    form.get('modificationSaved').setValue(true);
  }
}

/**
 * Method to check if all owner has been modified
 * @param formArray
 */
export function hasModifiedOwnersSaved(self: { alertService: AlertService }, formArray: FormGroup[]): boolean {
  const hasSaved = formArray.find(owner => {
    markFormGroupTouched(owner);
    return owner.get('hasModified').value && !owner.get('modificationSaved').value;
  })
    ? false
    : true;
  if (!hasSaved) {
    self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.SAVE-OWNER');
  }
  return hasSaved;
}

export function hasAllOwnerSaved(self: { alertService: AlertService }, formArray: FormGroup[]) {
  const notSaved = formArray.find(owner => {
    markFormGroupTouched(owner);
    return owner.get('isSaved').value === false;
  })
    ? true
    : false;
  if (notSaved) {
    self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.SAVE-OWNER');
  }
  return !notSaved;
}
export function hasAllOwnersVerified(self: { alertService: AlertService }, formArray: FormGroup[]) {
  formArray.forEach(form => markFormGroupTouched(form));
  const allFormNotValid = formArray.find(form => form.get('search')?.valid === false) ? true : false;
  if (allFormNotValid) {
    self.alertService.showMandatoryErrorMessage();
    return false;
  }
  const notVerified = formArray.find(owner => {
    return owner.get('isVerified').value === false;
  })
    ? true
    : false;
  if (notVerified) {
    self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_OWNER);
    return false;
  }
  return true;
}

export function checkForOwnerValidity(
  self: { alertService: AlertService },
  noOfActiveOwners: number,
  formArray: FormGroup[],
  isEstGcc: boolean,
  legalEntity: string,
  isReopenedEst?: boolean
): boolean {
  const ownersVerified = hasAllOwnersVerified(self, formArray);
  if (ownersVerified) {
    const ownerAreSaved = hasAllOwnerSaved(self, formArray);
    const hasModificationSaved = hasModifiedOwnersSaved(self, formArray);
    if (ownerAreSaved && hasModificationSaved && ownersVerified) {
      if (legalEntity === LegalEntityEnum.INDIVIDUAL) {
        if (noOfActiveOwners > 1) {
          self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.MORE-THAN-ONE-OWNER');
          return false;
        } else if (noOfActiveOwners < 1 && !isReopenedEst) {
          self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.LESS-THAN-ONE-OWNER');
          return false;
        } else {
          return true;
        }
      } else if (isLegalEntityPartnership(legalEntity)) {
        if (noOfActiveOwners > 5 && isEstGcc === true) {
          self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.MORE-THAN-5-OWNERS');
          return false;
        } /*else if (noOfActiveOwners < 1) {
          self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.LESS-THAN-ONE-OWNER');
          return false;
        }*/ else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
}

/**
 * Method to filter owners based on name or identifier
 * @param owners
 * @param searchParam
 */
export function searchWithOwnerNameOrIdentifier(owners: Owner[], searchParam: string) {
  if (!searchParam) {
    return owners;
  } else {
    //If name
    if (isNaN(+searchParam)) {
      const searchedOwners = owners.filter(owner => {
        return checkIfNameExists(searchParam, owner?.person?.name);
      });
      return searchedOwners;
    }
    //If identity
    else {
      return owners.filter(owner => {
        return hasPersonIdentity(owner.person, searchParam);
      });
    }
  }
}

export function checkIfNameExists(searchParam: string, name: Name): boolean {
  const engRegex = new RegExp('^' + searchParam, 'gi');
  const arabicRegex = new RegExp('^' + searchParam, 'gi');
  const arabicName = getPersonArabicName(name?.arabic);
  const engName = (getPersonEnglishName(name?.english) as string)?.toLowerCase();
  return engName?.match(engRegex)?.length > 0 || arabicName?.match(arabicRegex)?.length > 0 ? true : false;
}

//Check if the owner has the search identifier
export function hasPersonIdentity(person: Person, customdId: string) {
  const identity = getIdentityByType(person.identity, person.nationality?.english);
  return identity?.id ? identity.id.toString() === customdId : false;
}

export function ownersAfterFilter(owners: Owner[], ownerFilters: Array<FilterKeyValue>) {
  return owners.reduce((agg, item) => {
    let satisfyAllConditions = true;
    const ownerFilter = getOwnerFilter(ownerFilters);
    if (ownerFilter?.startDate) {
      if (item.endDate?.gregorian && moment(item.endDate?.gregorian).isBefore(ownerFilter.startDate, 'day')) {
        satisfyAllConditions = false;
      } else if (moment(item.startDate?.gregorian).isAfter(ownerFilter.endDate, 'day')) {
        satisfyAllConditions = false;
      }
    }
    if (ownerFilter && ownerFilter?.status?.length > 0 && ownerFilter?.status?.length !== 2) {
      const first = ownerFilter.status.indexOf(ActiveFilterEnum.ACTIVE) !== -1 ? true : false;
      const second = item.endDate?.gregorian ? true : false;
      if ((first || !second) && (!first || second)) {
        satisfyAllConditions = false;
      }
    }
    if (ownerFilter?.nationalityList?.length > 0) {
      if (ownerFilter.nationalityList.map(nation => nation.english).indexOf(item.person.nationality.english) === -1) {
        satisfyAllConditions = false;
      }
    }
    if (satisfyAllConditions) {
      agg.push(item);
    }
    return agg;
  }, []);
}

export function getOwnerFilter(filters: FilterKeyValue[]) {
  const ownerFilter = new OwnerFilter();
  if (filters?.length > 0) {
    const period = filters.filter(item => item.key === FilterKeyEnum.PERIOD);
    const status = filters.filter(item => item.key === FilterKeyEnum.STATUS);
    const nationalityList = filters.filter(item => item.key === FilterKeyEnum.NATIONALITY);
    if (period[0]?.values.length > 0) {
      ownerFilter.startDate = period[0]?.values[0];
      ownerFilter.endDate = period[0]?.values[1];
    }
    if (status?.length > 0) {
      ownerFilter.status = status[0].translateKeys;
    }
    if (nationalityList?.length > 0) {
      ownerFilter.nationalityList = nationalityList[0].bilingualValues;
    }
  }
  return ownerFilter;
}

export function saveOwnerModifications(
  self: ChangeOwnerScComponent,
  registrationNo: number
): Observable<DocumentItem[]> {
  if (registrationNo) {
    //Newly added owners, removed owners and modified owners
    const ownersToSave = [...self.currentOwners?.filter(owner => owner.recordAction !== null), ...self.newOwners];
    //Existing Active Owners + Newly Added Active Owners
    const isOwnersValid = checkForOwnerValidity(
      self,
      self.getAllActiveOwners().length,
      self.ownerFormArray,
      self.establishment.gccCountry,
      self.establishment.legalEntity.english
    );
    const hasChangedOwners = ownersToSave.length > 0;
    if (!hasChangedOwners) {
      self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_CHANGES);
      return of([]);
    } else if (isOwnersValid) {
      return self.establishmentService
        .saveAllOwners(
          ownersToSave,
          registrationNo,
          self.getNavIndForSave(),
          null,
          +self.ownerForm.get('referenceNo').value
        )
        .pipe(
          catchError(err => {
            self.alertService.showError(err.error.message, err.error.details);
            return throwError(err);
          }),
          switchMap(res => {
            self.ownerForm.get('referenceNo').setValue(res?.transactionId);
            return self.documentService
              .getDocuments(self.documentType, self.documentType, registrationNo, res?.transactionId)
              .pipe(
                map(docs =>
                  changeDocumentValidation(
                    docs,
                    isGccEstablishment(self.establishment),
                    self.establishment?.legalEntity?.english,
                    self.isReEnter
                      ? self.estToken?.channel === Channel.FIELD_OFFICE
                      : self.appType === ApplicationTypeEnum.PRIVATE,
                    self.hasCrn,
                    self.hasLicense,
                    self.hasUnn
                  )
                )
              );
          }),
          tap(docs => {
            self.ownerDocuments = docs;
            self.selectedWizard(1);
          })
        );
    } else {
      return of([]);
    }
  }
}
export function saveOwnerModificationsPartnership(
  self: ChangeOwnerScComponent,
  registrationNo: number
): Observable<OwnerResponse> {
  if (registrationNo) {
    //Newly added owners, removed owners and modified owners
    const ownersToSave = [...self.currentOwners?.filter(owner => owner.recordAction !== null), ...self.newOwners];
    //Existing Active Owners + Newly Added Active Owners
    const isOwnersValid = checkForOwnerValidity(
      self,
      self.getAllActiveOwners().length,
      self.ownerFormArray,
      self.establishment.gccCountry,
      self.establishment.legalEntity.english
    );
    const hasChangedOwners = ownersToSave.length > 0;
    if (!hasChangedOwners) {
      self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_CHANGES);
      return null;
    } else if (isOwnersValid) {
      return self.establishmentService
        .saveAllOwners(
          ownersToSave,
          registrationNo,
          NavigationIndicatorEnum.ESTADMIN_CHANGE_OWNER_DIRECT_CHANGE,
          null,
          +self.ownerForm.get('referenceNo').value
        )
        .pipe(
          catchError(err => {
            self.alertService.showError(err.error.message, err.error.details);
            return throwError(err);
          })
        );
    } else {
      return null;
    }
  }
}

export function setState(self: ChangeOwnerScComponent, registrationNo: number, referenceNo: number) {
  return self.establishmentService.getEstablishment(registrationNo).pipe(
    tap(est => {
      self.establishment = est;
      self.isEstGcc = isGccEstablishment(self.establishment);
      self.estStartDate = startOfDay(self.establishment?.startDate?.gregorian);
      self.hasCrn = estHasCrn(self.establishment);
      self.hasUnn = estHasUnn(self.establishment);
      self.hasLicense = self.establishment?.license?.number ? true : false;
      self.isPartnershipLegalEntity =  isLegalEntityPartnership(self.establishment.legalEntity.english);
      self.isIndividualOrPartnership =
        isLegalEntityPartnership(self.establishment.legalEntity.english) ||
        self.establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL;
      self.isEligibleForDirectChange =
        self.hasCrn && self.hasUnn && self.isIndividualOrPartnership && self.appType === ApplicationTypeEnum.PUBLIC;
      self.isOnePartner = self.establishment?.onePartner && self.hasCrn && self.hasUnn &&  self.isPartnershipLegalEntity;
        if (isLegalEntityPartnership(self.establishment.legalEntity.english)) {
        self.showStartDate = true;
        self.showEndDate = true;
      } else if (self.establishment?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL) {
        const noOfActiveOwner = self.getAllActiveOwners().length;
        if (noOfActiveOwner >= 1) {
          //add inactive owner for individual establishment
          self.showStartDate = true;
          self.showEndDate = true;
        } else {
          self.showStartDate = true;
          self.showEndDate = false;
          if (
            self.estToken.previousOwnerRole === Role.VALIDATOR_2 ||
            self.estToken.previousOwnerRole === Role.VALIDATOR ||
            self.estToken.assignedRole === Role.VALIDATOR_1
          ) {
            self.showEndDate = true;
          }
        }
      }
      self.initialiseLookups();
    }),
    map(est => {
      if (self.isEligibleForDirectChange) {
        self.establishmentService.getMciOwners(est.registrationNo).subscribe(
          res => {
            self.mciOwnerIds = res;
          },
          () => {
            self.mciError = true;
          }
        );
      }
      return est;
    }),
    switchMap(est => {
      return self.fetchOwners(est.registrationNo, referenceNo).pipe(
        tap(() => {
          self.ownerListLabel =
            self.establishment?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL && self.currentOwners?.length <= 1
              ? 'ESTABLISHMENT.CURRENT-OWNER'
              : 'ESTABLISHMENT.CURRENT-OWNERS';
        })
      );
    }),
    catchError(err => {
      self.alertService.showError(err.error?.message, err.error?.details);
      return throwError(err);
    })
  );
}
