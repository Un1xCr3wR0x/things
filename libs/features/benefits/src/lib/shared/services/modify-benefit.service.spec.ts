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
  DocumentItem,
  GosiCalendar
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  ValidateImprisonment,
  ImprisonmentVerifyResponse,
  HeirModifyPayeeDetails,
  StopSubmitRequest,
  StopBenefitRequest,
  HoldBenefit,
  DependentSetValues,
  AnnuityResponseDto
} from '../models';
import { ModifyBenefitService } from './modify-benefit.service';
import { ActiveBenefits } from '@gosi-ui/features/payment/lib/shared/models/active-benefits';

describe('ModifyBenefitService', () => {
  let service: ModifyBenefitService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        DatePipe
      ]
    });
    service = TestBed.inject(ModifyBenefitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it('to get saved active benefits', () => {
    service.getSavedActiveBenefit();
    expect(service.getSavedActiveBenefit).toBeDefined();
  });*/
  it('it get reqDocs for modify imprisonment', () => {
    const appPrivate = true;
    const url = '/api/v1/document/req-doc?transactionId=UPDATE_JAIL_WORKER&type=REQUEST_BENEFIT_FO';
    service.getReqDocsForModifyImprisonment(appPrivate);
    service.getReqDocsForModifyImprisonment(appPrivate).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new DocumentItem());
    expect(appPrivate).toBeTruthy();
  });
  it('it getReqDocsForStopBenefit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 1076204195;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop/${referenceNo}/req-doc`;
    service.getReqDocsForStopBenefit(sin, benefitRequestId, referenceNo);
    service.getReqDocsForStopBenefit(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new DocumentItem());
  });
  it('it to get ReqDocsForHoldBenefit', () => {
    const appPrivate = true;
    const url = '/api/v1/document/req-doc?transactionId=HOLD_BENEFIT&type=REQUEST_BENEFIT_FO';
    service.getReqDocsForHoldBenefit(appPrivate);
    service.getReqDocsForHoldBenefit(appPrivate).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new DocumentItem());
    expect(appPrivate).toBeTruthy();
  });
  it('it  getReqDocsForModifyPayee', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 1076204195;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/req-docs?referenceNo=${referenceNo}`;
    service.getReqDocsForModifyPayee(sin, benefitRequestId, referenceNo);
    service.getReqDocsForModifyPayee(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new DocumentItem());
  });
  it('it  updateImprisonmentDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const validateImprisonment = new ValidateImprisonment();
    validateImprisonment.enteringDate = new GosiCalendar();
    validateImprisonment.releaseDate = new GosiCalendar();
    const isVerify = true;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment?verify=${isVerify}`;
    service.updateImprisonmentDetails(sin, benefitRequestId, validateImprisonment, isVerify);
    service.updateImprisonmentDetails(sin, benefitRequestId, validateImprisonment, isVerify).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(new ImprisonmentVerifyResponse());
  });
  it('it revertStopBenefit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 1076204195;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop/${referenceNo}/revert`;
    service.revertStopBenefit(sin, benefitRequestId, referenceNo);
    service.revertStopBenefit(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it editDirectPayment', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 1076204195;
    const status = true;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/${referenceNo}/direct-payment?initiate=${status}`;
    service.editDirectPayment(sin, benefitRequestId, referenceNo, status);
    service.editDirectPayment(sin, benefitRequestId, referenceNo, status).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it restartDirectPayment', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const transactionTraceId = 1076204195;
    const status = true;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/${transactionTraceId}/direct-payment?initiate=${status}`;
    service.restartDirectPayment(sin, benefitRequestId, transactionTraceId, status);
    service.restartDirectPayment(sin, benefitRequestId, transactionTraceId, status).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it modifyBankDirectPayment', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const transactionTraceId = 300302;
    const status = true;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/bank-account/${transactionTraceId}/direct-payment?initiate=${status}`;
    service.modifyBankDirectPayment(sin, benefitRequestId, transactionTraceId, status);
    service.modifyBankDirectPayment(sin, benefitRequestId, transactionTraceId, status).subscribe(res => {
      expect(res).not.toBeNull();
      req.flush(new ImprisonmentVerifyResponse());
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it submitImprisonmentModifyDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new ValidateImprisonment();
    data.referenceNo = 2345566;
    const isverify = true;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment?verify=${isverify}`;
    service.submitImprisonmentModifyDetails(sin, benefitRequestId, data, isverify);
    service.submitImprisonmentModifyDetails(sin, benefitRequestId, data, isverify).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it getAppliedBenefitDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const baseurl = `/api/v1/contributor/${sin}/benefit?benefitRequestId=${benefitRequestId}`;
    service.getAppliedBenefitDetails(sin, benefitRequestId);
    service.getAppliedBenefitDetails(sin, benefitRequestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('should getModifyCommitment', () => {
    expect(service.getModifyCommitment(32323, 2334, 76767, false)).not.toEqual(null);
  });
  it('should  getDependentDetails', () => {
    expect(service.getDependentDetails()).not.toEqual(null);
  });
  it('should setDependentDetails', () => {
    const setDependentDetails = new DependentSetValues([], name, 2323231, 23322121, 77665654, 'pension', 6756555);
    expect(service.setDependentDetails(setDependentDetails)).not.toEqual(null);
  });
  it('should setAnnuityDetails', () => {
    const annuityDetails = new AnnuityResponseDto();
    expect(service.setAnnuityDetails(annuityDetails)).not.toEqual(null);
  });
  it('it  modifyPayeeDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new HeirModifyPayeeDetails();
    const referenceNo = 2345566;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee?referenceNo=${referenceNo}`;
    service.modifyPayeeDetails(sin, benefitRequestId, data, referenceNo);
    service.modifyPayeeDetails(sin, benefitRequestId, data, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it  submitModifyDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new StopSubmitRequest();
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee`;
    service.submitModifyDetails(sin, benefitRequestId, data);
    service.submitModifyDetails(sin, benefitRequestId, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PATCH');
  });
  it('it getModifyPaymentDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 23532234;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee?referenceNo=${referenceNo}`;
    service.getModifyPaymentDetails(sin, benefitRequestId, referenceNo);
    service.getModifyPaymentDetails(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it revertModifyPaymentDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const transactionTraceId = 3003455;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/payee/${transactionTraceId}/revert`;
    service.revertModifyPaymentDetails(sin, benefitRequestId, transactionTraceId);
    service.revertModifyPaymentDetails(sin, benefitRequestId, transactionTraceId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it saveStopDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new StopBenefitRequest();
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop`;
    service.saveStopDetails(sin, benefitRequestId, data);
    service.saveStopDetails(sin, benefitRequestId, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it holdBenefitDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new HoldBenefit();
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    service.holdBenefitDetails(sin, benefitRequestId, data);
    service.holdBenefitDetails(sin, benefitRequestId, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it submitStoppedDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new StopSubmitRequest();
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop`;
    service.submitStoppedDetails(sin, benefitRequestId, data);
    service.submitStoppedDetails(sin, benefitRequestId, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PATCH');
  });
  it('it submitHoldDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 3003445;
    const data = new StopSubmitRequest();
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    service.submitHoldDetails(sin, benefitRequestId, referenceNo, data);
    service.submitHoldDetails(sin, benefitRequestId, referenceNo, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PATCH');
  });
  it('it getHoldBenefitDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 3003445;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold?referenceNo=${referenceNo}`;
    service.getHoldBenefitDetails(sin, benefitRequestId, referenceNo);
    service.getHoldBenefitDetails(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it  getstopDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 3003445;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/stop?referenceNo=${referenceNo}`;
    service.getstopDetails(sin, benefitRequestId, referenceNo);
    service.getstopDetails(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it   getRestartDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 3003445;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension?referenceNo=${referenceNo}`;
    service.getRestartDetails(sin, benefitRequestId, referenceNo);
    service.getRestartDetails(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it  getRestartCalculation', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 3003445;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/restart-pension/calculate?referenceNo=${referenceNo}`;
    service.getRestartCalculation(sin, benefitRequestId, referenceNo);
    service.getRestartCalculation(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it holdBenefit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = 300302;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold`;
    service.holdBenefit(sin, benefitRequestId, data);
    service.holdBenefit(sin, benefitRequestId, data).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('it  revertHoldBenefit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const transactionTraceId = 300302;
    const baseurl = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/on-hold/${transactionTraceId}/revert`;
    service.revertHoldBenefit(sin, benefitRequestId, transactionTraceId);
    service.revertHoldBenefit(sin, benefitRequestId, transactionTraceId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('PUT');
  });
  it('to set Annuity details ', () => {
    spyOn(service, 'setAnnuityDetails');
    expect(service.setAnnuityDetails).toBeDefined();
  });

  it('to get Annuity details', () => {
    service.getAnnuityDetails();
    expect(service.getAnnuityDetails).toBeDefined();
  });

  it('to update imprisonment details', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new ValidateImprisonment();
    const isVerify = true;
    service.updateImprisonmentDetails(sin, benefitRequestId, data, isVerify);
    expect(service.updateImprisonmentDetails).toBeDefined();
  });

  it('to get applied benefit details', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    service.getAppliedBenefitDetails(sin, benefitRequestId);
    expect(service.getAppliedBenefitDetails).toBeDefined();
  });
});
