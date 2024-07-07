/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class AccountDetails {
  accountReasonDescription: BilingualText = new BilingualText();
  accountReasonCode: number = undefined;
  creditAmount: number = undefined;
  transactionDate: GosiCalendar = new GosiCalendar();
  chequeMailedDate: GosiCalendar = new GosiCalendar();
  receiptDate: GosiCalendar = new GosiCalendar();
}
