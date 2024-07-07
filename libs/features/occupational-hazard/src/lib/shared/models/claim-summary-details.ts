/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { ClaimPaymentsummary } from './claim-payment-summary';

export class ClaimSummaryDetails {
  claimNo: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  injuryNo: number = undefined;
  medicine: ClaimPaymentsummary;
  requestComments: string;
  ohId: number = undefined;
  ohType: number = undefined;
  regNo: number = undefined;
  service: ClaimPaymentsummary;
  sin: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
}
