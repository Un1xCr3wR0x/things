/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TransactionHistoryDetails {
  transactions: TransactionsDetails[];
}
export class TransactionsDetails {
  initiatedDate: GosiCalendar;
  status: BilingualText;
  transactionId: Number;
  transactionRefNo: Number;
  transactionType: BilingualText;
}
