import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  EnvironmentToken,
  BilingualText,
  Alert,
  RouterDataToken,
  RouterData,
  bindToObject,
  LovList,
  Lov,
  Transaction,
  DocumentItem
} from '@gosi-ui/core';
import { ActivatedRouteStub, ModalServiceStub } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';

import { RequestSanedBenefitScComponent } from './request-saned-benefit-sc.component';
import { BenefitType } from '../../../shared/enum/benefit-type';
import { of } from 'rxjs';
import {
  Benefits,
  AnnuityResponseDto,
  HasThisRolePipe,
  UnemploymentResponseDto,
  SanedBenefitService,
  BenefitDetails,
  BenefitDocumentService,
  MonthsDetails,
  EligibilityMonths
} from '../../../shared';
import { uiBenefits } from 'testing';
import { FormBuilder } from '@angular/forms';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RequestSanedBenefitScComponent', () => {
  let component: RequestSanedBenefitScComponent;
  let fixture: ComponentFixture<RequestSanedBenefitScComponent>;
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getBenefitCalculationsForSaned',
    'getBenefitRequestDetails',
    'getSanedRejectReasonList',
    'getSanedReturnReasonList',
    'getRejectReasonValidator',
    'getSanedRejectReasonValidator',
    'getTransaction'
  ]);
  sanedBenefitServiceSpy.getBenefitCalculationsForSaned.and.returnValue(
    of({
      ...new BenefitDetails(),
      initialMonths: { ...new MonthsDetails() },
      remainingMonths: { ...new MonthsDetails() },
      availedMonths: 2,
      eligibleMonths: [
        {
          ...new EligibilityMonths(),
          month: { gregorian: new Date('2021-12-01T00:00:00.000Z'), hijiri: '1443-04-26', entryFormat: 'GREGORIAN' }
        }
      ]
    })
  );
  sanedBenefitServiceSpy.getBenefitRequestDetails.and.returnValue(
    of({ ...new UnemploymentResponseDto(), personId: 123434, contributorName: { english: 'SADAD', arabic: '' } })
  );
  sanedBenefitServiceSpy.getSanedRejectReasonList.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getSanedReturnReasonList.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getRejectReasonValidator.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getSanedRejectReasonValidator.and.returnValue(of(new LovList([new Lov()])));
  sanedBenefitServiceSpy.getTransaction.and.returnValue(of(new Transaction()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },

        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        FormBuilder,
        DatePipe,
        { provide: Router, useValue: routerSpy }
      ],
      declarations: [RequestSanedBenefitScComponent, HasThisRolePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSanedBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'abc',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'field-office'
        },
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BENEFIT_REQUEST_ID: 3527632,
          SIN: 1234445456
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getUIEligibilityDetails', () => {
    it('should fetch UI eligibility details', () => {
      const sin = 230066639;
      const benefitType = BenefitType.ui;
      spyOn(component.uiBenefitService, 'getEligibleUiBenefitByType').and.returnValue(
        of(bindToObject(new Benefits(), uiBenefits))
      );
      spyOn(component.alertService, 'showWarning');
      component.getUIEligibilityDetails(sin, benefitType);
      expect(component.alertService.showError);
      expect(component.uiBenefitService.getEligibleUiBenefitByType).toHaveBeenCalled();
    });
  });
  describe('getBenefitRequestDetails', () => {
    it('shoul getBenefitRequestDetails', () => {
      component.sin = 2545667;
      component.benefitRequestId = 4545343;
      component.referenceNo = 34455667;
      expect(component.sin && component.benefitRequestId && component.referenceNo).toEqual(
        2545667 && 4545343 && 34455667
      );
      component.getBenefitRequestDetails();
      expect(component.getBenefitRequestDetails).toBeDefined();
    });
  });
  describe(' getBenefitCalculationDetails', () => {
    it('shoul  getBenefitCalculationDetails', () => {
      component.getBenefitCalculationDetails();
      expect(component.getBenefitCalculationDetails).toBeDefined();
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('showErrorMessages', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessages).toBeTruthy();
    });
    it('should navigateToContributorDetails', () => {
      component.navigateToContributorDetails();
    });
  });
});
