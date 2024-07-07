import { BilingualText, GosiCalendar } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ViolationHistoryList {
  channel: BilingualText;
  dateReported: GosiCalendar;
  paidAmount: number;
  penaltyAmount: number;
  status: BilingualText;
  transactionId: number;
  violationId: number;
  violationType: BilingualText;
  approvedViolationClass: BilingualText;
  violationLetterDate?:GosiCalendar;
}
