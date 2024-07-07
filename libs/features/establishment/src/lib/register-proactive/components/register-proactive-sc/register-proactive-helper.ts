/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  bindToObject,
  Establishment,
  EstablishmentStatusEnum,
  markFormGroupTouched,
  Person,
  RouterConstants,
  TransactionStatus
} from '@gosi-ui/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  EmployeeDetailsDcComponent,
  EstablishmentOwnersDcComponent,
  getProEstablishmentWizard,
  hasCrn,
  isEstRegPending,
  isGovOrSemiGov,
  LegalEntityEnum,
  NavigationIndicatorEnum,
  OwnerResponse,
  SearchEmployeeDcComponent
} from '../../../shared';
import { RegisterProactiveScComponent } from './register-proactive-sc.component';

/**
 * This method is used to fetch establishment details
 */
export const searchEstablishment = (self: RegisterProactiveScComponent, regNo: number): Observable<boolean> => {
  self.alertService.clearAlerts();
  let molEstablishment: Establishment;
  let establishmentAfterChanges: Establishment;
  return forkJoin([
    self.establishmentService.getEstablishment(regNo),
    self.editEstablishment || self.isResumeFromDraft
      ? self.establishmentService.getEstablishmentFromTransient(regNo, self.referenceNo)
      : of(new Establishment())
  ]).pipe(
    switchMap(res => {
      molEstablishment = res[0];
      establishmentAfterChanges = self.editEstablishment || self.isResumeFromDraft ? res[1] : res[0];
      return canAccessProactiveScreen(molEstablishment);
    }),
    catchError(() => of(false)),
    tap(canAccess => {
      if (canAccess) {
        self.legalEntityFromFeed = molEstablishment?.legalEntity;
        legalEntityCheck(self, molEstablishment);
        if (self.disableLegalEntity === false && self.editEstablishment) {
          if (hasCrn(establishmentAfterChanges)) {
            self.disableLegalEntity = true;
          }
        }
        licenseChecks(self, molEstablishment);
        activityTypeCheck(self, molEstablishment);
        establishmentEngNameCheck(self, molEstablishment);
        setEstablishmentAndState(self, establishmentAfterChanges);
      } else {
        //TODO Navigate to the required state
        self.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
      }
    }),
    catchError(err => {
      self.showErrorMessage(err);
      return of(err);
    })
  );
};

const canAccessProactiveScreen = (proactiveEstablishment: Establishment): Observable<boolean> => {
  //Check if proactive status pending
  if (
    isEstRegPending(proactiveEstablishment) &&
    proactiveEstablishment?.status?.english === EstablishmentStatusEnum.REGISTERED
  ) {
    return of(true);
  } else {
    return of(false);
  }
};

/**
 * Method to check if the establishment is in workflow
 * @param self
 * @param regNo
 */
export const establishmentInWorkflow = (self: RegisterProactiveScComponent, regNo: number): Observable<boolean> => {
  return self.establishmentService.getWorkflowsInProgress(regNo).pipe(
    switchMap(res => {
      if (res?.length > 0) {
        return of(res[0]?.status === TransactionStatus.APPROVAL_PENDING);
      } else {
        return of(false);
      }
    }),
    catchError(() => {
      return of(false);
    })
  );
};

export const setEstablishmentAndState = (self: RegisterProactiveScComponent, establishmentResponse: Establishment) => {
  self.establishment = new Establishment();
  self.establishment = self.addEstablishmentService.setEstablishmentDetails(self.establishment, establishmentResponse);
  self.establishment.proactive = true;
  self.showLateFeeIndicator = isGovOrSemiGov(establishmentResponse?.legalEntity?.english);
  self.isAccountSaved = true;
  if (establishmentResponse.molEstablishmentIds) {
    self.isEstablishmentFromMci = false;
  }
  if (establishmentResponse.crn && establishmentResponse.unifiedNationalNumber) {
    self.isEstMci = true;
  }
  self.addProEstWizardItems = getProEstablishmentWizard(true);
  self.addProEstWizardItems[0].isActive = true;
  self.addProEstWizardItems[0].isDisabled = false;
};

export function licenseChecks(self: RegisterProactiveScComponent, establishment: Establishment) {
  // If establishment is from MCI make license as optional
  if (hasCrn(establishment)) {
    self.isLicenseMandatory = false;
  } //If Mol establishment has license then disable License
  else if (
    establishment.license?.number &&
    establishment.license?.issueDate?.gregorian &&
    establishment.license?.issuingAuthorityCode?.english
  ) {
    self.disableLicense = true;
    if (establishment.license?.expiryDate?.gregorian) {
      self.disableLicenseExpiryDate = true;
    }
  }
}

export function legalEntityCheck(self: RegisterProactiveScComponent, establishment: Establishment) {
  // MCI Establishment will always have CRN and legal entity hence disable legalentity
  if (hasCrn(establishment)) {
    self.disableLegalEntity = true;
    self.fetchAllLegalEntity();
  } // If Establishment coming from MOL and Individual then disabled legal entity
  else if (establishment.legalEntity?.english === LegalEntityEnum.INDIVIDUAL) {
    self.disableLegalEntity = true;
    self.fetchAllLegalEntity();
  } //If Establishment coming from MOL and partnership then enable legal entity without individual legal entity in dropdown
  else {
    self.disableLegalEntity = false;
    self.filterIndividualLegalEntity();
  }
}

