/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InspectionDetails, InspectionDetailsWrapper } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  /** Creates an instance of InspectionService. */
  constructor(private http: HttpClient) {}

  /** Method to get inspection details by transaction id. */
  getInspectionByTransactionId(transactionId: number, sin: number): Observable<InspectionDetails[]> {
    const url = `/api/v1/inspection/rased-inspection?transactionTraceId=${transactionId}&socialInsuranceNo=${sin}`;
    return this.http.get<InspectionDetailsWrapper>(url).pipe(map(res => res.inspectionResponse));
  }

  /** Method to get inspection list. */
  getInspectionList(
    registrationNo: number,
    socialInsuranceNo: number,
    activeQuery?: boolean
  ): Observable<InspectionDetails[]> {
    const url = `/api/v1/inspection`;
    let params = new HttpParams()
      .set('registrationNo', registrationNo.toString())
      .set('socialInsuranceNo', socialInsuranceNo.toString());
    if (activeQuery) params = params.set('queryForActive', activeQuery.toString());
    return this.http.get<InspectionDetails[]>(url, { params });
  }
}
