import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BenefitConstants } from '../constants';
import { WizardItem } from '@gosi-ui/core/lib/models/wizard-item';
import { HeirStatus } from '../enum';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  constructor(private http: HttpClient) {}

  /**
   * This method is to get the progress wizard icons
   */
  getBenefitWizardItem() {
    const benefitsItem = new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits');
    benefitsItem.isImage = true;
    return benefitsItem;
  }
  /**
   * This method is to get the progress wizard icons for Stop
   */
  getStopWizardItem() {
    const benefitsItem = new WizardItem(BenefitConstants.STOP_DETAILS, 'stopHold-gray');
    benefitsItem.isImage = true;
    return benefitsItem;
  }
  /**
   * This method is to get the progress wizard icons for Stop
   */
  getHoldWizardItem() {
    const benefitsItem = new WizardItem(BenefitConstants.HOLD_DETAILS, 'stopHold-gray');
    benefitsItem.isImage = true;
    return benefitsItem;
  }

  /**
   * This method is used to disabled the successive navigation icons
   * @param index
   * @param addEstWizardItems
   */
  restrictProgress(index: number, wizardItems: WizardItem[]) {
    //TODO Proper Comments
    for (let i = index; i < wizardItems.length; i++) {
      if (wizardItems[i + 1]) {
        wizardItems[i + 1].isDisabled = true;
        wizardItems[i + 1].isActive = false;
        wizardItems[i + 1].isDone = false;
      }
    }
  }

  /**
   * This method is to get icons for form wizard
   */
  getRetirementPensionItems(
    eligibleDependent: boolean,
    actionType?: string,
    isModifyBackdated?: boolean,
    isHeir?: boolean,
    isLumpsum?: boolean
  ) {
    const wizardItems: WizardItem[] = [];
    if (actionType === HeirStatus.START_WAIVE || actionType === HeirStatus.STOP_WAIVE) {
      wizardItems.push(new WizardItem(BenefitConstants.WAIVE_BENEFIT, 'user-shield'));
      wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    }
    // else if (actionType === HeirStatus.HOLD) {
    //   wizardItems.push(new WizardItem(BenefitConstants.HOLD_BENEFIT, 'user-shield'));
    //   wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    // }
    else {
      if (eligibleDependent && isModifyBackdated) {
        wizardItems.push(new WizardItem(BenefitConstants.MODIFY_DETAILS, 'users'));
      }
      if (eligibleDependent && !isModifyBackdated && !isLumpsum) {
        wizardItems.push(new WizardItem(BenefitConstants.DEPENDENTS_DETAILS, 'users'));
      }
      wizardItems.push(this.getBenefitWizardItem());
      //wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    }

    return wizardItems;
  }
  // getBackdatedPensionModificationItems(eligibleDependent: boolean, actionType?: string) {
  //   const wizardItems: WizardItem[] = [];
  //   if (actionType === HeirStatus.START_WAIVE || actionType === HeirStatus.STOP_WAIVE) {
  //     wizardItems.push(new WizardItem(BenefitConstants.WAIVE_BENEFIT, 'user-shield'));
  //     wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
  //   }
  //   else {
  //     if (eligibleDependent) {
  //      wizardItems.push(new WizardItem(BenefitConstants.MODIFY_DETAILS, 'users'));
  //     }
  //     wizardItems.push(this.getBenefitWizardItem());
  //     wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
  //   }
  //   return wizardItems;
  // }

  /**
   * This method is to get icons for form wizard
   */
  getHeirPensionItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(this.getBenefitWizardItem());
    return wizardItems;
  }
  getHoldHeirPensionItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getRestartHeirPensionItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    // if (isAdjustmentAvailable) {
    wizardItems.push(new WizardItem(BenefitConstants.ADJUSTMENT_DETAILS, 'money-bill-alt'));
    // }
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getDisabilityAssesmentWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.DISABILITY_DETAILS, 'user-injured'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /** add wizard item to the list  */
  addWizardItem(wizardItems: WizardItem[], wizardItem: WizardItem): WizardItem[] {
    if (wizardItems && wizardItems.findIndex(wiz => wiz.key === wizardItem.key) === -1) {
      wizardItems.push(wizardItem);
    }
    return wizardItems;
  }
  addWizardItemByObj(wiardComp: ProgressWizardDcComponent, wizardItem: WizardItem): WizardItem[] {
    if (wiardComp.wizardItems && wiardComp.wizardItems.findIndex(wiz => wiz.key === wizardItem.key) === -1) {
      wiardComp.wizardItems.push(wizardItem);
    }
    return wiardComp.wizardItems;
  }
  /** remove wizard item to the list  */
  removeWizardItem(type, wizardItems: WizardItem[]) {
    return wizardItems.filter(wizardItem => wizardItem.key !== type);
  }

  /** Method to add wizard to  wizard list*/
  addWizardToPosition(wizards: WizardItem[], wiz: WizardItem, index: number) {
    wizards.splice(index, 0, wiz);
    return wizards;
  }

  isWizardItemAvailable(type: string, wizardItems: WizardItem[]) {
    const item = wizardItems.filter(wizardItem => wizardItem.key === type).length;
    return item;
  }
  /**
   * This method is to get icons for form wizard
   */
  getLumpsumWizardItems(isAppPrivate: boolean) {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(this.getBenefitWizardItem());
    if (isAppPrivate) {
      wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    }
    return wizardItems;
  }
  getJaileditems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.IMPRISONMENT_DETAILS, 'imprisonment'));
    //if (eligibleDependent) {
    wizardItems.push(new WizardItem(BenefitConstants.DEPENDENTS_DETAILS, 'users'));
    //}
    wizardItems.push(this.getBenefitWizardItem());
    return wizardItems;
  }
  getFuneralWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.FUNERAL_GRANT_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /**
   * This method is to get icons for form wizard
   */
  getRestoreLumpsumWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.RESTORE_DETAILS, 'money-bill-alt'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getBenefitWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_COVERAGE_DETAILS, 'Benefits'));
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }

  /**
   * This method is to get icons for form wizard
   */
  getModifyHeirItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getstopWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(this.getStopWizardItem());
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getRestartWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_RESTART_DETAILS, 'users'));
    wizardItems.push(this.getBenefitWizardItem());
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getHoldWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(this.getHoldWizardItem());
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getHeirDirectPaymentWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getModifyCommitmentWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.PAYMENT_DETAILS, 'money-bill-alt'));
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  getModifyCommitmentWizardsIndiApp() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.PAYMENT_DETAILS, 'money-bill-alt'));
    return wizardItems;
  }
  getSuspendSanedBenefitItems() {
    const benefitsItem = [
      new WizardItem(BenefitConstants.BENEFIT_SUSPEND_DETAILS, 'stopHold-gray'),
      new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'),
      new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
    ];
    benefitsItem[0].isImage = true;
    benefitsItem[1].isImage = true;
    return benefitsItem;
  }

  isThisLastWizardItem(wizardItem: WizardItem, wizardItems: WizardItem[] = []) {
    const lastItem = wizardItems.slice(-1);
    if(lastItem.length && lastItem[0]?.label === wizardItem?.label){
      return true;
    } else {
      return false;
    }
  }
}
