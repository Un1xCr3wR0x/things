/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { FlagDetails, FlagRequest, FlagQueryParam } from '../models';
import { Observable } from 'rxjs';
import { TransactionFeedback } from '@gosi-ui/core';
import { getParams } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class FlagEstablishmentService {
  constructor(readonly http: HttpClient) {}

  /**
   * Local variables
   */
  registrationNo: number;
  flagType: string;

  /**
   * Method to get the flag details
   * @param regNo
   */
  getFlags(regNo: number): Observable<FlagDetails[]> {
    const params = new FlagQueryParam();
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/establishment/${regNo}/flag`;
    return this.http.get<FlagDetails[]>(url, { params: httpParams });
  }

  /**
   * Method to add flag
   * @param registrationNo
   * @param flagRequest
   */
  saveFlagDetails(registrationNo: number, flagRequest: FlagRequest): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/flag`;
    return this.http.post<TransactionFeedback>(url, flagRequest);
  }

  /**
   * Mathod to get the flag details based on the parameters passed
   * @param queryParams
   * @param registrationNo
   */
  getFlagDetails(registrationNo: number, params: FlagQueryParam): Observable<FlagDetails[]> {
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/establishment/${registrationNo}/flag`;
    return this.http.get<FlagDetails[]>(url, { params: httpParams });
  }

  saveModifiedFlagDetails(
    registrationNo: number,
    flagRequest: FlagRequest,
    flagId: number
  ): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/flag/${flagId}`;
    return this.http.put<TransactionFeedback>(url, flagRequest);
  }
}
