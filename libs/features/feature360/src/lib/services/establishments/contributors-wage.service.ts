/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContributorWageDetailsResponse } from '../../models/establishments/contributor-wage-details-response';
import { ContributorWageParams } from '../../models/establishments/contributor-wage-params';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is to handle http api calls
 */
export class ContributorsWageService {
  /**
   * This method is to initialize ContributorsWageService class
   * @param http
   */
  constructor(readonly http: HttpClient) {}

  /** Method to assemble http params. */
  assembleHttpParams(params: ContributorWageParams, paginationRequired: boolean) {
    const httpParam = {};
    if (params.includeWageInfo !== undefined && params.includeWageInfo !== null)
      httpParam['includeWageInfo'] = params.includeWageInfo;
    if (params.countRequired !== undefined && params.countRequired !== null)
      httpParam['queryForCount'] = params.countRequired;
    if (params.filterRequest) {
      if (params.filterRequest.minDate) httpParam['filterCriteria.minDate'] = params.filterRequest.minDate;
      if (params.filterRequest.maxDate) httpParam['filterCriteria.maxDate'] = params.filterRequest.maxDate;
      if (params.filterRequest.minWage) httpParam['filterCriteria.minWage'] = params.filterRequest.minWage;
      if (params.filterRequest.maxWage) httpParam['filterCriteria.maxWage'] = params.filterRequest.maxWage;
      if (params.filterRequest.nationalityList)
        httpParam['filterCriteria.nationalityList'] = params.filterRequest.nationalityList;
    }
    if (params.status) httpParam['status'] = params.status;
    if (params.identifier) httpParam['identifier'] = params.identifier;
    if (params.sortBy && params.sortBy !== 'null') {
      httpParam['sortBy'] = params.sortBy;
      httpParam['sortOrder'] = params.sortOrder ? params.sortOrder : 'ASC';
    }
    if (paginationRequired) {
      httpParam['pageNo'] = params.pageNo ? params.pageNo - 1 : 0;
      httpParam['pageSize'] = params.pageSize ? params.pageSize : 10;
    }
    return httpParam;
  }

  /** Method to get contributor list. */
  getContributorList(registrationNo: number, params: ContributorWageParams, paginationRequired: boolean) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/fetch`;
    const httpParam = this.assembleHttpParams(params, paginationRequired);
    return this.http.get<ContributorWageDetailsResponse>(url, { params: httpParam });
  }
}
