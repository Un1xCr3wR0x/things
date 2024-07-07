/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { SearchRequest, BillHistoryWrapper, EstablishmentCertificateStatus } from '../models';
import { Observable } from 'rxjs';
import { BilingualText, Establishment } from '@gosi-ui/core';
import { HttpClient } from '@angular/common/http';
import { EstablishmentDashboardConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardBaseService {
  //local variables
  baseUrl = '/api/v1';

  constructor(readonly http: HttpClient) {}
  /**
   *
   * @param registrationNo method to get establishment details
   */
  getEstablishment(registrationNo: number): Observable<Establishment> {
    const establishmentUrl = `${this.baseUrl}/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    return this.http.get<Establishment>(establishmentUrl);
  }
  /**
   * This method is to get billing details
   */
  getBillingDetails(registrationNo: number): Observable<BillHistoryWrapper> {
    const billHistory = `${this.baseUrl}/establishment/${registrationNo}/account`;
    return this.http.get<BillHistoryWrapper>(billHistory, { headers: { ignoreLoadingBar: '' } });
  }
  getEstablishmentCertificateStatus(registrationNo: number): Observable<EstablishmentCertificateStatus> {
    const certificateType: string = EstablishmentDashboardConstants.ESTABLISHMENT_CERTIFICATE_TYPE;
    const establishmentCertificateUrl = `${this.baseUrl}/establishment/${registrationNo}/certificate-eligibility?certificateType=${certificateType}`;
    return this.http.get<EstablishmentCertificateStatus>(establishmentCertificateUrl, {
      headers: { ignoreLoadingBar: '' }
    });
  }
}
