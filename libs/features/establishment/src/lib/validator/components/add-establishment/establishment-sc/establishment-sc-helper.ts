import {
  AddressDetails,
  AddressTypeEnum,
  BankAccount,
  BilingualText,
  bindToObject,
  ContactDetails,
  Establishment,
  EstablishmentPaymentDetails,
  Role,
  scrollToTop
} from '@gosi-ui/core';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentTypeEnum,
  isLawTypeCivil,
  isOrgOrSociety,
  LegalEntityEnum
} from '../../../../shared';
import { EstablishmentScComponent } from './establishment-sc.component';

export function setEstablishmentDetails(self: EstablishmentScComponent, establishmentResponse: Establishment) {
  if (establishmentResponse) {
    scrollToTop();
    self.establishment.establishmentAccount = new EstablishmentPaymentDetails();
    self.establishment = bindToObject(new Establishment(), establishmentResponse);
    self.isBranch = self.establishment.establishmentType?.english === EstablishmentTypeEnum.BRANCH;
    if (self.estRouterData.previousOwnerRole === Role.VALIDATOR_2) {
      self.isTransactionReturned = true;
    }
    if (self.establishment.proactive && self.establishment.proactive === true) {
      self.validator2 = true;
      if (
        self.establishment.crn?.number &&
        self.establishment.crn?.issueDate &&
        self.establishment.crn?.issueDate.gregorian
      ) {
        self.isEstablishmentFromMci = true;
      }
    }
    if (self.establishment.gccCountry === true) {
      if (isOrgOrSociety(self.establishment)) {
        self.isOrgGcc = true;
      }
      self.fetchOwnerDetails();
      self.isGCC = true;
    } else {
      self.isGCC = false;
    }
    if (self.establishment.proactive) {
      if (!EstablishmentConstants.LEGAL_ENTITY_WITHOUT_OWNER.includes(self.establishment.legalEntity.english))
        self.fetchOwnerDetails();
      self.fetchEstOwnerDetails();
    } else {
      // If establishment is main fetch admin
      if (self.establishment.establishmentType?.english === EstablishmentTypeEnum.MAIN) {
        self.fetchAdminDetails();
      } else {
        // If establishment is branch fetch admin only if it is registered through branch
        if (self.establishment.adminRegistered) {
          self.fetchAdminDetails();
        }
      }
    }
    getDocuments(self, { ...self.establishment });
    self.getComments();
    self.showPayment();
  }
}

export function checkForFieldChanges(
  self: EstablishmentScComponent,
  estInDb: Establishment,
  estInTransient: Establishment
) {
  checkForLicenseChanged(self, estInDb, estInTransient);
  self.highlightActivityType = estInDb?.activityType?.english !== estInTransient?.activityType?.english;
  self.highlightEstEngName = estInDb?.name?.english !== estInTransient?.name?.english;
  hasAddresChanged(self, estInDb.contactDetails?.addresses, estInTransient.contactDetails?.addresses);
  hasContactChanged(self, estInDb?.contactDetails, estInTransient?.contactDetails);
  self.highlightIban = hasBankDetailChanged(
    estInDb?.establishmentAccount?.bankAccount,
    estInTransient?.establishmentAccount?.bankAccount
  );
  hasMOFChanged(self, estInDb?.establishmentAccount, estInTransient?.establishmentAccount);
  self.highlightLegalEntity = estInDb?.legalEntity?.english !== estInTransient?.legalEntity?.english;
  self.highlightLateFee = hasLateFeeChanged(
    estInDb.establishmentAccount?.lateFeeIndicator,
    estInTransient?.establishmentAccount?.lateFeeIndicator
  );
  self.highlightStartDate =
    new Date(estInDb?.startDate?.gregorian).toDateString() !==
    new Date(estInTransient?.startDate?.gregorian).toDateString();
}

export function hasLateFeeChanged(lateFee: BilingualText, changedLateFee: BilingualText) {
  return lateFee?.english === changedLateFee?.english;
}

export function hasAddresChanged(
  self: EstablishmentScComponent,
  address: AddressDetails[],
  changedAddress: AddressDetails[]
) {
  if (changedAddress?.length > 0) {
    changedAddress.forEach(chgAddr => {
      if (chgAddr.type === AddressTypeEnum.NATIONAL) {
        const nationalAddr = address?.filter(addr => addr.type === chgAddr.type);
        if (nationalAddr?.length > 0) {
          if (checkIfNationalAddressHasChanged(nationalAddr[0], chgAddr)) {
            self.highlightNationalAddress = true;
          }
        } else {
          self.highlightNationalAddress = true;
        }
      }
      if (chgAddr.type === AddressTypeEnum.POBOX) {
        const poAddr = address?.filter(addr => addr.type === chgAddr.type);
        if (poAddr?.length > 0) {
          if (checkIfPoAddrHasChanged(poAddr[0], chgAddr)) {
            self.highlightPoAddress = true;
          }
        } else {
          self.highlightPoAddress = true;
        }
      }
    });
  }
}

