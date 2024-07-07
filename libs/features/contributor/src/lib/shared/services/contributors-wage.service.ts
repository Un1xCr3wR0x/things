/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContributorWageDetailsResponse, ContributorWageParams, UpdateWageRequest } from '../models';
import { UpdateWageResponse } from '../models/update-wage-response';
import { BilingualText } from '@gosi-ui/core';
import { ContributorTransferableListResponse } from '../models/contributorTransferableListResponse';

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

  /**
   * This method is used to get contributor wage details
   *
   * @param registrationNo
   * @param identifier
   * @param pageNo
   * @param pageSize
   */
  getContributorWageDetails(
    registrationNo: number,
    params: ContributorWageParams,
    paginationRequired: boolean
  ): Observable<ContributorWageDetailsResponse> {
    const url = `/api/v1/establishment/${registrationNo}/contributor`;
    const httpParam = this.assembleHttpParams(params, paginationRequired);
    return this.http.get<ContributorWageDetailsResponse>(url, { params: httpParam });
  }

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
      if (params.filterRequest.minWage ) httpParam['filterCriteria.minWage'] = params.filterRequest.minWage;
      if (params.filterRequest.maxWage ) httpParam['filterCriteria.maxWage'] = params.filterRequest.maxWage;
      this.checkForZeroWageValue(params.filterRequest,httpParam);
      if (params.filterRequest.nationalityList)
        httpParam['filterCriteria.nationalityList'] = params.filterRequest.nationalityList;
    
    if(params.filterRequest.occupationList) httpParam['filterCriteria.occupation'] = params.filterRequest.occupationList;
    if(params.filterRequest.engMinStartDate) httpParam['filterCriteria.engagementStartDate']=params.filterRequest.engMinStartDate;
    if(params.filterRequest.engMaxStartDate) httpParam['filterCriteria.engagementEndDate']=params.filterRequest.engMaxStartDate;
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
  checkForZeroWageValue(filterParams,httpParam){
    if(filterParams?.minWage !== null){
      let minWage= parseInt(filterParams.minWage);
      if(minWage === 0){
        httpParam['filterCriteria.minWage'] = filterParams.minWage;
      }
    }
    if(filterParams?.maxWage !== null){
      let maxWage= parseInt(filterParams.maxWage);
      if(maxWage === 0){
        httpParam['filterCriteria.maxWage'] = filterParams.maxWage;
      }
    }
  }

  /**
   * This method is to update wage details of the list of contributors and return filtered obervable with error only
   * @param data
   * @param regNo
   */
  updateContributorWageDetailsList(data: UpdateWageRequest[], regNo: number): Observable<UpdateWageResponse> {
    const url = `/api/v1/establishment/${regNo}/bulk-wage`;
    return this.http.patch<UpdateWageResponse>(url, data);
  }

  /** Method to get contributor list. */
  getContributorList(registrationNo: number, params: ContributorWageParams, paginationRequired: boolean) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/fetch`;
    const httpParam = this.assembleHttpParams(params, paginationRequired);
    return this.http.get<ContributorWageDetailsResponse>(url, { params: httpParam });
  }
  getContributorFilterList(registrationNo: number, params: ContributorWageParams, paginationRequired: boolean, status ?:String){
    let url=`/api/v1/establishment/${registrationNo}/contributor/fetch?`;

    if (status ){
      url += `&status=${status}`;
    }
    if (paginationRequired) {
      const pageNo=params.pageNo ? params.pageNo - 1 : 0;
      const pageSize=params.pageSize ? params.pageSize : 10;
      url += `&pageNo=${pageNo}&pageSize=${pageSize}`;
    }

    if (params.includeWageInfo !== undefined && params.includeWageInfo !== null){
      url += `&includeWageInfo=${params.includeWageInfo}`;
    }

    if (params.countRequired !== undefined && params.countRequired !== null){
      url += `&queryForCount=${params.countRequired}`;
    }
    // contributor filter fields
    if(params.joiningDate.fromDate && params.joiningDate.toDate){
      url += `&filterCriteria.engagementStartDate=${params.joiningDate.fromDate}&filterCriteria.engagementEndDate=${params.joiningDate.toDate}`;
    }
    if(params.leavingDate.fromDate && params.leavingDate.toDate){
      url += `&filterCriteria.engLeavingStart=${params.leavingDate.fromDate}&filterCriteria.engLeavingEnd=${params.leavingDate.toDate}`;
    }
    if (params.gender != undefined && params.gender != null) {

        url += `&filterCriteria.genders=${params.gender}`
        //console.log('gender',params.gender);
        

    }
    if (params.nationalityList && params.nationalityList.length > 0) {
      params.nationalityList.map((value: BilingualText) => {
        url += `&filterCriteria.nationalityList=${value.english}`;
      });
    }
    if (params.occupationList && params.occupationList.length > 0) {
      params.occupationList.map((value: BilingualText) => {
        url += `&filterCriteria.occupation=${value.english}`;
      });
    }
    if(params.wageRangeStart != undefined && params.wageRangeEnd != undefined){
      url += `&filterCriteria.maxWage=${params.wageRangeEnd}&filterCriteria.minWage=${params.wageRangeStart}`
    }
    return this.http.get<ContributorWageDetailsResponse>(url);

  }
    /** Method to get contributor list. */
    getContributorTransferableList(registrationNo: number, params: ContributorWageParams, paginationRequired: boolean) {
      const url = `/api/v1/establishment/${registrationNo}/transferable-engagements`;
      const httpParam = this.assembleHttpParamsTransfer(params, paginationRequired);
      return this.http.get<ContributorTransferableListResponse>(url, { params: httpParam });

    }

    getTransferMultipleContributorDetails(registrationNo: number, requestId: number, params: ContributorWageParams, paginationRequired: boolean): Observable<ContributorTransferableListResponse> {
      let url = `/api/v1/establishment/${registrationNo}/transfer-request/${requestId}/engagements`;
      const httpParam = this.assembleHttpParamsTransfer(params, paginationRequired);
      return this.http.get<ContributorTransferableListResponse>(url, { params: httpParam });
    }

      /** Method to assemble http params. */
  assembleHttpParamsTransfer(params: ContributorWageParams, paginationRequired: boolean) {
    const httpParam = {};
    if (params.filterContributorRequest) {
      if (params.filterContributorRequest.joiningDate.fromDate) httpParam['periodStartDate'] = params.filterContributorRequest.joiningDate.fromDate;
      if (params.filterContributorRequest.joiningDate.toDate) httpParam['periodEndDate'] = params.filterContributorRequest.joiningDate.toDate;
    }
    if (params.identifier) httpParam['searchKey'] = params.identifier;
    if (paginationRequired) {
      httpParam['pageNo'] = params.pageNo ? params.pageNo - 1 : 0;
      httpParam['pageSize'] = params.pageSize ? params.pageSize : 10;
    }
    return httpParam;
  }


}
