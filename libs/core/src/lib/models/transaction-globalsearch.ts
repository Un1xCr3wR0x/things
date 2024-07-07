/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class Transactions {
  createdBy: any;
  createdDate: GosiCalendar = new GosiCalendar();
  lastModifiedBy: any;
  lastModifiedDate: GosiCalendar = new GosiCalendar();
  title: BilingualText = new BilingualText();
  description: BilingualText = new BilingualText();
  transactionRefNo: number = null;
  initiatedDate: GosiCalendar = new GosiCalendar();
  lastActionedDate: GosiCalendar = new GosiCalendar();
  status: BilingualText = new BilingualText();
  stepStatus: BilingualText = new BilingualText();
  channel: BilingualText = new BilingualText();
  registrationNo: number = null;
  transactionId: number = null;
  sin: number = null;
  businessId: number = null;
  taskId: string = null;
  assignedTo: string = null;
  assigneeName: string = null;
  actionedBy: string = null;
  params: TransactionsParams = null;
}

export class TransactionsParams {
    REGISTRATION_NO: any;
    SIN: any;
    NIN: any;
    ENGAGEMENT_ID: any;
}