function hasFieldsChanged(initial, after) {
  return initial !== after;
}
export function checkIfNationalAddressHasChanged(nationalAddr: AddressDetails, changedNationalAddr: AddressDetails) {
  return (
    hasFieldsChanged(nationalAddr.buildingNo, changedNationalAddr.buildingNo) ||
    hasFieldsChanged(nationalAddr.streetName, changedNationalAddr.streetName) ||
    hasFieldsChanged(nationalAddr.postalCode, changedNationalAddr.postalCode) ||
    hasFieldsChanged(nationalAddr.district, changedNationalAddr.district) ||
    hasFieldsChanged(nationalAddr.city?.english, changedNationalAddr.city?.english) ||
    hasFieldsChanged(nationalAddr.cityDistrict?.english, changedNationalAddr.cityDistrict?.english) ||
    hasFieldsChanged(nationalAddr.additionalNo, changedNationalAddr.additionalNo) ||
    hasFieldsChanged(nationalAddr.unitNo, changedNationalAddr.unitNo)
  );
}

export function checkIfPoAddrHasChanged(poAddr: AddressDetails, changePoAddress: AddressDetails) {
  return (
    hasFieldsChanged(poAddr.postalCode, changePoAddress.postalCode) ||
    hasFieldsChanged(poAddr.postBox, changePoAddress.postBox) ||
    hasFieldsChanged(poAddr.city?.english, changePoAddress.city?.english) ||
    hasFieldsChanged(poAddr.cityDistrict?.english, changePoAddress.cityDistrict?.english)
  );
}

export function checkIfForeignAddrHasChanged(foreignAddr: AddressDetails, changedForeignAddr: AddressDetails) {
  return (
    hasFieldsChanged(foreignAddr.country?.english, changedForeignAddr.country?.english) ||
    hasFieldsChanged(foreignAddr.city?.english, changedForeignAddr.city?.english) ||
    hasFieldsChanged(foreignAddr.detailedAddress, changedForeignAddr.detailedAddress)
  );
}

export function hasContactChanged(
  self: EstablishmentScComponent,
  contact: ContactDetails,
  changedContact: ContactDetails
) {
  self.highlightMailingAddressChange = hasFieldsChanged(
    contact?.currentMailingAddress,
    changedContact?.currentMailingAddress
  );
  self.highlightEmail = hasFieldsChanged(contact?.emailId?.primary, changedContact.emailId?.primary);
  self.highlightMobileNo = hasFieldsChanged(contact?.mobileNo?.primary, changedContact.mobileNo?.primary);
  self.highlightMobileNo = hasFieldsChanged(contact?.mobileNo?.isdCodePrimary, changedContact.mobileNo?.isdCodePrimary);
  self.highlightTelephone = hasFieldsChanged(contact?.telephoneNo?.primary, changedContact.telephoneNo?.primary);
  self.highlightExtension = hasFieldsChanged(
    contact?.telephoneNo?.extensionPrimary,
    changedContact.telephoneNo?.extensionPrimary
  );
}

export function hasBankDetailChanged(estAccount: BankAccount, changeEstAccount: BankAccount) {
  return (
    hasFieldsChanged(estAccount?.bankName?.english, changeEstAccount?.bankName?.english) &&
    hasFieldsChanged(estAccount?.ibanAccountNo, changeEstAccount?.ibanAccountNo)
  );
}

export function hasMOFChanged(
  self: EstablishmentScComponent,
  paymentDetails: EstablishmentPaymentDetails,
  changedPaymentDetails: EstablishmentPaymentDetails
) {
  if (paymentDetails?.paymentType?.english !== changedPaymentDetails?.paymentType?.english) {
    self.highlightMof = true;
  }
  if (
    new Date(paymentDetails?.startDate?.gregorian).toDateString() !==
    new Date(changedPaymentDetails?.startDate?.gregorian).toDateString()
  ) {
    self.highlightPaymentStartDate = true;
  }
  return false;
}

