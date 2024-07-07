/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WizardItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { benefitRequestResposeMockData, lovMockData } from 'testing/test-data/features/benefits';
import { BenefitConstants } from '../constants/benefit-constants';
import { UiApply } from '../models';
import { SanedBenefitService } from './saned-benefit.service';

describe('SanedBenefitService', () => {
  let httpMock: HttpTestingController;
  let service: SanedBenefitService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        // { provide: SanedBenefitService, useClass: SanedBenefitMockService },
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(SanedBenefitService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('to get Benefit Calculations For Saned', () => {
    const sin = 385093829;
    const reqDate = new GosiCalendar();
    const url = `/api/v1/contributor/385093829/ui/calculate`;
    service.getBenefitCalculationsForSaned(sin, reqDate).subscribe();
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
    httpMock.verify();
  });
  it('to getBenefitRequestDetails', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 1024008;
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}?referenceNo=${referenceNo}`;
    service.getBenefitRequestDetails(sin, benefitRequestId, referenceNo).subscribe();
    const task = httpMock.expectOne(url);
    expect(task.request.method).toBe('GET');
    httpMock.verify();
  });
  it('Should get SanedRejectReasonList', () => {
    const rejectionListUrl = `/api/v1/lov?category=REGISTRATION&domainName=ReasonForRejectionOfBen`;
    service.getSanedRejectReasonList().subscribe();
    const req = httpMock.expectOne(rejectionListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovMockData);
    httpMock.verify();
  });
  it('Should get SanedReturnReasonList', () => {
    const rejectionListUrl = `/api/v1/lov?category=REGISTRATION&domainName=TransactionReturnReason`;
    service.getSanedReturnReasonList().subscribe();
    const req = httpMock.expectOne(rejectionListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovMockData);
  });
  it('Should get RejectReasonValidator', () => {
    const rejectionListUrl = `/api/v1/lov?category=REGISTRATION&domainName=ReasonForRejectionOfBen`;
    service.getRejectReasonValidator().subscribe();
    const req = httpMock.expectOne(rejectionListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovMockData);
    httpMock.verify();
  });
  it('Should get SanedRejectReasonValidator', () => {
    const rejectionListUrl = `/api/v1/lov?category=REGISTRATION&domainName=ReasonForRejectionOfSaned`;
    service.getSanedRejectReasonValidator().subscribe();
    const req = httpMock.expectOne(rejectionListUrl);
    expect(req.request.method).toBe('GET');
    req.flush(lovMockData);
  });
  it('should getSanedWizardItems', () => {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.UI_SANED_DETAILS, 'Benefits'));
    service.getSanedWizardItems();
    expect(service.getSanedWizardItems().length).toEqual(1);
  });
  describe('apply Saned Benefit ', () => {
    // it('should apply Saned Benefit', () => {
    //   const sin = 385093829;
    //   const data = new UiApply();
    //   data.appealReason = null;
    //   data.requestDate = new GosiCalendar();
    //   const url = `/api/v1/contributor/${sin}/ui`;
    //   service.applySanedBenefit(sin, data).subscribe(response => {
    //     expect(response).toBeDefined();
    //   });

    //   const req = httpMock.expectOne(url);
    //   expect(req.request.method).toBe('POST');
    //   req.flush(benefitRequestResposeMockData);
    // });
    it('should update Saned Benefit', () => {
      const sin = 385093829;
      const benefitRequestId = 1003227956;
      const payload = new UiApply();
      const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}`;
      service.updateBenefit(sin, benefitRequestId, payload).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(benefitRequestResposeMockData);
    });
  });

  it('should revert Saned Benefit', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const referenceNo = 664797;

    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}/revert`;
    service.revertBenefit(sin, benefitRequestId, referenceNo).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(benefitRequestResposeMockData);
  });

  it('should patch Benefit', () => {
    const sin = 385093829;
    const benefitRequestId = 1003227956;
    const comments = 'success';
    const comment = { comments };
    const referenceNo = 664797;
    const url = `/api/v1/contributor/${sin}/ui/${benefitRequestId}`;

    service.patchBenefit(sin, benefitRequestId, comment, referenceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(benefitRequestResposeMockData);
    httpMock.verify();
  });

  // it('should fetch active annuity benefits', () => {
  // const socialInsuranceNo = 385093829;
  // const url = `/api/v1/contributor/${socialInsuranceNo}/benefit?status=Active`;
  // const params = '?';
  // const url = `/api/v1/contributor/${socialInsuranceNo}/benefit`;
  // service.getActiveAnnuityBenefits(socialInsuranceNo).subscribe(response => {
  //   expect(response).toBeTruthy();
  // });
  // const req = httpMock.expectOne(url);
  // expect(req.request.method).toBe('GET');
  // req.flush(benefitRequestResposeMockData);
  // });

  // it('should fetch active and draf benefits', () => {
  //   const socialInsuranceNo = 385093829;
  //   const url = `/api/v1/contributor/${socialInsuranceNo}/benefit?status=Active&status=Draft`;
  //   service.getBenefitsInActiveAndDraft(socialInsuranceNo).subscribe(response => {
  //     expect(response).toBeTruthy();
  //   });
  //   const req = httpMock.expectOne(url);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(benefitRequestResposeMockData);
  // });

  it('should fetch active UI Benefits', () => {
    const socialInsuranceNo = 385093829;
    const url = `/api/v1/contributor/${socialInsuranceNo}/ui`;

    service.getActiveUiBenefits(socialInsuranceNo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(benefitRequestResposeMockData);
    httpMock.verify();
  });
  it('should getSanedInspectionType', () => {
    expect(service.getSanedInspectionType()).not.toEqual(null);
  });
  it('should editDirectPayment', () => {
    expect(service.editDirectPayment(2123, 565656, 'gfgd')).not.toEqual(null);
  });
  it('should editBenefitDirectPayment', () => {
    expect(service.editBenefitDirectPayment(2123, 565656, 'gfgd')).not.toEqual(null);
  });
  it('should editHeirDirectPayment', () => {
    const directPaymentRequest = {
      sin: 234344
    };
    expect(service.editHeirDirectPayment(2123, 565656, 'gfgd', directPaymentRequest)).not.toEqual(null);
  });
  it('should applySanedBenefit', () => {
    const UiApply = {
      requestDate: new GosiCalendar()
    };
    expect(service.applySanedBenefit(2123, UiApply)).not.toEqual(null);
  });
  it('should  getTransaction', () => {
    expect(service.getTransaction(2123)).not.toEqual(null);
  });
  it('should getSanedHoldReasons', () => {
    expect(service.getSanedHoldReasons()).not.toEqual(null);
  });
  it('should getAppealWizardItems', () => {
    expect(service.getAppealWizardItems()).not.toEqual(null);
  });
  it('should getBenefitsWithStatus', () => {
    expect(service.getBenefitsWithStatus(2323, [])).not.toEqual(null);
  });
  it('should getSanedHoldReasons', () => {
    expect(service.getSanedHoldReasons()).not.toEqual(null);
  });
  it('should  getBenefitRecalculateDetails', () => {
    expect(service.getBenefitRecalculateDetails(32323, 21345)).not.toEqual(null);
  });
});
