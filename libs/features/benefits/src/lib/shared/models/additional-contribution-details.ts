/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributionPlan } from './contribution-plan';
import { GosiCalendar } from '@gosi-ui/core';

export interface AdditionalContributionDetails {
  additionalContributionAmount: number;
  contributionPlans: ContributionPlan[];
  additionalContributionMonths: number;
  deductionAmount: number;
  deductionPercent: number;
  endDate: GosiCalendar;
  paymentAmount: number;
  recoveryPeriodMonths: number;
  startDate: GosiCalendar;
}
