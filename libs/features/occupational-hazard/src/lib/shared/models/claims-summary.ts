/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { ReceiveClarification } from './receive-clarification';

export class ClaimsSummary {
  claimNo: number;
  discount: number;
  diagnosis: string;
  daysDiff?: number;
  endDate: GosiCalendar = new GosiCalendar();
  injuryNo: number;
  invoiceId: number;
  invoiceItemId: number;
  payableAmount: number;
  workItemReadStatus: boolean;
  medicine: number;
  ohId: number;
  ohType: number;
  regNo: number;
  service: number;
  sin: number;
  startDate: GosiCalendar = new GosiCalendar();
  totalAmount: number;
  vat: number;
  policyDeduction: number;
  medicalDeduction: number;
  isViewed: Boolean;
  receiveClarification: ReceiveClarification[] = [];
}
