/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export interface ContributionPlan {
  deductionAmount: number;
  deductionPercentage: number;
  recoveryPeriodMonths: number;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  paymentAmount: number;
}
