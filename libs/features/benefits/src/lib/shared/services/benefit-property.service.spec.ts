import { TestBed } from '@angular/core/testing';

import { BenefitPropertyService } from './benefit-property.service';
import { Person, BilingualText } from '@gosi-ui/core';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTypeToken, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionHistoryFilter } from '..';

describe('BenefitPropertyService', () => {
  let service: BenefitPropertyService;
  let httpMock: HttpTestingController;

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
    service = TestBed.inject(BenefitPropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('to get PaymentMethod', () => {
    service.getPaymentMethod();
    expect(service.getPaymentMethod).toBeDefined();
  });
  it('to set PaymentMethod', () => {
    service.setPaymentMethod(service.paymentMethod);
    expect(service.setPaymentMethod).toBeDefined();
  });
  it('to get payeeNationality', () => {
    service.getPayeeNationality();
    expect(service.getPayeeNationality).toBeDefined();
  });
  it('to set payeeNationality', () => {
    service.setPayeeNationality(service.payeeNationality);
    expect(service.getPayeeNationality).toBeDefined();
  });
  it('to get payeeType', () => {
    service.getPayeeType();
    expect(service.getPayeeType).toBeDefined();
  });
  it('to set payeeType', () => {
    service.setPayeeType(service.payeeType);
    expect(service.setPayeeType).toBeDefined();
  });
  it('to get NIN', () => {
    service.getNin();
    expect(service.getNin).toBeDefined();
  });

  it('to set NIN', () => {
    const nin = 1097114027;
    service.setNin(nin);
    expect(service.setNin).toBeDefined();
  });
  it('to get  validatorDetails', () => {
    const identifier = 385093829;
    const miscPaymentId = 1003227956;
    const url = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${miscPaymentId}/direct-payment`;
    service.validatorDetails(identifier, miscPaymentId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getHeirAdjustmentDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const personId = 1012661;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/${personId}/adjustments`;
    service.getHeirAdjustmentDetails(sin, benefitRequestId, personId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should   filterTransactionHistory', () => {
    const transactionHistoryFilter = new TransactionHistoryFilter();
    expect(service.filterTransactionHistory(23445, 435465656, transactionHistoryFilter)).not.toEqual(null);
  });
  it('should  getTransactionStatus', () => {
    expect(service.getTransactionStatus()).not.toEqual(null);
  });
  it('to getTransactionHistoryDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/transaction-history`;
    service.getTransactionHistoryDetails(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to set refrence number', () => {
    const referenceNo = 12345;
    service.setReferenceNo(referenceNo);
    expect(service.setReferenceNo).toBeDefined();
  });
  it('to set person details', () => {
    const person = new Person();
    service.setPersonDetails(person);
    expect(service.setPersonDetails).toBeDefined();
  });
  it('to get person details', () => {
    service.getPersonDetails();
    expect(service.getPersonDetails).toBeDefined();
  });
  it('to set person id', () => {
    const personId = 12345;
    service.setPersonId(personId);
    expect(service.setPersonId).toBeDefined();
  });
  it('to  getReferenceNo', () => {
    service.getReferenceNo();
    expect(service.getReferenceNo).toBeDefined();
  });
  it('to setBenType', () => {
    service.setBenType('67676565');
    expect(service.setBenType).toBeDefined();
  });
  it('to  getBenefitAppliedMessage', () => {
    service.getBenefitAppliedMessage();
    expect(service.getBenefitAppliedMessage).toBeDefined();
  });
  it('to setBenefitAppliedMessage', () => {
    const message = new BilingualText();
    service.setBenefitAppliedMessage(message);
    expect(service.setBenefitAppliedMessage).toBeDefined();
  });
  it('to get person id', () => {
    service.getPersonId();
    expect(service.getPersonId).toBeDefined();
  });
  it('to get RequestDate', () => {
    service.getAnnuityStatus();
    expect(service.getAnnuityStatus).toBeDefined();
  });
  it('to   setAnnuityStatus', () => {
    service.setAnnuityStatus('656554');
    expect(service.setAnnuityStatus).toBeDefined();
  });
  it('to getEligibleForVIC', () => {
    service.getEligibleForVIC();
    expect(service.getEligibleForVIC).toBeDefined();
  });
  it('to setEligibleForVIC', () => {
    service.setEligibleForVIC(true);
    expect(service.setEligibleForVIC).toBeDefined();
  });
  it('to getEligibleDependentAmount', () => {
    service.getEligibleDependentAmount();
    expect(service.getEligibleDependentAmount).toBeDefined();
  });
  it('to setEligibleDependentAmount', () => {
    service.setEligibleDependentAmount(true);
    expect(service.setEligibleDependentAmount).toBeDefined();
  });
  it('to AdjustmentDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/adjustments`;
    service.getAdjustmentDetails(sin, benefitRequestId).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to get benType', () => {
    service.getBenType();
    expect(service.getBenType).toBeDefined();
  });
  it('to track Transaction Details', () => {
    const url = `/api/v1/txn-trace?referenceNo=664797`;
    const referenceNo = 664797;
    service.trackTransactionDetails(referenceNo.toString()).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
});
