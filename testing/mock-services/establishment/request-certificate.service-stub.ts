import { Injectable } from '@angular/core';
import {
  CertificateDetailsRequest,
  CertificateDetailsResponse,
  CertificateEligibiltyWrapper,
  CertificateResponse,
  RequestCertificateService
} from '@gosi-ui/features/establishment';
import { Observable, of, throwError } from 'rxjs';
import { genericCertificateDetailsResponse, genericCertificateEligibiltyResponse, genericError } from '../../test-data';

@Injectable()
export class RequestCertificateServiceStub extends RequestCertificateService {
  getCertificateEligibilty(regNo: number): Observable<CertificateEligibiltyWrapper> {
    if (regNo) {
      return of(genericCertificateEligibiltyResponse);
    }
    return throwError(genericError);
  }
  getCertificateDetails(
    regNo: number,
    certificateRequest: CertificateDetailsRequest
  ): Observable<CertificateDetailsResponse> {
    if (regNo || certificateRequest) {
      return of(genericCertificateDetailsResponse);
    }
    return throwError(genericError);
  }

  generateCertificate(regNo: number, reportId: number): Observable<CertificateResponse> {
    if (regNo || reportId) {
      return;
    }
    return throwError(genericError);
  }
}
