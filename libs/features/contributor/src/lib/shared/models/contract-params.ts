/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContractParams {
  engagementId: number = undefined;
  status: string = undefined;
  contractId: number = undefined;
  pageSize: number = undefined;
  pageNo: number = undefined;

  constructor(engagementId: number, status: string, contractId: number, pageSize?: number, pageNo?: number) {
    if (engagementId) this.engagementId = engagementId;
    if (status) this.status = status;
    if (contractId) this.contractId = contractId;
    if (pageNo !== undefined && pageNo !== null) this.pageNo = pageNo;
    if (pageSize !== undefined && pageSize !== null) this.pageSize = pageSize;
  }
}
