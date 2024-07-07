/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 * This file is used to handle api calls in change legal entity transaction
 */
import {
  ApplicationTypeEnum,
  BilingualText,
  bindToObject,
  DocumentResponseItem,
  Establishment,
  EstablishmentStatusEnum,
  markFormGroupTouched,
  Person,
  Role
} from '@gosi-ui/core';
import { iif, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentErrorKeyEnum,
  EstablishmentQueryKeysEnum,
  getDocumentContentIds,
  getUnusedDocs,
  isDocumentsValid,
  isGccEstablishment,
  isGovOrSemiGov,
  isLegalEntityPartnership,
  LegalEntityEnum,
  MciResponse,
  NavigationIndicatorEnum,
  Owner,
  OwnerResponse,
  PatchLegalEntity,
  QueryParam
} from '../../../shared';
import { checkForOwnerValidity } from '../change-owner-sc/owner-helper';
import { ChangeLegalEntityDetailsScComponent } from './change-legal-entity-details-sc.component';
//Method to initialise lookups
export function initialiseLookUpsForLegalEntity(self: ChangeLegalEntityDetailsScComponent) {
  self.nationalityList$ = self.lookUpService.getNationalityList();
  self.yesOrNoList$ = self.lookUpService.getYesOrNoList();
  self.gccCountryList$ = self.lookUpService.getGccCountryList();
  self.genderList$ = self.lookUpService.getGenderList();
  self.cityList$ = self.lookUpService.getCityList();
  self.ownerSectionList = self.estLookUpService.getOwnerSelectionList();
}
export function fetchEstablishment(
  self: ChangeLegalEntityDetailsScComponent,
  registrationNo: number,
  referenceNo: number = null
): Observable<Establishment> {
  let branch$: Observable<Establishment>;
  if (referenceNo !== null) {
    branch$ = self.changeEstablishmentService.getEstablishmentFromTransient(registrationNo, referenceNo);
  } else {
    branch$ = self.establishmentService
      .getEstablishment(registrationNo, { includeMainInfo: true })
      .pipe(tap(res => (self.estBeforeEdit = res)));
  }
  return branch$;
}
const validationBeforeSaveAndNext = (self: ChangeLegalEntityDetailsScComponent): boolean => {
  let isReopenedEst = self.establishment?.status?.english === EstablishmentStatusEnum.REOPEN ? true : false;
  if (!self.isLegalEntityChanged) {
    if (self.isCrnFetchedFromMci) {
      self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_CHANGES_MCI);
    } else {
      self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_CHANGES);
      return false;
    }
  }

  if (self.showOwnerSection) {
    if (
      checkForOwnerValidity(
        self,
        self.ownerFormArray.length +
          self.splitOwners[0].filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE).length,
        self.ownerFormArray,
        isGccEstablishment(self.establishment),
        self.legalEntityForm.get('legalEntity').get('english').value,
        isReopenedEst
      ) === false
    ) {
      return false;
    }
  }
  if (!self.legalEntityForm.valid) {
    self.alertService.showMandatoryErrorMessage();
    return false;
  }
  return true;
};
function getNavigationIndicatorForSave(self: ChangeLegalEntityDetailsScComponent): NavigationIndicatorEnum {
  if (self.isValidator) {
    return NavigationIndicatorEnum.VALIDATOR_LEGAL_ENTITY_CHANGE_SUBMIT;
  } else {
    if (self.appToken === ApplicationTypeEnum.PRIVATE) {
      return NavigationIndicatorEnum.CSR_LEGAL_ENTITY_CHANGE_SUBMIT;
    } else {
      return NavigationIndicatorEnum.ADMIN_LEGAL_ENTITY_CHANGE_SUBMIT;
    }
  }
}
const setRequestForSave = (
  self: ChangeLegalEntityDetailsScComponent,
  navigationIndicatorValue: number | undefined = undefined
): PatchLegalEntity => {
  const patchLegalEntityDetails = new PatchLegalEntity();
  bindToObject(patchLegalEntityDetails, self.legalEntityForm.getRawValue());
  if (self.showOwnerSection) {
    let selectedOwners = [];
    if (self.currentOwners) {
      selectedOwners = self.currentOwners.filter(owner => owner.recordAction === ActionTypeEnum.REMOVE);
    }
    patchLegalEntityDetails.owners = [...self.owners, ...selectedOwners];
  }

  patchLegalEntityDetails.contentIds = getDocumentContentIds(self.legalEntityDocuments);
  patchLegalEntityDetails.lateFeeIndicator = self.showLateFeeIndicator
    ? self.legalEntityForm.get('lateFeeIndicator.english').value === 'Yes'
    : undefined;
  patchLegalEntityDetails.navigationIndicator = navigationIndicatorValue
    ? navigationIndicatorValue
    : getNavigationIndicatorForSave(self);
  return patchLegalEntityDetails;
};
export const saveAndNextLegalEntity = (
  self: ChangeLegalEntityDetailsScComponent,
  registrationNo
): Observable<DocumentResponseItem[]> => {
  self.alertService.clearAlerts();
  markFormGroupTouched(self.legalEntityForm);
  if (validationBeforeSaveAndNext(self)) {
    const patchLegalEntityDetails = setRequestForSave(self);
    return self.changeEstablishmentService.changeLegalEntity(registrationNo, patchLegalEntityDetails).pipe(
      tap(response => {
        if (response.transactionId) {
          self.legalEntityForm.get('referenceNo').setValue(response.transactionId);
          self.referenceNo = response.transactionId;
        }
      }),
      switchMap(res => {
        return self.documentService
          .getDocuments(
            self.documentType,
            self.documentType,
            registrationNo,
            self.estToken.referenceNo ? self.estToken.referenceNo : res.transactionId
          )
          .pipe(
            tap(docs => {
              self.legalEntityDocuments = docs;
            })
          );
      }),
      tap(() => {
        self.changeLEDocumentValidation(
          !isLegalEntityPartnership(self.currentLegalEntity) &&
            isLegalEntityPartnership(patchLegalEntityDetails?.legalEntity?.english),
          isGovOrSemiGov(patchLegalEntityDetails?.legalEntity?.english) &&
            self.legalEntityForm.get('paymentType')?.get('english')?.value === 'Yes',
          isGovOrSemiGov(patchLegalEntityDetails?.legalEntity?.english)
        );
      }),
      switchMap(() =>
        self.documentService.deleteDocuments(
          registrationNo,
          getUnusedDocs(self.legalEntityDocuments),
          self.estToken?.referenceNo || self.legalEntityForm?.get('referenceNo')?.value
        )
      ),
      tap(() => self.selectedWizard(1))
    );
  } else {
    return of([]);
  }
};

