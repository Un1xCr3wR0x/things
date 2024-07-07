/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ThirdPartyBillAllocations } from './third-party-bill-allocations';
import { AllocationSummaryDetails } from './allocation-summary-details';

export class MofAllocationDetails {
  thirdPartyBillAllocations: ThirdPartyBillAllocations[] = [];
  allocationSummaries: AllocationSummaryDetails[] = [];
  creditFromPrevious: number = undefined;
  creditAdjustment: number = undefined;
  totalPayment: number = undefined;
  totalNoOfEstablishments: number = undefined;
  totalDebitAmount: number = undefined;
  totalAllocatedAmount: number = undefined;
}
