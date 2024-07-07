/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContributorAllocationFilterRequest {
  minBillAmount: number = undefined;
  maxBillAmount: number = undefined;
  minAllocatedAmount: number = undefined;
  maxAllocatedAmount: number = undefined;

  minBalanceAfterAllocation: number = undefined;
  maxBalanceAfterAllocation: number = undefined;
}
