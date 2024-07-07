/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AddressDetails,
  AddressTypeEnum,
  ApplicationTypeEnum,
  bindToObject,
  Establishment,
  EstablishmentStatusEnum,
  IdentityTypeEnum,
  Iqama,
  NationalId,
  Person,
  RouterConstants,
  startOfDay
} from '@gosi-ui/core';
import { of } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../../constants';
import {
  DocumentTransactionTypeEnum,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  NavigationIndicatorEnum
} from '../../enums';
import { isDocumentsValid, isEstRegPending, isLawTypeCivil, isOrgOrSociety } from '../../utils';
import { AddEstablishmentSCBaseComponent } from './add-establishment-sc.base-component';

export const DUPLICATE_OWNER_KEY = 'ESTABLISHMENT.ERROR.DUPLICATE_OWNER';
//Method to set start date and license dates
export const setStartDateAndLicenseDates = (establishment: Establishment, self: AddEstablishmentSCBaseComponent) => {
  /** Work around for establishment startdate */
  establishment.startDate.gregorian = startOfDay(self.establishment.startDate.gregorian);
  if (
    establishment.license === undefined ||
    establishment.license?.number === null ||
    establishment.license?.number === undefined ||
    establishment.license?.issuingAuthorityCode.english === null ||
    establishment.license?.issuingAuthorityCode.english === undefined
  ) {
    establishment.license = null;
  }
  if (establishment.license && establishment.license !== null) {
    if (establishment.license.issueDate && establishment.license.issueDate.gregorian) {
      establishment.license.issueDate.gregorian = startOfDay(establishment.license.issueDate.gregorian);
    }
    if (establishment.license.expiryDate && establishment.license.expiryDate.gregorian) {
      establishment.license.expiryDate.gregorian = startOfDay(establishment.license.expiryDate.gregorian);
    }
  }
};
//Method to set crn as null if all the details are null
export const setCrnAsNullIfEmpty = (establishment: Establishment) => {
  if (
    establishment.crn === undefined ||
    establishment.crn === null ||
    establishment.crn?.issueDate?.gregorian === undefined ||
    establishment.crn?.issueDate?.gregorian === null
  ) {
    establishment.crn = null;
  }
};
//Method to set the navigation indicator based on some criterias
export const setNavigationIndicatorForSaveEst = (
  establishment: Establishment,
  self: AddEstablishmentSCBaseComponent
) => {
  if (establishment.proactive === true) {
    establishment.gccCountry = false;
    establishment.gccEstablishment = null;
    if (establishment.navigationIndicator === NavigationIndicatorEnum.COMPLETE_PROACTIVE_SAVE && self.isSaved) {
      establishment.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_PREVIOUS_SAVE;
    } else {
      establishment.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_SAVE;
    }
  } else {
    if (self.editEstablishment === true) {
      establishment.navigationIndicator = NavigationIndicatorEnum.FIRST_VALIDATOR_SAVE;
    } else {
      establishment.navigationIndicator = NavigationIndicatorEnum.CSR_SAVE;
    }
  }
};
//This method is used to add gcc id from search in the gcc person details if the reponse doesnot contain
export const addGccId = (person: Person, verifyDetails, self: AddEstablishmentSCBaseComponent) => {
  self.alertService.clearAlerts();
  if (EstablishmentConstants.GCC_NATIONAL.indexOf(person.nationality.english) !== -1) {
    let hasGccId = false;
    for (let identity of person.identity) {
      if (!hasGccId) {
        if (identity.idType === IdentityTypeEnum.NATIONALID) {
          identity = <NationalId>identity;
          hasGccId = identity.id ? true : false;
          if (!identity.id && verifyDetails.id) {
            identity.id = verifyDetails.id;
            hasGccId = true;
          }
        } else {
          hasGccId = false;
        }
      }
    }
    if (!hasGccId && verifyDetails.id) {
      const nationalId: NationalId = new NationalId();
      nationalId.id = verifyDetails.id;
      person.identity.push(nationalId);
    }
  }
  return bindToObject(new Person(), person);
};
export const setEstablishmentFormDetails = (establishment, self: AddEstablishmentSCBaseComponent) => {
  setStartDateAndLicenseDates(establishment, self);
  setCrnAsNullIfEmpty(establishment);
  if (establishment.establishmentAccount ? establishment.establishmentAccount.paymentType === null : false) {
    establishment.establishmentAccount = null;
  }

  if (establishment.establishmentType.english === EstablishmentTypeEnum.MAIN) {
    establishment.mainEstablishmentRegNo = 0;
  }
  if (establishment.status.english !== EstablishmentStatusEnum.REGISTERED) {
    if (self.editEstablishment) {
      establishment.status.english = EstablishmentStatusEnum.OPENING_IN_PROGRESS;
    } else if (self.isSaved) {
      establishment.status.english = EstablishmentStatusEnum.DRAFT;
    }
  }
  setNavigationIndicatorForSaveEst(establishment, self);
};
//This method is used to bind any explicit identifiers from form during save.
export const bindIdentifiers = (person: Person, gccid: string, iqama?: string) => {
  if (EstablishmentConstants.GCC_NATIONAL.indexOf(person.nationality.english) !== -1) {
    let gccIdExists = false;
    let iqamaExists = false;
    if (person.identity) {
      for (const item of person.identity) {
        if (item.idType === IdentityTypeEnum.NATIONALID) {
          gccIdExists = true;
        }
        if (item.idType === IdentityTypeEnum.IQAMA) {
          iqamaExists = true;
        }
      }
    }
    if (!gccIdExists && gccid) {
      const nationalId = new NationalId();
      nationalId.id = Number(gccid);
      if (person.identity) {
        person.identity.push(nationalId);
      } else {
        person.identity = [];
        person.identity.push(nationalId);
      }
      gccIdExists = true;
    }
    if (!iqamaExists && iqama) {
      const iqamaDetails = new Iqama();
      iqamaDetails.iqamaNo = Number(iqama);
      if (person.identity) {
        person.identity.push(iqamaDetails);
      } else {
        person.identity = [];
        person.identity.push(iqamaDetails);
      }
      iqamaExists = true;
    }
  }
  return person;
};
export const getRegisterEstDocType = (self: AddEstablishmentSCBaseComponent) => {
  let docType = null;
  let count = 1;
  if (self.isMofPayment) {
    docType = DocumentTransactionTypeEnum.GOV_MOF;
  } else if (self.gccEstablishment) {
    if (self.establishmentOwner.persons.length >= 1) {
      for (let i = 0; i < self.establishmentOwner.persons.length; i++) {
        if (self.establishmentOwner.persons[i] && self.establishmentOwner.persons[i] !== null) {
          if (
            self.establishmentOwner.persons[i].name &&
            self.establishmentOwner.persons[i].name.arabic &&
            self.establishmentOwner.persons[i].name.arabic.firstName
          ) {
            count++;
            docType = DocumentTransactionTypeEnum.GCC_EST_OWNER;
            break;
          }
        }
      }
      if (count === 1) {
        docType = DocumentTransactionTypeEnum.GCC_EST;
      }
    } else if (isOrgOrSociety(self.establishment) || isLawTypeCivil(self.establishment)) {
      docType = DocumentTransactionTypeEnum.GCC_EST_WITHOUT_OWNER;
    } else {
      docType = DocumentTransactionTypeEnum.GCC_EST;
    }
  } else {
    if (
      self.establishment.legalEntity &&
      (self.establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
        self.establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV)
    ) {
      docType = DocumentTransactionTypeEnum.GOV_NON_MOF;
    } else {
      docType = DocumentTransactionTypeEnum.ORG_REGIONAL;
    }
  }
  if (self.establishment.establishmentAccount?.bankAccount?.bankName?.english) {
    docType += DocumentTransactionTypeEnum.ADD_IBAN;
  }
  return docType;
};
export const finalSubmitForRegisterEstablishment = (self: AddEstablishmentSCBaseComponent, comments) => {
  if (self.apiInProgress) return;
  self.alertService.clearAlerts();
  if (!self.showDocumentSection || (self.showDocumentSection && isDocumentsValid(self.documentList))) {
    self.establishment.comments = comments.comments;
    if (self.establishment.proactive) {
      if (!self.showDocumentSection) {
        self.establishment.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_DIRECT_CHANGE_SUBMIT;
      } else if (self.editEstablishment) {
        self.establishment.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_RESUBMIT;
      } else {
        self.establishment.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_SUBMIT;
      }
    } else {
      self.establishment.status.english = EstablishmentStatusEnum.OPENING_IN_PROGRESS;
    }
    self.establishment.scanDocuments = [];
    if (self.establishment.proactive === false) {
      if (self.editEstablishment === true) {
        self.establishment.navigationIndicator = NavigationIndicatorEnum.FIRST_VALIDATOR_SUBMIT;
      } else {
        self.establishment.navigationIndicator = NavigationIndicatorEnum.CSR_SUBMIT;
      }
    }
    if (
      self.establishment.proactive ||
      (self.establishment.establishmentAccount ? self.establishment.establishmentAccount.paymentType === null : false)
    ) {
      self.establishment.establishmentAccount = null;
    }
    if (self.editEstablishment) {
      self.establishment.status.english = EstablishmentStatusEnum.OPENING_IN_PROGRESS;
    }
    self.apiInProgress = true;
    self.addEstablishmentService.saveEstablishment(self.establishment).subscribe(
      res => {
        if (res.registrationNo) {
          self.establishment.registrationNo = res.registrationNo;
          self.establishment.transactionMessage = res.transactionMessage;
          if (
            self.editEstablishment === true ||
            self.estRouterData.resourceType === RouterConstants.TRANSACTION_PROACTIVE_FEED
          ) {
            // If admin reenter or validator edit
            const isProactiveWorkflow = self.estRouterData.resourceType === RouterConstants.TRANSACTION_PROACTIVE_FEED;
            self.updateBpmTransaction(self.estRouterData, comments.comments).subscribe(
              () => {
                self.setTransactionComplete();
                if (isProactiveWorkflow) {
                  self.alertService.showSuccess(res.transactionMessage);
                  self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(ApplicationTypeEnum.PUBLIC)]);
                } else {
                  self.apiInProgress = false;
                  self.nextForm();
                  self.coreBenefitService.setBenefitAppliedMessage(res.transactionMessage);
                  self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(ApplicationTypeEnum.PRIVATE)]);
                }
              },
              err => {
                self.apiInProgress = false;
                self.showErrorMessage(err);
              }
            );
          } else {
            self.setTransactionComplete();
            if (isEstRegPending(self.establishment)) {
              // If complete proactive transaction
              of(null)
                .pipe(
                  debounceTime(1500),
                  tap(() => {
                    self.alertService.showSuccess(res.transactionMessage);
                    self.location.back();
                  })
                )
                .subscribe();
            } else {
              // If register establishment
              self.alertService.showSuccess(res.transactionMessage);
              self.router.navigate([RouterConstants.ROUTE_ESTABLISHMENT_SEARCH]);
            }
          }
        }
      },
      err => {
        self.apiInProgress = false;
        self.showErrorMessage(err);
      }
    );
  } else {
    self.alertService.showMandatoryDocumentsError();
  }
};
export const setAdminForVerify = (self: AddEstablishmentSCBaseComponent, adminFormDetails) => {
  self.establishmentAdmin.person = new Person();
  self.alertService.clearAlerts();
  //Role =1 formestablishment
  self.verifyAdminStatus = false;
  self.editAdminDetails = true;
  self.establishmentAdmin.person.contactDetail.addresses = [new AddressDetails()];
  self.resetAdminForm();
  self.establishmentAdmin.person = self.establishmentAdminService.updateAdminDetails(
    self.establishmentAdmin.person,
    adminFormDetails
  );
  self.establishmentAdmin.person.role = EstablishmentConstants.EST_ADMIN;
};
export const setAdminAfterVerify = (self: AddEstablishmentSCBaseComponent, personDetails, adminFormDetails) => {
  if (personDetails) {
    self.establishmentAdmin.person = self.establishmentAdminService.updateAdminDetails(
      self.establishmentAdmin.person,
      personDetails
    );
    self.establishmentAdmin.person = addGccId(self.establishmentAdmin.person, adminFormDetails, self);
    self.establishmentAdmin.person.personId = personDetails.personId;
    self.verifyAdminStatus = true;
    self.editAdminDetails = false;
  } else {
    self.establishmentAdmin.person = self.establishmentAdminService.getIdentityDetails();
    if (adminFormDetails.idType !== IdentityTypeEnum.NIN) {
      self.establishmentAdmin.person = addGccId(self.establishmentAdmin.person, adminFormDetails, self);
      self.verifyAdminStatus = true;
      self.editAdminDetails = true;
    }
  }
};
export const setOwnerForSave = (self: AddEstablishmentSCBaseComponent, ownerDetails) => {
  self.alertService.clearAlerts();
  for (let i = 0; i < ownerDetails.owners.length; i++) {
    if (i === ownerDetails.index) {
      if (self.establishmentOwner.persons[i] && self.establishmentOwner.persons[i].contactDetail) {
        if (!self.establishmentOwner.persons[i].contactDetail.addresses) {
          self.establishmentOwner.persons[i].contactDetail.addresses = [new AddressDetails()];
        }
      }
      self.establishmentOwner.persons[i] = self.addEstablishmentService.updateOwner(
        self.establishmentOwner.persons[i],
        ownerDetails.owners[i]
      );
      if (ownerDetails.owners[i].birthDate && ownerDetails.owners[i].birthDate.gregorian) {
        self.establishmentOwner.persons[i].birthDate.gregorian = startOfDay(
          self.establishmentOwner.persons[i].birthDate.gregorian
        );
      }
      if (self.establishmentOwner.persons[i].identity) {
        self.establishmentOwner.persons[i] = bindIdentifiers(
          self.establishmentOwner.persons[i],
          ownerDetails.owners[i].id,
          ownerDetails.owners[i].iqamaNo
        );
      }
      self.establishmentOwner.persons[i].contactDetail.addresses = [];
      ownerDetails.owners[i].contactDetail.addresses.forEach(address => {
        self.establishmentOwner.persons[i].contactDetail.addresses.push(new AddressDetails().fromJsonToObject(address));
      });
    }
  }
  if (self.ownerIndex && self.ownerIndex.indexOf(ownerDetails.index) !== -1) {
    return true;
  } else {
    return false;
  }
};
export const setAdminForSave = (self: AddEstablishmentSCBaseComponent, adminDetails) => {
  self.alertService.clearAlerts();
  self.establishmentAdmin.person = self.establishmentAdminService.updateAdminDetails(
    self.establishmentAdmin.person,
    adminDetails.personDetails
  );
  self.establishmentAdmin = self.establishmentAdminService.updateAdminContactDetails(
    self.establishmentAdmin,
    adminDetails.contactDetails
  );
  self.establishmentAdmin.person.contactDetail.addresses = [new AddressDetails()];
  if (self.gccEstablishment) {
    self.establishmentAdmin.person.contactDetail.addresses = [];
    adminDetails.addresses.forEach(address => {
      self.establishmentAdmin.person.contactDetail.addresses.push(new AddressDetails().fromJsonToObject(address));
    });
    self.establishmentAdmin.person.contactDetail.currentMailingAddress = AddressTypeEnum.OVERSEAS;
  } else {
    self.establishmentAdmin.person.contactDetail.addresses = [];
  }
  self.establishmentAdmin.person = bindIdentifiers(
    self.establishmentAdmin.person,
    adminDetails.personDetails.id,
    adminDetails.personDetails.iqamaNo
  );
  self.establishmentAdmin.person.birthDate.gregorian = startOfDay(self.establishmentAdmin.person.birthDate.gregorian);
};
export const setOwnerAfterVerify = (
  self: AddEstablishmentSCBaseComponent,
  personDetails,
  index,
  ownerIdentifiers,
  isDateRequired
) => {
  if (personDetails) {
    let isDuplicate = false;
    self.establishmentOwner.persons.forEach(person => {
      if (person.personId === personDetails.personId) {
        isDuplicate = true;
      }
    });
    if (isDuplicate === false) {
      self.establishmentOwner.persons[index].personId = personDetails.personId;
      self.establishmentOwner.persons[index] = self.establishmentAdminService.updateOwnerDetails(
        self.establishmentOwner.persons[index],
        personDetails
      );
      self.establishmentOwner.persons[index] = addGccId(self.establishmentOwner.persons[index], ownerIdentifiers, self);
      self.verifyPersonStatus[index] = true;
      self.editPersonDetails[index] = false;
      self.isOwnerSaved[index] = false;
    } else {
      self.alertService.showErrorByKey(DUPLICATE_OWNER_KEY);
    }
  } else {
    if (isDateRequired) {
      self.verifyBirthDate(index);
      self.establishmentOwner.persons[index].birthDate.gregorian = null;
    }
    self.establishmentOwner.persons[index] = self.establishmentAdminService.getIdentityDetails();
    if (ownerIdentifiers.idType !== IdentityTypeEnum.NIN) {
      self.establishmentOwner.persons[index] = addGccId(self.establishmentOwner.persons[index], ownerIdentifiers, self);
      self.verifyPersonStatus[index] = true;
      self.editPersonDetails[index] = true;
    }
  }
};
export const setPaymentDetailsForSave = (self: AddEstablishmentSCBaseComponent, bankPaymentDetails) => {
  self.establishment.establishmentAccount = self.addEstablishmentService.setPaymentDetails(
    self.establishment.establishmentAccount,
    bankPaymentDetails.paymentDetails,
    bankPaymentDetails.bankAccount
  );
  if (bankPaymentDetails.paymentDetails.paymentType && bankPaymentDetails.paymentDetails.paymentType.english === 'No') {
    if (self.establishment.establishmentAccount.startDate) {
      self.establishment.establishmentAccount.startDate.gregorian = null;
    }
  }
  if (
    self.establishment.establishmentAccount.bankAccount &&
    self.establishment.establishmentAccount.bankAccount.ibanAccountNo === null
  ) {
    self.establishment.establishmentAccount.bankAccount = null;
  }
  self.establishment.establishmentAccount.startDate.gregorian = startOfDay(
    self.establishment.establishmentAccount.startDate.gregorian
  );
  if (
    self.establishment.establishmentAccount.paymentType === null
      ? true
      : self.establishment.establishmentAccount.paymentType.english === null &&
        self.establishment.establishmentAccount.bankAccount === null
  ) {
    self.establishment.establishmentAccount.startDate = null;
    self.establishment.establishmentAccount.paymentType = null;
  }
  if (self.establishment.proactive === true) {
    if (self.editEstablishment) {
      self.establishment.establishmentAccount.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_RESUBMIT;
    } else {
      self.establishment.establishmentAccount.navigationIndicator = NavigationIndicatorEnum.COMPLETE_PROACTIVE_SUBMIT;
    }
    self.establishment.establishmentAccount.referenceNo = self.referenceNo;
  }
  if (self.editEstablishment === true) {
    self.isAccountSaved = true;
  }
};
