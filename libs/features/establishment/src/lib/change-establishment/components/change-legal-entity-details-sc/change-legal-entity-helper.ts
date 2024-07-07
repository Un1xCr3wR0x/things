/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  ApplicationTypeEnum,
  DocumentItem,
  Establishment,
  EstablishmentRouterData,
  Lov,
  LovList,
  MainEstablishmentInfo,
  startOfDay
} from '@gosi-ui/core';
import { noop, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  DocumentNameEnum,
  EstablishmentKeyEnum,
  EstablishmentRoutesEnum,
  getLegalEntityWizards,
  isGovOrSemiGov,
  isLegalEntityPartnership,
  LegalEntityEnum
} from '../../../shared';
import { getOwnersForLegalEntity } from './change-legal-entity-api-helper';
import { ChangeLegalEntityDetailsScComponent } from './change-legal-entity-details-sc.component';
import { defaultNationality, setLateFeeIndicator, setPayment } from './change-legal-entity-form';

function filterLegalEntities(
  noOfBranches: number,
  legalEntityList: Lov[],
  estLegalEntity: string,
  mainLegalEntity: string,
  isEstMain: boolean,
  isEstGcc = false,
  isPublic: boolean,
  ppaEstablishment: boolean
): Lov[] {
  //Selected Establishent is not main
  if (!isEstMain) {
    if (mainLegalEntity === LegalEntityEnum.GOVERNMENT || mainLegalEntity === LegalEntityEnum.SEMI_GOV) {
      //Main is Government or Semi Government
      return legalEntityList.filter(
        item =>
          item.value.english === LegalEntityEnum.GOVERNMENT ||
          item.value.english === LegalEntityEnum.SEMI_GOV ||
          item.value.english === estLegalEntity
      );
    } else if (mainLegalEntity !== estLegalEntity) {
      //Different Legal entitites
      return legalEntityList.filter(
        item => item.value.english === estLegalEntity || item.value.english === mainLegalEntity
      );
    } else {
      return legalEntityList.filter(item => {
        return item.value.english === estLegalEntity;
      });
    }
  }
  //Selected Establishment is Main
  else {
    if (noOfBranches > 1) {
      return [];
    } else {
      if (isEstGcc === true && !ppaEstablishment) {
        return legalEntityList.filter(
          lov =>
            lov.value.english === LegalEntityEnum.INDIVIDUAL ||
            lov.value.english === LegalEntityEnum.SOCIETY ||
            lov.value.english === LegalEntityEnum.ORG_REGIONAL ||
            isLegalEntityPartnership(lov.value.english)
        );
      } else if (isPublic) {
        return legalEntityListStandaloneMain(legalEntityList, estLegalEntity, mainLegalEntity);
      }
      else if(ppaEstablishment || (ppaEstablishment && isEstGcc) || (ppaEstablishment && isEstGcc && isPublic)){
        return legalEntityList.filter(
          item =>
            item.value.english === LegalEntityEnum.GOVERNMENT ||
            item.value.english === LegalEntityEnum.SEMI_GOV
        );
      } 
      else{
        return legalEntityList;
      }
    }
  }
}

/************************ Owner Functionalities end ***********************/
// Fetch and filter legal entity dropdown
export function handleInitialValidations(
  self: ChangeLegalEntityDetailsScComponent,
  establishment: Establishment,
  mainEstablishment: MainEstablishmentInfo,
  noOfBranches: number
): void {
  self.legalEntityDropDown$ = self.lookUpService.getlegalEntityList().pipe(
    filter(res => res !== null),
    map(
      lovlist =>
        new LovList(
          filterLegalEntities(
            noOfBranches,
            lovlist.items,
            establishment.legalEntity.english,
            mainEstablishment.legalEntity.english,
            establishment.registrationNo === mainEstablishment.registrationNo,
            establishment.gccCountry,
            self.appToken === ApplicationTypeEnum.PUBLIC,
            establishment.ppaEstablishment
           
          )
        )
    )
  );
}

