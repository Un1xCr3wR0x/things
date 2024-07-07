/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { VicEngagementPayload, VICEngagementResponse, VicWageUpdateDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VicWageUpdateService {
  constructor(private http: HttpClient) {}

  /** Method to update vic wage. */
  updateVicWage(
    nin: number,
    engagementId: number,
    engagement: VicEngagementPayload
  ): Observable<VICEngagementResponse> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/wage-update-request`;
    return this.http.put<VICEngagementResponse>(url, engagement.engagementPeriod);
  }

  /** Method to submit VIC wage update. */
  submitVicWageUpdate(
    nin: number,
    engagementId: number,
    referenceNo: number,
    comments: string
  ): Observable<TransactionFeedback> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/wage-update-request/${referenceNo}/submit`;
    return this.http.put<TransactionFeedback>(url, { comments: comments });
  }

  /**Method to get workflow details */
  getVicWageUpdateDetails(
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<VicWageUpdateDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request/${referenceNo}`;
    return this.http.get<VicWageUpdateDetails>(url);
  }
}