function getSubmitNavInd(self: ChangeLegalEntityDetailsScComponent): NavigationIndicatorEnum {
  if (self.isCrnFetchedFromMci) {
    return NavigationIndicatorEnum.ADMIN_LEGAL_ENTITY_CHANGE_SUBMIT;
  }

  if (self.isValidator) {
    if (self.appToken === ApplicationTypeEnum.PRIVATE) {
      return NavigationIndicatorEnum.VALIDATOR_LEGAL_ENTITY_CHANGE_FINAL_SUBMIT;
    } else {
      return NavigationIndicatorEnum.ADMIN_REENTER_LEGAL_ENTITY_FINAL_SUBMIT;
    }
  } else {
    if (self.appToken === ApplicationTypeEnum.PRIVATE) {
      return NavigationIndicatorEnum.CSR_LEGAL_ENTITY_CHANGE_FINAL_SUBMIT;
    } else {
      return NavigationIndicatorEnum.ADMIN_LEGAL_ENTITY_CHANGE_FINAL_SUBMIT;
    }
  }
}

export const submitLegalEntity = (
  self: ChangeLegalEntityDetailsScComponent,
  registrationNo
): Observable<null | BilingualText> => {
  self.alertService.clearAlerts();
  if (!isDocumentsValid(self.legalEntityDocuments)) {
    self.alertService.showMandatoryDocumentsError();
    return of(null);
  } else {
    return submitLegalEntityDirectChange(self, registrationNo);
  }
};

export const submitLegalEntityDirectChange = (
  self: ChangeLegalEntityDetailsScComponent,
  registrationNo
): Observable<null | BilingualText> => {
  let navigationIndicatorValue = getSubmitNavInd(self);
  self.legalEntityForm.get('navigationIndicator').setValue(navigationIndicatorValue);
  if (validationBeforeSaveAndNext(self)) {
    const patchLegalEntityDetails = setRequestForSave(self, navigationIndicatorValue);
    return self.changeEstablishmentService.changeLegalEntity(registrationNo, patchLegalEntityDetails).pipe(
      tap(res => (self.transactionFeedback = res)),
      switchMap(() =>
        iif(
          () => self.isValidator === true,
          self.updateBpm(
            self.estToken,
            self.legalEntityForm.get('comments').value,
            self.transactionFeedback.successMessage
          ),
          of(null)
        )
      ),
      tap(() => {
        if (self.isValidator) {
          self.setTransactionComplete();
          self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(self.appToken)]);
        } else {
          self.setTransactionComplete();
          self.location.back();
          self.alertService.showSuccess(self.transactionFeedback.successMessage);
        }
      })
    );
  }
};

export const saveOwnerForLegalEntity = (
  self: ChangeLegalEntityDetailsScComponent,
  index: number
): Observable<OwnerResponse> => {
  const navigationInd = NavigationIndicatorEnum.ADD_OWNER_LEGAL_ENTITY_CHANGE;
  let owner = self.owners[index];
  owner = self.assembleFormToOwner(owner, index);
  self.alertService.clearAlerts();
  return self.establishmentService.saveAllOwners([owner], self.establishment.registrationNo, navigationInd).pipe(
    tap(res => {
      self.alertService.showSuccess(res.message);
      self.accordionPanel = -1;
      owner.person.personId = res.personId;
      self.owners[index] = bindToObject(new Owner(), self.owners[index]);
      self.owners = [...self.owners];
      self.ownerFormArray[index].get('isSaved').setValue(true);
    })
  );
};

