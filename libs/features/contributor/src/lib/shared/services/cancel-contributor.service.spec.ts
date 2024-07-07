/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CancelContributorDetails, CancelContributorRequest } from '../models';
import { CancelContributorService } from './cancel-contributor.service';

describe('CancelContributorService', () => {
  let service: CancelContributorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CancelContributorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit cancel contributor request', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076/cancel`;
    service.submitCancelContributor(200085744, 423641258, 1569355076, new CancelContributorRequest()).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: { english: 'Transaction is initiated', arabic: '' } });
  });

  it('should get cancel contributor details in workflow', () => {
    const url = `/api/v1/establishment/200085744/contributor/423641258/engagement/1569355076/cancellation-request/234789`;
    service.getCancellationDetails(200085744, 423641258, 1569355076, 234789).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new CancelContributorDetails());
  });
});
