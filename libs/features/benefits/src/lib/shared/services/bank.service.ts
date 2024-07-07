import { Injectable } from '@angular/core';
import { PersonBankDetails, BankAccountList } from '../models';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  constructor(private http: HttpClient) {}

  /**
   * This method is used to get the person bank details
   * @param personId
   */
  getBankDetails(
    personId: number,
    referenceNo?: number,
    serviceType?: string,
    modifyBenefit = false
  ): Observable<PersonBankDetails> {
    const url = `/api/v1/person/${personId}/bank-account`;
    let params = new HttpParams();
    if (referenceNo && !modifyBenefit) {
      params = params.set('referenceNo', referenceNo.toString());
      if (serviceType) params = params.set('serviceType', serviceType.toString());
    }
    return this.http.get<BankAccountList>(url, { params }).pipe(
      map(res => {
        return res?.bankAccountList?.length ? res?.bankAccountList[0] : null;
      })
    );
  }

  getBankList(personId: number, serviceType?: string): Observable<PersonBankDetails[]> {
    const url = `/api/v1/person/${personId}/bank-account`;
    let params = new HttpParams();
    if (serviceType) params = params.set('serviceType', serviceType.toString());
    return this.http.get<BankAccountList>(url, { params }).pipe(
      map(res => {
        return res.bankAccountList;
      })
    );
  }

  getBankAccountList(personId: number, referenceNo?: number, serviceType?: string): Observable<BankAccountList> {
    const url = `/api/v1/person/${personId}/bank-account`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (serviceType) params = params.set('serviceType', serviceType.toString());
    return this.http.get<BankAccountList>(url, { params });
  }
  getSanedBankDetails(
    personId: number,
    referenceNo?: number,
    serviceType?: string,
    modifyBenefit = false
  ): Observable<PersonBankDetails[]> {
    const url = `/api/v1/person/${personId}/bank-account`;
    let params = new HttpParams();
    if (referenceNo && !modifyBenefit) {
      params = params.set('referenceNo', referenceNo.toString());
      if (serviceType) params = params.set('serviceType', serviceType.toString());
    }
    return this.http.get<BankAccountList>(url, { params }).pipe(
      map(res => {
        return res?.bankAccountList?.length ? res?.bankAccountList : null;
      })
    );
  }
}
