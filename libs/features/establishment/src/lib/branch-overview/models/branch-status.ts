/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BranchStatus {
  activeEstablishments: number;
  openingInProgress: number;
  closingInProgress: number;

  /**
   * Creates an instance of BranchStatus
   * @memberof BranchStatus
   */
  constructor() {
    this.activeEstablishments = 0;
    this.openingInProgress = 0;
    this.closingInProgress = 0;
  }
}
