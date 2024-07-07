/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormArray, FormGroup } from '@angular/forms';
import { BilingualText, Establishment, GCCBankDomain, Person } from '@gosi-ui/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Admin,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentTypeEnum,
  getAddEstablishmentWizard,
  isGovOrSemiGov,
  isOrgOrSociety,
  LegalEntityEnum,
  OrganisationTypeEnum
} from '../../../shared';
import { RegisterEstablishmentScComponent } from './register-establishment-sc.component';

/**
 * This method is to set the various states of the register establishment
 */
export const initialiseStateForEdit = (
  establishmentResponse: Establishment,
  tabIndex: number,
  self: RegisterEstablishmentScComponent
): Observable<boolean> => {
  if (establishmentResponse !== undefined && establishmentResponse !== null) {
    self.withOwner = false;
    let admin$: Observable<Admin> = of(null);
    let owners$: Observable<boolean> = of(true);
    const mainRegistrationNo = establishmentResponse.mainEstablishmentRegNo;
    self.gccBankNameList$ = self.lookUpService.getGCCBankList(
      EstablishmentConstants.GCC_BANK(establishmentResponse),
      true
    );
    if (
      establishmentResponse.establishmentType.english === EstablishmentTypeEnum.MAIN ||
      establishmentResponse.adminRegistered
    ) {
      admin$ = self.establishmentService.getSuperAdminDetails(mainRegistrationNo).pipe(
        catchError(err => {
          if (err && err.error.code === ErrorCodeEnum.ADMIN_NO_RECORD) {
            self.hasAdmin = false;
            if (establishmentResponse.gccCountry === true) {
              self.totalTabs = EstablishmentConstants.TABS_WITH_OWNER_GCC;
              if (isOrgOrSociety(establishmentResponse)) {
                self.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
              }
            } else {
              self.totalTabs = EstablishmentConstants.TABS_NO_WITH_ADMIN;
            }
          } else {
            self.showErrorMessage(err);
          }
          return throwError(err);
        }),
        tap(res => {
          self.establishmentAdmin = res;
          self.verifyAdminStatus = true;

          self.adminSaved = true;
          if (establishmentResponse.gccCountry === false) {
            self.totalTabs = EstablishmentConstants.TABS_NO_WITH_ADMIN;
          }
        })
      );
    } else {
      self.hasAdmin = false;
      self.totalTabs = EstablishmentConstants.TABS_NO_WITHOUT_ADMIN;
    }
    if (establishmentResponse.gccCountry === true) {
      establishmentResponse.organizationCategory = new BilingualText();
      establishmentResponse.organizationCategory.english = OrganisationTypeEnum.GCC;
      self.gccEstablishment = true;
      self.addEstWizardItems = getAddEstablishmentWizard(
        OrganisationTypeEnum.GCC,
        establishmentResponse?.legalEntity?.english
      );
      self.totalTabs = EstablishmentConstants.TABS_WITH_OWNER_GCC;
      if (isOrgOrSociety(establishmentResponse)) {
        self.isOrgGcc = true;
        self.totalTabs = EstablishmentConstants.TABS_WITH_PAYMENT_GCC;
      } else {
        if (establishmentResponse && establishmentResponse.registrationNo) {
          owners$ = self.establishmentService.getOwnerDetails(establishmentResponse.registrationNo).pipe(
            catchError(err => {
              if (err.error.code === ErrorCodeEnum.OWNER_NO_RECORD) {
                self.withOwner = false;
              } else {
                self.showErrorMessage(err);
              }
              return throwError(err);
            }),
            map(ownerWrapper => {
              if (ownerWrapper && ownerWrapper.owners) {
                return ownerWrapper.owners.map(owner => owner.person);
              }
            }),
            switchMap(owners => initialiseOwnerSection(owners, self))
          );
        }
      }
    } else {
      self.addEstWizardItems = getAddEstablishmentWizard(
        establishmentResponse.establishmentType.english === EstablishmentTypeEnum.MAIN
          ? null
          : establishmentResponse.adminRegistered
          ? null
          : 'hasAdmin'
      );
    }
    if (establishmentResponse.legalEntity.english === LegalEntityEnum.ORG_REGIONAL) {
      self.isInternational = true;
    } else if (establishmentResponse.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
      self.isIndividual = true;
    }
    self.verifyEstStatus = true;
    self.establishment = new Establishment();
    self.establishment = self.addEstablishmentService.setResponse(self.establishment, establishmentResponse);
    self.isMofPayment = self.establishment?.establishmentAccount?.paymentType?.english === 'Yes';
    self.showLateFeeIndicator = isGovOrSemiGov(establishmentResponse?.legalEntity?.english);
    self.documentList$ = self.getDocumentList();
    const wizards = self.addEstWizardItems.map(wizard => {
      wizard.isDisabled = false;
      wizard.isActive = false;
      wizard.isDone = true;
      return wizard;
    });
    if (wizards[tabIndex]) {
      wizards[tabIndex].isActive = true;
    }
    self.addEstWizardItems = [...wizards];
    self.hasInitialised = true;

    return admin$.pipe(
      switchMap(() => {
        return owners$;
      })
    );
  }
};

export const initialiseOwnerSection = (
  owners: Person[],
  self: RegisterEstablishmentScComponent
): Observable<boolean> => {
  if (owners && owners.length > 0) {
    owners.some((owner, index) => {
      if (index >= 1) {
        if (self.ownerComponent) {
          self.ownerComponent.addOwnerForm();
        }
      }
      if (owner.personId) {
        self.verifyPersonStatus[index] = true;
        self.editPersonDetails[index] = false;
        self.isOwnerSaved[index] = true;
        self.establishmentOwner.persons[index] = owner;
      }
      if (self.establishmentAdmin && owner.personId === self.establishmentAdmin?.person?.personId) {
        self.ownerIsAdmin = true;
        if (self.ownerComponent) {
          (<FormGroup>(self.ownerComponent.ownerForms.controls.owners as FormArray).controls[index])
            .get('isAdmin')
            .setValue(true);
          self.ownerComponent.adminIndex = index;
        }
      }
      self.ownerIndex.push(index);
      return false;
    });
    if (self.ownerComponent) {
      self.ownerComponent.employeeComponent.forEach(person => {
        person.submitted = true;
      });
      self.ownerComponent.searchEmployeeComponent.forEach(searchPerson => {
        searchPerson.submitted = true;
      });
    }
    self.withOwner = true;
  } else {
    self.withOwner = false;
  }
  return of(true);
};
