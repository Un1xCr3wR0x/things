import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditBalanceDetails } from '../models/credit-balance-details';
import {
  BackdatedTerminationTransactionsDetails,
  ContributorRefundRequest,
  CreditManagmentRequest,
  CreditRefundDetails,
  CreditRefundRequest,
  CreditRefundUpdateRequest,
  PersonRequest,
  TerminationTransactionsDetails,
  VicCreditRefundIbanDetails
} from '../models';
import { BilingualText, Contributor } from '@gosi-ui/core';
import { TransactionOutcome } from '../enums';
import { VicContributorDetails } from '../models/vic-contributor-details';
import { SelectedTerminationPeriodDetails } from '../models/selected-termination-period-details';

@Injectable({
  providedIn: 'root'
})
export class CreditManagementService {
  formValue = false;
  selectedTerminationPeriod: SelectedTerminationPeriodDetails[];
  constructor(readonly http: HttpClient) {}

  /**Methode to set penalityWaiverReason */
  setPenalityWaiverReason(reason: boolean) {
    this.formValue = reason;
  }
  /**Methode to return penalityWaiverReason */
  getPenalityWaiverReason() {
    return this.formValue;
  }
  /**
   * This method is to get available credit balance
   * @param regNumber Registration Number
   */
  getAvailableCreditBalance(registerNo: number): Observable<CreditBalanceDetails> {
    const creditBalanceUrl = `/api/v1/establishment/${registerNo}/account`;
    return this.http.get<CreditBalanceDetails>(creditBalanceUrl);
  }
  /**
   * This method is to save credit transfer
   * @param registrationNo registration No
   */
  submitCreditMangmentDetails(registrationNo: number, creditDEtails: CreditManagmentRequest) {
    const url = `/api/v1/establishment/${registrationNo}/credit-transfer`;
    return this.http.post<CreditManagmentRequest>(url, creditDEtails);
  }
  /**
   * This method is to save credit refund
   * @param registrationNo registration No
   */
  submitCreditRefundDetails(registrationNo: number, creditRefundDetails: CreditRefundRequest, isIBanEdit = false) {
    const url = `/api/v1/establishment/${registrationNo}/credit-refund?isIbanUpdated=${isIBanEdit}`;
    return this.http.post<CreditRefundRequest>(url, creditRefundDetails);
  }
  /**
   * This method is to all credit balance details
   * @param regNumber Registration Number
   * @param reqNo Request Number
   */
  getAllCreditBalanceDetails(registerNo: number, requestNo: number): Observable<CreditManagmentRequest> {
    const allCreditBalanceUrl = `/api/v1/establishment/${registerNo}/credit-transfer/${requestNo}`;
    return this.http.get<CreditManagmentRequest>(allCreditBalanceUrl);
  }
  /**
   * This method is to update wavier penality details
   * @param registrationNo registration No
   */
  updateCreditMangmentDetails(registrationNo: number, requestNo: number, creditDEtails: CreditManagmentRequest) {
    const url = `/api/v1/establishment/${registrationNo}/credit-transfer/${requestNo}`;
    return this.http.put<CreditManagmentRequest>(url, creditDEtails);
  }
  /** Method to handle workflow actions. */
  submitAfterEdit(taskId: string, workflowUser: string) {
    const submitPayment = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${workflowUser}`
      })
    };

    const payload = {
      taskId: taskId,
      outcome: TransactionOutcome.SUBMIT
    };

    return this.http.post<BilingualText>(submitPayment, payload, httpOptions);
  }
  /**
   * This method is to revert
   * @param regNumber Registration Number
   */
  revertDocumentDetails(registrationNo: number, requestNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/credit-transfer/${requestNo}/revert`;
    return this.http.put<number>(url, null);
  }
  /**
   * This method is to all credit balance details
   * @param regNumber Registration Number
   * @param reqNo Request Number
   */
  getRefundDetails(registerNo: number, requestNo: number): Observable<CreditRefundDetails> {
    const Url = `/api/v1/establishment/${registerNo}/credit-refund/${requestNo}`;
    return this.http.get<CreditRefundDetails>(Url);
  }

  /**
   * This method is to save vic credit refumd details
   * @param sin sin
   */
  submitVicCreditRefundDetails(sin: number, vicCreditRefundDetails: CreditRefundRequest, ibanDetails: string) {
    const url = `/api/v1/vic/${sin}/credit-refund?ibanModification=${ibanDetails}`;
    return this.http.post<CreditRefundRequest>(url, vicCreditRefundDetails);
  }

  /**
   * This method is to update vic credit refund details
   * @param sin sin
   */
  updateVicCreditRefundDetails(
    sin: number,
    reqNo: number,
    vicCreditRefundDetails: CreditRefundRequest,
    ibanDetails: string
  ) {
    const url = `/api/v1/vic/${sin}/credit-refund/${reqNo}?ibanModification=${ibanDetails}`;
    return this.http.put<CreditRefundRequest>(url, vicCreditRefundDetails);
  }

