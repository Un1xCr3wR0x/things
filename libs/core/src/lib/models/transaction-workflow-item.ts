import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/*
 * This method is used as model for transaction workflow data
 */
export class TransactionWorkflowItem {
  approverName: BilingualText = new BilingualText();
  approverRole: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  date: GosiCalendar = null;
  display: boolean = null;
  actionedBy: string = null;
  assigneeName: string = null;
  isProfileLoading = false;
}

export class TransactionWorkflowLineItem {
  status: BilingualText;
  role: BilingualText;
}

export class TransactionWorkList {
  status: BilingualText;
  role: BilingualText;
  userId: string;
  actionDate: Date;
}

export class TransactionTrace {
  listOfStatus: TransactionWorkflowLineItem[] = [];
  transactionWorkLists: TransactionWorkList[] = [];
}

export class TransactionWorkflowDetails {
  transactionList: TransactionWorkflowItem[] = [];
  workFlowList: TransactionWorkflowItem[] = [];
}
