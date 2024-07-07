/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  HealthRecordDetails,
  PersonalInformation,
  SaveVicPersonResponse,
  VicEngagementDetails,
  VicEngagementPayload,
  VICEngagementResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AddVicService {
  constructor(private http: HttpClient) {}

  /** Method to save VIC person details. */
  saveVICPerson(person: PersonalInformation): Observable<SaveVicPersonResponse> {
    const url = `/api/v1/vic`;
    return this.http.post<SaveVicPersonResponse>(url, person);
  }

  /** Method to update VIC person details. */
  updateVICPerson(person: PersonalInformation, nin: number, params? :HttpParams) {
    const url = `/api/v1/vic/${nin}`;
    return this.http.put(url, person,{ params });
  }

  /** Method to save health record details. */
  saveHealthRecordDetails(
    nin: number,
    engagementId: number,
    healthRecords: HealthRecordDetails[]
  ): Observable<TransactionFeedback> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/health-record`;
    return this.http.put<TransactionFeedback>(url, { healthRecords: healthRecords });
  }

  /** Method to save VIC engagement. */
  saveVicEngagement(nin: number, engagement: VicEngagementPayload): Observable<VICEngagementResponse> {
    const url = `/api/v1/vic/${nin}/engagement`;
    return this.http.post<VICEngagementResponse>(url, engagement);
  }

  /** Method to update vic engagement. */
  updateVicEngagement(
    nin: number,
    engagementId: number,
    engagement: VicEngagementPayload
  ): Observable<VICEngagementResponse> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}`;
    return this.http.put<VICEngagementResponse>(url, engagement);
  }

  /** Method to submit VIC registration. */
  submitVicRegistration(nin: number, engagementId: number, comments: string): Observable<TransactionFeedback> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/submit`;
    return this.http.put<TransactionFeedback>(url, { comments: comments });
  }

  /** Method to submit VIC registration. */
  getVicEngagementDetails(socialInsuranceNo: number, engagementId: number, options?: Map<string, boolean>): Observable<VicEngagementDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}`;
    let params = new HttpParams();
    if (options) {
      if (options.get('isTransactionView')) params = params.set('isTransactionView', 'true');
    }
    return this.http.get<VicEngagementDetails>(url, { params });
  }
}
