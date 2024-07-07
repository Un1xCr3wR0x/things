/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export interface ReturnLumpsumPaymentDetails {
  paymentMethod: BilingualText;
  additionalPaymentDetails?: string;
  paymentReferenceNo?: number;
  amountTransferred?: number;
  bankName?: BilingualText;
  bankType?: BilingualText;
  referenceNo?: number;
  transactionDate?: GosiCalendar;
  receiptMode?: BilingualText;
  uuid?: string;
  receiptNumber?: number;
}
