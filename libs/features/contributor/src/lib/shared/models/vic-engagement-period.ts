/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class VicEngagementPeriod {
  basicWage: number = undefined;
  occupation: BilingualText = new BilingualText();
  contributionAmount: number = undefined;
  wageCategory: number = undefined;
  coverageTypes: BilingualText[] = [];
  editFlow?: boolean;
  startDate?: GosiCalendar = new GosiCalendar();
  applicableFromDate?: GosiCalendar = new GosiCalendar();
  isCurrentPeriod: boolean = undefined;
  status: string = undefined;
  monthlyContributoryWage: number = undefined;
}
