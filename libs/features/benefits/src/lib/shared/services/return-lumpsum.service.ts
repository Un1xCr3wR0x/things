import { Injectable } from '@angular/core';
import {
  ActiveBenefits,
  AnnuityResponseDto,
  ReturnLumpsumResponse,
  ReturnLumpsumPaymentDetails,
  ReturnLumpsumDetails,
  EnableRepaymentRequest,
  EnableRepaymentResponse,
  StopSubmitRequest
} from '../models';
import { DocumentItem, Lov, LovList } from '@gosi-ui/core';
import { BenefitConstants } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReturnLumpsumService {
  repayID: number;
  enableId: number;
  requestId: number;
  benefitRequestId: number;
  isUserSubmittedTransaction: Boolean;

  constructor(readonly http: HttpClient) {}

  savedActiveBenefit: ActiveBenefits;

  /**saving the lumpsum benefit details from the annuity benefit history page */
  setActiveBenefit(data: ActiveBenefits) {
    this.savedActiveBenefit = data;
  }

  /** returning saved benefit details   */
  getSavedActiveBenefit() {
    return this.savedActiveBenefit;
  }

  /**
   * Method to set variable repayID
   * @param repayID
   */
  setRepayId(repayID: number) {
    this.repayID = repayID;
  }

  /**Method to get repayment Id */
  getRepayId() {
    return this.repayID;
  }

  /** Method to set variable benReqID
   * @param benReqID
   */
  setBenefitReqId(benReqID: number) {
    this.benefitRequestId = benReqID;
  }

  /**method to return benefit requestid */
  getBenefitReqId() {
    return this.benefitRequestId;
  }

  /**Method to set user submit repyment*/
  setIsUserSubmitted() {
    this.isUserSubmittedTransaction = true;
  }

  /**Method to return submitted transaction*/
  getIsUserSubmitted() {
    return this.isUserSubmittedTransaction;
  }

  /**
   * fetching payment history data
   * @param {number} sin
   */
  public getPaymentDetails(sin: number) {
    if (sin) {
      const paymentUrl = 'assets/data/payment-history-details.json';
      return this.http.get<null>(paymentUrl);
    }
  }

  /**method to fetch bank Lov list */
  getBankLovList(): Observable<Lov[]> {
    // const url = `/api/v1/lov/bank`;
    const url = `/api/v1/lov?category=COLLECTION&domainName=SaudiArabiaBank`;
    return this.http.get<Lov[]>(url);
  }

  /**method to fetch restore reason Lov list */
  getReasonLovList(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=ANNUITIES&domainName=RestoreLumpsumReason`;
    return this.http.get<Lov[]>(url);
  }

  /**
   * This method is used to get the nin by passing  benefitRequestId
   * @param sin
   * @param benefitRequestId
   *
   */
  getActiveBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number): Observable<AnnuityResponseDto> {
    if (sin && benefitRequestId) {
      let url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
      if (referenceNo > 0) {
        url = url + `?referenceNo=${referenceNo}`;
      }
      return this.http.get<AnnuityResponseDto>(url);
    }
  }

  /**
   * this api is called when user clicks on the proceed to pay button on the sadad payment
   * @param sin
   * @param benefitRequestId
   * @param sadadPaymentDetails
   */
  repaymentPost(
    sin: number,
    benefitRequestId: number,
    sadadPaymentDetails: ReturnLumpsumPaymentDetails
  ): Observable<ReturnLumpsumResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment`;
    return this.http.post<ReturnLumpsumResponse>(url, sadadPaymentDetails);
  }

  /**
   * This method is used to sent POST call for return lumpsum
   * @param sin
   * @param benefitRequestId
   * @param sadadPaymentDetails
   */
  submitSadadPayment(
    sin: number,
    benefitRequestId: number,
    repayID: number,
    sadadPaymentDetails: ReturnLumpsumPaymentDetails
  ): Observable<ReturnLumpsumResponse> {
    if (sin && benefitRequestId) {
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
      return this.http.patch<ReturnLumpsumResponse>(url, sadadPaymentDetails);
    }
  }

  /**-----------------------------------restore Lumpsum APIs------------------------ */
  /**
   * this api is used to sent PATCH call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param restoreDetails
   */
  submitRestoreEdit(
    sin: number,
    benefitRequestId: number,
    repayID: number,
    restoreDetails: ReturnLumpsumResponse
  ): Observable<EnableRepaymentResponse> {
    if (sin && benefitRequestId) {
      const referenceNo = {
        referenceNo: restoreDetails.referenceNo
      };
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
      return this.http.patch<EnableRepaymentResponse>(url, referenceNo);
    }
  }

  /**
   * this api is used to sent POST call for restore lumpsum
   * @param sin
   * @param benefitRequestId
   * @param restoreDetails
   */
  restorePost(
    sin: number,
    benefitRequestId: number,
    restoreDetails: EnableRepaymentRequest
  ): Observable<EnableRepaymentResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/enable-repayment`;
    return this.http.post<EnableRepaymentResponse>(url, restoreDetails);
  }

  /**
   * This method is used to sent POST call for return lumpsum
   * @param sin
   * @param benefitRequestId
   * @param enableId
   * @param restoreDetails
   */
  submitRestore(
    sin: number,
    benefitRequestId: number,
    enableId: number,
    submitValues: StopSubmitRequest
  ): Observable<EnableRepaymentResponse> {
    if (sin && benefitRequestId) {
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/enable-repayment/${enableId}`;
      return this.http.patch<EnableRepaymentResponse>(url, submitValues);
    }
  }

  /**
   * to fetch the required doc list for the restore lumpsum
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ReturnLumpsumService
   */
  getReqDocsForRestoreLumpsum(isAppPrivate: boolean): Observable<DocumentItem[]> {
    if (isAppPrivate) {
      const url = '/api/v1/document/req-doc?transactionId=RES_RET_LUMPSUM_BEN&type=REQUEST_BENEFIT_FO';
      return this.http.get<DocumentItem[]>(url);
    }
  }

  /**-----------------------------------other payment APIs------------------------ */

  /**method to submit validator modification (PUT) */
  otherPaymentSubmit(
    sin: number,
    benefitRequestId: number,
    repayID: number,
    otherPaymentDetails: ReturnLumpsumPaymentDetails
  ): Observable<ReturnLumpsumResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    return this.http.put<ReturnLumpsumResponse>(url, otherPaymentDetails);
  }

  /**method to submit restore validator modification (PUT) */
  restoreEdit(
    sin: number,
    benefitRequestId: number,
    repayID: number,
    restoreDetails: EnableRepaymentRequest
  ): Observable<ReturnLumpsumResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    return this.http.put<ReturnLumpsumResponse>(url, restoreDetails);
  }

  /**
   * to fetch the required doc list for the other payment
   * @return {*}  {Observable<DocumentItem>}
   * @memberof ReturnLumpsumService
   */
  getReqDocsForReturnLumpsum(isAppPrivate: boolean): Observable<DocumentItem[]> {
    if (isAppPrivate) {
      const url = '/api/v1/document/req-doc?transactionId=RET_LUMPSUM_BEN&type=REQUEST_BENEFIT_FO';
      return this.http.get<DocumentItem[]>(url);
    } else {
      const url = '/api/v1/document/req-doc?transactionId=RET_LUMPSUM_BEN&type=REQUEST_BENEFIT_GOL';
      return this.http.get<DocumentItem[]>(url);
    }
    // const reqDocsUrl = 'assets/data/returnLumpsum-req-docs.json';
    // return this.http.get<DocumentItem[]>(reqDocsUrl);
  }

  /**----------------------Helper services--------------------------------------- */

  /**
   * Method to sort Lovlist.
   * @param lovList lov list
   * @param isBank bank identifier
   * @param lang language
   */
  sortLovList(lovList: LovList, isBank: boolean, lang: string) {
    let other: Lov;
    let otherExcludedList: Lov[];
    if (isBank) {
      other = lovList.items?.filter(item => BenefitConstants.OTHER_LIST?.indexOf(item.value?.english) !== -1)[0];
      otherExcludedList = lovList.items?.filter(
        item => BenefitConstants.OTHER_LIST?.indexOf(item.value?.english) === -1
      );
      lovList.items = this.sortItems(otherExcludedList, isBank, lang);
      lovList.items.push(other);
    } else {
      lovList.items = this.sortItems(lovList.items, isBank, lang);
    }
    return { ...lovList };
  }

  /**
   * Method to fetch Lumpsum repayment details
   */
  getLumpsumRepaymentDetails(sin: number, benefitRequestId: number, repayID: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    return this.http.get<ReturnLumpsumDetails>(url);
  }

  /**
   * Method to sort items.
   * @param list list
   * @param isBank bank identifier
   * @param lang language
   */
  sortItems(list: Lov[], isBank: boolean, lang: string) {
    if (isBank) {
      if (lang === 'en') {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.english
              .toLowerCase()
              .replace(/\s/g, '')
              .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''));
          }
        });
      } else {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.arabic.localeCompare(b.value.arabic);
          }
        });
      }
    } else {
      if (lang === 'en') {
        list.sort((a, b) =>
          a.value.english
            .toLowerCase()
            .replace(/\s/g, '')
            .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''))
        );
      } else {
        list.sort((a, b) => a.value.arabic.localeCompare(b.value.arabic));
      }
    }
    return list;
  }
}
