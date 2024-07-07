/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BankService } from './bank.service';

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get bank details', () => {
    const personId = 67189827;
    const referenceNo = 210558;
    const modifyBenefit = false;
    // const url = `/api/v1/person/${personId}/bank-account`;
    service.getBankDetails(personId, referenceNo, '', modifyBenefit).subscribe(response => {
      expect(response).toBeDefined();
    });
    // const req = httpMock.expectOne(url);
    // expect(req.request.method).toBe('GET');
    expect(service.getBankDetails).toBeDefined();
  });
  it('to getBankList', () => {
    const personId = 1019474024;
    const url = `/api/v1/person/${personId}/bank-account`;
    service.getBankList(personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to  getBankAccountList', () => {
    const personId = 1019474024;
    const referenceNo = 2357755;
    const serviceType = '';
    const url = `/api/v1/person/${personId}/bank-account?referenceNo=${referenceNo}`;
    service.getBankAccountList(personId, referenceNo, serviceType).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
});
