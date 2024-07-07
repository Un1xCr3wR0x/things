import { Injectable } from '@angular/core';
import {
  AdjustmentDetailsDto,
  TransactionHistoryDetails,
  TransactionReference,
  MiscellaneousPaymentRequest,
  TransactionHistoryFilter
} from '../models';
import { BilingualText, Person, LovList, Lov } from '@gosi-ui/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { hasvalidValue } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class BenefitPropertyService {
  message: BilingualText;
  successMessage: BilingualText;
  personId: number;
  benType: string;
  referenceNo = 0;
  paymentMethod: string;
  payeeNationality: string;
  payeeType: string;
  nin: number;
  person: Person;
  bankInfo;
  private annuityStatus: string;
  private eligibleForVIC: boolean;
  private eligibleDependentAmount = true;
  private lovUrl = '/api/v1/lov';

  constructor(private http: HttpClient) {}
  //Setter method for referenceNo
  setReferenceNo(referenceNo: number) {
    this.referenceNo = referenceNo;
  }
  // Getter method for referenceNo
  getReferenceNo() {
    return this.referenceNo;
  }
  setPersonDetails(person: Person) {
    this.person = person;
  }
  getPersonDetails() {
    return this.person;
  }
  setBenefitAppliedMessage(message: BilingualText) {
    this.message = message;
  }
  getBenefitAppliedMessage() {
    return this.message;
  }
  setActiveSuccessMessage(message: BilingualText) {
    this.successMessage = message;
  }
  getActiveSuccessMessage() {
    return this.successMessage;
  }
  //Setter method for person id
  setPersonId(personId: number) {
    this.personId = personId;
  }
  //Getter method for personId
  getPersonId() {
    return this.personId;
  }
  //Getter method for benType
  getBenType() {
    return this.benType;
  }
  //Setter method for benType
  setBenType(benType: string) {
    this.benType = benType;
  }
  /*
   * Getter method for  paymentMethod
   */
  getPaymentMethod() {
    return this.paymentMethod;
  }
  /**
   * Setter method for paymentMethod
   */
  setPaymentMethod(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }
  /*
   * Getter method for  PayeeNationality
   */
  getPayeeNationality() {
    return this.payeeNationality;
  }
  /**
   * Setter method for PayeeNationality
   */
  setPayeeNationality(payeeNationality) {
    this.payeeNationality = payeeNationality;
  }
  /*
   * Getter method for  payee type
   */
  getPayeeType() {
    return this.payeeType;
  }
  /**
   * Setter method for payeeType
   */
  setPayeeType(payeeType) {
    this.payeeType = payeeType;
  }
  public set bankDetails(bankInfo) {
    this.bankInfo = bankInfo;
  }
  public get bankDetails() {
    return this.bankInfo;
  }
  /*
   * Getter method for  nin
   */
  getNin() {
    return this.nin;
  }
  /**
   * Setter method for nin
   */
  setNin(nin) {
    this.nin = nin;
  }
  /** Getting benefit status number*/
  public getAnnuityStatus() {
    return this.annuityStatus;
  }
  /**@param annuityStatus Setting benefit status */
  setAnnuityStatus(annuityStatus: string) {
    this.annuityStatus = annuityStatus;
  }
  /** Getting eligible vic*/
  public getEligibleForVIC() {
    return this.eligibleForVIC;
  }
  /**@param eligibleForVIC Setting eligibleForVIC  */
  setEligibleForVIC(eligibleForVIC: boolean) {
    this.eligibleForVIC = eligibleForVIC;
  }
  /** Getting eligible dependent amount*/
  public getEligibleDependentAmount() {
    return this.eligibleDependentAmount;
  }
  /**@param eligibleDependentAmount Setting eligibleDependentAmount  */
  setEligibleDependentAmount(eligibleDependentAmount: boolean) {
    this.eligibleDependentAmount = eligibleDependentAmount;
  }
  validatorDetails(identifier, miscPaymentId): Observable<MiscellaneousPaymentRequest> {
    const val = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${miscPaymentId}/direct-payment`;
    return this.http.get<MiscellaneousPaymentRequest>(val);
  }
  //to get transaction history details
  getTransactionHistoryDetails(sin: number, benefitRequestId: number, personId?: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/transaction-history`;
    let params = new HttpParams();
    if (personId) {
      params = params.set('personId', personId.toString());
    }
    return this.http.get<TransactionHistoryDetails>(url, { params });
  }

  getTransactionStatus(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'TransactionTraceStatus'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };
  filterTransactionHistory(socialInsuranceNo, benefitRequestId, transactionHistoryFilter: TransactionHistoryFilter) {
    let filterUrl = `/api/v1/contributor/${socialInsuranceNo}/benefit/${benefitRequestId}/transaction-history?`;
    const transactionId = transactionHistoryFilter.transactionId;
    const transactionStatus = transactionHistoryFilter.status;
    let benefitPeriodFrom = null;
    let benefitPeriodTo = null;
    let paramExists = false;
    if (transactionHistoryFilter.benefitPeriodFrom && transactionHistoryFilter.benefitPeriodTo) {
      benefitPeriodFrom = this.convertToDDMMYYYY(transactionHistoryFilter.benefitPeriodFrom.toString());
      benefitPeriodTo = this.convertToDDMMYYYY(transactionHistoryFilter.benefitPeriodTo.toString());
    }
    if (hasvalidValue(transactionStatus)) {
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
  //to get adjustment details
  getAdjustmentDetails(sin: number, benefitRequestId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/adjustments`;
    return this.http.get<AdjustmentDetailsDto>(url);
  }
  getHeirAdjustmentDetails(sin: number, benefitRequestId: number, personId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/${personId}/adjustments`;
    return this.http.get<AdjustmentDetailsDto>(url);
  }
  validatorEditCall(sin: number, benefitRequestId: number, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/edit/${referenceNo}/validator-edited`;
    return this.http.put(url, {});
  }
  trackTransactionDetails(referenceNo: string) {
    const url = `/api/v1/txn-trace`;
    return this.http.get<TransactionReference[]>(url, {
      params: {
        referenceNo: referenceNo
      }
    });
  }
}
