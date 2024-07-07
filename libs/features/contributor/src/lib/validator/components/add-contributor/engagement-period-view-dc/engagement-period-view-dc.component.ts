/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';
import { EngagementDetails, ContributorTypesEnum } from '../../../../shared';

@Component({
  selector: 'cnt-engagement-period-view-dc',
  templateUrl: './engagement-period-view-dc.component.html',
  styleUrls: ['./engagement-period-view-dc.component.scss']
})
export class EngagementPeriodViewDcComponent {
  /**Input variables */
  @Input() engagement: EngagementDetails;
  @Input() canEdit: boolean;
  @Input() conType: string;
  @Input() canEditPenalty: boolean;
  @Input() cntValidatorForm: FormGroup;

  /**Local Variables */
  contTypeEnum = ContributorTypesEnum;
  showPPAAnnuity: boolean;
  showPensionReform: boolean;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
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
   * Check if the coverage has PPA
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
