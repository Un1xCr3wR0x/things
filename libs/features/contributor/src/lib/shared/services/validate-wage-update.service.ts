/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdatedWageListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is to handle http api calls
 */
export class ValidateWageUpdateService {
  /**
   * This method is to initialize ContributorsWageService class
   * @param http
   */
  constructor(readonly http: HttpClient) {}

  /**
   * This method is to update wage details of the list of contributors and return filtered obervable with error only
   * @param data
   * @param regNo
   */
  getOccupationAndWageDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<UpdatedWageListResponse> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request/${referenceNo}`;
    return this.http.get<UpdatedWageListResponse>(url);
  }
}
