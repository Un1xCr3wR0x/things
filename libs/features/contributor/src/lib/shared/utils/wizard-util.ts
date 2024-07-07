/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ApplicationTypeEnum, WizardItem } from '@gosi-ui/core';
import { ContributorTypesEnum, FormWizardTypes } from '../enums';

/** Method to create contributor wizard. */
export function createContributorWizard(): WizardItem[] {
  let items: WizardItem[] = [];
  items.push(new WizardItem(FormWizardTypes.PERSON_DETAILS, 'user'));
  items.push(new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'briefcase'));
  return items;
}

/** Method to create add contributor wizard. */
export function createAddContributorWizard(isAppPrivate: boolean, contributorType: string): WizardItem[] {
  let wizardItems: WizardItem[] = [];
  wizardItems = createContributorWizard();
  if ((!isAppPrivate && contributorType !== ContributorTypesEnum.SAUDI) || isAppPrivate)
    wizardItems.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
  return wizardItems;
}

/** Method to create  add contract wizard. */
export function createAddContractWizard(appType: string): WizardItem[] {
  let wizardItems: WizardItem[] = [];
  wizardItems.push(new WizardItem(FormWizardTypes.CONTRACT_INFORMATIONS, 'address-card'));
  wizardItems.push(new WizardItem(FormWizardTypes.CONTRACT_CLAUSES, 'file-contract'));
  if (appType === ApplicationTypeEnum.PRIVATE)
    wizardItems.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
  wizardItems.push(new WizardItem(FormWizardTypes.PREVIEW, 'eye'));
  return wizardItems;
}

/** Method to add document wizard. */
export function addDocumentWizard(items: WizardItem[]): WizardItem[] {
  if (!items.some(item => item.key === FormWizardTypes.DOCUMENT_DETAILS)) {
    if (items.length === 5) items.splice(4, 0, new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    else if (items.length < 5) items.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    return [...items];
  } else return items;
}

/** Method to add document wizard. */
export function removeDocumentWizard(items: WizardItem[]): WizardItem[] {
  if (items.some(item => item.key === FormWizardTypes.DOCUMENT_DETAILS)) {
    const docIconIndex = items.findIndex(item => item.key === FormWizardTypes.DOCUMENT_DETAILS);
    items.splice(docIconIndex, 1);
    return [...items];
  } else return items;
}

/** Method to add contract wizards. */
export function addContractWizards(items: WizardItem[], isDocReq: boolean): WizardItem[] {
  if (items.length !== 6 && items.length !== 5) {
    if (items.length === 3) items.pop();
    items.push(new WizardItem(FormWizardTypes.CONTRACT_INFORMATIONS, 'address-card'));
    items.push(new WizardItem(FormWizardTypes.CONTRACT_CLAUSES, 'file-contract'));
    if (isDocReq) items.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    items.push(new WizardItem(FormWizardTypes.PREVIEW, 'eye'));
    return [...items];
  } else return items;
}

/** Method to remove contract wizards. */
export function removeContractWizards(items: WizardItem[], isDocReq: boolean): WizardItem[] {
  if (items.length === 6 || items.length === 5) {
    items.splice(2);
    if (isDocReq) items.push(new WizardItem(FormWizardTypes.DOCUMENT_DETAILS, 'file-alt'));
    return [...items];
  } else return items;
}

/** Method to initialize wizard. */
export function initializeWizard(wizardItems: WizardItem[], index: number) {
  if (wizardItems.length > 0) {
    for (let i = 0; i < index; i++) {
      wizardItems[i].isDone = true;
      wizardItems[i].isActive = false;
      wizardItems[i].isDisabled = false;
    }
    wizardItems[index].isActive = true;
    wizardItems[index].isDisabled = false;
  }
}
