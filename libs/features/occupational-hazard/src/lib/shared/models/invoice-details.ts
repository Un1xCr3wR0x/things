/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { ClaimsSummary } from './claims-summary';

export class InvoiceDetails {
  batchId: number;
  batchMonth: GosiCalendar = new GosiCalendar();
  batchMonthString: string;
  batchYear: string;
  previousInvoiceId: number;
  previousBatchTpaCode: string;
  cases: ClaimsSummary[];
  cchiNo: number;
  providerName: BilingualText = new BilingualText();
  requestDate: GosiCalendar = new GosiCalendar();
  tpaId: number;
  tpaName: string;
  type: BilingualText = new BilingualText();
  disabilityAssessment: number;
  inPatientAmount: number;
  noOfOhCases: number;
  outPatientAmount: number;
  totalMedAmount: number;
  totalServiceAmount: number;
  diagnosis: string;
}
