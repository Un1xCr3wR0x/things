/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchFilterResponse } from './branch-filter-response';
import { BranchStatus } from './branch-status';
import { BranchList } from './establishment-branch-list';

export class EstablishmentBranchWrapper {
  branchList: BranchList[] = [];
  branchStatus: BranchStatus = new BranchStatus();
  filter: BranchFilterResponse;
}
