/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export interface TransactionReference {
  bilingualComments: BilingualText[];
  comments: string;
  createdDate: GosiCalendar;
  referenceNo: number;
  rejectionReason: BilingualText;
  returnReason: BilingualText;
  role: BilingualText;
  transactionStepStatus: string;
  transactionStatus: string;
  transactionType: string;
  userName: BilingualText;
}
