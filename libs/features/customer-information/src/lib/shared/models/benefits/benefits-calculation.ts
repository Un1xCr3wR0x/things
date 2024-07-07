/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AverageMonthlyWagePeriod } from './average-monthlywage-period';
import { BenefitCalculationGuide } from './benefit-calculation-guide';

export interface BenefitCalculation {
  averageMonthlyContributoryWage: Number;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod;
  calculationGuides: BenefitCalculationGuide[];
  totalBenefitAmount: 0;
  totalContributionMonths: 0;
}
