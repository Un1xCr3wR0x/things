/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { WizardItem } from '@gosi-ui/core';
import { AdjustmentConstants } from '../constants';

export const getTpaAdjustmentWizard = (currentTab?: number): WizardItem[] => {
  const wizards: WizardItem[] = [];
  wizards.push(new WizardItem(AdjustmentConstants.ADJUSTMENT_DETAILS, 'money-bill'));
  wizards.push(new WizardItem(AdjustmentConstants.DOCUMENTS, 'file-alt'));
  if (currentTab !== undefined) {
    return selectWizard(wizards, currentTab);
  } else {
    return wizards;
  }
};

/**
 * Method to select the wizard.
 * @param wizard
 * @param index
 */
export const selectWizard = (wizard: WizardItem[], index: number): WizardItem[] => {
  for (let i = 0; i <= wizard.length - 1; i++) {
    if (i < index) {
      wizard[i].isDone = true;
      wizard[i].isDisabled = false;
      wizard[i].isActive = false;
    } else if (i === index) {
      wizard[i].isDisabled = false;
      wizard[i].isDone = false;
      wizard[i].isActive = true;
    } else {
      wizard[i].isActive = false;
    }
  }
  return [...wizard];
};
