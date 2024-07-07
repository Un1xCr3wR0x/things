/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BreakUp } from './break-up';

export class AllowanceBreakUp {
  allowanceType: BilingualText = new BilingualText();
  endDate: GosiCalendar = new GosiCalendar();
  startDate: GosiCalendar = new GosiCalendar();
  noOfVisits?: number;
  differenceinDay?: number;
  totalAllowance: number;
  breakUpDetails: BreakUp[];
  oldContributorWage: string = undefined;
  newContributorWage: string = undefined;
}
