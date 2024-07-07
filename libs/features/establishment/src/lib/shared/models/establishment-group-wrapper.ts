/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchStatus } from './branch-status';
import { EstablishmentGroup } from './establishment-group';

export class EstablishmentGroupWrapper {
  branchList: EstablishmentGroup[] = [];
  branchStatus: BranchStatus = new BranchStatus();
}
