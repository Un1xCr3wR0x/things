/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { vicWageUpdateDetails, updateVicWageResponse, vicEngagementData } from 'testing';
import { VicEngagementPayload } from '../models';
import { VicWageUpdateService } from './vic-wage-update.service';

describe('VicWageUpdateService', () => {
  let service: VicWageUpdateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(VicWageUpdateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update vic wage', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const engagement: VicEngagementPayload = vicEngagementData;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request`;
    service.updateVicWage(socialInsuranceNo, engagementId, engagement).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(updateVicWageResponse);
  });

  it('should submit VIC Update wage', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const referenceNo = 662518;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request/${referenceNo}/submit`;
    service.submitVicWageUpdate(socialInsuranceNo, engagementId, referenceNo, null).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get vic update wage details', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const referenceNo = 662518;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request/${referenceNo}`;
    service.getVicWageUpdateDetails(socialInsuranceNo, engagementId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(vicWageUpdateDetails);
  });
});
