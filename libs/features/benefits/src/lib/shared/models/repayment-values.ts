/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class RepaymentValues {
  additionalPaymentDetails: string;
  amountTransferred: number;
  bankName: BilingualText;
  bankType: BilingualText;
  paymentMethod: BilingualText;
  paymentReferenceNo: number;
  receiptMode: BilingualText;
  transactionDate: GosiCalendar;
}
