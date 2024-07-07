/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BulkWageRequestDetails, BulkWageWorkflowDetails, DownloadCsvParams, BulkWageUpdateResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BulkWageService {
  /** Local variables */
  isAppPrivate: boolean;

  /** Creates an instance of BulkWageService. */
  constructor(private http: HttpClient, @Inject(ApplicationTypeToken) private appToken: string) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Method to download active contributors CSV for wage update */
  downloadActiveContributorsCSV(registrationNo: number, params?: DownloadCsvParams, inWorkflow?: boolean) {
    const url = `/api/v1/establishment/${registrationNo}/wage`;
    const httpParam = {};
    if (params) {
      if (params.filterRequest) {
        if (params.filterRequest.minDate) httpParam['filterCriteria.minDate'] = params.filterRequest.minDate;
        if (params.filterRequest.maxDate) httpParam['filterCriteria.maxDate'] = params.filterRequest.maxDate;
        if (params.filterRequest.minWage) httpParam['filterCriteria.minWage'] = params.filterRequest.minWage;
        if (params.filterRequest.maxWage) httpParam['filterCriteria.maxWage'] = params.filterRequest.maxWage;
        if (params.filterRequest.nationalityList)
          httpParam['filterCriteria.nationalityList'] = params.filterRequest.nationalityList;
      }
      if (params.identifier) httpParam['identifier'] = params.identifier;
      if (params.sortBy && params.sortBy !== 'null') {
        httpParam['sortBy'] = params.sortBy;
        httpParam['sortOrder'] = params.sortOrder ? params.sortOrder : 'ASC';
      }
      if (params.identifierList) httpParam['identifierList'] = params.identifierList;
    }
    if (inWorkflow) httpParam['wageSummaryType'] = 'PENDING';
    return this.http.get(url, { responseType: 'text', params: httpParam });
  }

  /** Method to process bulk wage update */
  processBulkWageUpdate(
    registrationNo: number,
    file: File,
    comments: string,
    editMode: boolean
  ): Observable<BulkWageUpdateResponse> {
    let url = `/api/v1/establishment/${registrationNo}/bulk-wage-request`;
    if (this.isAppPrivate) url += `?isEditFlow=${editMode}`;
    const formData = new FormData();
    formData.append('updatedWageFile', new Blob([file], { type: 'text/csv;charset=utf-8;' }), file.name);
    if (comments) formData.append('comments', comments);
    return this.http.post<BulkWageUpdateResponse>(url, formData);
  }

  /**  Method to get transfer details. */
  getUploadedFileHistory(
    registrationNo: number,
    pageNo?: number,
    pageSize?: number,
    sortOrder?: string,
    transactionStatus?: string
  ): Observable<BulkWageRequestDetails> {
    let url = `/api/v1/establishment/${registrationNo}/bulk-wage-request?`;
    pageNo ? (url += `pageNo=${pageNo - 1}&`) : (url += `pageNo=0&`);
    pageSize ? (url += `pageSize=${pageSize}&`) : (url += `pageSize=10&`);
    sortOrder ? (url += `sortOrder=${sortOrder}&`) : (url += `sortOrder=Desc&`);
    transactionStatus ? (url += `transactionStatus=${transactionStatus}`) : (url += `transactionStatus=History`);
    return this.http.get<BulkWageRequestDetails>(url);
  }

  /** Method to get error report for registration number. */
  getReport(registrationNo: number, requestId: number, isSuccessDownload = false) {
    let url = `/api/v1/establishment/${registrationNo}/bulk-wage-request/${requestId}/report`;
    if (isSuccessDownload) url += `?status=Success`;
    else url += `?status=Failed`;
    return this.http.get(url, { responseType: 'text' }).pipe(catchError(err => throwError(err)));
  }

  /** Method to get bulk wgae workflow details. */
  getBulkWageWorkflowDetails(registrationNo: number, requestId: number): Observable<BulkWageWorkflowDetails> {
    const url = `/api/v1/establishment/${registrationNo}/bulk-wage-request/${requestId}`;
    return this.http.get<BulkWageWorkflowDetails>(url);
  }
}
