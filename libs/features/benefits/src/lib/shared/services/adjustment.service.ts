import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { PersonAdjustmentDetails, PaymentAndBenefitStatusDtos, AdjustmentModification } from '../models';
import { BilingualText } from '@gosi-ui/core';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {
  constructor(private http: HttpClient) {}

  adjustmentDetails(identifier: number, sin, isTpa = true): Observable<PersonAdjustmentDetails> {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${sin}`;
    let params = new HttpParams();
    params = params.set('isTpa', isTpa.toString());
    return this.http.get<PersonAdjustmentDetails>(adjustmentUrl, { params });
  }
  uiAdjustmentDetails(identifier: number, sin): Observable<PersonAdjustmentDetails> {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${sin}`;
    return this.http.get<PersonAdjustmentDetails>(adjustmentUrl);
  }
  directPayment(
    sin: number,
    referenceNo: number,
    benefitRequestId: number,
    queryParams?,
    requestBody?: PaymentAndBenefitStatusDtos[]
  ) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/direct-payment`;
    let params = new HttpParams();
    if (queryParams) {
      params = new HttpParams();
      Object.keys(queryParams).forEach(subKey => {
        if (queryParams[subKey]) {
          params = params.set(subKey, queryParams[subKey]?.toString());
        }
      });
    }
    params = params.set('referenceNo', referenceNo.toString());
    return this.http.put<BilingualText>(url, requestBody, { params });
  }
  getAdjustmentsByDualStatus(identifier, status1, status2, sin): Observable<PersonAdjustmentDetails> {
    const url = `/api/v1/beneficiary/${identifier}/adjustment/${sin}?status=${status1}&status=${status2}`;
    return this.http.get<PersonAdjustmentDetails>(url);
  }
}
