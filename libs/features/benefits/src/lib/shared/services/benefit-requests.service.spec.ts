/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  BilingualText
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitRequestsService } from './benefit-requests.service';
import { ValidateHeirBenefit } from '..';

describe('BenefitRequestsService', () => {
  let service: BenefitRequestsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(BenefitRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get all benefit transactions', () => {
    const pageNo = 2;
    const pageSize = 10;
    const status = 'Active';
    const url = `/api/v1/benefit?pageNo=${pageNo}&pageSize=${pageSize}&status=${status}`;
    service.getAllBenefitTranscations(pageNo, pageSize, status).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getEachNoOfBenefits', () => {
    expect(service.getEachNoOfBenefits()).not.toEqual(null);
  });
  it('should hasvalidValue', () => {
    expect(service.hasvalidValue(34456)).not.toEqual(null);
  });
  it('should getbenefitFilterType', () => {
    expect(service.getbenefitFilterType()).not.toEqual(null);
  });
  it('should  getEligibleBenefitByBenefitType', () => {
    expect(service.getEligibleBenefitByBenefitType(34456, 'dff')).not.toEqual(null);
  });
  it('to  validateBenefit', () => {
    const benefitType = '1013422082';
    const sin = 23453543434;
    const reason = new BilingualText();
    const requestDate = new GosiCalendar();
    const data = new ValidateHeirBenefit(reason, requestDate);
    const url = `/api/v1/contributor/${sin}/benefit/_validate?benefitType=${benefitType}`;
    service.validateBenefit(sin, benefitType, data).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });
});
