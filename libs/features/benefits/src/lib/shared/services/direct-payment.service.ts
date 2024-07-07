import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bindToObject, DocumentItem, DocumentService, convertToYYYYMMDD } from '@gosi-ui/core';
import { Observable, forkJoin, of } from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import { DirectPaymentHistory, DirectPaymentHistoryFilter } from '../models';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DirectPaymentService {
  private baseUrl = `/api/v1`;

  private referenceNo: number;
  private paymentSourceId: number;

  constructor(private http: HttpClient, private documentService: DocumentService) {}

  getHeirListForDirectPayment(paymentSourceId: number, referenceNo?: number) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment`;
    let params = new HttpParams();
    if (referenceNo) params = params.append('referenceNo', referenceNo.toString());
    // const url = `../../../assets/data/direct-payment-heirs.json`;
    return this.http.get<any>(url, { params });
  }

  checkForDirectPayment(paymentSourceId: number, referenceNo?: number) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment/eligibility`;
    let params = new HttpParams();
    if (referenceNo) params = params.append('referenceNo', referenceNo.toString());
    // const url = `../../../assets/data/direct-payment-heirs.json`;
    return this.http.get<any>(url, { params });
  }

  getDirectPaymentHistory(sin: number, filter: DirectPaymentHistoryFilter): Observable<DirectPaymentHistory[]> {
    // const url = '../../../assets/data/direct-payment-history.json';
    const url = `${this.baseUrl}/contributor/${sin}/benefit/payment-history`;
    let params = new HttpParams();
    if (filter) {
      const paymentTypes = filter.paymentType;
      const paymentStatus = filter.paymentStatus;
      const benefitTypes = filter.BenefitType;
      let startDate = null;
      let endDate = null;
      if (filter.paymentPeriodFrom && filter.paymentPeriodTo) {
        startDate = convertToYYYYMMDD(filter.paymentPeriodFrom.toString());
        endDate = convertToYYYYMMDD(filter.paymentPeriodTo.toString());
      }
      if (paymentTypes?.length > 0) {
        paymentTypes.forEach(type => {
          params = params.append('paymentType', type.english);
        });
      }
      if (paymentStatus?.length > 0) {
        paymentStatus.forEach(status => {
          params = params.append('status', status.english);
        });
      }
      if (benefitTypes?.length > 0) {
        benefitTypes.forEach(type => {
          params = params.append('benefitType', type.english);
        });
      }
      if (startDate && endDate) {
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
      }
    }
    return this.http.get<DirectPaymentHistory[]>(url, { params });
  }


  saveDirectPaymentDetails(paymentSourceId, payload) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment`;
    return this.http.post(url, payload);
  }

  updateDirectPaymentDetails(paymentSourceId, payload) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment`;
    return this.http.put(url, payload);
  }

  submitDirectPaymentDetails(paymentSourceId, payload) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment`;
    return this.http.patch(url, payload);
  }


  getMiscDocuments(paymentSourceId, referenceNo): Observable<DocumentItem[]> {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment/req-docs`;
    let params = new HttpParams();
    if (referenceNo) params = params.append('referenceNo', referenceNo);
    return this.http.get<DocumentItem[]>(url, { params })
      .pipe(map(docs => docs.map(doc => bindToObject(new DocumentItem(), doc))));;
  }
  /** for calling the required docs on the validator screen */
  getUploadedDocuments(sin: number, referenceNo?: number) {
    return this.getMiscDocuments(sin, referenceNo).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
           // if(doc.documentContent!=null){
            return this.documentService.refreshDocument(doc, sin, null, null, referenceNo);
           // }
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }

  cancelMiscPayment(paymentSourceId, referenceNo) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment/cancel`;
    let params = new HttpParams().append('referenceNo', referenceNo.toString());
    return this.http.put(url, null, {params});
  }

  revertMiscPayment(paymentSourceId, referenceNo) {
    const url = `${this.baseUrl}/heir/${paymentSourceId}/misc-payment/${referenceNo}/revert`;
    return this.http.put(url, null);
  }

  getReferenceNo() {
    return this.referenceNo;
  }

  setReferenceNo(referenceNo) {
    this.referenceNo = referenceNo;
  }

  getPaymentSourceId() {
    return this.paymentSourceId;
  }

  setPaymentSourceId(paymentSourceId) {
    this.paymentSourceId = paymentSourceId;
  }
}
