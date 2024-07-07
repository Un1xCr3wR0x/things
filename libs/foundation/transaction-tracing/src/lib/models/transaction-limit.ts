/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TransactionLimit {
  pageNo: number = undefined;
  size: number = undefined;

  constructor() {
    this.pageNo = 0;
    this.size = 10;
  }
}
