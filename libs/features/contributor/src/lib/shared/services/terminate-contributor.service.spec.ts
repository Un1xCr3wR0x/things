/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { terminateContributorData } from 'testing';
import { TerminateContributorDetails, TerminateContributorPayload } from '../models';
import { TerminateContributorService } from './terminate-contributor.service';

describe('TerminateContributorService', () => {
  let service: TerminateContributorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TerminateContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should submit terminate transaction', () => {
    const registrationNo = 200085744;
    const sin = 423641258;
    const engagementId = 1569355076;
    const terminateDetails: TerminateContributorPayload = terminateContributorData;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/terminate`;
    service.submitTerminateTransaction(registrationNo, sin, engagementId, terminateDetails).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get termination details', () => {
    const registrationNo = 200085744;
    const sin = 423641258;
    const engagementId = 1569355076;
    const referenceNo = 354126;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/termination-request/${referenceNo}`;
    service.getTerminationDetails(registrationNo, sin, engagementId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new TerminateContributorDetails());
  });

  it('should get terminate all active engagements of the contributor', () => {
    const sin = 423641258;
    const registrationNo = 200085744;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/terminate`;
    service.terminateAllActiveEngagements(registrationNo, sin, new TerminateContributorPayload()).subscribe(res => {
      expect(res.english).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ english: 'Terminated successfully', arabic: '' });
  });
});
