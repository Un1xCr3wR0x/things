/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CancelContributorDetails, CancelContributorRequest, TransactionResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CancelVicService {
  constructor(private http: HttpClient) {}

  /** Method to save vic cancellation request. */
  saveVicCancellation(
    nin: number,
    engagementId: number,
    payload: CancelContributorRequest
  ): Observable<TransactionResponse> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/cancel`;
    return this.http.put<TransactionResponse>(url, payload);
  }

  /** Method to submit vic cancellation request. */
  submitVicCancellation(
    nin: number,
    engagementId: number,
    referenceNo: number,
    isEdit: boolean,
    comments: string
  ): Observable<TransactionResponse> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/cancellation-request/${referenceNo}/submit`;
    return this.http.put<TransactionResponse>(url, { comments: comments, editFlow: isEdit });
  }
  /**Method to get cancellation details */
  getCancellationDetails(
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<CancelContributorDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}`;
    return this.http.get<CancelContributorDetails>(url);
  }
}
