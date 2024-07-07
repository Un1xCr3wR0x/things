/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationTypeToken, RouterData, Person, BilingualText } from '@gosi-ui/core';
import { DatePipe } from '@angular/common';
import {
  Benefits,
  ActiveSanedAppeal,
  AnnuityResponseDto,
  PaymentDetail,
  TransactionHistoryDetails,
  PaymentHistoryFilter,
  AdjustmentDetailsDto,
  AdjustmentModification,
  CalculatedAdjustment,
  SuspendSanedResponse,
  SuspendSanedRequest,
  SuspendSanedDetails,
  UIHistoryDto, PersonAdjustmentDetails, SimisSanedPaymentHistory
} from '../models';
import { lumpsumBenefitAdjustmentTestData } from '../../../assets/data/lumpsum-benefits-adjustment-test-data';
import moment from 'moment';
import { TransactionHistoryFilter } from '../models/transaction-history-filter';
import { UISanedBenifitEligibilityListDto } from '../models/saned-eligibility';

@Injectable({
  providedIn: 'root'
})
export class UiBenefitsService {
  /**Local variables */
  private routerData: RouterData;
  private registrationNo: number;
  private socialInsuranceNo: number;
  private personId: number;
  private referenceNo: number;
  private benefitStatus: string;
  private person: Person;
  private closedStatus: BilingualText;

