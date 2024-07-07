/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { healthRecords, purposeOfRegistrationList, vicEngagementDetailsResponse, wageCategories } from 'testing';
import { VicContributionDetails } from '../models';
import { VicService } from './vic.service';

describe('VicService', () => {
  let service: VicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(VicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get wage categories for vic', () => {
    const url = `/api/v1/vic/null/engagement/wage-category`;
    service.getVICWageCategories(null).subscribe(res => {
      expect(res.wageCategories.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(wageCategories);
  });

  it('should get wage categories based on transaction and purpose of registration', () => {
    const url = `/api/v1/vic/423968311/engagement/wage-category?purposeOfRegistration=Professional&transactionType=Manage VIC Wage`;
    service.getVICWageCategories(423968311, 'Professional', 'Manage VIC Wage').subscribe(res => {
      expect(res.wageCategories.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(wageCategories);
  });

  it('should get purpose of registration', () => {
    const url = `/api/v1/vic/423968311/engagement/registration-purpose`;
    service.getPurposeOfRegistration(423968311).subscribe(res => {
      expect(res.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(purposeOfRegistrationList);
  });

  it('should get health records', () => {
    const url = `/api/v1/vic/health-record`;
    service.fetchHealthRecords().subscribe(res => {
      expect(res.healthRecordsResponse.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(healthRecords);
  });

  it('get engagement details for vic', () => {
    const socialInsuranceNo = 411885615;
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement`;
    service.getVicEngagements(411885615).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([vicEngagementDetailsResponse]);
  });

  it('should get vic engagement details by id', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810`;
    service.getVicEngagementById(411885615, 1584364810).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(vicEngagementDetailsResponse);
  });

  it('should get vic contribution details', () => {
    const socialInsuranceNo = 411885615;
    const engagementId = 1584364810;
    const date = '2020-12-31';
    const type = 'CancelVic';
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/contribution-details?terminationDate=${date}&transactionType=${type}`;
    service
      .getVicContributionDetails(socialInsuranceNo, engagementId, date, type)
      .subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new VicContributionDetails());
  });

  it('should revert vic related transaction', () => {
    const url = `/api/v1/vic/411885615/engagement/1584364810/transaction/600431/revert`;
    service.revertTransaction(411885615, 1584364810, 600431).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
