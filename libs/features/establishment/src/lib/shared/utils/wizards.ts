/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { WizardItem } from '@gosi-ui/core';
import { EstablishmentConstants } from '../constants';
import { LegalEntityEnum, OrganisationTypeEnum } from '../enums';
import { isLegalEntityPartnership } from './establishment-util';

export const getAddEstablishmentWizard = (param?: string, legalEntity?: string): WizardItem[] => {
  const wizardItems: WizardItem[] = [];
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_DETAILS, 'building'));
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PAYMENT_DETAILS, 'money-bill-alt'));
  if (param === OrganisationTypeEnum.GCC) {
    // wizardItems.some((val, index) => {
    //   if (val.key === EstablishmentConstants.SEC_PAYMENT_DETAILS) {
    //     wizardItems.splice(index);
    //     return true;
    //   }
    //   return false;
    // });
    if (
      !legalEntity ||
      (legalEntity !== LegalEntityEnum.ORG_REGIONAL &&
        legalEntity !== LegalEntityEnum.SOCIETY &&
        legalEntity !== LegalEntityEnum.GOVERNMENT &&
        legalEntity !== LegalEntityEnum.SEMI_GOV)
    ) {
      wizardItems.push(new WizardItem(EstablishmentConstants.SEC_OWNER_DETAILS, 'user', false));
    }
  } else if (param === LegalEntityEnum.ORG_REGIONAL) {
    wizardItems.some((val, index) => {
      if (val.key === EstablishmentConstants.SEC_OWNER_DETAILS) {
        wizardItems.splice(index);
        return true;
      }
      return false;
    });
  }
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_ADMIN_DETAILS, 'user-cog'));
  if (param === 'hasAdmin') {
    wizardItems.some((val, index) => {
      if (val.key === EstablishmentConstants.SEC_EST_ADMIN_DETAILS) {
        wizardItems.splice(index);
        return true;
      }
      return false;
    });
  }
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt'));
  return [...wizardItems];
};

export const getProEstablishmentWizard = (addAll: boolean, legalEntity?: string): WizardItem[] => {
  const wizardItems: WizardItem[] = [];
  if (addAll) {
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_DETAILS, 'building'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PAYMENT_DETAILS, 'money-bill-alt'));
    if (legalEntity && isLegalEntityPartnership(legalEntity)) {
      wizardItems.push(new WizardItem(EstablishmentConstants.SEC_OWNER_DETAILS, 'user', false));
    } else {
      wizardItems.push(new WizardItem(EstablishmentConstants.SEC_OWNER_DETAILS, 'user'));
    }
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt'));
  } else {
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_DETAILS, 'building'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PAYMENT_DETAILS, 'money-bill-alt'));
    wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt'));
  }
  return wizardItems;
};
export const getReopenEstablishmentWizard = (param?: String): WizardItem[] => {
  const wizardItems: WizardItem[] = [];
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_EST_REOPEN_DETAILS, 'redo'));
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_PERSON_DETAILS, 'user'));
  wizardItems.push(new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, 'file-alt'));

  return [...wizardItems];
};

/**
 * Method to select the wizard.
 * @param wizards
 * @param index
 */
export const selectWizard = (wizards: WizardItem[], index: number): WizardItem[] => {
  for (let i = 0; i <= wizards.length - 1; i++) {
    if (i < index) {
      wizards[i].isDone = true;
      wizards[i].isDisabled = false;
      wizards[i].isActive = false;
    } else if (i === index) {
      wizards[i].isDisabled = false;
      wizards[i].isDone = false;
      wizards[i].isActive = true;
    } else {
      wizards[i].isActive = false;
    }
  }
  return [...wizards];
};

/**
 * Get Wizards for legal entity
 * @param currentTab
 */
export const getLegalEntityWizards = (currentTab?: number, isDocsRequired: boolean = true): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.SEC-EST-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faBuilding = 'building';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);

  if (isDocsRequired) {
    wizard = new WizardItem(SEC_DOCS, faFileAlt);
    wizards.push(wizard);
  }

  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for legal entity
 * @param currentTab
 */
export const getChangeOwnerWizards = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.SEC-OWNER-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faUser = 'user';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faUser);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for  partnership legal entity
 * @param currentTab
 */
