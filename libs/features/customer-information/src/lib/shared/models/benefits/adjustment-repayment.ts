/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AdjustmentContributor } from './adjustment-contributor';
import { RepayDetails } from './repay-details';
import { RepaymentValues } from './repayment-values';

export class AdjustmentRepayment {
  contributor: AdjustmentContributor;
  referenceNo: number;
  repayItems: RepayDetails[];
  repaymentDetails: RepaymentValues;
  totalBalanceAmount: number;
  totalPaidAmount: number;
}
