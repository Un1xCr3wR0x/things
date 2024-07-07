/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FilterDate } from '@gosi-ui/features/establishment';
import { ContributorFilter } from './contributor-filter';
import { BilingualText } from '@gosi-ui/core';
import { ContributorDetailsFilter } from './contributor-details-filter';

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
  filterContributorRequest:ContributorDetailsFilter=undefined;
  joiningDate: FilterDate = new FilterDate();
  leavingDate: FilterDate = new FilterDate();
  gender: BilingualText = new BilingualText();
  nationalityList: BilingualText[] = undefined;
  occupationList:  BilingualText[] = undefined;
  wageRangeStart:number;
  wageRangeEnd:number;

  constructor(
    includeWageInfo: boolean,
    countRequired: boolean,
    status: string,
    pageNo?: number,
    pageSize?: number,
    identifier?: string | number,
    filterReq?: ContributorFilter,
    sortBy?: string,
    sortOrder?: string,
    filterContributorRequest?:ContributorDetailsFilter,
    joiningDate?: FilterDate,
    leavingDate?: FilterDate,
    gender?: BilingualText ,
    nationalityList?: Array<BilingualText>,
    occupationList?: Array<BilingualText>,
    wageRangeStart?:number,
    wageRangeEnd?:number,
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
    if (filterContributorRequest) this.filterContributorRequest = filterContributorRequest;
    if ( joiningDate ) this.joiningDate=joiningDate;
    if ( leavingDate ) this.leavingDate=leavingDate;
    if ( gender ) this.gender=gender;
    if ( nationalityList ) this.nationalityList=nationalityList;
    if ( occupationList ) this.occupationList=occupationList;
    if ( wageRangeStart ) this.wageRangeStart=wageRangeStart;
    if ( wageRangeEnd ) this.wageRangeEnd=wageRangeEnd;
  }
}
