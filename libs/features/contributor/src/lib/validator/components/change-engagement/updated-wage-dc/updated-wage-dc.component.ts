/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { ChangeEngagementTransactionType } from '../../../../shared/enums';
import { UpdatedWageDetails } from '../../../../shared/models/updated-wage-details';

@Component({
  selector: 'cnt-updated-wage-dc',
  templateUrl: './updated-wage-dc.component.html',
  styleUrls: ['./updated-wage-dc.component.scss']
})
export class UpdatedWageDcComponent implements OnChanges {
  /* Local variables. */
  isWageChanged = false;
  isOccupationChanged = false;
  isWorkTypeChanged = false;
  isEmployeeIDChanged = false;
  isContributorAbroadChanged = false;
  showPPAAnnuity: boolean = false;
  showPensionReform: boolean = false;

  /* Input variables. */
  @Input() updatedWageDetails: UpdatedWageDetails;
  @Input() isPpa = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.updatedWageDetails && changes.updatedWageDetails.currentValue) {
      this.identifyTheChanges();
      this.setBasicDetails();
      if (
        changes.updatedWageDetails.currentValue.wagePeriods &&
        changes.updatedWageDetails.currentValue.wagePeriods.length > 0
      ) {
        this.showPPAAnnuity = false;
        this.showPensionReform = false;
        changes.updatedWageDetails.currentValue.wagePeriods.forEach(period => {
          if (period.current && period.current.coverageType) {
            period.current.coverageType.forEach(currentType => {
              if (currentType.english === 'PPA Annuity') {
                this.showPPAAnnuity = true;
              }
              if (currentType.english === 'Pension Reform Annuity') {
                this.showPensionReform = true;
              }
            });
          }
          if (period.updated && period.updated.length > 0) {
            period.updated.forEach(updatedPeriod => {
              updatedPeriod.coverageType &&
                updatedPeriod.coverageType.length > 0 &&
                updatedPeriod.coverageType.forEach(updatedType => {
                  if (updatedType.english === 'PPA Annuity') {
                    this.showPPAAnnuity = true;
                  }
                  if (updatedType.english === 'Pension Reform Annuity') {
                    this.showPensionReform = true;
                  }
                });
            });
          }
        });
      }
    }
  }

  /** Method to identify the changes in engagement. */
  identifyTheChanges() {
    this.updatedWageDetails.changeRequestTypes.forEach(param => {
      const key = ChangeEngagementTransactionType[param];
      if (key) {
        switch (key) {
          case ChangeEngagementTransactionType.BACKDATED_WAGE:
          case ChangeEngagementTransactionType.CURRENT_MONTH_WAGE_FOR_TERMINATED:
          case ChangeEngagementTransactionType.REGULAR_WAGE:
            this.isWageChanged = true;
            break;
          case ChangeEngagementTransactionType.OCCUPATION:
            this.isOccupationChanged = true;
            break;
          case ChangeEngagementTransactionType.WORK_TYPE:
            this.isWorkTypeChanged = true;
            break;
          case ChangeEngagementTransactionType.WORKING_ABROAD:
            this.isContributorAbroadChanged = true;
            break;
          case ChangeEngagementTransactionType.EMPLOYEE_ID:
            this.isEmployeeIDChanged = true;
            break;
        }
      }
    });
  }

  /** Method to set the missing basic details of engagement. */
  setBasicDetails() {
    if (this.updatedWageDetails.basicDetails) {
      if (!this.updatedWageDetails.basicDetails.updated.joiningDate) {
        this.updatedWageDetails.basicDetails.updated.joiningDate =
          this.updatedWageDetails.basicDetails.current.joiningDate;
      }
      if (!this.updatedWageDetails.basicDetails.updated.leavingDate) {
        this.updatedWageDetails.basicDetails.updated.leavingDate =
          this.updatedWageDetails.basicDetails.current.leavingDate;
      }
      if (!this.updatedWageDetails.basicDetails.updated.leavingReason) {
        this.updatedWageDetails.basicDetails.updated.leavingReason =
          this.updatedWageDetails.basicDetails.current.leavingReason;
      }
    }
  }

  /**
   * Check if the coverageType has annuity
   * @param wagePeriods
   */
  isAnnuityCoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Annuity') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if the coverageType has annuity
   * @param wagePeriods
   */
  isPPAAnnuityCoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'PPA Annuity') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if the coverage has PR Annuity
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

  /**
   * Check if the coverageType has OH
   * @param wagePeriods
   */
  isOHCoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Occupational Hazard') {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Check if the coverageType has UI
   * @param wagePeriods
   */
  isUICoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Unemployment Insurance') {
          return true;
        }
      }
    }
    return false;
  }
}
