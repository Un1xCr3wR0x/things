/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { CoveragePeriodWrapper } from './coverage-period-wrapper';

export class VicContributionDetails {
  contributionMonths = 0;
  totalContributionMonths = 0;
  numberOfUnPaidMonths = 0;
  refundableCreditBalance = 0;
  contributionDays? = 0;
  totalContributionDays? = 0;
  numberOfUnPaidDays? = 0;
  lastBillPaidDate: GosiCalendar = new GosiCalendar();
  contributionDetails?: CoveragePeriodWrapper = new CoveragePeriodWrapper();
}
