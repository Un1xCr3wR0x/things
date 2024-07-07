/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RepaymentDetails, RepayItems } from '.';
import { AdjustmentContributorDetails } from './adjustment-contributor-details';

export class AdjustmentRepaymentValidator {
  contributor: AdjustmentContributorDetails;
  referenceNo: number;
  repayItems: RepayItems[];
  repaymentDetails: RepaymentDetails;
  totalBalanceAmount: number;
  totalPaidAmount: number;
}
