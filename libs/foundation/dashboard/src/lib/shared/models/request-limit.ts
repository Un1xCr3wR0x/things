/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RequestLimit {
  pageNo: number = undefined;
  pageSize: number = undefined;
  constructor() {
    this.pageNo = 0;
    this.pageSize = 10;
  }
}
