/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';

export interface AdditionalContributionResponse {
  additionalContributionAmount: number;
  deductionAmount: number;
  additionalContributionMonths: number;
  deductionPercent: number;
  endDate: GosiCalendar;
  startDate: GosiCalendar;
  paymentAmount: number;
  recoveryPeriodMonths: number;
}