  /**
   * This method is to save wavier penality details
   * @param registrationNo registration No
   */
  updateCreditRefundDetails(
    registrationNo: number,
    requestNo: number,
    creditRefundDetails: CreditRefundUpdateRequest,
    isIBanEdit = false
  ) {
    const url = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}?isIbanUpdated=${isIBanEdit}`;
    return this.http.put<CreditRefundUpdateRequest>(url, creditRefundDetails);
  }

  //Method to get contributor details
  getContirbutorDetails(sin: number) {
    return this.http.get<VicContributorDetails>(`/api/v1/contributor/${sin}`);
  }

  //Method to get contributor details by national id
  getContirbutorByNationalId(nationalId: number) {
    return this.http.get<VicContributorDetails>(`/api/v1/contributor?nationalId=${nationalId}`);
  }

  //Method to get vic contributor credit refund amount
  getVicCreditRefundAmountDetails(sin: number, requestNo: number) {
    return this.http.get<CreditRefundDetails>(`/api/v1/vic/${sin}/credit-refund/${requestNo}`);
  }
  //Method to get vic contributor iban details
  getContirbutorIbanDetails(reg: number, sin: number) {
    return this.http.get<VicCreditRefundIbanDetails>(`/api/v1/establishment/${reg}/contributor/${sin}/bank-account`);
  }
  //Method to get vic contributor iban details
  getVicContirbutorIbanDetails(id: number) {
    return this.http.get<VicCreditRefundIbanDetails>(`/api/v1/person/${id}/bank-account`);
  }
  //Method to get contributor Refund details
  getContirbutorRefundDetails(sin: number, status: boolean) {
    return this.http.get<CreditBalanceDetails>(`/api/v1/vic/${sin}/account?active=${status}`);
  }
  /**
   * This method is to revert
   * @param regNumber Registration Number
   * @param requestNo Request Number
   */
  revertRefundDocumentDetails(registrationNo: number, requestNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/credit-refund/${requestNo}/revert`;
    return this.http.put<number>(url, null);
  }
  /**
   * This method is to revert
   * @param regNumber Registration Number
   * @param requestNo Request Number
   * @param socialInsuranceNumber social Insurance Number
   */
  revertContributorRefundDocumentDetails(registrationNo: number, sin: number, requestNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund/${requestNo}/revert`;
    return this.http.put<number>(url, null);
  }
  //Method to revert vic document details
  revertVicRefundDocumentDetails(sin: number, requestNo: number) {
    const url = `/api/v1/vic/${sin}/credit-refund/${requestNo}/revert`;
    return this.http.put<number>(url, null);
  }
  getChangePersonRequest(personId: number, type: string) {
    const url = `/api/v1/person/${personId}/change-request?type=${type}`;
    return this.http.get<PersonRequest>(url);
  }
  /**
   * Method to search contributor with reg and sin
   * @param estIdentifier
   * @param cntIdentifier
   */
  searchContributor(estRegNo, cntSin): Observable<Contributor> {
    const url = `/api/v1/establishment/${estRegNo}/contributor/${cntSin}`;
    return this.http.get<Contributor>(url);
  }
  /*** This method is to get backdated termination details*/
  getBackdatedTeminationTransactionsDetails(registrationNo: number, socialInsuranceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/credit-refund-quote`;
    return this.http.get<BackdatedTerminationTransactionsDetails>(url);
  }

  /**
   * This method is to save contributor refund details
   * @param sin sin   */
  submitContributorRefundDetails(
    registrationNo: number,
    sin: number,
    contributorRefundDetails: ContributorRefundRequest,
    isIBanEdit = false
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund?isIbanUpdated=${isIBanEdit}`;
    return this.http.post<ContributorRefundRequest>(url, contributorRefundDetails);
  }
  /**
   * This method is to set backdated termination period*/
  setSelectedTerminationPeriod(selectedPeriod: SelectedTerminationPeriodDetails[]) {
    this.selectedTerminationPeriod = selectedPeriod;
  }
  getSelectedTerminationPeriod() {
    return this.selectedTerminationPeriod;
  }
  /*** This method is to get backdated termination details on validator view*/
  getBackdatedTerminationDetails(registrationNo: number, socialInsuranceNo: number, requestNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/credit-refund/${requestNo}`;
    return this.http.get<TerminationTransactionsDetails>(url);
  }

  /**
   * This method is to update contributor refund details
   * @param registrationNo registration No
   * @param socialInsuranceNumber socialInsurance Number
   * @param requestNo request No
   */
  updateContributorRefundDetails(
    registrationNo: number,
    sin: number,
    requestNo: number,
    contributorRefundDetails: ContributorRefundRequest,
    isIBanEdit = false
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/credit-refund/${requestNo}?isIbanUpdated=${isIBanEdit}`;
    return this.http.put<ContributorRefundRequest>(url, contributorRefundDetails);
  }
}