export const cancelLegalEntity = (self: ChangeLegalEntityDetailsScComponent): Observable<null> => {
  if (self.legalEntityForm.get('referenceNo').value || self.isReEnter) {
    return self.changeEstablishmentService
      .revertTransaction(self.establishment.registrationNo, self.legalEntityForm.get('referenceNo').value)
      .pipe(
        tap(() => {
          self.setTransactionComplete();
          if (self.reRoute) {
            self.router.navigate([self.reRoute]);
          } else {
            if (self.appToken === ApplicationTypeEnum.PUBLIC && self.isReEnter) {
              self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(self.appToken)]);
            } else if (self.isReEnter) {
              self.changeEstablishmentService.navigateToValidateLegalEntity();
            } else {
              self.location.back();
            }
          }
        })
      );
  } else {
    return of(null).pipe(
      tap(() => {
        self.setTransactionComplete();
        self.reRoute ? self.router.navigate([self.reRoute]) : self.location.back();
      })
    );
  }
};

export const verifyOwnerForLegalEntity = (
  self: ChangeLegalEntityDetailsScComponent,
  index: number
): Observable<Person> => {
  self.alertService.clearAlerts();
  markFormGroupTouched(self.ownerFormArray[index]);
  if (!self.ownerFormArray[index].valid) {
    self.alertService.showMandatoryErrorMessage();
    return of(null);
  } else {
    const owner = new Owner();
    owner.person.fromJsonToObject(self.ownerFormArray[index].get('search').value);
    owner.person.role = Role.OWNER;
    return self.establishmentService.verifyPersonDetails(owner.person).pipe(
      tap(res => {
        self.ownerFormArray[index].get('isVerified').setValue(true);
        if (res !== undefined && res !== null) {
          self.ownerFormArray[index].get('personExists').setValue(true);
          const newOwner = new Owner();
          newOwner.person.fromJsonToObject(res);
          self.owners[index] = newOwner;
        } else {
          self.owners[index] = owner;
        }
      }),
      catchError(err => {
        if (err.error.code === ErrorCodeEnum.OWNER_NO_RECORD) {
          self.ownerFormArray[index].get('isVerified').setValue(true);
          self.owners[index] = owner;
        } else {
          self.alertService.showError(err.error.message, err.error.details);
        }
        return of(null);
      })
    );
  }
};

export const getOwnersForLegalEntity = (
  self: ChangeLegalEntityDetailsScComponent,
  establishment: Establishment,
  referenceNo: number = null
): Observable<Owner[]> => {
  let owners$: Observable<Owner[]>;
  if (!referenceNo) {
    const queryParams: QueryParam[] = [];
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
    owners$ = self.changeEstablishmentService.getOwners(establishment.registrationNo, queryParams).pipe(
      tap(owners => {
        self.filteredOwners = self.currentOwners = owners;
      })
    );
  } else {
    owners$ = self.changeEstablishmentService
      .searchOwnerWithQueryParams(establishment.registrationNo, [
        {
          queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
          queryValue: referenceNo
        }
      ])
      .pipe(
        tap(owners => {
          //Owner Newly Added
          const selectedOwners = owners.filter(owner => owner.recordAction === ActionTypeEnum.ADD);
          if (establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
            if (selectedOwners.length === 0) {
              self.ownerSelectionForm.get('english').setValue(self.currentOwnerSelection);
            } else {
              self.ownerSelectionForm.get('english').setValue(self.createOwnerSelection);
            }
            self.ownerSelectionForm.get('english').updateValueAndValidity();
          }
          //Existing Owners who are removed
          self.filteredOwners = self.currentOwners = owners.filter(
            owner => owner.recordAction === ActionTypeEnum.REMOVE
          );
          selectedOwners.some((owner, index) => {
            self.addOwnerForm();
            self.ownerFormArray[index].get('isSaved').setValue(true);
            self.ownerFormArray[index].get('isVerified').setValue(true);

            self.owners.push(owner);
          });
          self.accordionPanel = -1;
        }),
        switchMap(() => {
          //To get existing owners who are not deleted
          return self.changeEstablishmentService.getOwners(establishment.registrationNo).pipe(
            tap(owners => {
              const ownerIds = self.currentOwners.map(owner => owner.ownerId);
              const currentActiveOwners = owners.filter(owner => ownerIds.indexOf(owner.ownerId) === -1);
              currentActiveOwners.forEach(owner => (owner.recordAction = ActionTypeEnum.ADD));
              self.currentOwners.push(...currentActiveOwners);
              self.filteredOwners = self.currentOwners;
            })
          );
        })
      );
  }
  return owners$.pipe(
    tap(() => {
      self.enableAddOwner();
    })
  );
};
export const getMciResponse = (
  self: ChangeLegalEntityDetailsScComponent,
  crn: string,
  registrationNo: number,
  unn?: string
): Observable<MciResponse> => {
  return self.establishmentService.getMciResponse(crn, registrationNo, unn);
};
