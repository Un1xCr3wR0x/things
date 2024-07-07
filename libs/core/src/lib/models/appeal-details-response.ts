/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorDetail } from '../../../../features/violations/src/lib/shared/models/contributor-detail';
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class AppealDetailsResponse {
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
  decisions: ContributorDetail[];
}

export class PsFeaturesModel {
  Features: string[];
  Message: BilingualText;
  ReturnCode: Number;
  ValidationErrorMessage: BilingualText[];
}
