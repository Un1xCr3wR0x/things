/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { transferContributorData } from 'testing';
import { TransferContributorDetails, TransferAllContributorDetails, TransferContributorPayload } from '../models';
import { TransferContributorService } from './transfer-contributor.service';

describe('TransferContributorService', () => {
  let service: TransferContributorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TransferContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should update transfer contributor', () => {
    const registrationNo = 200085744;
    const sin = 423641258;
    const engagementId = 1569355076;
    const transferPayload: TransferContributorPayload = transferContributorData;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/transfer`;
    service.updateTansferContributor(registrationNo, sin, engagementId, transferPayload).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get transfer details', () => {
    const registrationNo = 200085744;
    const sin = 423641258;
    const engagementId = 1569355076;
    const referenceNo = 205469;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/transfer-request/${referenceNo}`;
    service.getTransferDetails(registrationNo, sin, engagementId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new TransferContributorDetails());
  });

  it('should submit transfer all', () => {
    const registrationNo = 200085744;
    const transferPayload: TransferContributorPayload = transferContributorData;
    const url = `/api/v1/establishment/${registrationNo}/transfer`;
    service.submitTransferRequest(registrationNo, transferPayload).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get transfer all details', () => {
    const registrationNo = 200085744;
    const url = `/api/v1/establishment/${registrationNo}/transfer-request?requestId=604120`;
    service.getTransferAllDetails(registrationNo, 604120).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new TransferAllContributorDetails());
  });

  it('should revert transfer all', () => {
    const registrationNo = 200085744;
    const requestId = 25;
    const url = `/api/v1/establishment/${registrationNo}/transfer-request/${requestId}/revert`;
    service.revertTransactionAll(registrationNo, requestId).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
