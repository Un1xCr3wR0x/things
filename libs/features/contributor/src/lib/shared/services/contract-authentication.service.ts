/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  ClausesWrapper,
  ContractParams,
  ContractRequest,
  ContractResponse,
  ContractWrapper,
  PendingContract,
  UnifiedContract,
  ValidateContractResponse,
  ViolationRequest
} from '../models';
import { PendingEngagement } from '../models/pending-engagement';

@Injectable({
  providedIn: 'root'
})
export class ContractAuthenticationService {
  private _identifier: number;
  private _authorization: string;
  private _contractId: number;

  /** Creates an instance of ContractAuthenticationService. */
  constructor(readonly http: HttpClient) {}

  /** Getters. */

  get identifier(): number {
    return this._identifier;
  }
  get authorization(): string {
    return this._authorization;
  }
  get contractId(): number {
    return this._contractId;
  }

  /** Setters. */

  set identifier(identifier) {
    this._identifier = identifier;
  }
  set authorization(authorization) {
    this._authorization = authorization;
  }
  set contractId(contractId: number) {
    this._contractId = contractId;
  }

  /** Method to get contracts */
  getContracts(registrationNo: number, socialInsuranceNo: number, contractParams: ContractParams) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/contract`;
    let params = new HttpParams();
    if (contractParams.engagementId) params = params.set('engagementId', contractParams.engagementId.toString());
    if (contractParams.contractId) params = params.set('contractId', contractParams.contractId.toString());
    if (contractParams.status) params = params.set('contractStatus', contractParams.status);
    if (contractParams.pageSize) {
      params = params.set('pageSize', contractParams.pageSize.toString());
      params = params.set('pageNo', contractParams.pageNo.toString());
    }
    return this.http.get<ContractWrapper>(url, { params });
  }

  /** Method to get the clauses  list. */
  getListOfClauses(regNo: number, siNo: number, engagementId: number, contractId: number): Observable<ClausesWrapper> {
    const contractViewUrl = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/contract/${contractId}/clauses`;
    return this.http.get<ClausesWrapper>(contractViewUrl);
  }

  /** Method to save/update details of the contract */
  addContractDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    contractDetails: ContractRequest,
    contractId?: number,
    isEditMode?: boolean,
    isFinalSubmit?: boolean
  ) {
    if (contractDetails && !contractDetails['contractId']) {
      if (contractDetails.contractType.english === 'Limited')
        contractDetails.contractType = { english: 'Limited Contract', arabic: 'عقد محدد المدة' };
      else if (contractDetails.contractType.english === 'Unlimited')
        contractDetails.contractType = { english: 'Unlimited Contract', arabic: 'عقد غير محدد المدة' };
      else if (contractDetails.contractType.english === 'Contract related to the completion of work')
        contractDetails.contractType = {
          english: 'Contract related to the completion of work',
          arabic: 'عقد عمل لإنجاز عمل معين'
        };
    }

    if (isEditMode) {
      const addContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}`;
      return this.http.put<ContractResponse>(addContractUrl, contractDetails);
    }

    if (isFinalSubmit) {
      const addContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/submit`;
      return this.http.put<ContractResponse>(addContractUrl, {});
    } else {
      const addContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract`;
      return this.http.post<ContractResponse>(addContractUrl, contractDetails);
    }
  }

  /** This method is to revert contract details. */
  revertContractDetails(registrationNo: number, socialInsuranceNo: number, engagementId: number, contractId: number,isDraftRequired?:boolean,referenceNo?: number) {
    let revertContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/revert`;
    if(isDraftRequired && referenceNo){ 
      revertContractUrl+=`?referenceNo=${referenceNo}`
      revertContractUrl+=`&isDraftRequired=true`}
    else if((isDraftRequired==false && isDraftRequired != undefined && isDraftRequired !=null) && referenceNo){
      revertContractUrl+=`?referenceNo=${referenceNo}`
      revertContractUrl+=`&isDraftRequired=false`}
    return this.http.put<BilingualText>(revertContractUrl, {});
  }

  /** This method is to save the contract clauses. */
  saveClauseDetails(contractClause, regNo: number, socialNum: number, engagementId: number, contractId: number) {
    const addContributorUrl = `/api/v1/establishment/${regNo}/contributor/${socialNum}/engagement/${engagementId}/contract/${contractId}/clauses`;
    return this.http.post(addContributorUrl, contractClause);
  }

  /** This method is to cancel pending contract. */
  cancelPendingContract(registrationNo: number, socialInsuranceNo: number, engagementId: number, contractId: number) {
    const cancelContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/cancel`;
    return this.http.put<TransactionFeedback>(cancelContractUrl, {});
  }

  /** Method to get violation request */
  getViolationRequest(registrationNo: number, requestId: number): Observable<ViolationRequest> {
    const violationUrl = `/api/v1/establishment/${registrationNo}/violation-request/${requestId}`;
    return this.http.get<ViolationRequest>(violationUrl);
  }

  /** Method to approve engagement */
  approveEngagement(registrationNo: number, requestId: number) {
    const approveUrl = `/api/v1/establishment/${registrationNo}/violation-request/${requestId}/approve`;
    return this.http.post(approveUrl, {});
  }

  /** Method to modify date */
  modifyDate(regNo: number, siNo: number, engagementId: number, requestId: number, validatorData) {
    const modifyDateUrl = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/violation-request/${requestId}`;
    return this.http.put<BilingualText>(modifyDateUrl, validatorData);
  }

  /** This method print the preview page in private and public. */
  printPreview(registrationNo: number, socialInsuranceNo: number, engagementId: number, contractId: number) {
    const printContractUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/report`;
    return this.http.get(printContractUrl, { responseType: 'blob' });
  }

  // STANDALONE APP APIS

  /** Method to validate contract. */
  validateContract(referenceNumber: string, identifier?: number) {
    const url = `/api/v1/contract/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
    let params = new HttpParams();
    if (identifier) params = params.set('personIdentifier', identifier.toString());
    return this.http.get<ValidateContractResponse>(url, { headers: { noAuth: 'true' }, params });
  }

  /** Method to validate contract. */
  validateEngagement(referenceNumber: string, identifier?: number) {
    const url = `/api/v1/engagement/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
    let params = new HttpParams();
    if (identifier) params = params.set('personIdentifier', identifier.toString());
    return this.http.get<ValidateContractResponse>(url, { headers: { noAuth: 'true' }, params });
  }

  /** Method to validate nin and captcha. */
  validateCaptchaContract(referenceNumber: string, identifier?: number, xCaptcha?: string) {
    const verifyCaptchaurl = `/api/v1/contract/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
    let params = new HttpParams();
    if (identifier) params = params.set('personIdentifier', identifier.toString());
    return this.http.get<ValidateContractResponse>(verifyCaptchaurl, {
      headers: { noAuth: 'true', 'x-captcha': xCaptcha },
      params
    });
  }
  /** Method to verify OTP. */
  verifyOTP(referenceNumber: string, xOtp: string, identifier?: number) {
    const url = `/api/v1/contract/${referenceNumber}/verify?personIdentifier=${identifier}`;
    return this.http.get(url, { headers: { noAuth: 'true', 'x-otp': xOtp }, observe: 'response' });
  }

  /** Method to validate nin and engagement. */
    validateCaptchaEngagement(referenceNumber: string, identifier?: number, xCaptcha?: string) {
      const verifyCaptchaurl = `/api/v1/engagement/${referenceNumber?.toString()?.substr(0, 8)}/validate`;
      let params = new HttpParams();
      if (identifier) params = params.set('personIdentifier', identifier.toString());
      return this.http.get<ValidateContractResponse>(verifyCaptchaurl, {
        headers: { noAuth: 'true', 'x-captcha': xCaptcha },
        params
      });
    }

  /** Method to verify OTP for engagement. */
  EverifyOTP(referenceNumber: string, xOtp: string) {
    const url = `/api/v1/engagement/${referenceNumber}/verify`;
    return this.http.get(url, { headers: { noAuth: 'true', 'x-otp': xOtp }, observe: 'response' });
  }

  /** Method to get unified contract. */
  getUnifiedContract(referenceNo: string, identifier: number) {
    const contractViewUrl = `/api/v1/contract/${referenceNo}/unified-contract?personIdentifier=${identifier}`;
    return this.http.get<UnifiedContract>(contractViewUrl, {
      headers: this.getNoAuthHeaders()
    });
  }



  /** Method to get details of the pending contract. */
  getPendingContractByRef(referenceNo: string, identifier: number) {
    const pendingContractUrl = `/api/v1/contract/${referenceNo}?personIdentifier=${identifier}`;
    return this.http.get<PendingContract>(pendingContractUrl, {
      headers: this.getNoAuthHeaders()
    });
  }

  /** Method to get details of engagement. */
  getPendingEngagementByRef(referenceNo: string, identifier: number) {
    const engagementUrl = `/api/v1/engagement/${referenceNo}?personIdentifier=${identifier}`;
    return this.http.get<PendingEngagement>(engagementUrl, {
      headers: this.getNoAuthHeaders()
    });
  }


  /** Method to get details of engagement. */
  getIndividualEngagementByRef(engagementId: number, identifier: number) {
    const engagementUrl = `/api/v1/contributor/${identifier}/engagement/${engagementId}/engagement-authentication`;
    return this.http.get<PendingEngagement>(engagementUrl, {  });
  }

  /** Method to get accept pending contract. */
  acceptPendingContract(referenceNo: string, identifier: number) {
    const contractViewUrl = `/api/v1/contract/${referenceNo}/activate?personIdentifier=${identifier}`;
    return this.http.put(contractViewUrl, null, { headers: this.getNoAuthHeaders() });
  }

  /** Method to get accept pending engagement. */
  engagementPendingContract(referenceNo: string, identifier: number) {
    const contractViewUrl = `/api/v1/engagement/${referenceNo}/activate?personIdentifier=${identifier}`;
    return this.http.put(contractViewUrl, null, { headers: this.getNoAuthHeaders() });
  }
/** Method to reject pending engagement. */
rejectengagementContract(referenceNo: string, identifier: number, rejectContract) {
  const contractViewUrl = `/api/v1/engagement/${referenceNo}/reject?personIdentifier=${identifier}`;
  return this.http.put(contractViewUrl, rejectContract, {
    headers: this.getNoAuthHeaders()
  });
}
  /** Method to reject pending contract. */
  rejectPendingContract(referenceNo: string, identifier: number, rejectContract) {
    const contractViewUrl = `/api/v1/contract/${referenceNo}/reject?personIdentifier=${identifier}`;
    return this.http.put(contractViewUrl, rejectContract, {
      headers: this.getNoAuthHeaders()
    });
  }
  /**This method print the preview page in standalone app. */
  printPreviewByRef(contractId: number) {
    const url = `/api/v1/contract/${contractId}/report`;
    return this.http.get(url, {
      responseType: 'blob',
      headers: this.getNoAuthHeaders()
    });
  }

  /** Method to get headers for skipping authentication in stand alone app. */
  getNoAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders().set('noAuth', 'true');
    if (this._authorization) headers = headers.set('Authorization', this._authorization);
    return headers;
  }
}