export function activityTypeCheck(self: RegisterProactiveScComponent, establishment: Establishment) {
  self.disableActivityType = establishment?.activityType?.english ? true : false;
}

export function establishmentEngNameCheck(self: RegisterProactiveScComponent, establishment: Establishment) {
  self.disableEstEngName = establishment?.name?.english ? true : false;
}

export function setOwnerState(owners: Person[], self: RegisterProactiveScComponent) {
  if (owners?.length > 0) {
    owners.forEach((person, index) => {
      setEstablishmentOwnerDcState(self.ownerComponent, index, person);
      setStateVariables(self, person, index);
      setTimeout(() => {
        setSearchOwnerState(
          self.ownerComponent.searchEmployeeComponent.find((_, cmpIndex) => cmpIndex === index),
          person,
          self.molOwnerPersonId,
          self.editEstablishment,
          self.establishment?.legalEntity?.english
        );
        setEmployeeComponentState(self.ownerComponent.employeeComponent.find((_, cmpIndex) => cmpIndex === index));
      }, 100);
    });
  }
}

export function setEstablishmentOwnerDcState(
  ownerComponent: EstablishmentOwnersDcComponent,
  index: number,
  person: Person
) {
  if (index >= ownerComponent?.editPersonDetails?.length && person?.personId) {
    ownerComponent.addOwnerForm();
  }
}

export function setStateVariables(self: RegisterProactiveScComponent, person: Person, index: number) {
  if (person?.personId) {
    self.ownerIndex.push(index); //track the person with index
    self.establishmentOwner.persons[index] = bindToObject(new Person(), person);
    if (self.editEstablishment) {
      //Variables to control fields in employee details component
      self.editPersonDetails[index] = false; //To disable person names and gender fields
      self.verifyPersonStatus[index] = true; //To show the employee details after verified
      self.isOwnerSaved[index] = true; // For Admin Renter Scenario the owners will be already saved
    } else {
      self.editPersonDetails[index] = false; //To disable person names and gender fields
      self.isOwnerSaved[index] = false; // For Complete Scenario owner need to be saved
      self.verifyPersonStatus[index] = personHasRequiredIdentifiers(person);
    }
  }
}

export function personHasRequiredIdentifiers(person: Person) {
  return person?.nationality?.english && person?.identity?.length > 0 && person?.birthDate?.gregorian ? true : false;
}

export function setSearchOwnerState(
  searchCmp: SearchEmployeeDcComponent,
  person: Person,
  molOwnerIds: number[],
  isAdminRenter: boolean,
  legalEntity: string
) {
  if (searchCmp) {
    if (isAdminRenter) {
      searchCmp.submitted = true; //If Reenter show all fields as readonly
      searchCmp.hasPerson = true; // If Renter dont show reset
    } else {
      if (molOwnerIds?.indexOf(person?.personId) !== -1) {
        searchCmp.submitted = true;
        if (personHasRequiredIdentifiers(person) && legalEntity === LegalEntityEnum.INDIVIDUAL) {
          searchCmp.hasPerson = true;
        }
      }
    }
    markFormGroupTouched(searchCmp?.verifyPersonForm);
  }
}

export function setEmployeeComponentState(employeeCmp: EmployeeDetailsDcComponent) {
  if (employeeCmp) {
    employeeCmp.isProActive = true; //To enable name and gender fields if empty even after successfull verify
    markFormGroupTouched(employeeCmp.personForm);
    if (employeeCmp?.contactDcComponent?.contactDetailsForm) {
      markFormGroupTouched(employeeCmp.contactDcComponent.contactDetailsForm);
    }
    if (employeeCmp?.addressDcComponent?.parentForm) {
      markFormGroupTouched(employeeCmp?.addressDcComponent?.parentForm);
    }
  }
}

/**
 * This method is to reset the crn componentform
 */
export const resetCRNDetails = (self: RegisterProactiveScComponent) => {
  self.establishment.crn = null;
  if (self.proactiveEstComp && self.proactiveEstComp.establishmentForm) {
    self.proactiveEstComp.establishmentForm.get('crn').reset();
    self.proactiveEstComp.establishmentForm.get('crn').markAsPristine();
    self.proactiveEstComp.establishmentForm.get('crn').markAsUntouched();
  }
};

export function saveAllOwners(self: RegisterProactiveScComponent): Observable<OwnerResponse> {
  return self.establishmentService.saveAllOwners(
    self.proactiveEstowners
      .filter(owner => (owner.recordAction ? true : false))
      .map(owner => {
        owner.startDate = self.establishment.startDate;
        return owner;
      }),
    self.establishment.registrationNo,
    self.editEstablishment
      ? NavigationIndicatorEnum.COMPLETE_PROACTIVE_RESUBMIT
      : NavigationIndicatorEnum.COMPLETE_PROACTIVE_SUBMIT,
    '',
    self.referenceNo
  );
}
