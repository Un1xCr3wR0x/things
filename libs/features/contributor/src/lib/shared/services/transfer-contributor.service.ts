/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransferAllContributorDetails, TransferContributorDetails, TransferContributorPayload } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransferContributorService {
  constructor(private http: HttpClient) {}
  /**
   * Method to update transfer contributor
   * @param registrationNo
   * @param socialInsuranceNo
   * @param engagementId
   * @param payload
   */
  updateTansferContributor(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    payload: TransferContributorPayload
  ): Observable<TransactionFeedback> {
    const transferUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/transfer`;
    return this.http.put<TransactionFeedback>(transferUrl, payload);
  }

  /**
   * Method to get transfer details.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  getTransferDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<TransferContributorDetails> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/transfer-request/${referenceNo}`;
    return this.http.get<TransferContributorDetails>(url);
  }

  /** Method to submit transfer request. */
  submitTransferRequest(registrationNo: number, payload: TransferContributorPayload): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/transfer`;
    return this.http.put<TransactionFeedback>(url, payload).pipe(map(res => res.message));
  }

  submitMultipletransferRequest(registrationNo:number, payload: TransferContributorPayload): Observable<BilingualText>{
    const url = `/api/v1/establishment/${registrationNo}/transfer-request/submit`;
    return  this.http.put<TransactionFeedback>(url, payload).pipe(map(res => res.message));
  }

  /**
   * Method to get transfer all details of the engagement.
   * @param registrationNo registartion number
   * @param requestId request id
   */
  getTransferAllDetails(registrationNo: number, requestId?: number): Observable<TransferAllContributorDetails> {
    let url = `/api/v1/establishment/${registrationNo}/transfer-request`;
    if (requestId) url += `?requestId=${requestId}`;
    return this.http.get<TransferAllContributorDetails>(url);
  }

  /**
   * Method to save workflow.
   * @param registrationNo registration number
   * @param requestId request id
   */
  revertTransactionAll(registrationNo: number, requestId: number) {
    const transferUrl = `/api/v1/establishment/${registrationNo}/transfer-request/${requestId}/revert`;
    return this.http.put<null>(transferUrl, []);
  }
}
