/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ContributorFilter } from './contributor-filter';

export class DownloadCsvParams {
  identifier: string | number = undefined;
  filterRequest: ContributorFilter = undefined;
  sortBy: string = undefined;
  sortOrder: string = undefined;
  identifierList: number[] = undefined;

  constructor(
    identifier?: string | number,
    filterReq?: ContributorFilter,
    sortBy?: string,
    sortOrder?: string,
    selectedIds?: number[]
  ) {
    if (identifier) this.identifier = identifier;
    if (filterReq) this.filterRequest = filterReq;
    if (sortBy) this.sortBy = sortBy;
    if (sortOrder) this.sortOrder = sortOrder;
    if (selectedIds) this.identifierList = selectedIds;
  }
}
