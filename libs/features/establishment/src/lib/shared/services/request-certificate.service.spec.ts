import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { genericCertificateDetailsResponse, genericCertificateEligibiltyResponse } from 'testing';
import { CertificateEnum } from '../enums';
import { CertificateDetailsRequest } from '../models';
import { RequestCertificateService } from './request-certificate.service';

describe('RequestCertificateService', () => {
  let service: RequestCertificateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RequestCertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the certificate eligibilty', () => {
    const regNo = 34234234;
    const url = encodeURI(
      `/api/v1/establishment/${regNo}/certificate-eligibility?certificateType=${CertificateEnum.GOSI}`
    );
    service.getCertificateEligibilty(regNo, { certificateType: CertificateEnum.GOSI }).subscribe(res => {
      expect(res.certificate?.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(genericCertificateEligibiltyResponse);
  });

  it('should fetch the certificate details', () => {
    const regNo = 34234234;
    const url = `/api/v1/establishment/${regNo}/certificate`;
    service.getCertificateDetails(regNo, new CertificateDetailsRequest()).subscribe(res => {
      expect(res.certificateNo).toBe(genericCertificateDetailsResponse.certificateNo);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(genericCertificateDetailsResponse);
  });
});