// Filter Documents for transaction
export function handleLegalDocuments(
  documents: DocumentItem[],
  isGcc: boolean,
  isFieldOffice: boolean,
  hasOwner: boolean,
  hasCRN: boolean,
  hasLicense: boolean,
  isLeToPartnerShip: boolean,
  isMofPaying: boolean,
  isGovOfSemiGov: boolean,
  isPpa: boolean
) {
  documents.forEach(doc => {
    doc.show = false;
    handleGccDocs(doc, isGcc, hasOwner);
    if (doc.name.english === DocumentNameEnum.EMPLOYER_PROCESS_DOCUMENT) {
      doc.show = doc.required = !isGcc && isFieldOffice; // Non Gcc and field office
    } else if (doc.name.english === DocumentNameEnum.AUTH_DELEGATION_LETTER) {
      doc.show = !isGcc && isFieldOffice; // Non Gcc and field office
      doc.required = false;
    } else if (doc.name.english === DocumentNameEnum.LICENSE_DOCUMENT) {
      doc.required = doc.show = !isGcc && hasLicense; //non gcc  and licence
    } else if (doc.name.english === DocumentNameEnum.COMMERCIAL_REG_DOCUMENT) {
      doc.required = doc.show = !isGcc && hasCRN; //non gcc  and CRN
    } else if (doc.name.english === DocumentNameEnum.COMPANY_MEMO_DOCUMENT) {
      doc.required = doc.show = !isGcc && isLeToPartnerShip; //legal enity to partnership
    } else if (doc.name.english === DocumentNameEnum.NATIONAL_ID_IQAMA) {
      doc.required = false;
      doc.show = !isGcc && isFieldOffice; //NON GCC and owner related changes
    } else if (doc.name.english === DocumentNameEnum.OTHERS_DOCUMENT) {
      doc.show = true; //Field  office
      doc.required = false;
    } else if (doc.name.english === DocumentNameEnum.MOF_FINANCIAL_GUARANTEE) {
      if (isPpa && isGcc) {
        doc.required = doc.show = false;
      } else {
        doc.required = doc.show = isMofPaying;
      } //Field  office
    } else if (doc.name.english === DocumentNameEnum.FINANCIAL_GUARANTEE) {
      doc.required = doc.show = !isGcc && isGovOfSemiGov && !isMofPaying; //Field  office
    }
  });
}
function handleGccDocs(doc: DocumentItem, isGcc: boolean, hasOwner: boolean) {
  if (doc.name.english === DocumentNameEnum.PROOF_LEGAL_ENTITY) {
    doc.show = doc.required = isGcc; // Gcc
  } else if (doc.name.english === DocumentNameEnum.MODIFICATION_REQUEST_DOCUMENT) {
    doc.show = doc.required = isGcc;
  } else if (doc.name.english === DocumentNameEnum.OWNERS_ID) {
    doc.show = hasOwner && isGcc; //If owners added
    doc.required = false;
  } else if (doc.name.english === DocumentNameEnum.PROOF_ESTABLISHMENT_OWNERSHIP) {
    doc.show = hasOwner && isGcc; //If owners added
    doc.required = false;
  }
}

export function setStateForModify(self: ChangeLegalEntityDetailsScComponent, estToken: EstablishmentRouterData) {
  return self.establishmentService.getEstablishment(estToken.registrationNo, { includeMainInfo: true }).pipe(
    switchMap(est => {
      self.estBeforeEdit = est;
      self.currentLegalEntity = est.legalEntity.english;
      self.initialPaymentType = est.establishmentAccount?.paymentType?.english;
      self.initialLateFee = est.establishmentAccount?.lateFeeIndicator?.english;
      return self.establishmentService.getEstablishmentProfileDetails(estToken.registrationNo, true);
    }),
    switchMap(res => self.fetchInitialData(estToken.registrationNo, res.noOfBranches, estToken.referenceNo)),
    switchMap(() => {
      if (
        self.estBeforeEdit?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL ||
        isLegalEntityPartnership(self.estBeforeEdit?.legalEntity?.english) ||
        self.establishment?.legalEntity?.english === LegalEntityEnum.INDIVIDUAL ||
        isLegalEntityPartnership(self.establishment?.legalEntity?.english)
      ) {
        return getOwnersForLegalEntity(self, self.establishment, estToken.referenceNo);
      } else {
        return of(null);
      }
    }),
    tap(() => {
      self.changeLegalEntity(
        self.currentLegalEntity,
        self.establishment.legalEntity.english,
        self.establishment.nationalityCode.english,
        self.establishment.establishmentAccount?.paymentType?.english,
        self.establishment.startDate?.gregorian,
        self.establishment.establishmentAccount?.lateFeeIndicator?.english
      );
    }),
    switchMap(() => {
      return self.documentService
        .getDocuments(
          self.documentType,
          self.documentType,
          self.establishment.registrationNo,
          self.estToken.referenceNo
        )
        .pipe(
          tap(docs => {
            self.legalEntityDocuments = docs;
            self.changeLEDocumentValidation(
              !isLegalEntityPartnership(self.currentLegalEntity) &&
                isLegalEntityPartnership(self.establishment?.legalEntity?.english),
              self.establishment.establishmentAccount?.paymentType?.english === 'Yes',
              isGovOrSemiGov(self.establishment?.legalEntity?.english)
            );
          })
        );
    })
  );
}

// Method to show delete  owner info
export function showDeleteOwnerInfo(self: ChangeLegalEntityDetailsScComponent, previousLegalEntity: string) {
  if (
    previousLegalEntity !== LegalEntityEnum.GOVERNMENT &&
    previousLegalEntity !== LegalEntityEnum.SEMI_GOV &&
    previousLegalEntity !== LegalEntityEnum.SOCIETY &&
    previousLegalEntity !== LegalEntityEnum.ORG_REGIONAL
  ) {
    self.showInfo = true;
    self.infoKey = EstablishmentKeyEnum.OWNER_DELETE_INFO;
  }
}
//If previous payment type was mof and moving to non government establishment
export function showMofSelfInfo(self: ChangeLegalEntityDetailsScComponent) {
  if (self.estBeforeEdit?.establishmentAccount?.paymentType?.english === 'Yes') {
    self.showInfo = true;
    self.infoKey = EstablishmentKeyEnum.PAYMENT_SELF_INFO;
  }
}