  private baseUrl = `/api/v1/contributor`;
  activeAppealBenefit: ActiveSanedAppeal;
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly datePipe: DatePipe
  ) {}

  eligibleUiListUrl: string;

  /**
   *
   * fetching the annuity Benefits list
   */
  public getAllBenefits(socialInsuranceNumber: number): Observable<Benefits[]> {
    if (socialInsuranceNumber) {
      this.eligibleUiListUrl = `${this.baseUrl}/${socialInsuranceNumber}/benefit/eligibility`;
      return this.http.get(this.eligibleUiListUrl).pipe(
        map(res => {
          const ret = <Benefits[]>res;
          return ret;
        })
      );
    }
  }

  /**
   *
   * fetching the UiBenefits list
   */
  public getUIBenefits(
    socialInsuranceNumber: number,
    requestDate?: string,
    isReopenCase = false
  ): Observable<Benefits> {
    if (socialInsuranceNumber) {
      let params = new HttpParams();
      this.eligibleUiListUrl = `${this.baseUrl}/${socialInsuranceNumber}/ui/eligibility`;
      if (requestDate) {
        params = params.set('requestDate', requestDate);
      }
      if (isReopenCase) {
        params = params.set('isReopen', isReopenCase.toString());
      }
      return this.http.get(this.eligibleUiListUrl, { params }).pipe(
        map(res => {
          const ret = <Benefits>res;
          return ret;
        })
      );
    }
  }
  /**
   * Method to delete benefit request
   * @param sin
   * @param benefitRequestId
   */
  deleteTransaction(sin, benefitRequestId) {
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/delete`;
    return this.http.put<any>(url, null);
  }
  /**method to fetch eligibility by passing benefit type */
  public getEligibleUiBenefitByType(
    socialInsuranceNumber: number,
    benefitType: string,
    requestDate?: string
  ): Observable<Benefits> {
    let params = new HttpParams();
    if (requestDate) {
      params = params.set('requestDate', requestDate);
    }
    params = params.set('benefitType', benefitType);
    const url = `${this.baseUrl}/${socialInsuranceNumber}/ui/eligibility`;
    return this.http.get(url, { params }).pipe(
      map(res => {
        const ret = <Benefits>res;
        return ret;
      })
    );
  }

  /**
   * This method is used to get the lumpsum benefit request details
   * @param sin
   * @param benefitRequestId
   */
  getUiBenefitRequestDetail(sin: number, benefitRequestId: number, referenceNo: number) {
    let params = new HttpParams();
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}`;
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<AnnuityResponseDto>(url, { params });
  }
  /**
   * api to get payment details and payment history
   * @param socialInsuranceNo
   * @param benefitRequestId
   */
  getUiPaymentDetails(socialInsuranceNo, benefitRequestId) {
    const url = `${this.baseUrl}/${socialInsuranceNo}/ui/${benefitRequestId}/payment-detail`;
    return this.http.get<PaymentDetail>(url);
  }
  /**
   * api to get payment details and payment history
   * @param socialInsuranceNo
   * @param benefitRequestId
   */
  getUiAdjustmentDetails(socialInsuranceNo, benefitRequestId) {
    const url = `${this.baseUrl}/${socialInsuranceNo}/ui/${benefitRequestId}/adjustments`;
    return this.http.get<AdjustmentDetailsDto>(url);
  }
  /** Method to filter payment history */
  filterPaymentHistory(socialInsuranceNo, benefitRequestId, paymentHistoryFilter: PaymentHistoryFilter) {
    let filterUrl = `${this.baseUrl}/${socialInsuranceNo}/ui/${benefitRequestId}/payment-detail?`;
    const paymentEvents = paymentHistoryFilter.paymentEvents;
    const paymentStatus = paymentHistoryFilter.paymentStatus;
    let startDate = null;
    let endDate = null;
    let paramExists = false;
    if (paymentHistoryFilter.benefitPeriodFrom && paymentHistoryFilter.benefitPeriodTo) {
      startDate = this.convertToDDMMYYYY(paymentHistoryFilter.benefitPeriodFrom.toString());
      endDate = this.convertToDDMMYYYY(paymentHistoryFilter.benefitPeriodTo.toString());
    }
    if (this.hasvalidValue(paymentEvents)) {
      for (let i = 0; i < paymentEvents.length; i++) {
        if (paramExists) {
          const statusParam = `&paymentEventTypes=${paymentEvents[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `paymentEventTypes=${paymentEvents[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&paymentEventTypes=${paymentEvents[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (this.hasvalidValue(paymentStatus)) {
      for (let i = 0; i < paymentStatus.length; i++) {
        if (paramExists) {
          const statusParam = `&status=${paymentStatus[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `status=${paymentStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&status=${paymentStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (startDate && endDate) {
      if (paramExists) {
        const dateParam = `&startDate=${startDate}&endDate=${endDate}`;
        filterUrl = filterUrl.concat(dateParam);
      } else {
        const dateParam = `startDate=${startDate}&endDate=${endDate}`;
        filterUrl = filterUrl.concat(dateParam);
        paramExists = true;
      }
    }
    return this.http.get<PaymentDetail>(filterUrl);
  }
  //to get transaction history details
  getUiTransactionHistoryDetails(sin: number, benefitRequestId: number) {
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}/transaction-history`;
    return this.http.get<TransactionHistoryDetails>(url);
  }
  filterTransactionHistory(socialInsuranceNo, benefitRequestId, transactionHistoryFilter: TransactionHistoryFilter) {
    let filterUrl = `${this.baseUrl}/${socialInsuranceNo}/ui/${benefitRequestId}/transaction-history?`;
    const transactionId = transactionHistoryFilter.transactionId;
    const transactionStatus = transactionHistoryFilter.status;
    let benefitPeriodFrom = null;
    let benefitPeriodTo = null;
    let paramExists = false;
    if (transactionHistoryFilter.benefitPeriodFrom && transactionHistoryFilter.benefitPeriodTo) {
      benefitPeriodFrom = this.convertToDDMMYYYY(transactionHistoryFilter.benefitPeriodFrom.toString());
      benefitPeriodTo = this.convertToDDMMYYYY(transactionHistoryFilter.benefitPeriodTo.toString());
    }
    if (this.hasvalidValue(transactionStatus)) {
      for (let i = 0; i < transactionStatus.length; i++) {
        if (paramExists) {
          const statusParam = `&status=${transactionStatus[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `status=${transactionStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&status=${transactionStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (benefitPeriodFrom && benefitPeriodTo) {
      if (paramExists) {
        const dateParam = `&startDate=${benefitPeriodFrom}&endDate=${benefitPeriodTo}`;
        filterUrl = filterUrl.concat(dateParam);
      } else {
        const dateParam = `startDate=${benefitPeriodFrom}&endDate=${benefitPeriodTo}`;
        filterUrl = filterUrl.concat(dateParam);
        paramExists = true;
      }
    }
    if (transactionId) {
      if (paramExists) {
        const transactionParam = `&transactionId=${transactionId}`;
        filterUrl = filterUrl.concat(transactionParam);
      } else {
        const transactionParam = `transactionId=${transactionId}`;
        filterUrl = filterUrl.concat(transactionParam);
        paramExists = true;
      }
    }
    return this.http.get<TransactionHistoryDetails>(filterUrl);
  }
  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };
  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }
  /**
   *
   * fetching the benefit adjustments
   */
  public getlumpsumBenefitAdjustments() {
    return lumpsumBenefitAdjustmentTestData;
  }
  /**
   *
   * fetching the ui(saned) payment details
   */
  public getPaymentDetails() {
    const paymentUrl = 'assets/data/payment-details.json';
    return this.http.get<null>(paymentUrl);
  }

  /**
   * Method to set variable closedStatus
   * @param closedStatus
   */

  setClosingstatus(closedStatus: BilingualText) {
    this.closedStatus = closedStatus;
  }
  /**
   * Method to get closing status
   */
  getClosingstatus() {
    return this.closedStatus;
  }
  /**
   * set Router Data
   * @param routerData
   */
  setRouterData(routerData: RouterData) {
    this.routerData = routerData;
  }
  /**
   * set Router Data
   * @param routerData
   */
  getRouterData() {
    return this.routerData;
  }

  /**
   * Method to set variable socialInsuranceNo
   * @param socialInsuranceNo
   */
  setSocialInsuranceNo(socialInsuranceNo: number) {
    this.socialInsuranceNo = socialInsuranceNo;
  }

  /**
   *
   * @param registrationNo Setting Registration  Number
   */
  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }

  /**
   * Getting benefit status number
   */
  public getBenefitStatus() {
    return this.benefitStatus;
  }

  /**
   *
   * @param benefitStatus Setting benefit status
   */
  setBenefitStatus(benefitStatus: string) {
    this.benefitStatus = benefitStatus;
  }

  public clearBenefitStatus() {
    this.benefitStatus = '';
  }

  /**
   * Getting personal details
   */
  public getPersonDetails() {
    return this.person;
  }
  /**
   * Getting social insurance number
   */
  public getSocialInsuranceNo() {
    return this.socialInsuranceNo;
  }

  /**
   * Getting registeration number
   */
  public getRegistrationNo() {
    return this.registrationNo;
  }

  /**
   *  getting person id
   */
  public getPersonId() {
    return this.personId;
  }

  /**
   *
   * @param id Set referenceNo for validator edit
   */
  setReferenceNum(referenceNo: number) {
    this.referenceNo = referenceNo;
  }
  /**
   *  getting id
   */
  public getReferenceNo() {
    return this.referenceNo;
  }

  public setActiveSanedAppeal(benefitDetails: ActiveSanedAppeal) {
    this.activeAppealBenefit = benefitDetails;
  }
  public getActiveSanedAppeal() {
    return this.activeAppealBenefit;
  }
  getAdjustmentEligiblity(identifier, sin): Observable<AdjustmentModification> {
    const eligibleUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${sin}/maintain-adjustment`;
    return this.http.get<AdjustmentModification>(eligibleUrl);
  }
  //Defect 526050
  getHeirAdjustmentEligibility(sin, benefitRequestId): Observable<AdjustmentModification> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/adjustment-modification`;
    return this.http.get<AdjustmentModification>(url);
  }
  getPaymentEligiblity(identifier, sin): Observable<PersonAdjustmentDetails> {
    const url = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${sin}/direct-payment`;
    return this.http.get<PersonAdjustmentDetails>(url);
  }

  calculateSanedSuspendAdjustments(
    sin: number,
    benefitRequestId: number,
    suspendDate: string
  ): Observable<CalculatedAdjustment> {
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}/suspend/calculate-adjustment?suspendDate=${suspendDate}`;
    return this.http.get<CalculatedAdjustment>(url);
  }

  initiateSuspendSanedRequest(sin: number, benefitRequestId: number) {
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}/suspend`;
    return this.http.post<SuspendSanedResponse>(url, null);
  }

  updateSuspendSanedRequest(req: SuspendSanedRequest) {
    const url = `${this.baseUrl}/${req.sin}/ui/${req.benefitRequestId}/suspend/${req.referenceNo}?suspendDate=${req.suspendDate}`;
    return this.http.put<SuspendSanedResponse>(url, {
      reasonCode: req.reasonCode,
      notes: req.notes
    });
  }

  submitSuspendSanedRequest(req: SuspendSanedRequest) {
    const url = `${this.baseUrl}/${req.sin}/ui/${req.benefitRequestId}/suspend/${req.referenceNo}?suspendDate=${req.suspendDate}`;
    return this.http.patch<SuspendSanedResponse>(url, {
      reasonCode: req.reasonCode,
      notes: req.notes,
      comments: req.comments
    });
  }

  getSuspendSanedDetails(sin: number, benefitRequestId: number): Observable<SuspendSanedDetails> {
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}/suspend`;
    return this.http.get<SuspendSanedDetails>(url);
  }

  getSanedHistory(sin: number, benefitRequestId: number): Observable<UIHistoryDto> {
    const url = `${this.baseUrl}/${sin}/ui/${benefitRequestId}/saned-history`;
    return this.http.get<UIHistoryDto>(url);
  }

  /**
   * This method is used to get the saned eligibility list
   * @param sin
   */
  getSanedBenefitsEligibilityList(sin: number): Observable<UISanedBenifitEligibilityListDto> {
    const url = `/api/v1/contributor/${sin}/ui/contributor-visits`;
    return this.http.get<UISanedBenifitEligibilityListDto>(url);
  }

  getSimisSanedPaymentHistory(sin: number, benefitRequestId: number): Observable<SimisSanedPaymentHistory> {
    return this.http.get<SimisSanedPaymentHistory>(
      `${this.baseUrl}/${sin}/ui/${benefitRequestId}/simis-saned-payment-history`
    );
  }
}
