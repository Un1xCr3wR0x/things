/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { CancelContributorDetails, CancelContributorRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CancelContributorService {
  /**
   * This method is to create a service
   * @param http
   */
  constructor(private http: HttpClient) {}

  /**
   * Method to submit the cancel transaction.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  submitCancelContributor(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    cancelContDetails: CancelContributorRequest
  ): Observable<TransactionFeedback> {
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/cancel`;
    return this.http.put<TransactionFeedback>(submitUrl, cancelContDetails);
  }

  /** Method to get cancellation details. */
  getCancellationDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<CancelContributorDetails> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}`;
    return this.http.get<CancelContributorDetails>(url);
  }
  /** Method to get cancellation details. */
  adminRejectTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number,
    comments: string
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}/reject`;
    return this.http.put<BilingualText>(url, { comments: comments });
  }

  /** Method to get cancellation details on 'Agree'. */
  adminApproveTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}/validate`;
    return this.http.get<BilingualText>(url);
  }
}
