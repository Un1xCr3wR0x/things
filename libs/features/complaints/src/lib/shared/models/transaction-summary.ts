/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class TransactionSummary {
  category: BilingualText = new BilingualText();
  createdDate: GosiCalendar = new GosiCalendar();
  completedDate: GosiCalendar = new GosiCalendar();
  description: string = null;
  priority: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  type: BilingualText = new BilingualText();
  subtype: BilingualText = new BilingualText();
  registrationNo: string = null;
  registrationNos: string[] = [];
  transactionRefNo: number = null;
  transactionTraceId: string = null;
  complainant: number = null;
  referenceNo: number = null;
  transactionTitle?: BilingualText = new BilingualText();
  gosiComments: string = null;
  taskId: string = null;
  channel: string = null;
  entryChannel: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  transactionId: number = null;
  isValid: number = 1;
  rightCategory: number = null;
  rightType: number = null;
  rightSubType: number = null;
  constructor() {}
  fromJsonToObject(json: TransactionSummary, transactionSummary: TransactionSummary) {
    Object.keys(json).forEach(key => {
      if (key in new TransactionSummary() && key !== 'priority') {
        transactionSummary[key] = json[key];
      }
    });
  }
}
