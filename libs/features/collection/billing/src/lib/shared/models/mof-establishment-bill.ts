/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from '@gosi-ui/core';
import { MofEstablishmentBreakup } from './mof-establishment-breakup';
import { BillSummary } from './bill-summary';
import { BillBreakup } from './bill-breakup';

export class MofEstablishmentBill {
  balanceDue: number = undefined;
  billNumber: number = undefined;
  dueDate: GosiCalendar = new GosiCalendar();
  issueDate: GosiCalendar = new GosiCalendar();
  totalMOFContribution: BillSummary[] = [];
  mofEstablishmentDetails: MofEstablishmentBreakup[] = [];
  billBreakUp: BillBreakup = new BillBreakup();
  lateFee: number = undefined;
}
