/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { TerminateContributorDetails, TerminateContributorPayload, TerminateContributorResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TerminateContributorService {
  /**
   * This method is to create a service
   * @param http
   */
  constructor(private http: HttpClient) {}

  /**
   * Method to submit the terminate transaction.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  submitTerminateTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    terminationDetails: TerminateContributorPayload
  ): Observable<TerminateContributorResponse> {
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/terminate`;
    return this.http.put<TerminateContributorResponse>(submitUrl, terminationDetails);
  }

  /**
   * Method to get termnation details of the engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  getTerminationDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<TerminateContributorDetails> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}`;
    return this.http.get<TerminateContributorDetails>(url);
  }

  /**
   * Method to terminate all active engagements of the contributor.
   * @param socialInsuranceNo social insurance number
   * @param payload termination details payload
   */
  terminateAllActiveEngagements(
    registrationNo: number,
    socialInsuranceNo: number,
    payload: TerminateContributorPayload
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/terminate`;
    return this.http.put<BilingualText>(url, payload);
  }
  /** Method to reject termination details. */
  adminRejectTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number,
    comments: string
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}/reject`;
    return this.http.put<BilingualText>(url, { comments: comments });
  }
  /** Method to reject termination details. */
  adminApproveTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}/validate`;
    return this.http.get<BilingualText>(url);
  }
}
