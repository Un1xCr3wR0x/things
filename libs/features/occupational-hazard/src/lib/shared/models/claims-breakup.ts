/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BreakUp } from './break-up';

export class ClaimsBreakUp {
  claimType: BilingualText = new BilingualText();
  endDate: GosiCalendar = new GosiCalendar();
  startDate: GosiCalendar = new GosiCalendar();
  noOfVisits?: number;
  totalClaims: number;
  breakUpDetails: BreakUp[];
}
