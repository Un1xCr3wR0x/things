import { AdminBranchFilter } from './admin-branch-filter';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AdminQueryParam {
  includeAllAdmin: boolean = undefined;
  includeSupervisorAdmin: boolean = undefined;
  registrationNo: number;
  branchFilter: AdminBranchFilter = undefined;
  searchParam: string = undefined;
}
