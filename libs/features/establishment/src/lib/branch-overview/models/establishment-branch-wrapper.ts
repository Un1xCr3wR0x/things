/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BranchStatus } from './branch-status';
import { BranchList } from './branch-list';

export class EstablishmentBranchWrapper {
  branchList: BranchList[];
  branchStatus: BranchStatus;

  /**
   * Initialize values inside constructor
   */
  constructor() {
    this.branchList = [];
    this.branchStatus = new BranchStatus();
  }
}
