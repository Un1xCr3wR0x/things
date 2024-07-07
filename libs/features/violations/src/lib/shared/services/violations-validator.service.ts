import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, Establishment, EstablishmentQueryParams, Lov, TransactionFeedback } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CancelViolationRequest,
  CancelViolationResponse,
  ChangeViolationValidator,
  MemberDecisionDto,
  ModifyViolationRequest,
  ModifyViolationResponse,
  PenaltyInfo,
  PenaltyInfoResponse,
  ViolationTransaction,
  TransactionResponse,
  ContributorsTier,
  AutoTierClass
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ViolationsValidatorService {
  registrationNo: number;
  alertMessage: BilingualText;
  systemParamSubject = new BehaviorSubject<{ name: string; value: string }[]>(null);
  constructor(private http: HttpClient) {}

  /** Method to get person details. */
  getTransactionDetails(violationId: number, estRegNo: number): Observable<ViolationTransaction> {
    const url = `/api/v1/establishment/${estRegNo}/violation/${violationId}`;
    return this.http.get<ViolationTransaction>(url);
  }

  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }

  getRegistrationNo() {
    return this.registrationNo;
  }
  /** Method to get person details. */
  getValidatorViewDetails(violationId: number, transactionId: number): Observable<ChangeViolationValidator> {
    const url = `/api/v1/violation/${violationId}/transaction/${transactionId}`;
    return this.http.get<ChangeViolationValidator>(url);
  }
  /** Method to get person details. */
  getViolationClassDetails(violationId: number, allContributorsExcluded: boolean): Observable<Lov[]> {
    const url = `/api/v1/violation/${violationId}/class-details?allContributorsExcluded=${allContributorsExcluded}`;
    return this.http.get<Lov[]>(url);
  }

  /** Method to save violation details. */
  submitValidation(violationId: number, UpdateDoctor: MemberDecisionDto, bpmTaskId: string): Observable<BilingualText> {
    const url = `/api/v1/violation/${violationId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${UpdateDoctor.assignedCommitteeUser}`,
        bpmTaskId: `${bpmTaskId}`
      })
    };
    return this.http.put<BilingualText>(url, UpdateDoctor, httpOptions);
  }
  /** Method to reject violation details. */
  rejectViolation(violationId: number, transactionTraceId: number, editmode: boolean) {
    const url = `/api/v1/violation/${violationId}/revert?isEditFlow=${editmode}&referenceNo=${transactionTraceId}`;
    return this.http.put<BilingualText>(url, null);
  }
  /** Method to save comments details. */
  submitChangeViolation(
    violationId: number,
    transactionId: number,
    comments,
    transactionType: string,
    editmode: boolean
  ): Observable<TransactionFeedback> {
    const url = `/api/v1/violation/${violationId}/submit?isEditFlow=${editmode}&transactionTraceId=${transactionId}`;
    return this.http.patch<TransactionFeedback>(url, { comments: comments, transactionType: transactionType });
  }
  /** Method to save doctor details. */
  submitPenaltyCalculations(violationId: number, data: PenaltyInfo): Observable<PenaltyInfoResponse> {
    const url = `/api/v1/violation/${violationId}/penalty-calculation`;
    return this.http.post<PenaltyInfoResponse>(url, data);
  }
  /**
   * Method to submit the modifed contributor details
   */
  submitModifyViolations(
    violationId: number,
    modifyViolationRequest: ModifyViolationRequest
  ): Observable<ModifyViolationResponse> {
    const url = `/api/v1/violation/${violationId}/modify`;
    return this.http.put<ModifyViolationResponse>(url, modifyViolationRequest);
  }

  /**
   * Method to submit the cancel violations details
   */
  submitCancelViolations(
    violationId: number,
    cancelViolationRequest: CancelViolationRequest
  ): Observable<ModifyViolationResponse> {
    const url = `/api/v1/violation/${violationId}/cancel`;
    return this.http.put<CancelViolationResponse>(url, cancelViolationRequest);
  }
  // Method to get System parameters
  getSystemParams(): Observable<{ name: string; value: string }[]> {
    if (this.systemParamSubject?.getValue()) {
      return this.systemParamSubject.asObservable();
    } else {
      const baseUrl = `/api/v1/lov/system-parameters`;
      return this.http
        .get<{ name: string; value: string }[]>(baseUrl)
        .pipe(tap(res => this.systemParamSubject.next(res)));
    }
  }

  /**
   * Method for searching transaction using esta
   * @param searchRequest
   */
  searchTransaction(searchRequest: string): Observable<TransactionResponse> {
    let searchTransactionUrl = `/api/v1/transaction?general=true`;
    if (searchRequest) {
      searchTransactionUrl += `&searchKey=${searchRequest}`;
      return this.http.get<TransactionResponse>(searchTransactionUrl);
    }
  }
  /**Method to get data establishment details */
  getEstablishment(registrationNo: number): Observable<Establishment> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    return this.http.get<Establishment>(getEstablishmentUrl);
  }
  // Method to get contributors tier values of corresponding violation
  getContributorsTierValues(violationId:number):Observable<AutoTierClass>{
    const url= `/api/v1/violation/${violationId}/contributors-repetition-tier`;
    return this.http.get<AutoTierClass>(url);
  }
}
