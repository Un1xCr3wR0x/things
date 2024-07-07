/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { UnemploymentPeriodDto } from './unemployment-perioddto';
import { AverageMonthlyWagePeriod } from './average-monthlywage-period';
import { BenefitCalculationGuide } from './benefit-calculation-guide';
import { EligibilityMonths } from './eligibility-months';

export interface UnemploymentCalculationDto {
  averageMonthlyContributoryWage: number;
  daysAfterTermination: number;
  initialMonths: UnemploymentPeriodDto;
  remainingMonths: UnemploymentPeriodDto;
  noOfEligibleMonths: number;
  availedMonths: number;
  averageMonthlyWagePeriods: AverageMonthlyWagePeriod;
  isReopen: boolean;
  calculationGuides: BenefitCalculationGuide[];
  eligibleMonths: EligibilityMonths[];
  contributionMonths: number;
}
