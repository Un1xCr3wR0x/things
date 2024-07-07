/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class BranchStatus {
  activeEstablishments: number = undefined;
  openingInProgress: number = undefined;
  closingInProgress: number = undefined;
  closedEstablishments: number = undefined;
  gccEstablishments: number = undefined;
  proactiveEstablishments: number = undefined;
  isFailure? = false;
  totalBranches?: number = undefined;
  proactiveStatusPending? = 0;
}
