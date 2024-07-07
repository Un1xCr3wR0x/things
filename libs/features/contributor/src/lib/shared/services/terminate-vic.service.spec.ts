/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { terminateContributorData, terminationVicDetailsMock } from 'testing';
import { TerminateContributorPayload } from '../models';
import { TerminateVicService } from './terminate-vic.service';

describe('TerminateVicService', () => {
  let service: TerminateVicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TerminateVicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save termination vic', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const payload: TerminateContributorPayload = terminateContributorData;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/terminate`;
    service.saveVicTermination(socialInsuranceNo, engagementId, payload).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should submit termination vic', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const referenceNo = 662518;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}/submit`;
    service.submitVicTermination(socialInsuranceNo, engagementId, referenceNo, true, null).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get terminate vic details', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const referenceNo = 662518;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/termination-request/${referenceNo}`;
    service.getTerminateVicDetails(socialInsuranceNo, engagementId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(terminationVicDetailsMock);
  });
});
