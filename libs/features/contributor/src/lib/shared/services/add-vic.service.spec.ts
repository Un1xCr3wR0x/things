/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TransactionFeedback } from '@gosi-ui/core';
import { savePersonResponse, saveVICEngagementResponse, vicEngagementDetailsResponse } from 'testing';
import { PersonalInformation, VicEngagementPayload, VICEngagementResponse } from '../models';
import { AddVicService } from './add-vic.service';

describe('AddVicService', () => {
  let service: AddVicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AddVicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('save VIC person', () => {
    const url = `/api/v1/vic`;
    service.saveVICPerson(new PersonalInformation()).subscribe(res => {
      expect(res.socialInsuranceNo).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(savePersonResponse);
  });

  it('update vic person', () => {
    const url = `/api/v1/vic/423651249`;
    service.updateVICPerson(new PersonalInformation(), 423651249).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'VIC Contributor modified.' });
  });

  it('should save health record details', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810/health-record`;
    service.saveHealthRecordDetails(411885615, 1584364810, []).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new TransactionFeedback());
  });

  it('should save vic engagement details', () => {
    const url = `/api/v1/vic/411885615/engagement`;
    service.saveVicEngagement(411885615, new VicEngagementPayload()).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(saveVICEngagementResponse);
  });

  it('should submit vic registration', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810/submit`;
    service.submitVicRegistration(411885615, 1584364810, 'test').subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new TransactionFeedback());
  });

  it('should update vic engagement details', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810`;
    service.updateVicEngagement(411885615, 1584364810, new VicEngagementPayload()).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new VICEngagementResponse());
  });

  it('should get vic engagement details', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810`;
    service.getVicEngagementDetails(411885615, 1584364810).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(vicEngagementDetailsResponse);
  });
});