/* Method to set the states to iniital values when user change legal entity
 * This is revert all the state changes and compares legal entity from start
 */
export function initialiseBooleanStates(self: ChangeLegalEntityDetailsScComponent) {
  self.showInfo = false;
  self.showContribution = false;
  self.showOwnerSection = false;
  self.showNationality = false;
  self.showStartDate = false;
  self.showEndDate = false;
  self.canAddOwner = false;
  self.canChoseOwnerSection = false;
  setLateFeeIndicator(self, undefined, false, false);
}

export function setStatetoGovLE(
  self: ChangeLegalEntityDetailsScComponent,
  previousLegalEntity: string,
  paymentType: string,
  lateFeeIndicator: string
) {
  showDeleteOwnerInfo(self, previousLegalEntity);
  defaultNationality(self, true);
  setPayment(self, paymentType, (self.isEstGcc ? false : true), true);
  setLateFeeIndicator(self, self.isFO ? lateFeeIndicator : 'Yes', true, true);
}
export const NO = 'No';

export function setStateToPartnership(
  self: ChangeLegalEntityDetailsScComponent,
  estStartDate: Date,
  previousLegalEntity: string,
  nationality: string
) {
  self.showStartDate = true;
  self.showOwnerSection = true;
  setPayment(self, null, false, false);
  self.enableAddOwner();
  if (estStartDate) {
    self.estStartDate = startOfDay(estStartDate);
  }
  if (previousLegalEntity === LegalEntityEnum.GOVERNMENT || previousLegalEntity === LegalEntityEnum.SEMI_GOV) {
    showMofSelfInfo(self);
    setPayment(self, NO, false, true);
    defaultNationality(self, false, nationality);
  } else if (isLegalEntityPartnership(previousLegalEntity)) {
    self.showOwnerSection = false;
    self.showStartDate = false;
  }
}

export function setStateToIndividual(
  self: ChangeLegalEntityDetailsScComponent,
  previousLegalEntity: string,
  nationality: string
) {
  self.enableAddOwner();
  self.showOwnerSection = true;
  if (previousLegalEntity === LegalEntityEnum.GOVERNMENT || previousLegalEntity === LegalEntityEnum.SEMI_GOV) {
    showMofSelfInfo(self);
    setPayment(self, NO, false, true);
    defaultNationality(self, false, nationality);
  } else if (isLegalEntityPartnership(previousLegalEntity)) {
    self.canChoseOwnerSection = true;
    if (!self.currentOwners?.length) {
      self.ownerSelectionForm.get('english').setValue(self.createOwnerSelection);
      self.ownerSelectionForm.get('english').updateValueAndValidity();
      self.chooseOwnerSection(self.createOwnerSelection);
    }
    setPayment(self, null, false, false);
  } else {
    setPayment(self, null, false, false);
  }
}

//Method to initialise for edit state
export function initialiseForEdit(
  self: ChangeLegalEntityDetailsScComponent,
  estToken: EstablishmentRouterData,
  isDraft = false
) {
  self.goBackRouter = EstablishmentRoutesEnum.VALIDATOR_LEGAL_ENTITY;
  self.legalEntityForm.get('referenceNo').setValue(estToken.referenceNo);
  self.legalEntityForm.updateValueAndValidity();
  if (!isDraft) {
    self.isReEnter = true;
    self.isValidator = true;
    self.fetchComments(estToken);
  }
  self.legalEntityTabWizards = getLegalEntityWizards().map(wizard => {
    wizard.isDisabled = false;
    wizard.isActive = false;
    wizard.isDone = true;
    return wizard;
  });
  if (estToken.tabIndicator !== null && estToken.tabIndicator < self.legalEntityTabWizards.length) {
    self.currentTab = estToken.tabIndicator;
    self.legalEntityTabWizards[estToken.tabIndicator].isActive = true;
  } else {
    self.legalEntityTabWizards[self.currentTab].isActive = true;
  }
  setStateForModify(self, estToken).subscribe(noop, err => {
    self.alertService.showError(err?.error?.message, err?.error?.details);
  });
}
// method to show LE drop down for standalone main est
export function legalEntityListStandaloneMain(legalEntityList: Lov[], estLegalEntity: string, mainLegalEntity: string) {
  if (mainLegalEntity === LegalEntityEnum.GOVERNMENT || mainLegalEntity === LegalEntityEnum.SEMI_GOV) {
    //Main is Government or Semi Government
    return legalEntityList.filter(
      item =>
        item.value.english === LegalEntityEnum.GOVERNMENT ||
        item.value.english === LegalEntityEnum.SEMI_GOV ||
        item.value.english === estLegalEntity
    );
  } else if (mainLegalEntity !== LegalEntityEnum.GOVERNMENT && mainLegalEntity !== LegalEntityEnum.SEMI_GOV) {
    //Different Legal entitites
    return legalEntityList.filter(
      item => item.value.english !== LegalEntityEnum.GOVERNMENT && item.value.english !== LegalEntityEnum.SEMI_GOV
    );
  }
  return legalEntityList;
}
