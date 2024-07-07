/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CertificateEnum } from '../enums';
import {
  CertificateDetailsRequest,
  CertificateDetailsResponse,
  CertificateEligibilityParams,
  CertificateEligibiltyWrapper,
  CertificateResponse,
  ZakatGroupCertificatResponse
} from '../models';
import { CertificateTrackingResponse } from '../models/certificate-tracking';
import { getParams } from '../utils';

interface Eligibility {
  type: CertificateEnum;
  certificate: CertificateEligibiltyWrapper;
}
@Injectable({
  providedIn: 'root'
})
export class RequestCertificateService {
  private _eligibiltyDetails: Map<number, Array<Eligibility>> = new Map();
  constructor(readonly http: HttpClient) {}

  getCertificateEligibilty(
    regNo: number,
    params: CertificateEligibilityParams,
    callApi: boolean = true
  ): Observable<CertificateEligibiltyWrapper> {
    if (callApi) {
      //fetch from api
      return this.getCertificateEligibiltyFromBackEnd(regNo, params);
    } else {
      //fetch from map
      const eligibilty = this.getEligibiltyOfType(
        this.getEligibilityDetailsForRegNo(regNo).get(regNo),
        params.certificateType
      );
      if (eligibilty) {
        return of(eligibilty);
      } else {
        return this.getCertificateEligibiltyFromBackEnd(regNo, params);
      }
    }
  }

  getCertificateEligibiltyFromBackEnd(regNo: number, params: CertificateEligibilityParams) {
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/establishment/${regNo}/certificate-eligibility`;
    return this.http.get<CertificateEligibiltyWrapper>(url, { params: httpParams }).pipe(
      tap(res => {
        this.setCertificateEligibilty(regNo, params.certificateType, res);
      })
    );
  }

  getEligibilityDetailsForRegNo(regNo: number): Map<number, Array<Eligibility>> {
    if (this._eligibiltyDetails.get(regNo)) {
      return this._eligibiltyDetails;
    } else {
      this._eligibiltyDetails = new Map();
      this._eligibiltyDetails.set(regNo, []);
      return this._eligibiltyDetails;
    }
  }

  getEligibiltyOfType(list: Array<Eligibility>, certificateType: CertificateEnum): CertificateEligibiltyWrapper {
    const certificateEligibilty = list.find(el => el.type === certificateType);
    return certificateEligibilty?.certificate;
  }

  setCertificateEligibilty(regNo, type: CertificateEnum, eligibilty: CertificateEligibiltyWrapper): void {
    const eligibleMap = this.getEligibilityDetailsForRegNo(regNo);
    const list = eligibleMap.get(regNo);
    const certificate = list.find(item => item.type === type);
    if (certificate) {
      const index = list.indexOf(certificate);
      list.splice(index, 1, { type: type, certificate: eligibilty });
    } else {
      list.push({ type: type, certificate: eligibilty });
    }
  }

  getCertificateDetails(
    regNo: number,
    certificateRequest: CertificateDetailsRequest
  ): Observable<CertificateDetailsResponse> {
    const url = `/api/v1/establishment/${regNo}/certificate`;
    return this.http.post<CertificateDetailsResponse>(url, certificateRequest);
  }

  getCertificateDetail(regNo: number, certificateNo: number): Observable<CertificateTrackingResponse> {
    const url = `/api/v1/establishment/${regNo}/certificate-details?certificateNo=${certificateNo}`;
    return this.http.get<CertificateTrackingResponse>(url);
  }

  generateCertificate(regNo: number, reportId: number): Observable<CertificateResponse> {
    const url = `/api/v1/establishment/${regNo}/certificate/${reportId}/report`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' }).pipe(
      map(res => {
        const regex = new RegExp(`(filename).+?(\.pdf)`);
        const contentDisposition = res.headers.get('Content-Disposition');
        const fileName = contentDisposition?.match(regex)?.[0]?.replace('filename=', '');
        return {
          fileName: fileName,
          blob: res.body
        };
      })
    );
  }
  getZakatCertStatus(regNo: number, certificateNo: number): Observable<ZakatGroupCertificatResponse> {
    const url = `/api/v1/establishment/${regNo}/certificate/${certificateNo}/zakat-group-certificate-processed`;
    return this.http.get<ZakatGroupCertificatResponse>(url);
  }
}