export const getChangeOwnerWizardsPartnership = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.SEC-OWNER-DETAILS';
  const faUser = 'user';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faUser);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for change main establishment
 * @param currentTab
 */
export const getChangeMainEstWizards = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.SELECT-MAIN-EST';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faBuilding = 'building';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for change mof payment details
 * @param currentTab
 */
export const getChangeMofPaymentWizards = (currentTab?: number): WizardItem[] => {
  const SEC_MOF_PAYMENT = 'ESTABLISHMENT.MOF-PAYMENT-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faBuilding = 'file-invoice-dollar';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_MOF_PAYMENT, faBuilding);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for change main establishment
 * @param currentTab
 */
export const getChangeMainEstWizardsGOL = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.SELECT-MAIN-EST';
  const faBuilding = 'building';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for change main establishment
 * @param currentTab
 */
export const getDelinkEstWizards = (
  currentTab: number,
  isDelinkToNewGroup: boolean,
  isAppPrivate: boolean
): WizardItem[] => {
  const SEC_DELINK = 'ESTABLISHMENT.SEC-DELINK';
  const SEC_EST = isDelinkToNewGroup ? 'ESTABLISHMENT.SELECT-MAIN-EST' : 'ESTABLISHMENT.SEC-LINK-OTHER';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const SEC_ADMIN = 'ESTABLISHMENT.SUPER-ADMIN-DETAILS';
  const faList = 'list';
  const faBuilding = 'building';
  const faFileAlt = 'file-alt';
  const faUser = 'user-cog';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_DELINK, faList);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);
  if (isDelinkToNewGroup) {
    wizard = new WizardItem(SEC_ADMIN, faUser);
    wizards.push(wizard);
  }
  if (isAppPrivate) {
    wizard = new WizardItem(SEC_DOCS, faFileAlt);
    wizards.push(wizard);
  }
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for admin
 * @param currentTab
 */
export const getChangeAdminWizards = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.NEW-ADMIN-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.ADMINISTRATION-DETAILS';
  const faUser = 'user';
  const faFileAlt = 'user-cog';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faUser);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

export const getRegisterSuperAdminWizards = (currentTab?: number): WizardItem[] => {
  const wizards: WizardItem[] = [];
  const userIcon = 'user-cog';
  const docIcon = 'file-alt';
  let wizard = new WizardItem(EstablishmentConstants.SEC_EST_ADMIN_DETAILS, userIcon);
  wizards.push(wizard);
  wizard = new WizardItem(EstablishmentConstants.SEC_DOCUMENT_DETAILS, docIcon);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for change super admin
 * @param currentTab
 */
export const getChangeSuperAdminWizards = (currentTab?: number, docsRequired: boolean = true): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.NEW-ADMIN-DETAILS';
  const faUser = 'user';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faUser);
  wizards.push(wizard);
  if (docsRequired) {
    const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
    const faFileAlt = 'file-alt';
    wizard = new WizardItem(SEC_DOCS, faFileAlt);
    wizards.push(wizard);
  }
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};
/**
 * Get Wizards for terminate main establishment
 * @param currentTab
 */
export const getTerminateMainEstWizards = (currentTab?: number, isMain?: boolean): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.ESTABLISHMENT-DETAILS';
  const SEC_MAIN_EST = 'ESTABLISHMENT.SELECT-MAIN-EST';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faBuilding = 'building';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);
  if (isMain) {
    wizard = new WizardItem(SEC_MAIN_EST, faBuilding);
    wizards.push(wizard);
  }

  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for terminate branch establishment
 * @param currentTab
 */
export const getTerminateEstWizards = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.ESTABLISHMENT-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faBuilding = 'building';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faBuilding);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Get Wizards for add flag details
 * @param currentTab
 */
export const getChangeFlagWizards = (currentTab?: number): WizardItem[] => {
  const SEC_EST = 'ESTABLISHMENT.FLAG-DETAILS';
  const SEC_DOCS = 'ESTABLISHMENT.SEC-DOCUMENTS';
  const faFlag = 'flag';
  const faFileAlt = 'file-alt';
  const wizards: WizardItem[] = [];
  let wizard = new WizardItem(SEC_EST, faFlag);
  wizards.push(wizard);
  wizard = new WizardItem(SEC_DOCS, faFileAlt);
  wizards.push(wizard);
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};
