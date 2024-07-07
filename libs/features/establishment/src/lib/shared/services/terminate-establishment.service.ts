/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentService, Establishment, TransactionFeedback } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { QueryParam, TerminateRequest, TerminateResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TerminateEstablishmentService {
  selectedEstablishment: Establishment;
  transactionFeedback: TransactionFeedback[] = [];

  constructor(readonly http: HttpClient, readonly documentService: DocumentService) {}

  terminateEstablishment(
    registrationNo: number,
    terminateRequest: TerminateRequest,
    queryParams?: QueryParam[]
  ): Observable<TerminateResponse> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
    }
    const url = `/api/v1/establishment/${registrationNo}/terminate`;
    return this.http.put<TerminateResponse>(url, terminateRequest, { params: params });
  }
}
