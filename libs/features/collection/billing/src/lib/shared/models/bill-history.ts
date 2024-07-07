/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { BillSummary } from './bill-summary';

export class BillHistory {
  breakUp: BillSummary[] = [];
  issueDate: GosiCalendar = new GosiCalendar();
  allocationInd: boolean;
  billNumber: number;
  billPeriod: BilingualText = new BilingualText();
  totalAmount: null;
  reditBalance: null;
  rejectedOhInd: null;
  adjustmentInd: null;
  migratedBill: boolean;
  droppedMonth: boolean;
  violationInd: null;
  paymentStatus: null;
  settlementDate: null;
  requiredMinPayment: null;
  installmentComplianceInd: null;
}
