/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  BenefitPaymentDetails,
  BenefitResponse,
  HeirsDetails,
  HoldBenefit,
  RestartHoldDetails,
  StopSubmitRequest,
  ModifyPaymentDetails,
  SubmitRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BenefitActionsService {
  baseUrl = '/api/v1';
  constructor(private http: HttpClient) {}
  /**
   * Method to get restart hold details
   * @param benefitRequestId
   * @param sin
   */
  getRestartholdDetails(benefitRequestId: number, sin: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/hold`;
    return this.http.get<RestartHoldDetails>(url);
  }
  /**
   *
   * @param holdBenefit
   * @param benefitRequestId
   * @param sin
   */
  saveRestartBenefitDetails(holdBenefit: HoldBenefit, benefitRequestId: number, sin: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension`;
    return this.http.post<BenefitPaymentDetails>(url, holdBenefit);
  }
  /**
   *
   * @param holdBenefit
   * @param benefitRequestId
   * @param sin
   */
  updateRestartBenefitDetails(holdBenefit: HoldBenefit, benefitRequestId: number, sin: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension`;
    return this.http.put<BenefitPaymentDetails>(url, holdBenefit);
  }
  /**
   *
   * @param heirsDetails BenefitResponse
   * @param benefitRequestId
   * @param sin
   * @param transactionTraceId
   */
  savePayeeDetails(heirsDetails: HeirsDetails, benefitRequestId: number, sin: number, transactionTraceId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/payee`;
    return this.http.put<BenefitResponse>(url, heirsDetails);
  }
  /**
   * this api is used to sent POST call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param comments
   * @param referenceNo
   */
  submitRestartDetails(
    sin: number,
    benefitRequestId: number,
    transactionTraceId: number,
    submitValues: StopSubmitRequest
  ): Observable<BenefitResponse> {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}`;
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
  /**
   * this api is used to sent POST call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param comments
   * @param referenceNo
   */
  submitModifybankDetails(
    sin: number,
    benefitRequestId: number,
    transactionTraceId: number,
    submitValues: StopSubmitRequest,
    benefitText
  ): Observable<BenefitResponse> {
    const url = `${this.baseUrl}/contributor/${sin}/${benefitText}/${benefitRequestId}/bank-account/${transactionTraceId}/submit`;
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
  /**
   *This api is used to revert the restart benefit details
   * @param benefitRequestId
   * @param sin
   * @param transactionTraceId
   */
  revertRestartBenefit(sin: number, benefitRequestId: number, transactionTraceId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/revert`;
    return this.http.put(url, null);
  }
  /**
   *This api is used to revert the modify bank details
   * @param benefitRequestId
   * @param sin
   * @param transactionTraceId
   */
  revertModifyBank(sin: number, benefitRequestId: number, transactionTraceId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/${transactionTraceId}/revert`;
    return this.http.put(url, null);
  }
  /**
   * This api is used to revert the remove bank details
   * @param sin
   * @param benefitRequestId
   * @param transactionTraceId
   */
  revertRemoveBank(sin: number, benefitRequestId: number, transactionTraceId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment/${transactionTraceId}/revert`;
    return this.http.put(url, null);
  }
  /*************** Bank Commitment Related Stories **************/
  getModifyCommitmentDetails(sin: number, benefitRequestId: number, referenceNo: number, isRemove: boolean) {
    let url = '';
    if (isRemove) {
      url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment`;
    } else {
      url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account`;
    }
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<ModifyPaymentDetails>(url, { params });
  }
  getUiCommitmentDetails(sin, benefitRequestId, referenceNo, isRemove): Observable<ModifyPaymentDetails> {
    let url = '/api/v1/contributor';
    if (isRemove) {
      url += `/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment`;
    } else {
      url += `/${sin}/ui/${benefitRequestId}/bank-account`;
    }
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<ModifyPaymentDetails>(url, { params });
    }
  }
  saveModifyCommitmentDetails(
    sin: number,
    benefitRequestId: number,
    paymentRequest: HeirsDetails,
    transactionTraceId?: number,
    benefitText?: string
  ) {
    let url = `${this.baseUrl}`;
    if (!transactionTraceId) {
      url += `/contributor/${sin}/${benefitText}/${benefitRequestId}/bank-account`;
    } else {
      url += `/contributor/${sin}/${benefitText}/${benefitRequestId}/bank-account?transactionTraceId=${transactionTraceId}`;
    }
    //const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account?transactionTraceId=${transactionTraceId}`;
    return this.http.put<BenefitResponse>(url, paymentRequest);
  }
  /**
   * Method to add bank commitment
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  addBankCommitment(sin: number, benefitRequestId: number, submitValues: SubmitRequest) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/add-commitment`;
    return this.http.put<BenefitResponse>(url, submitValues);
  }
  activateBankCommitment(sin: number, benefitRequestId: number, personId: number, referenceNo: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/add-commitment/${referenceNo}/activate/${personId}`;
    return this.http.put<BenefitResponse>(url, null);
  }
  /**
   * Method to remove bank commitment
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  removeCommitment(
    sin: number,
    benefitRequestId: number,
    submitValues: StopSubmitRequest
  ): Observable<BenefitResponse> {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment/submit`;
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
}
