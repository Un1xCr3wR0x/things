/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BilingualTextPipeMock, holdBenefitData, genericError } from 'testing';
import { ActivatedRouteStub, ManagePersonServiceStub, ModalServiceStub } from 'testing/mock-services';
import { ValidatorRestartBenefitScComponent } from './validator-restart-benefit-sc.component';
import {
  HoldBenefitDetails,
  ModifyBenefitService,
  UITransactionType,
  BenefitDocumentService,
  BenefitConstants,
  Contributor,
  RecalculationConstants,
  ManageBenefitService,
  BenefitDetails
} from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
  'getAnnuityBenefitRequestDetail',
  'getBenefitCalculationDetailsByRequestId',
  'getBenefitCalculationDetailsByRequestId',
  'getSystemParams',
  'getSystemRunDate',
  'setValues'
]);
manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
  'getRestartCalculation',
  'getRestartDetails',
  'restartDirectPayment'
]);
modifyBenefitServiceSpy.getRestartCalculation.and.returnValue(
  of(bindToObject(new HoldBenefitDetails(), holdBenefitData))
);
modifyBenefitServiceSpy.restartDirectPayment.and.returnValue(of(new HoldBenefitDetails()));
modifyBenefitServiceSpy.getRestartDetails.and.returnValue(
  of({ ...new HoldBenefitDetails(), contributor: { ...new Contributor(), identity: [] } })
);
describe('ValidatorRestartBenefitScComponent', () => {
  let component: ValidatorRestartBenefitScComponent;
  let fixture: ComponentFixture<ValidatorRestartBenefitScComponent>;
  const documentService = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getStopBenefitDocuments',
    'getUploadedDocuments'
  ]);
  documentService.getUploadedDocuments.and.returnValue(of(new DocumentItem()));

  beforeEach(async () => {
    // const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ValidatorRestartBenefitScComponent, BilingualTextPipeMock],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: BenefitDocumentService, useValue: documentService },
        // {
        //   provide: TranslateService,
        //   useValue: translateSpy
        // },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },

        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },

        { provide: Router, useValue: routerSpy },

        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorRestartBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOninit', () => {
    it('should be ngOninit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getRestartBenefitDetails', () => {
    it('should getRestartBenefitDetails', () => {
      const sin = 23452323;
      const benefitRequestId = 234335231;
      const referenceNo = 32211223;
      component.getRestartBenefitDetails(sin, benefitRequestId, referenceNo);
      expect(component.getRestartBenefitDetails).toBeDefined();
    });
  });
  describe('getRestartCalcDetails', () => {
    it('should  getRestartCalcDetails', () => {
      const sin = 23452323;
      const benefitRequestId = 234335231;
      const referenceNo = 32211223;
      component.getRestartCalcDetails();
      component.modifyBenefitService.getRestartCalculation(sin, benefitRequestId, referenceNo).subscribe(res => {
        component.restartCalculations = res;
      });
      expect(component.getRestartCalcDetails).toBeDefined();
    });
  });
  describe('onViewBenefitDetails', () => {
    it('should onViewBenefitDetails', () => {
      component.onViewBenefitDetails();
      expect(component.onViewBenefitDetails).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should  readFullNote', () => {
      const noteText = 'abcdfsdsd';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
  });
  describe('fetchDocumentsForRestart', () => {
    it('should fetchDocumentsForRestart', () => {
      component.requestId = 1004341279;
      component.fetchDocumentsForRestart();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.fetchDocumentsForRestart).not.toBeNull();
    });
  });
  describe('getDocumentsForHoldBenefit', () => {
    it('should fetch documents', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.requestId = 1004341279;
      // spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForRestart(transactionKey, transactionType, component.requestId);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('getBenefitCalculationDetails', () => {
    it('getBenefitCalculationDetails', () => {
      const sin = 1004341279;
      component.benefitRequestId = 4334;
      // spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getBenefitCalculationDetails(sin, component.benefitRequestId);
      expect(component.getBenefitCalculationDetails).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  describe('navigateToEdit', () => {
    it('should navigate to apply screen', () => {
      component.navigateToEdit();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_RESTART_PENSION],
        Object({
          queryParams: Object({
            edit: true
          })
        })
      );
    });
    it('should  navigateToPrevAdjustment', () => {
      component.navigateToPrevAdjustment();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_ADJUSTMENT],
        Object({
          queryParams: Object({
            from: RecalculationConstants.RESTART_CONTRIBUTOR
          })
        })
      );
    });
  });
  describe('confirmApproveBenefit', () => {
    it('should confirmApproveBenefit', () => {
      component.retirementForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveBenefit();
      expect(component.confirmApproveBenefit).toBeDefined();
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should confirmRejectBenefit', () => {
      component.retirementForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('returnBenefit', () => {
    it('should returnBenefit', () => {
      component.retirementForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnBenefit();
      expect(component.returnBenefit).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      spyOn(component, 'readFullNote');
      // component.readFullNote();
      expect(component.readFullNote).toBeDefined();
    });
  });
  describe('showModal1', () => {
    it('should showModal1', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal1(modalRef);
      expect(component.showModal1).toBeDefined();
    });
  });
});
