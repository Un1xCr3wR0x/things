/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';
import { TransactionParams } from './transaction-params';

export class Transaction {
  transactionRefNo: number = null;
  title: BilingualText = new BilingualText();
  description: BilingualText = new BilingualText();
  contributorId: number = null;
  establishmentId: number = null;
  initiatedDate: GosiCalendar = new GosiCalendar();
  lastActionedDate: GosiCalendar = new GosiCalendar();
  status: BilingualText = new BilingualText();
  stepStatus: BilingualText = new BilingualText();
  channel: BilingualText = new BilingualText();
  transactionId: number = null;
  registrationNo: number = null;
  sin: number = null;
  businessId: number = null;
  taskId: string = null;
  assignedTo: string = null;
  assigneeName: string = null;
  params: TransactionParams = null;
  pendingWith: BilingualText = new BilingualText();
  idParams = new Map();
  canRequestReview? : boolean = false;
  canAppeal? : boolean =  false;
  requestClarification? = false;
  pendingViolation?: string[] = [];
  IsReopenTransaction?: boolean = false;
  hasItsm?: boolean = false;
  itsmStatus?: string = null;
  fromJsonToObject(json) {
    if (!json) return null;
    Object.keys(new Transaction()).forEach(key => {
      if (key in json) {
        if (key === 'params' && json[key]) {
          this[key] = json[key];
          const params = json.params;
          Object.keys(params).forEach(paramKey => {
            this.idParams.set(paramKey, params[paramKey]);
          });
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
