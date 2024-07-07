import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BranchDetailsWrapper {
  branchList: BranchList[] = [];
}

export class BranchList {
  name: BilingualText = new BilingualText();
  registrationNo: number;
  noOfBranches: number;
  status: BilingualText = new BilingualText();
}
