/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BillBreakup } from './bill-breakup';
import { GosiCalendar, Name } from '@gosi-ui/core';
import { BillSummary } from './bill-summary';
import { UnBillAmount } from './un-bill-amount';
import { CreditRefundDetails } from './credit-refund-details';

export class BillDetails {
  adjustedCreditBalance: number = undefined;
  ameenStartDate: GosiCalendar = new GosiCalendar();
  ameenReleaseDate?: GosiCalendar = new GosiCalendar();
  balanceDue: number = undefined;
  billBreakUp: BillBreakup = new BillBreakup();
  billNo: number = undefined;
  creditAmountFromApplyDate: number = undefined;
  carryForwardAmount: number = undefined;
  currentBill: number = undefined;
  dueDate: GosiCalendar = new GosiCalendar();
  lastBillEndDate: GosiCalendar = new GosiCalendar();
  issueDate: GosiCalendar = new GosiCalendar();
  paidAmount: number = undefined;
  previousBill: number = undefined;
  installmentAmount: number = undefined;
  summary: BillSummary[] = [];
  lateFee: number = undefined;
  amountTransferredToMof: number = undefined;
  initialBillStartDate: GosiCalendar = new GosiCalendar();
  previousMonthDues: number = undefined;
  downPaymentAmount: number = undefined;
  unBilledAmount: UnBillAmount = new UnBillAmount();
  unallocatedBalance: number = undefined;
  totalContribution: number = undefined;
  totalDebitAdjustment: number = undefined;
  mofCurrentBalanceGosi: number = undefined;
  mofCurrentBalancePpa: number = undefined;
  totalCreditAdjustment: number = undefined;
  totalReceiptsAndCredits: number = undefined;
  totalLateFee: number = undefined;
  noOfPaidContribution?: number = undefined;
  noOfDelayedPayments?: number = undefined;
  name: Name = undefined;
  deductionRate?: number = undefined;
  contributoryWage?: number = undefined;
  adjustmentContributoryWage?: number = undefined;
  adjustmentContribution?: number = undefined;
  billStartDate: GosiCalendar = new GosiCalendar();
  latestBillStartDate: GosiCalendar = new GosiCalendar();
  creditBalanceTransferredOrRefunded: number = undefined;
  creditBalanceRefunded: number = undefined;
  creditRefundDetails: CreditRefundDetails = new CreditRefundDetails();
  totalCreditRefund: number = undefined;
  minimumPaymentRequired: number = undefined;
  minimumPaymentRequiredForMonth: number = undefined;
  migratedBill: boolean;
  overAllPaidContribution: number = undefined;
  ppaEffectiveDate: GosiCalendar = new GosiCalendar();
  reactivateFlag: boolean;
}
