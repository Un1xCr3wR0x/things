/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class AppealOnViolationDetailsResponse {
  appealId: number;
  objector: number;
  reason: string;
  refNumber: number;
  status: BilingualText;
  transactionRefNumber: number;
  transactionSource: BilingualText;
  type: number;
  againstTitle: BilingualText;
  title: BilingualText;
  createdDate: GosiCalendar;
  againstTransactionId: number;
  decisionStatus: BilingualText;
  decisions: Decision[];
}

export class Decision {
  contributorDocuments: string[];
  reason: string;
  contributorId: number;
}
