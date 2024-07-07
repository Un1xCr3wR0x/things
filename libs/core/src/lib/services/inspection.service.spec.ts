/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { inspectionDetails } from 'testing';
import { InspectionService } from './inspection.service';

describe('InspectionService', () => {
  let httpMock: HttpTestingController;
  let service: InspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(InspectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get inspection by transaction id', () => {
    const url = `/api/v1/inspection/rased-inspection?transactionTraceId=994362&socialInsuranceNo=325741268`;
    service.getInspectionByTransactionId(994362, 325741268).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ inspectionResponse: [inspectionDetails] });
  });

  it('should get inspection list', () => {
    const url = `/api/v1/inspection?registrationNo=592338327&socialInsuranceNo=991989803&queryForActive=true`;
    service.getInspectionList(592338327, 991989803, true).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([inspectionDetails]);
  });
});
