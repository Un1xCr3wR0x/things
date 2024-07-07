import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';

import { ContributorTypesEnum, EngagementDetails } from '../../../shared';

@Component({
  selector: 'cnt-engagement-period-details-view-dc',
  templateUrl: './engagement-period-details-view-dc.component.html',
  styleUrls: ['./engagement-period-details-view-dc.component.scss']
})
export class EngagementPeriodDetailsViewDcComponent {
  /**Input variables */
  @Input() engagement: EngagementDetails;
  @Input() conType: string;

  /**Local Variables */
  contTypeEnum = ContributorTypesEnum;
  engagementDetailsViewForm: FormGroup;
  showPPAAnnuity: boolean;
  showPensionReform: boolean;

  constructor(private fb: FormBuilder) {}
  /**
   * Method to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this.engagementDetailsViewForm) {
      this.engagementDetailsViewForm = this.createEmplymentDetailsViewForm();
    }

    if (changes.engagement && changes.engagement.currentValue && this.engagementDetailsViewForm) {
      this.engagementDetailsViewForm.get('applyLateFee').setValue(this.engagement.penaltyIndicator);
      this.engagementDetailsViewForm.get('applyLateFee').disable();
    }

    if (changes.engagement && changes.engagement.currentValue) {
      changes.engagement.currentValue.engagementPeriod.forEach(item => item.coverageType.forEach(item => {
        if (item.english == 'PPA Annuity') {
          this.showPPAAnnuity = true;
          this.showPensionReform = false;
        }
        if (item.english == 'Pension Reform Annuity') {
          this.showPPAAnnuity = false;
          this.showPensionReform = true;
        }
      }));
    }
  }

  /** Method to create form */
  createEmplymentDetailsViewForm() {
    return this.fb.group({
      applyLateFee: [false, { disabled: true }]
    });
  }

  /**
   * Check if the coverage has annuity
   * @param engagementPeriod
   */
  isAnnuityCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Annuity') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has OH
   * @param engagementPeriod
   */
  isOHCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Occupational Hazard') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has UI
   * @param engagementPeriod
   */
  isUICoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Unemployment Insurance') {
          return true;
        }
      }
    }

    return false;
  }

   /**
   * Check if the coverage has OH
   * @param engagementPeriod
   */
   isPpaCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'PPA Annuity') {
          return true;
        }
      }
    }
 
    return false;
  }

  /**
   * Check if the coverage has PPA Annuity
   * @param coverages
   */
  checkPensionReformCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Pension Reform Annuity') {
          return true;
        }
      }
    }
    return false;
  }
}
