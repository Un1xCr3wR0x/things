/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from './gosi-calendar';
import { BilingualText } from './bilingual-text';
import { DocumentItem } from './document';

/**
 * This method is used as model for transaction referene data
 */
export class TransactionReferenceData {
  referenceNo: number;
  createdDate: GosiCalendar;
  transactionType: string;
  bilingualComments?: BilingualText[];
  comments?: string;
  rejectionReason?: BilingualText;
  returnReason?: BilingualText;
  reopenReason?: BilingualText;
  ticketNumber?: String;
  ticketStatus?: String;
  transactionStepStatus?: string;
  transactionStatus: string = undefined;
  role: BilingualText;
  userName: BilingualText;
  receiveComments?: string;
  sid?: number;
  tpaName?: string;
  tpaRole?: string;
  documents?: DocumentItem[];
  serviceId?: [];
  allowanceId?: [];
  receivedDate?: GosiCalendar;
  resolverComment?: ListItems[] = [];

  constructor() {
    this.role = new BilingualText();
    this.userName = new BilingualText();
  }
}

export class ListItems{
  itsmResolverComment: string;
  createdDate: GosiCalendar = new GosiCalendar();
}


