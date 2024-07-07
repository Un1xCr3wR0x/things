/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export interface MonthlyBenefitAmount {
  amount: number;
  endDate: GosiCalendar;
  noOfMonths: number;
  startDate: GosiCalendar;
  adjustmentAmount?: number;
}
