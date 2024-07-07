/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchDetails } from './branch-details';
import { EstablishmentBranchesSummary } from './establishment-branches-summary';

export class BranchDetailsWrapper {
  branchList: BranchDetails[] = [];
  branchStatus: EstablishmentBranchesSummary;
}