export const checkForLicenseChanged = (
  self: EstablishmentScComponent,
  establishment: Establishment,
  changeEst: Establishment
) => {
  if (!establishment.license) {
    if (!changeEst.license) {
      self.highlightLicense = false;
    } else if (
      (!changeEst.license?.number || changeEst.license?.number?.toString() === '') &&
      !changeEst.license?.issuingAuthorityCode?.english &&
      !changeEst.license?.issueDate?.gregorian &&
      !changeEst.license?.expiryDate?.gregorian
    ) {
      self.highlightLicense = false;
    } else {
      self.highlightLicense = true;
    }
  }
  if (establishment.unifiedNationalNumber !== changeEst.unifiedNationalNumber) {
    self.highlightUnifiedNaionalNumber = true;
  }
  if (establishment.crn?.number !== changeEst.crn?.number && establishment.crn?.number != null) {
    self.highlightCrNumber = true;
  }

  if (establishment.unifiedNationalNumber !== changeEst.unifiedNationalNumber) {
    self.highlightUnifiedNaionalNumber = true;
  }
  if (establishment.crn?.number !== changeEst.crn?.number && establishment.crn?.number != null) {
    self.highlightCrNumber = true;
  }
  if (establishment.license?.number !== changeEst.license?.number) {
    self.highlightLicenseNo = true;
  }

  if (!establishment.license?.issuingAuthorityCode) {
    if (changeEst.license?.issuingAuthorityCode?.english) {
      self.highlightLicenseAuth = true;
    }
  } else if (changeEst.license?.issuingAuthorityCode.english !== establishment.license?.issuingAuthorityCode?.english) {
    self.highlightLicenseAuth = true;
  }

  if (!establishment.license?.issueDate) {
    if (changeEst.license?.issueDate?.gregorian) {
      self.highlightLicenseIssDate = true;
    }
  } else if (
    new Date(changeEst.license?.issueDate?.gregorian).toDateString() !==
    new Date(establishment.license?.issueDate?.gregorian).toDateString()
  ) {
    self.highlightLicenseIssDate = true;
  }

  if (!establishment.license?.expiryDate) {
    if (changeEst.license?.expiryDate?.gregorian) {
      self.highlightLiceseExpDate = true;
    }
  } else {
    if (!changeEst.license?.expiryDate) {
      self.highlightLiceseExpDate = true;
    }
    if (
      new Date(changeEst.license?.expiryDate.gregorian).toDateString() !==
      new Date(establishment.license.expiryDate.gregorian).toDateString()
    ) {
      self.highlightLiceseExpDate = true;
    }
  }
};
/**
 * Method to get documents
 * @param establishment
 */
export function getDocuments(self: EstablishmentScComponent, establishment: Establishment) {
  if (establishment.proactive === true) {
    self.validatorService
      .getProActiveDocumentList(establishment.registrationNo)
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.map(doc =>
              self.documentService.refreshDocument(
                doc,
                establishment.registrationNo,
                undefined,
                undefined,
                self.estRouterData.referenceNo
              )
            )
          );
        })
      )
      .subscribe(res => (self.documentList = res));
  } else {
    let docType;
    if (establishment.establishmentAccount?.paymentType?.english === 'Yes') {
      docType = DocumentTransactionTypeEnum.GOV_MOF;
    } else if (establishment.gccCountry === true) {
      docType = DocumentTransactionTypeEnum.GCC_EST;
      if (self.establishmentOwnerDetails.persons.length !== 0) {
        docType = DocumentTransactionTypeEnum.GCC_EST_OWNER;
      } else if (isOrgOrSociety(self.establishment) || isLawTypeCivil(self.establishment)) {
        docType = DocumentTransactionTypeEnum.GCC_EST_WITHOUT_OWNER;
      }
    } else {
      if (
        establishment.legalEntity?.english === LegalEntityEnum.GOVERNMENT ||
        establishment.legalEntity?.english === LegalEntityEnum.SEMI_GOV
      ) {
        docType = DocumentTransactionTypeEnum.GOV_NON_MOF;
      } else {
        docType = DocumentTransactionTypeEnum.ORG_REGIONAL;
      }
    }
    if (establishment?.establishmentAccount?.bankAccount?.bankName?.english) {
      docType += DocumentTransactionTypeEnum.ADD_IBAN;
    }
    self.documentService
      .getDocuments(
        DocumentTransactionTypeEnum.REGISTER_ESTABLISHMENT,
        docType,
        establishment.registrationNo,
        self.estRouterData.referenceNo
      )
      .subscribe(res => (self.documentList = res));
  }
}
