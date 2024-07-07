/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ContributorCountDetails {
  totalContributors: number = undefined;
  transferable: number = undefined;
  nonTransferable: number = undefined;

  constructor(total: number, transferable: number) {
    this.totalContributors = total;
    this.transferable = transferable;
    this.nonTransferable = total - transferable;
  }
}
