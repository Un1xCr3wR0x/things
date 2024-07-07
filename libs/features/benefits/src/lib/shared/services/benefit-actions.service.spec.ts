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
  BPMUpdateRequest,
  GosiCalendar,
  LanguageToken,
  Person,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { benefitRequestResposeMockData } from 'testing/test-data/features/benefits/benefit-test-data';
import {
  PersonalInformation,
  AdjustmentDetailsDto,
  BenefitActionsService,
  HoldBenefit,
  StopSubmitRequest,
  HeirsDetails
} from '..';
import { BenefitType } from '../enum/benefit-type';
import { BenefitValues } from '../enum/benefit-values';
import { AnnuityBenefitRequest } from '../models/annuity-benefit-request';
import { DisabilityDetails } from '../models/disability-details';
import moment from 'moment';
import { Component } from 'preact';

describe('BenefitActionsService', () => {
  let httpMock: HttpTestingController;
  let service: BenefitActionsService;
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
    service = TestBed.inject(BenefitActionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('to  saveRestartBenefitDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const holdBenefit = new HoldBenefit();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension`;
    service.saveRestartBenefitDetails(holdBenefit, benefitRequestId, sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });
  it('to savePayeeDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const heirsDetails = new HeirsDetails();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/payee`;
    service.savePayeeDetails(heirsDetails, benefitRequestId, sin, transactionTraceId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to  updateRestartBenefitDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const holdBenefit = new HoldBenefit();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension`;
    service.updateRestartBenefitDetails(holdBenefit, benefitRequestId, sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to  submitModifybankDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const submitValues = new StopSubmitRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/${transactionTraceId}/submit`;
    service
      .submitModifybankDetails(sin, benefitRequestId, transactionTraceId, submitValues, 'benefit')
      .subscribe(response => {
        expect(response).toBeTruthy();
      });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });
  it('to submitRestartDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const submitValues = new StopSubmitRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}`;
    service.submitRestartDetails(sin, benefitRequestId, transactionTraceId, submitValues).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });
  it('to revertModifyBank', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/${transactionTraceId}/revert`;
    service.revertModifyBank(sin, benefitRequestId, transactionTraceId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to revertRemoveBank', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment/${transactionTraceId}/revert`;
    service.revertRemoveBank(sin, benefitRequestId, transactionTraceId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to removeCommitment', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const submitValues = new StopSubmitRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment/submit`;
    service.removeCommitment(sin, benefitRequestId, submitValues).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });
  it('to revertRestartBenefit', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const transactionTraceId = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/revert`;
    service.revertRestartBenefit(sin, benefitRequestId, transactionTraceId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to getRestartholdDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/hold`;
    service.getRestartholdDetails(benefitRequestId, sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getModifyCommitmentDetails is Remove', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const referenceNo = 3445345353;
    const isRemove = true;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/remove-commitment?referenceNo=${referenceNo}`;
    service.getModifyCommitmentDetails(sin, benefitRequestId, referenceNo, isRemove).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  /* it('to addBankCommitment', () => {
    const benefitRequestId = 1013422082;
    const sin =  23453543434;
    const submitValues = new StopSubmitRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/add-commitment`;
    service.addBankCommitment(sin,benefitRequestId,submitValues).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });*/
  it('to activateBankCommitment', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const personId = 344565;
    const referenceNo = 12345566;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/add-commitment/${referenceNo}/activate/${personId}`;
    service.activateBankCommitment(sin, benefitRequestId, personId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to saveModifyCommitmentDetails', () => {
    const benefitRequestId = 1013422082;
    const sin = 23453543434;
    const paymentRequest = new HeirsDetails();
    const transactionTraceId = 12345566;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account?transactionTraceId=${transactionTraceId}`;
    service
      .saveModifyCommitmentDetails(sin, benefitRequestId, paymentRequest, transactionTraceId, 'benefit')
      .subscribe(response => {
        expect(response).toBeTruthy();
      });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
});
