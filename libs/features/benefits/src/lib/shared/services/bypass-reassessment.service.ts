/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import {
  BenefitResponse,
  DisabilityTimeline,
  HoldBenefitDetails,
  StopSubmitRequest,
  ValidateCaptchaResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BypassReassessmentService {
  baseUrl = '/api/v1';
  private _identifier: number;

  private _authorization: string;
  mobileNo: string;
  uuid: string;

  isValid: boolean;
  constructor(readonly http: HttpClient, @Inject(ApplicationTypeToken) readonly appToken: string) {}
  get identifier(): number {
    return this._identifier;
  }
  set identifier(identifier) {
    this._identifier = identifier;
  }
  get authorization(): string {
    return this._authorization;
  }
  set authorization(authorization) {
    this._authorization = authorization;
  }
  /** Method to set variable Mobile No
   *@param MobileNo
   */
  setMobileNo(mobileNo: string) {
    this.mobileNo = mobileNo;
  }
  /**
   * Method to set variable is valid
   * @param isValid
   */
  setisValid(isValid: boolean) {
    this.isValid = isValid;
  }
  /**Method to get is valid */
  getisValid() {
    return this.isValid;
  }
  /**Method to get Mobile No*/
  getMobileNo() {
    return this.mobileNo;
  }
  setUuid(uuid: string) {
    this.uuid = uuid;
  }
  getUuid() {
    return this.uuid;
  }
  /** Method to verify OTP. */
  verifyOTP(referenceNumber: string, personId: number, xOtp?: string) {
    const url = `${this.baseUrl}/mbassessment/${referenceNumber}/verify?personIdentifier=${personId}`;
    return this.http.get(url, { headers: { noAuth: 'true', 'x-otp': xOtp }, observe: 'response' });
  }
  /** Method to verify OTP. */
  resendOTP(referenceNumber: string, personId: number) {
    const url = `${this.baseUrl}/mbassessment/${referenceNumber}/verify?personIdentifier=${personId}`;
    return this.http.get(url, { headers: { noAuth: 'true' }, observe: 'response' });
  }
  /** Method to validate nin and captcha. */
  validateCaptcha(referenceNumber: string, identifier?: number, xCaptcha?: string) {
    const verifyCaptchaurl = `/api/v1/mbassessment/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
    let params = new HttpParams();
    if (identifier) params = params.set('personIdentifier', identifier.toString());
    return this.http.get<ValidateCaptchaResponse>(verifyCaptchaurl, {
      headers: { noAuth: 'true', 'x-captcha': xCaptcha },
      params
    });
  }
  /**
   * Method to get assessment details
   * @param benefitRequestId
   * @param assessmentId
   * @param sin
   */
  getMedicalAssessment(benefitRequestId: number, assessmentId: number, sin: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment`;
    let params = new HttpParams();
    if (assessmentId) params = params.set('assessmentId', assessmentId.toString());
    return this.http.get<HoldBenefitDetails>(url, { params });
  }

  /** Method to validate contract. */
  validateAssessment(referenceNumber: string, identifier?: number) {
    const url = `/api/v1/mbassessment/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
    let params = new HttpParams();
    if (identifier) params = params.set('personIdentifier', identifier.toString());
    return this.http.get<ValidateCaptchaResponse>(url, { headers: { noAuth: 'true' }, params });
  }
  /**
   * Method to get assessment details
   * @param disabilityReferenceNo
   * @param nin
   */
  getStandaloneAssessment(disabilityReferenceNo: number, nin: number) {
    const url = `${this.baseUrl}/mbassessment/${disabilityReferenceNo}`;
    let params = new HttpParams();
    if (nin) params = params.set('nin', nin.toString());
    return this.http.get<HoldBenefitDetails>(url, {
      params,
      headers: this.getNoAuthHeaders()
    });
  }
  /**
   * Method to get disability details
   * @param sin
   * @param benefitRequestId
   */
  getDisabilityDetails(sin: number, benefitRequestId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/assessment-details`;
    return this.http.get<DisabilityTimeline>(url);
  }
  /**
   * Method to accept standalone assessment
   * @param disabilityReferenceNo
   * @param nin
   */
  acceptStandaloneAssessment(disabilityReferenceNo: number, nin: number) {
    const url = `${this.baseUrl}/mbassessment/${disabilityReferenceNo}/_accept?nin=${nin}`;
    return this.http.put<BenefitResponse>(url, null, { headers: this.getNoAuthHeaders() });
  }
  /**
   * Method to accept medical assessment details
   * @param sin
   * @param benefitRequestId
   * @param assessmentId
   */
  accceptMedicalAssessment(sin: number, benefitRequestId: number, assessmentId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment?assessmentId=${assessmentId}`;
    return this.http.put<BenefitResponse>(url, null);
  }
  /**
   * Method to accept medical assessment details
   * @param sin
   * @param benefitRequestId
   * @param assessmentId
   */
  appealMedicalAssessment(sin: number, benefitRequestId: number, assessmentId: number, payload?, xOtp?: string) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment/${assessmentId}/appeal`;
    let headersXOTP: HttpHeaders;
    if (xOtp) {
      headersXOTP = new HttpHeaders().set('x-otp', xOtp);
    }
    return this.http.put<BenefitResponse>(url, payload, { headers: headersXOTP });
  }
  /**
   * Method to appeal standalone assessment
   * @param disabilityReferenceNo
   * @param nin
   */
  appealStandaloneAssessment(disabilityReferenceNo: number, nin: number) {
    const url = `${this.baseUrl}/mbassessment/${disabilityReferenceNo}/_appeal?nin=${nin}`;
    return this.http.put<BenefitResponse>(url, null, { headers: this.getNoAuthHeaders() });
  }
  /**
   * Method to submit medical assessment details
   * @param sin
   * @param benefitRequestId
   * @param assessmentId
   */
  submitMedicalAssesment(
    sin: number,
    benefitRequestId: number,
    assessmentId: number,
    submitValues: StopSubmitRequest,
    xOtp?: string
  ) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/disability-assignment/submit?assessmentId=${assessmentId}`;
    let headersXOTP: HttpHeaders;
    if (xOtp) {
      headersXOTP = new HttpHeaders().set('x-otp', xOtp);
    }
    return this.http.patch<BenefitResponse>(url, submitValues, { headers: headersXOTP });
  }
  /** Method to get headers for skipping authentication in stand alone app. */
  getNoAuthHeaders(): HttpHeaders {
    if (this.appToken === ApplicationTypeEnum.MBASSESSMENT_APP) {
      let headers = new HttpHeaders().set('noAuth', 'true');
      if (this._authorization) headers = headers.set('Authorization', this._authorization);
      return headers;
    } else return null;
  }
}
