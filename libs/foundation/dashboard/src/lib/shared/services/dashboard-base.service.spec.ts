/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';

import { DashboardBaseService } from './dashboard-base.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EstablishmentDashboardConstants } from '../constants';
import { establishmentMockData } from 'testing';

describe('DashboardBaseService', () => {
  let service: DashboardBaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DashboardBaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should get certificate eligibility', () => {
    const registrationNo = 10000602;
    const certificateType: string = EstablishmentDashboardConstants.ESTABLISHMENT_CERTIFICATE_TYPE;
    const establishmentCertificateUrl = `/api/v1/establishment/${registrationNo}/certificate-eligibility?certificateType=${certificateType}`;
    service.getEstablishmentCertificateStatus(registrationNo).subscribe();
    const httpRequest = httpMock.expectOne(establishmentCertificateUrl);
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(establishmentMockData);
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
