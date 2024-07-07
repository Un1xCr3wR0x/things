import { RepayItems, RepaymentDetails } from '.';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AdjustmentRepayValidatorSetValues {
  referenceNo: number;
  repayItems: RepayItems[];
  repaymentDetails: RepaymentDetails;
  totalBalanceAmount: number;
  totalPaidAmount: number;
  adjustmentRepayId?: number;
  constructor(
    referenceNo: number,
    repayItems: RepayItems[],
    repaymentDetails: RepaymentDetails,
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
