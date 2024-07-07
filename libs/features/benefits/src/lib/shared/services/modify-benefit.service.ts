import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  ImprisonmentVerifyResponse,
  ValidateImprisonment,
  DependentSetValues,
  HeirModifyPayeeDetails,
  ModifyPayeeDetails,
  BenefitResponse,
  HoldBenefit,
  HoldBenefitDetails,
  StopBenefitRequest,
  StopSubmitRequest,
  PersonBankDetails
} from '../models';
import { BilingualText, DocumentItem, GosiCalendar } from '@gosi-ui/core';
import { BenefitType } from '../../shared/enum';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ModifyBenefitService {
  savedActiveBenefit: ActiveBenefits;
  annuityDetails: AnnuityResponseDto;
  dependentDetails: DependentSetValues;
  message: BilingualText;
  isDead:boolean;
  constructor(private http: HttpClient) {}
  
  getIsDead(){
    return this.isDead;
  }
  setIsDead(isDead: boolean){
    this.isDead = isDead;
  }
  /** This method is to get Dependent details */
  getDependentDetails() {
    return this.dependentDetails;
  }
  /** This method is to set Dependent details */
  setDependentDetails(dependentDetails: DependentSetValues) {
    this.dependentDetails = dependentDetails;
  }
  /** This method is to get Annuity details */
  getAnnuityDetails() {
    return this.annuityDetails;
  }
  /** This method is to set Annuity details */
  setAnnuityDetails(annuityDetails: AnnuityResponseDto) {
    this.annuityDetails = annuityDetails;
  }
  /**
   * to fetch the required doc list for Jailed Imprisonment
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ModifyBenefitService
   */
  getReqDocsForModifyImprisonment(isAppPrivate: boolean): Observable<DocumentItem[]> {
    if (isAppPrivate) {
      const url = '/api/v1/document/req-doc?transactionId=UPDATE_JAIL_WORKER&type=REQUEST_BENEFIT_FO';
      return this.http.get<DocumentItem[]>(url);
    }
  }
  /**
   * to fetch the required doc list for Stop Benefit
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ModifyBenefitService
   */
  getReqDocsForStopBenefit(sin: Number, benefitRequestId: Number, referenceNo: Number): Observable<DocumentItem[]> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop/${referenceNo}/req-doc`;
    return this.http.get<DocumentItem[]>(url);
  }
  /**
   * to fetch the required doc list for Hold Benefit
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ModifyBenefitService
   */
  getReqDocsForHoldBenefit(isAppPrivate: boolean): Observable<DocumentItem[]> {
    if (isAppPrivate) {
      const url = '/api/v1/document/req-doc?transactionId=HOLD_BENEFIT&type=REQUEST_BENEFIT_FO';
      return this.http.get<DocumentItem[]>(url);
    }
  }
  /**
   * to fetch the required doc list for Modify Benefit Payment
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ModifyBenefitService
   */
  getReqDocsForModifyPayee(sin: Number, benefitRequestId: Number, referenceNo: Number): Observable<DocumentItem[]> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/req-docs`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<DocumentItem[]>(url, { params });
  }
  /**
   * to fetch the required doc list for Modify Bank Commitment
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ModifyBenefitService
   */
  getReqDocsForModifyBank(sin: Number, benefitRequestId: Number, referenceNo?: Number): Observable<DocumentItem[]> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/req-docs`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<DocumentItem[]>(url, { params });
  }
  updateImprisonmentDetails(sin: Number, benefitRequestId: Number, data: ValidateImprisonment, isVerify?: boolean) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment`;
    let params = new HttpParams();
    if (isVerify) {
      params = params.set('verify', isVerify.toString());
    }
    return this.http.post<ImprisonmentVerifyResponse>(url, data, { params });
  }
  /**
   * This method is used to revert benefit
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  revertStopBenefit(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId) {
      // let payload;
      // if (referenceNo) {
      //   payload = {
      //     referenceNo: referenceNo
      //   };
      // }
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop/${referenceNo}/revert`;
      return this.http.put<null>(url, null);
    }
  }
  /** Method to edit direct payment status */
  editDirectPayment(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    status: boolean,
    selectedPersonId: number[]
  ) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/${referenceNo}/direct-payment?initiate=${status}`;
    return this.http.put(url, selectedPersonId, {});
  }
  /** Method to edit direct payment status */
  restartDirectPayment(sin: number, benefitRequestId: number, transactionTraceId: number, status: boolean) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/direct-payment?initiate=${status}`;
    return this.http.put(url, {});
  }
  /** Method to edit direct payment status */
  modifyBankDirectPayment(sin: number, benefitRequestId: number, transactionTraceId: number, status: boolean) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/${transactionTraceId}/direct-payment?initiate=${status}`;
    return this.http.put(url, {});
  }
  submitImprisonmentModifyDetails(
    sin: Number,
    benefitRequestId: Number,
    data: ValidateImprisonment,
    isVerify?: boolean
  ) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment`;
    let params = new HttpParams();
    if (isVerify) {
      params = params.set('verify', isVerify.toString());
    }
    return this.http.put<ImprisonmentVerifyResponse>(url, data, { params });
  }

  getAppliedBenefitDetails(sin: Number, benefitRequestId: Number): Observable<ActiveBenefits[]> {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit`;
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    return this.http.get<ActiveBenefits[]>(url, { params });
  }

  modifyPayeeDetails(sin: number, benefitRequestId: number, data: HeirModifyPayeeDetails, referenceNo?: number) {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee`;
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.put<BenefitResponse>(url, data, { params });
  }
  submitModifyDetails(sin: number, benefitRequestId: number, submitValues: StopSubmitRequest) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee`;
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
  getModifyPaymentDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<ModifyPayeeDetails>(url, { params });
    }
  }
  revertModifyPaymentDetails(sin: number, benefitRequestId: number, transactionTraceId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/${transactionTraceId}/revert`;
    if (sin && benefitRequestId && transactionTraceId) {
      return this.http.put(url, undefined);
    }
  }
  /**
   * this api is used to sent POST call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param stopValues
   */
  saveStopDetails(sin: number, benefitRequestId: number, stopValues: StopBenefitRequest): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop`;
    return this.http.put<BenefitResponse>(url, stopValues);
  }
  /**
   * this api is used to sent PUT call for Hold Benefit Details
   * @param sin
   * @param benefitRequestId
   * @param stopValues
   */
  holdBenefitDetails(sin: number, benefitRequestId: number, holdValues: HoldBenefit): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    return this.http.put<BenefitResponse>(url, holdValues);
  }
  /**
   * this api is used to sent POST call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param comments
   * @param referenceNo
   */
  submitStoppedDetails(
    sin: number,
    benefitRequestId: number,
    submitValues: StopSubmitRequest
  ): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop`;
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
  submitHoldDetails(sin: number, benefitRequestId: number, referenceNo: number, submitValues: StopSubmitRequest) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.patch<BenefitResponse>(url, submitValues);
  }
  getHoldBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  getstopDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  getRestartDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  getModifyCommitment(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    isModifyBank: boolean
  ): Observable<HoldBenefitDetails> {
    let url = '/api/v1/contributor';
    if (isModifyBank) {
      url += `/${sin}/benefit/${benefitRequestId}/bank-account`;
    } else {
      url += `/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment`;
    }
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  /**
   * Method to get calculation details for restart
   * @param benefitRequestId
   * @param sin
   * @param referenceNo
   */
  getRestartCalculation(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/calculate`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  holdBenefit(sin: number, benefitRequestId: number, data) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    const params = new HttpParams();
    return this.http.put<HoldBenefit>(url, data, { params });
  }
  revertHoldBenefit(sin: number, benefitRequestId: number, transactionTraceId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold/${transactionTraceId}/revert`;
    return this.http.put(url, null);
  }
  // getSavedActiveBenefit() {
  //   return this.savedActiveBenefit;
  // }
  // setActiveBenefit(data: ActiveBenefits) {
  //   this.savedActiveBenefit = data;
  // }
  // setBenefitAppliedMessage(message: BilingualText) {
  //   this.message = message;
  // }
  // getBenefitAppliedMessage() {
  //   return this.message;
  // }
  // getSystemRunDate(): Observable<GosiCalendar> {
  //   return this.http.get<GosiCalendar>(`/api/v1/calendar/run-date`).pipe(catchError(err => this.handleError(err)));
  // }
  // /**
  //  * Method to handle error while service call fails
  //  * @param error
  //  */
  // private handleError(error: HttpErrorResponse) {
  //   return throwError(error);
  // }
  getUiBankDetails(sin, benefitRequestId): Observable<PersonBankDetails[]> {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/bank-account`;
    return this.http.get<PersonBankDetails[]>(url);
  }
  getValidatorUIBankDetails(sin, benefitRequestId, referenceNo, isModifyBank): Observable<HoldBenefitDetails> {
    let url = '/api/v1/contributor';
    if (isModifyBank) {
      url += `/${sin}/ui/${benefitRequestId}/bank-account`;
    } else {
      url += `/${sin}/ui/${benefitRequestId}/bank-account/remove-commitment`;
    }
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (sin && benefitRequestId) {
      return this.http.get<HoldBenefitDetails>(url, { params });
    }
  }
  editUiBankDetails(sin, benefitRequestId) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/bank-account`;
    return this.http.put(url, {});
  }
  submitUiPaymentDetails(sin, benefitRequestId, transactionTraceId) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/bank-account/${transactionTraceId}/submit`;
    return this.http.patch(url, {});
  }
  approveUiPayment(sin, benefitRequestId, transactionTraceId) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/bank-account/${transactionTraceId}/approve`;
    return this.http.put(url, {});
  }
  rejectUiPayment(sin, benefitRequestId, transactionTraceId) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/bank-account/${transactionTraceId}/reject`;
    return this.http.put(url, {});
  }
}
