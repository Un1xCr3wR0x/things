/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { UiBenefitsService } from '.';
import { TransactionHistoryFilter, PaymentHistoryFilter, AppealDetails } from '..';

describe('UiBenefitsService', () => {
  let httpMock: HttpTestingController;
  let service: UiBenefitsService;
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
    service = TestBed.inject(UiBenefitsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('to get All Benefits', () => {
    const sin = 385093829;
    const url = `/api/v1/contributor/${sin}/benefit/eligibility`;
    service.getAllBenefits(sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });

  it('to get UI Benefits', () => {
    const sin = 385093829;
    const url = `/api/v1/contributor/${sin}/ui/eligibility`;
    service.getUIBenefits(sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('it getUiBenefitRequestDetail', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const referenceNo = 1076204195;
    const baseurl = `/api/v1/contributor/${sin}/ui/${benefitRequestId}?referenceNo=${referenceNo}`;
    service.getUiBenefitRequestDetail(sin, benefitRequestId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it getUiPaymentDetails', () => {
    const socialInsuranceNo = 367189827;
    const benefitRequestId = 1002210558;
    const baseurl = `/api/v1/contributor/${socialInsuranceNo}/ui/${benefitRequestId}/payment-detail`;
    service.getUiPaymentDetails(socialInsuranceNo, benefitRequestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it getUiTransactionHistoryDetails', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const baseurl = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/transaction-history`;
    service.getUiTransactionHistoryDetails(sin, benefitRequestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });
  it('it  getUiAdjustmentDetails', () => {
    const socialInsuranceNo = 367189827;
    const benefitRequestId = 1002210558;
    const baseurl = `/api/v1/contributor/${socialInsuranceNo}/ui/${benefitRequestId}/adjustments`;
    service.getUiAdjustmentDetails(socialInsuranceNo, benefitRequestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(baseurl);
    expect(req.request.method).toBe('GET');
  });

  it('to set closing status', () => {
    const closedStatus = new BilingualText();
    service.setClosingstatus(closedStatus);
    expect(service.setClosingstatus).toBeDefined();
  });

  it('to get closing status', () => {
    service.getClosingstatus();
    expect(service.getClosingstatus).toBeDefined();
  });

  it('to get Router Data', () => {
    service.getRouterData();
    expect(service.getRouterData).toBeDefined();
  });

  it('to set social insurance number', () => {
    const socialInsuranceNo = 385093829;
    service.setSocialInsuranceNo(socialInsuranceNo);
    expect(service.setSocialInsuranceNo).toBeDefined();
  });
  it('should hasvalidValue', () => {
    expect(service.hasvalidValue(2323)).not.toEqual(null);
  });
  it('should getPaymentDetails', () => {
    expect(service.getPaymentDetails()).not.toEqual(null);
  });
  it('should getlumpsumBenefitAdjustments', () => {
    expect(service.getlumpsumBenefitAdjustments()).not.toEqual(null);
  });
  it('should getAdjustmentEligiblity', () => {
    expect(service.getAdjustmentEligiblity(65454543, 2012415454)).not.toEqual(null);
  });
  it('should getAdjustmentEligiblity', () => {
    expect(service.getAdjustmentEligiblity(65454543, 2012415454)).not.toEqual(null);
  });
  it('should getActiveSanedAppeal', () => {
    expect(service.getActiveSanedAppeal()).not.toEqual(null);
  });
  it('should setActiveSanedAppeal', () => {
    const appeal = new AppealDetails();
    const ActiveSanedAppeal = {
      appealDetails: appeal,
      benefitRequestId: 76765,
      requestDate: new GosiCalendar(),
      referenceNo: 656554
    };
    expect(service.setActiveSanedAppeal(ActiveSanedAppeal)).not.toEqual(null);
  });
  it('should setRouterData', () => {
    const route = new RouterData();
    expect(service.setRouterData(route)).not.toEqual(null);
  });
  it('should setBenefitStatus', () => {
    expect(service.setBenefitStatus('sdds')).not.toEqual(null);
  });
  it('should setBenefitStatus', () => {
    expect(service.clearBenefitStatus()).not.toEqual(null);
  });
  it('should filterTransactionHistory', () => {
    const transactionHistoryFilter = new TransactionHistoryFilter();
    expect(service.filterTransactionHistory(3232, 53453, transactionHistoryFilter)).not.toEqual(null);
  });
  it('should  filterPaymentHistory', () => {
    const paymentHistoryFilter = new PaymentHistoryFilter();
    expect(service.filterPaymentHistory(3232, 53453, paymentHistoryFilter)).not.toEqual(null);
  });
  it('should getEligibleUiBenefitByType', () => {
    expect(service.getEligibleUiBenefitByType(3232, 'vhgff')).not.toEqual(null);
  });
  it('to set registration number', () => {
    const registrationNo = 13359474;
    service.setRegistrationNo(registrationNo);
    expect(service.setRegistrationNo).toBeDefined();
  });

  it('to get benefit status', () => {
    service.getBenefitStatus();
    expect(service.getBenefitStatus).toBeDefined();
  });

  it('to get person details', () => {
    service.getPersonDetails();
    expect(service.getPersonDetails).toBeDefined();
  });

  it('to get registration number', () => {
    service.getRegistrationNo();
    expect(service.getRegistrationNo).toBeDefined();
  });

  it('to get person id', () => {
    service.getPersonId();
    expect(service.getPersonId).toBeDefined();
  });
});
