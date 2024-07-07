/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { TerminateContributorDetails, TerminateContributorPayload, TransactionResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TerminateVicService {
  constructor(private http: HttpClient) {}

  /** Method to save vic termination. */
  saveVicTermination(nin: number, engagementId: number, payload: TerminateContributorPayload) {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/terminate`;
    return this.http.put<TransactionResponse>(url, payload);
  }

  /** Method to submit vic termination. */
  submitVicTermination(nin: number, engagementId: number, referenceNo: number, isEdit: boolean, comments: string) {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/termination-request/${referenceNo}/submit`;
    return this.http.put<TransactionFeedback>(url, { comments: comments, editFlow: isEdit });
  }

  /**Method to get terminate vic details */
  getTerminateVicDetails(
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<TerminateContributorDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}`;
    return this.http.get<TerminateContributorDetails>(url);
  }
}
