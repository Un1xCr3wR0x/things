import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WizardItem } from '@gosi-ui/core/lib/models/wizard-item';
import { AdjustmentConstants } from '../constants/adjustment-constants';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  constructor(private http: HttpClient) {}

  getAdjustmentWizardItem() {
    const benefitsItem = new WizardItem(AdjustmentConstants.ADJUSTMENT_DETAILS, 'Benefits');
    benefitsItem.isImage = true;
    return benefitsItem;
  }

  getAdjustmentWizradItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(this.getAdjustmentWizardItem());
    wizardItems.push(new WizardItem(AdjustmentConstants.PAYMENT_DETAILS, 'money-bill-alt'));
    return wizardItems;
  }
}
