/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { secondedTestData } from 'testing';
import { SecondedDetails } from '../models';
import { SecondedService } from './seconded.service';

describe('SecondedService', () => {
  let service: SecondedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SecondedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should submit seconded transaction', () => {
    const registrationNo = 200085744;
    const secondedDetails: SecondedDetails = secondedTestData;
    const url = `/api/v1/establishment/${registrationNo}/seconded`;
    service.submitSecondedDetails(registrationNo, secondedDetails).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get seconded details', () => {
    const registrationNo = 200085744;
    const secondedId = 485;
    const url = `/api/v1/establishment/${registrationNo}/seconded/${secondedId}`;
    service.getSecondedDetails(registrationNo, secondedId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new SecondedDetails());
  });

  it('should revert the transaction', () => {
    const registrationNo = 200085744;
    const secondedId = 485;
    const url = `/api/v1/establishment/${registrationNo}/seconded/${secondedId}/revert`;
    service.revertTransaction(registrationNo, secondedId).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
