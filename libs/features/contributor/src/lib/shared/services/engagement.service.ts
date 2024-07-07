/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, bindToObject } from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { AddContEngagementPayload, EngagementDetails, SaveEngagementResponse } from '../models';
import { BehaviorSubject } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  constructor(readonly http: HttpClient) {}

  /* ==================================================
     Engagement api calls + getters & setters section
   ==================================================== */
  /**
   * This method is to get the engagment details of the establishment
   * @param registerationNumber
   * @param socialInsuranceNumber
   * @param engagementId
   */
  getEngagementDetails(
    registerationNo: number,
    socialInsuranceNumber: number,
    engagementId: number,
    engagementType?: string,
    determineCoverage: boolean = true,
    isTransactionView: boolean = false
  ): Observable<EngagementDetails> {
    const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}/engagement/${engagementId}`;
    let params = new HttpParams();
    if (engagementType) params = params.set('engagementType', engagementType);
    if (determineCoverage) params = params.set('determineCoverage', 'true');
    if (isTransactionView) params = params.set('isTransactionView', 'true');
    return this.http.get<EngagementDetails>(contributorUrl, { params });
  }

  /**
   * This method is to save engagement details
   * @param engagement
   * @memberof ContributorService
   */
  saveEngagementDetails(engagement: EngagementDetails, socialInsuranceNo: number, registrationNo: number) {
    const engPayload: AddContEngagementPayload = bindToObject(new AddContEngagementPayload(), engagement); //removing un neccessary payload
    const addEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement`;
    return this.http
      .post<SaveEngagementResponse>(addEngagementUrl, engPayload)
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * This method is to update existing engagement details
   * @param employmentDetails
   * @memberof ContributorService
   */
  updateEngagementDetails(
    engagementDetails: EngagementDetails,
    socialInsuranceNo: number,
    registrationNo: number,
    engagementId: number,
    isEditEstAdminOrValidator: boolean,
    isBackdatedEngagment: boolean
  ): Observable<SaveEngagementResponse> {
    const updateEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}`;
    if (isEditEstAdminOrValidator) {
      engagementDetails.backdatingIndicator = isBackdatedEngagment;
      engagementDetails.editFlow = true;
    }
    const engPayload: AddContEngagementPayload = bindToObject(new AddContEngagementPayload(), engagementDetails); //removing un neccessary payload
    return this.http
      .put<SaveEngagementResponse>(updateEngagementUrl, engPayload)
      .pipe(catchError(err => this.handleError(err)));
  }

  /**Method to fetch coverage type for beneficiary */
  getBeneficiaryCoverage(
    registerationNo: number,
    socialInsuranceNumber: number,
    engagement: EngagementDetails
  ): Observable<BilingualText[]> {
    const url = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}/engagement/determine-coverage`;
    return this.http.post<{ coverages: BilingualText[] }>(url, engagement).pipe(pluck('coverages'));
  }

  /** Method to update penalty indicator. */
  updatePenaltyIndicator(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    penaltyIndicator: number
  ): Observable<void> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/update-penalty`;
    return this.http.patch<void>(url, { penaltyIndicator: penaltyIndicator });
  }

  /* =====================
   Error methods section
   ======================= */

  /**
   * Method to handle error while service call fails
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  private personApiSubject = new BehaviorSubject<boolean>(false);
  ispersonApiTriggered$ = this.personApiSubject.asObservable();

  setIsPersonApiTriggered(value: boolean) {
    this.personApiSubject.next(value);
  }

}
