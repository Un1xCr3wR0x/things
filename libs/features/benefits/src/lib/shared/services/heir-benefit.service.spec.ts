/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WizardItem,
  BPMUpdateRequest
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { HeirBenefitService } from '.';
import { BenefitConstants } from '../constants/benefit-constants';
import { BenefitType } from '../enum/benefit-type';
import {
  HeirBenefitFilter,
  HeirDetailsRequest,
  HeirUnbornRequest,
  HeirVerifyRequest,
  ValidateHeir,
  DependentDetails,
  DependentHistoryFilter,
  AdjustmentRepaySetvalues,
  RepaymentValues
} from '../models';

describe('HeirBenefitService', () => {
  let httpMock: HttpTestingController;
  let service: HeirBenefitService;
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
    service = TestBed.inject(HeirBenefitService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to get BenefitsByType', () => {
    const sin = 385093829;
    const benefitType = BenefitType.heirPension;
    const url = `/api/v1/contributor/${sin}/benefit/eligibility?benefitType=${benefitType}`;
    service.getEligibleBenefitByType(sin, benefitType).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('should getHeirPensionItems', () => {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.REASON_FOR_BENEFIT, 'BenefitReason'));
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
    expect(service.getHeirPensionItems).toBeDefined();
  });
  it('to get AllHeirDetails', () => {
    const sin = 385093829;
    const heirDetailsData = new HeirDetailsRequest();
    const benefitType = 'Heir Pension Benefit';
    heirDetailsData.eventDate = new GosiCalendar();
    heirDetailsData.reason = new BilingualText();
    const isBackdated = 'true';
    const url = `/api/v1/contributor/${sin}/heir`;
    service.getAllHeirDetails(sin, heirDetailsData, benefitType, isBackdated);
    // service.getAllHeirDetails(sin, heirDetailsData, benefitType).subscribe(response => {
    //   expect(response).toBeTruthy();
    // });
    // const task = httpMock.expectOne(url);
    // expect(task.request.method).toBe('GET');
    expect(service.getAllHeirDetails).toBeDefined();
  });
  it('should check if person is a Custodian', () => {
    const guardianNin = 1097114027;
    const heirNin = 1001627262;
    const params = new HttpParams();
    // const url = `/api/v1/person/${guardianNin}/custody`;
    service.checkCustodian(guardianNin, heirNin);
    // const task = httpMock.expectOne(url);
    // // expect(task.request.method).toBe('GET');
    expect(service.checkCustodian).toBeDefined();
  });
  it('to check hasvalidValue', () => {
    const val = 1;
    service.hasvalidValue(val);
    expect(service.hasvalidValue).toBeDefined();
  });
  it('to set UnbornRequest', () => {
    const heirUnborn = new HeirUnbornRequest();
    service.setUnbornRequest(heirUnborn);
    expect(service.setUnbornRequest).toBeDefined();
  });
  it('to get UnbornRequest', () => {
    service.getUnbornRequest();
    expect(service.getUnbornRequest).toBeDefined();
  });
  it('should filter Heir Benefit by Detail', () => {
    const socialInsuranceNumber = 367189827;
    const benefitRequestId = 1002210558;
    const heirFilter = new HeirBenefitFilter();
    const baseUrl = `/api/v1/contributor`;
    service.filterUrl = `${baseUrl}/${socialInsuranceNumber}/benefit/${benefitRequestId}/heir-hist?`;
    service.filterHeirBenefitByDetail(socialInsuranceNumber, benefitRequestId, heirFilter).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(service.filterUrl);
    expect(req.request.method).toBe('GET');
  });
  it('should update Heir Benefit', () => {
    const sin = 367189827;
    const benefitRequestId = 1002210558;
    const data = new ValidateHeir();
    const benefitType = 'HeirPensionBenefit';
    let url = `/api/v1/contributor/${sin}/heir/_validate?benefitRequestId=${benefitRequestId}&benefitType=${benefitType}`;
    service.validateHeir(sin, data, '', benefitRequestId, benefitType).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
  });

  it('should register heir', () => {
    const id = 178565;
    const data = new HeirVerifyRequest();
    const url = `/api/v1/heir/${id}/account`;
    service.registerHeir(id, data).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
  });
  it('should verify heir', () => {
    const id = 178565;
    const data = new HeirVerifyRequest();
    const url = `/api/v1/heir/${id}/account/_verify`;
    service.verifyHeir(id, data).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
  });

  it('should get PersionId', () => {
    const personId = 178565;
    const url = `/api/v1/person/${personId}`;
    service.getPersonById(personId).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('to  addHeir', () => {
    const benefitRequestId = 565654564;
    const sin = 23453543434;
    const referenceNo = 23453543434;
    const data = new DependentDetails();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir?referenceNo=${referenceNo}`;
    service.addHeir(sin, benefitRequestId, referenceNo, data, false).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('POST');
  });
  it('to fetchAdjustmentRepayment', () => {
    const adjustmentRepayId = 565654564;
    const personId = 23453543434;
    const referenceNo = 23453543434;
    const sin = 23453543434;
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/${adjustmentRepayId}?referenceNo=${referenceNo}`;
    service.fetchAdjustmentRepayment(adjustmentRepayId, personId, referenceNo, sin).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
  });
  it('to getBenefitLists', () => {
    expect(service.getBenefitLists(34455, 676788)).not.toEqual(null);
  });
  it('to  getHeirBenefitHistory', () => {
    expect(service.getHeirBenefitHistory(34455, 676788)).not.toEqual(null);
  });
  it('to getAccountRequestDetails', () => {
    expect(service.getAccountRequestDetails(34455, 676788)).not.toEqual(null);
  });
  it('to getHeirLinkedContributors', () => {
    expect(service.getHeirLinkedContributors(34455)).not.toEqual(null);
  });
  it('to getHeirHistoryDetails', () => {
    expect(service.getHeirHistoryDetails(34455, 8745875, 646467)).not.toEqual(null);
  });
  it('to getDemoHeirDetails', () => {
    expect(service.getDemoHeirDetails()).not.toEqual(null);
  });
  it('to getBankDetailsList', () => {
    expect(service.getBankDetailsList()).not.toEqual(null);
  });
  it('to getAttorneyList', () => {
    expect(service.getAttorneyList()).not.toEqual(null);
  });
  it('to  getHeirBenefit', () => {
    expect(service.getHeirBenefit(23344, 'ggfdg', 1222, ['dsd'], false)).not.toEqual(null);
  });
  it('to getHeirById', () => {
    expect(service.getHeirById(23344, '34434', 3443555, 'efdf', ['dfdff'], false)).not.toEqual(null);
  });
  it('to getHeirForValidatorScreen', () => {
    expect(service.getHeirForValidatorScreen(23344, '34434', 3443555, 'efdf', ['dfdff'])).not.toEqual(null);
  });
  it('to getBenefitReasonList', () => {
    expect(service.getBenefitReasonList()).not.toEqual(null);
  });
  it('to updateTaskWorkflow', () => {
    const data = new BPMUpdateRequest();
    expect(service.updateTaskWorkflow(data)).not.toEqual(null);
  });
  it('to setHeirUpdateWarningMsg', () => {
    expect(service.setHeirUpdateWarningMsg(true)).not.toEqual(null);
  });
  it('to getHeirUpdateWarningMsg', () => {
    expect(service.getHeirUpdateWarningMsg()).not.toEqual(null);
  });
  it('to  filterHeirHistory', () => {
    const heirHistoryFilter = new DependentHistoryFilter();
    expect(service.filterHeirHistory(3344, 56566, heirHistoryFilter)).not.toEqual(null);
  });
  it('to getAdjustmentRepaymentDetails', () => {
    expect(service.getAdjustmentRepaymentDetails()).not.toEqual(null);
  });
  it('to setAdjustmentRepaymentDetails', () => {
    const repaymentDetails = new RepaymentValues();
    const data = new AdjustmentRepaySetvalues(34654, [], repaymentDetails, 2323, 323);
    expect(service.setAdjustmentRepaymentDetails(data)).not.toEqual(null);
  });
});
