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
import { FuneralBenefitService } from '.';
import { ImprisonmentDetails, DependentHistoryFilter, HeirDetailsRequest, FuneralGrantSubmit } from '../models';

describe('FuneralBenefitService', () => {
  let httpMock: HttpTestingController;
  let service: FuneralBenefitService;
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
    service = TestBed.inject(FuneralBenefitService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('to  getBeneficiaryRequestDetails', () => {
    const sin = 23453543434;
    const benefitRequestId = 23453543434;
    const referenceNo = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/beneficiary?referenceNo=${referenceNo}`;
    service.getBeneficiaryRequestDetails(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to   applyFuneralGrant', () => {
    const sin = 23453543434;
    const data = new FuneralGrantSubmit();
    const url = `/api/v1/contributor/${sin}/benefit/funeral-grant`;
    service.applyFuneralGrant(sin, data).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });
  it('to  updateFuneralGrant', () => {
    const sin = 23453543434;
    const data = new FuneralGrantSubmit();
    const benefitRequestId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/funeral-grant`;
    service.updateFuneralGrant(benefitRequestId, sin, data).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('should  getEligibleBenefitByBenefitType', () => {
    const requestDate = new GosiCalendar();
    expect(service.checkIfEligible(34456, 'dff', requestDate)).not.toEqual(null);
  });
});
