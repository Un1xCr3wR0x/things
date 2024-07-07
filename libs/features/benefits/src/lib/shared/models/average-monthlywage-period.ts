/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { MonthlyBenefitAmount } from './monthly-benefit-amount';

export interface AverageMonthlyWagePeriod {
  amwType: BilingualText;
  averageMonthlyWage: number;
  averageMonthlyWageInOldLaw: number;
  averageMonthlyWageInNewLaw: number;
  benefitAmountInOldLaw: number;
  benefitAmountInNewLaw: number;
  benefitAmount: number;
  contributionMonths: number;
  endDate: GosiCalendar;
  monthlyContributoryWages: MonthlyBenefitAmount[];
  noOfNewLawMonths: number;
  noOfOldLawMonths: number;
  period: BilingualText;
  startDate: GosiCalendar;
}
