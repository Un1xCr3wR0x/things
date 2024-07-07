/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { EnableRepaymentRequest, ReturnLumpsumResponse, StopSubmitRequest } from '../models';
import { ReturnLumpsumService } from './return-lumpsum.service';

describe('ReturnLumpsumService', () => {
  let httpMock: HttpTestingController;
  let service: ReturnLumpsumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(ReturnLumpsumService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get saved active benefits', () => {
    service.getSavedActiveBenefit();
    expect(service.getSavedActiveBenefit).toBeDefined();
  });

  it('to set repayId', () => {
    service.setRepayId(service.repayID);
    expect(service.getRepayId).toBeDefined();
  });

  it('to get repayId', () => {
    service.getRepayId();
    expect(service.getRepayId).toBeDefined();
  });
  it('to set benefitrequestId', () => {
    service.setBenefitReqId(service.benefitRequestId);
    expect(service.setBenefitReqId).toBeDefined();
  });
  it('to get benefitrequestId', () => {
    service.getBenefitReqId();
    expect(service.getBenefitReqId).toBeDefined();
  });
  it('to set is submitted transaction', () => {
    service.setIsUserSubmitted();
    expect(service.setIsUserSubmitted).toBeDefined();
  });
  it('to get is submitted transaction', () => {
    service.getIsUserSubmitted();
    expect(service.getIsUserSubmitted).toBeDefined();
  });
  it('to get active benefit details of contributor', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 12857;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}?referenceNo=${referenceNo}`;
    service.getActiveBenefitDetails(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to submit restore lumpsum on edit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const repayID = 1000045428;
    const restoreDetails = new ReturnLumpsumResponse();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    service.submitRestoreEdit(sin, benefitRequestId, repayID, restoreDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });

  it('to save restore lumpsum', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const restoreDetails = new EnableRepaymentRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/enable-repayment`;
    service.restorePost(sin, benefitRequestId, restoreDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });

  it('to submit restore lumpsum', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const enableId = 1000045428;
    const restoreDetails = new StopSubmitRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/enable-repayment/${enableId}`;
    service.submitRestore(sin, benefitRequestId, enableId, restoreDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PATCH');
  });

  it('to get all payment history', () => {
    const sin = 367189827;
    const url = 'assets/data/payment-history-details.json';
    service.getPaymentDetails(sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get bank Lov list', () => {
    // const url = `/api/v1/lov?category=COLLECTION&domainName=SaudiArabiaBank`;
    const url = `/api/v1/lov?category=COLLECTION&domainName=SaudiArabiaBank`;
    service.getBankLovList().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get reason Lov list', () => {
    const url = `/api/v1/lov?category=ANNUITIES&domainName=RestoreLumpsumReason`;
    service.getReasonLovList().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get required doc list for the other payment', () => {
    const isAppPrivate = true;
    const url = '/api/v1/document/req-doc?transactionId=RET_LUMPSUM_BEN&type=REQUEST_BENEFIT_FO';
    service.getReqDocsForReturnLumpsum(isAppPrivate).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get required doc list for restoreLumpsum', () => {
    const isAppPrivate = true;
    const url = '/api/v1/document/req-doc?transactionId=RES_RET_LUMPSUM_BEN&type=REQUEST_BENEFIT_FO';
    service.getReqDocsForRestoreLumpsum(isAppPrivate).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to submit restore validator modification', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const repayID = 1000045428;
    const restoreDetails = new EnableRepaymentRequest();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    service.restoreEdit(sin, benefitRequestId, repayID, restoreDetails).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('PUT');
  });
  it('to get lumpsum repayment details', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const repayID = 1000045428;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/repayment/${repayID}`;
    service.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should repaymentPost', () => {
    const ReturnLumpsumPaymentDetails = {
      paymentMethod: {
        arabic: '',
        english: 'unknown'
      }
    };
    expect(service.repaymentPost(2323, 56565, ReturnLumpsumPaymentDetails)).not.toEqual(null);
  });
  it('should submitSadadPayment', () => {
    const ReturnLumpsumPaymentDetails = {
      paymentMethod: {
        arabic: '',
        english: 'unknown'
      }
    };
    expect(service.submitSadadPayment(2323, 56565, 23234, ReturnLumpsumPaymentDetails)).not.toEqual(null);
  });
  it('should otherPaymentSubmit', () => {
    const ReturnLumpsumPaymentDetails = {
      paymentMethod: {
        arabic: '',
        english: 'unknown'
      }
    };
    expect(service.otherPaymentSubmit(2323, 56565, 23234, ReturnLumpsumPaymentDetails)).not.toEqual(null);
  });
});
