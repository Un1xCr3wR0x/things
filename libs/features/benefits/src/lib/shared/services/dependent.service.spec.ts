/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DependentService } from '.';
import { ImprisonmentDetails, DependentHistoryFilter, HeirDetailsRequest } from '../models';

describe('DependentService', () => {
  let httpMock: HttpTestingController;
  let service: DependentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(DependentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get DependentDetails', () => {
    const sin = 385093829;
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const benefitType = 'RetirementPensionBenefit';
    const isBackdated = true;
    const requestDate = new GosiCalendar();
    const imprisonmentDetails = new ImprisonmentDetails();
    const status = 'active';
    const url = `/api/v1/contributor/${sin}/dependent?hasCertificate=false&enteringDate=${currentDate}&releaseDate=${currentDate}&requestDate=${currentDate}&benefitType=${benefitType}`;
    service.getDependentDetails(sin, benefitType, requestDate, imprisonmentDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should get ImprisonmentDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment`;
    service.getImprisonmentDetails(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should get DependentHistory', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/dependent-hist`;
    service.getDependentHistory(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should get ReasonForBenefit', () => {
    service.getReasonForBenefit();
    expect(service.getReasonForBenefit).toBeDefined();
  });
  it('should set ReasonForBenefit', () => {
    const deathDate = new GosiCalendar();
    const missingDate = new GosiCalendar();
    const heirBenefitRequestReason = new BilingualText();
    service.setReasonForBenefit(deathDate, missingDate, heirBenefitRequestReason);
    expect(service.getReasonForBenefit).toBeDefined();
  });
  it('should get dependents', () => {
    service.getDependents();
    expect(service.getDependents).toBeDefined();
  });
  it('should set dependents', () => {
    service.setDependents(service.dependents);
    expect(service.getReasonForBenefit).toBeDefined();
  });
  it('should get imprisonment', () => {
    service.getImprisonment();
    expect(service.getImprisonment).toBeDefined();
  });
  it('should set imprisonment', () => {
    const imprisonment = new ImprisonmentDetails();
    service.setImprisonment(imprisonment);
    expect(service.setImprisonment).toBeDefined();
  });
  it('should  filterDependentHistory', () => {
    const dependentHistoryFilter = new DependentHistoryFilter();
    expect(service.filterDependentHistory(1234, 34355, dependentHistoryFilter)).not.toEqual(null);
  });
  it('should  hasvalidValue', () => {
    expect(service.hasvalidValue(1234)).not.toEqual(null);
  });
  it('should getDependentHistoryLOV', () => {
    expect(service.getDependentHistoryLOV()).not.toEqual(null);
  });
  it('should getBenefitStartAndEligibilityDate', () => {
    const imprisonmentDetails = new ImprisonmentDetails();
    const heirDetails = new HeirDetailsRequest();
    const requestDate = new GosiCalendar();
    expect(
      service.getBenefitStartAndEligibilityDate(343, 'gfgf', imprisonmentDetails, heirDetails, requestDate)
    ).not.toEqual(null);
  });
  it('should  getDependentHistoryDetails', () => {
    expect(service.getDependentHistoryDetails(343, 234)).not.toEqual(null);
  });
  it('to getDependentDetailsById', () => {
    const benefitType = '1013422082';
    const sin = 23453543434;
    const referenceNo = 23453543434;
    const benefitRequestId = 1013422082;
    const url = `/api/v1/contributor/${sin}/dependent?benefitRequestId=${benefitRequestId}&referenceNo=${referenceNo}`;
    service.getDependentDetailsById(sin, benefitType, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to  getBenefitHistory', () => {
    const sin = 23453543434;
    const benefitRequestId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit?benefitRequestId=${benefitRequestId}`;
    service.getBenefitHistory(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to  getStatusHistoryDetails', () => {
    const sin = 23453543434;
    const benefitRequestId = 23453543434;
    const personId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/dependent-history/${personId}`;
    service.getStatusHistoryDetails(sin, benefitRequestId, personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
});
