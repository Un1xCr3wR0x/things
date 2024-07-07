/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ValidateWageUpdateService } from './validate-wage-update.service';

describe('VaidateWageUpdateService', () => {
  let service: ValidateWageUpdateService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidateWageUpdateService]
    });
    service = TestBed.inject(ValidateWageUpdateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch occupation and wage details', () => {
    const registrationNo = 123123;
    const sin = 123123;
    const engagementId = 11231588;
    const referenceNo = 324561;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/wage-update-request/${referenceNo}`;
    service.getOccupationAndWageDetails(registrationNo, sin, engagementId, referenceNo).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('');
  });
});
