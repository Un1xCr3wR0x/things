/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Payment {
  benefitAmount: number;
  paymentStartDate: GosiCalendar;
  paymentEndDate: GosiCalendar;
  status: BilingualText;
  transactionId: number;
  paymentId: number;
  bankAccountNo: number;
  amw: number;
  adjustmentAmount: number;
}
