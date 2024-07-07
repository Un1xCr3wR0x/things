/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CancelVicService } from './cancel-vic.service';
import { CancelContributorRequest } from '../models';
import { cancelContributorData, cancellationDetailsMock } from 'testing';

describe('CancelVicService', () => {
  let service: CancelVicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CancelVicService);
    service = TestBed.inject(CancelVicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save vic cancellation', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const payload: CancelContributorRequest = cancelContributorData;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/cancel`;
    service.saveVicCancellation(socialInsuranceNo, engagementId, payload).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should submit VIC Cancellation', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const referenceNo = 662518;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}/submit`;
    service.submitVicCancellation(socialInsuranceNo, engagementId, referenceNo, true, null).subscribe(res => {
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
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/cancellation-request/${referenceNo}`;
    service.getCancellationDetails(socialInsuranceNo, engagementId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(cancellationDetailsMock);
  });
});
