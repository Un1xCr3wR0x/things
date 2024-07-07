/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RepayDetails, RepaymentValues } from '.';

export class AdjustmentRepaySetvalues {
  referenceNo: number;
  repayItems: RepayDetails[];
  repaymentDetails: RepaymentValues;
  totalBalanceAmount: number;
  totalPaidAmount: number;
  constructor(
    referenceNo: number,
    repayItems: RepayDetails[],
    repaymentDetails: RepaymentValues,
    totalBalanceAmount: number,
    totalPaidAmount: number
  ) {
    this.referenceNo = referenceNo;
    this.repayItems = repayItems;
    this.repaymentDetails = repaymentDetails;
    this.totalBalanceAmount = totalBalanceAmount;
    this.totalPaidAmount = totalPaidAmount;
  }
}
