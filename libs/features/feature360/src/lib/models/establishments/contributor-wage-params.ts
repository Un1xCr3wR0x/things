/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorFilter } from './contributor-filter';

export class ContributorWageParams {
  includeWageInfo: boolean = undefined;
  countRequired: boolean = undefined;
  filterRequest: ContributorFilter = undefined;
  status: string = undefined;
  identifier: string | number = undefined;
  sortBy: string = undefined;
  sortOrder: string = undefined;
  pageNo: number = undefined;
  pageSize: number = undefined;

  constructor(
    includeWageInfo: boolean,
    countRequired: boolean,
    status: string,
    pageNo?: number,
    pageSize?: number,
    identifier?: string | number,
    filterReq?: ContributorFilter,
    sortBy?: string,
    sortOrder?: string
  ) {
    if (includeWageInfo !== undefined && includeWageInfo !== null) this.includeWageInfo = includeWageInfo;
    if (countRequired !== undefined && countRequired !== null) this.countRequired = countRequired;
    if (status) this.status = status;
    if (identifier) this.identifier = identifier;
    if (sortBy) this.sortBy = sortBy;
    if (sortOrder) this.sortOrder = sortOrder;
    if (pageNo !== undefined && pageNo !== null) this.pageNo = pageNo;
    if (pageSize !== undefined && pageSize !== null) this.pageSize = pageSize;
    if (filterReq) this.filterRequest = filterReq;
  }
}
