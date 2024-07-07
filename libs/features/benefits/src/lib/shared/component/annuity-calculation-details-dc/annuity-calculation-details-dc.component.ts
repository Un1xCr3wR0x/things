/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AverageMonthlyWagePeriod, BenefitDetails, BenefitRecalculation, Benefits } from '../../models';
import { BenefitType, MonthYearLabel, WagePeriodType } from '../../enum';
import {BilingualText, GosiCalendar} from '@gosi-ui/core';
import moment from 'moment-timezone';
import {isEligibleForPensionReform, isRequestSaned} from "../../utils";

@Component({
  selector: 'bnt-annuity-calculation-details-dc',
  templateUrl: './annuity-calculation-details-dc.component.html',
  styleUrls: ['./annuity-calculation-details-dc.component.scss']
})
export class AnnuityCalculationDetailsDcComponent implements OnInit {
  @Input() averageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  @Input() oldAverageMonthlyWagePeriods: AverageMonthlyWagePeriod[];
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() benefitRecalculationDetails: BenefitRecalculation;
  @Input() isLumpsum: boolean;
  @Output() close = new EventEmitter();
  @Input() lang;
  @Input() isSaned: boolean;
  @Input() isRecalculation = false;
  @Input() eligibleForPensionReform: boolean;
  @Input() annuitybenefits: Benefits[] = [];
  @Input() annuityBenefit:Benefits;
  @Input() benefitType: string;
  calcType: string;

  totalNewLawMonths = 0;
  totalOldLawMonths = 0;
  averageMonthlyTotal = 0;
  totalPensionAmountOld = 0;
  totalPensionAmountNew = 0;
  totalBenefit = 0;
  totalContributionMonth = 0;
  isEligible=false;
  numberOfRpaPeriods = 0;


  constructor() {}
  ngOnInit(): void {
    this.getTotalAmount();
    this.calcType = 'newBenefit';
  }
  // method to get the total amount
  getTotalAmount() {
    if (this.averageMonthlyWagePeriods) {
      this.averageMonthlyWagePeriods.forEach(monthlyWage => {
        this.totalOldLawMonths += monthlyWage.noOfOldLawMonths;
        this.totalNewLawMonths += monthlyWage.noOfNewLawMonths;
        this.totalBenefit += monthlyWage.benefitAmount;
        this.averageMonthlyTotal += monthlyWage.averageMonthlyWage;
        this.totalPensionAmountOld += monthlyWage.benefitAmountInOldLaw;
        this.totalPensionAmountNew += monthlyWage.benefitAmountInNewLaw;
        this.numberOfRpaPeriods += monthlyWage.period.english === WagePeriodType.RPA ? 1 : 0;
      });
    }
    if (this.oldAverageMonthlyWagePeriods) {
      this.oldAverageMonthlyWagePeriods.forEach(monthlyWage => {
        this.totalOldLawMonths += monthlyWage.noOfOldLawMonths;
        this.totalNewLawMonths += monthlyWage.noOfNewLawMonths;
        this.totalBenefit += monthlyWage.benefitAmount;
        this.averageMonthlyTotal += monthlyWage.averageMonthlyWage;
        this.totalPensionAmountOld += monthlyWage.benefitAmountInOldLaw;
        this.totalPensionAmountNew += monthlyWage.benefitAmountInNewLaw;
      });
    }
  }
  getFinalAMW(oldAverageMonthlyWagePeriods: AverageMonthlyWagePeriod[]) {
    this.averageMonthlyTotal = 0;
    oldAverageMonthlyWagePeriods.forEach(monthlyWage => {
      this.averageMonthlyTotal += monthlyWage.averageMonthlyWage;
    });
    return this.averageMonthlyTotal;
  }
  getFinalContributionMonths(oldAverageMonthlyWagePeriods: AverageMonthlyWagePeriod[]) {
    this.totalContributionMonth = 0;
    oldAverageMonthlyWagePeriods.forEach(monthlyWage => {
      this.totalContributionMonth += monthlyWage.contributionMonths;
    });
    return this.totalContributionMonth;
  }
  // method to get the months label to diplay
  geMonthForTrans(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  // method to close the modal
  closeModal() {
    this.close.emit();
  }
  getTotalNonRpaBenefitAmount(averageMonthlyWagePeriods) {
    return averageMonthlyWagePeriods.filter(wage=> wage.period?.english !== WagePeriodType.RPA).map(wage => wage?.benefitAmount).reduce((wage, s) => wage + s, 0);
  }
  getTotalBenefitAmount(averageMonthlyWagePeriods) {
    return averageMonthlyWagePeriods.map(wage => wage?.benefitAmount).reduce((wage, s) => wage + s, 0);
  }
  getTotalRpaBenefitAmount(averageMonthlyWagePeriods) {
    return averageMonthlyWagePeriods.filter(wage=> wage.period?.english === WagePeriodType.RPA).map(wage => wage?.benefitAmount).reduce((wage, s) => wage + s, 0);
  }
  getTotalPensionAmountOld(averageMonthlyWagePeriods) {
    return averageMonthlyWagePeriods.map(wage => wage?.benefitAmountInOldLaw).reduce((wage, s) => wage + s, 0);
  }
  getTotalPensionAmountNew(averageMonthlyWagePeriods) {
    return averageMonthlyWagePeriods.map(wage => wage?.benefitAmountInNewLaw).reduce((wage, s) => wage + s, 0);
  }
  calcTypeChange(calcType) {
    if (calcType === 'newBenefit') {
      this.calcType = 'newBenefit';
    } else {
      this.calcType = 'currentBenefit';
    }
  }

  isPensionReform(){
    return isEligibleForPensionReform(this.benefitType, this.isLumpsum, this.eligibleForPensionReform)
  }

  isRpa(period: BilingualText) {
    return period.english === WagePeriodType.RPA;
  }

  isRequestSanedPensionReform(){
    return isRequestSaned(this.benefitType,this.eligibleForPensionReform)
  }
}
