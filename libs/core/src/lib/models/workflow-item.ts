/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';
import { TransactionReferenceData } from './transaction-reference-data';

export class WorkflowItem {
  type: string = undefined;
  status: string = undefined;
  message: BilingualText = new BilingualText();
  oldValue: string = undefined;
  newValue: string = undefined;
  transactionData: TransactionReferenceData[];
  referenceNo?: number = undefined;
  submissionDate?: GosiCalendar = new GosiCalendar();
  bankName?: BilingualText;
  expiryDate?: GosiCalendar;
  issueDate?: GosiCalendar;
}
