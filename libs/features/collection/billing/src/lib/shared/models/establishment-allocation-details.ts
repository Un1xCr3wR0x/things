/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchBreakup } from './branch-breakup';

export class EstablishmentAllocationDetails {
  receiptAmount: number = undefined;
  allocatedAmount: number = undefined;
  unAllocatedAmount: number = undefined;
  branchAmount: BranchBreakup[] = [];
  noOfRecords: number = undefined;
}
