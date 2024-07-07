/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  BilingualText,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  LovList,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  BenefitConstants,
  BenefitDocumentService,
  BenefitType,
  HoldBenefitDetails,
  HoldBenefitHeading,
  ModifyBenefitService,
  SanedBenefitService,
  UITransactionType,
  Contributor
} from '../../../shared';
import { ValidatorHoldBenefitScComponent } from './validator-hold-benefit-sc.component';
//import { SanedBenefitService, ModifyBenefitService, HoldBenefitDetails, BenefitDocumentService, BenefitType, HoldBenefitHeading, UITransactionType, BenefitConstants } from '../../..';
const routerSpy = { navigate: jasmine.createSpy('navigate') };
const holdServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
  'getSanedReturnReasonList',
  'getSanedRejectReasonList'
]);
holdServiceSpy.getSanedReturnReasonList.and.returnValue(of(<LovList>new LovList([])));
holdServiceSpy.getSanedRejectReasonList.and.returnValue(of(<LovList>new LovList([])));
const validatorpGetService = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
  'getHoldBenefitDetails'
]);
validatorpGetService.getHoldBenefitDetails.and.returnValue(
  of({ ...new HoldBenefitDetails(), contributor: { ...new Contributor(), identity: [] } })
);
const documentService = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
  'getStopBenefitDocuments',
  'getUploadedDocuments'
]);
documentService.getStopBenefitDocuments.and.returnValue(of(new DocumentItem()));
documentService.getUploadedDocuments.and.returnValue(of(new DocumentItem()));
describe('ValidatorHoldBenefitScComponent', () => {
  let component: ValidatorHoldBenefitScComponent;
  let fixture: ComponentFixture<ValidatorHoldBenefitScComponent>;
  let showMoreText = 'BENEFITS.READ-FULL-NOTE';
  let limit = 100;
  let checkBenefitType = BenefitType.stopbenefit;
  beforeEach(async(() => {
    // const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule
      ],
      declarations: [ValidatorHoldBenefitScComponent, BilingualTextPipeMock],
      // RouterTestingModule, TranslateModule.forRoot(),BrowserDynamicTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: ModifyBenefitService, useValue: validatorpGetService },
        { provide: BenefitDocumentService, useValue: documentService },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorHoldBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xdescribe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.limitvalue = limit;
      component.ngOnInit();
      component.language.subscribe(lang => {
        expect(lang).toEqual('en');
      });
      component.socialInsuranceNo = 417171428;
      component.requestId = 1004325373;
      component.referenceNo = 29778515;
      if (component.socialInsuranceNo && component.requestId && component.referenceNo) {
        component.getHoldDetails(component.socialInsuranceNo, component.requestId, component.referenceNo);
        expect(component.getHoldDetails).toBeDefined();
      }
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getHoldDetails', () => {
    it('should getHoldDetails', () => {
      component.socialInsuranceNo = 417171428;
      component.requestId = 1004325373;
      component.referenceNo = 29778515;
      const BenefitType = new BilingualText();
      component.getHoldDetails(component.socialInsuranceNo, component.requestId, component.referenceNo);
      component.holdHeading = new HoldBenefitHeading(BenefitType?.english).toString();
      expect(component.getHoldDetails).toBeDefined();
    });
  });
  describe('fetchDocumentsForHoldBenefit', () => {
    it('should fetch documents for hold benefit', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.requestId = 1004341279;
      component.fetchDocumentsForHoldBenefit();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.fetchDocumentsForHoldBenefit).not.toBeNull();
    });
  });
  describe('getDocumentsForHoldBenefit', () => {
    it('should fetch documents', () => {
      const transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT;
      const transactionType = 'REQUEST_BENEFIT_FO';
      component.requestId = 1004341279;
      // spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getDocumentsForHoldBenefit(transactionKey, transactionType, component.requestId);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('navigateToEdit', () => {
    it('should navigate to apply screen', () => {
      component.navigateToEdit();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BenefitConstants.ROUTE_HOLD_RETIREMENT_PENSION_BENEFIT],
        Object({
          queryParams: Object({
            edit: true
          })
        })
      );
    });
  });
  describe('confirmApproveBenefit', () => {
    it('should show approve modal', () => {
      component.modifyHoldForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(component.modifyHoldForm);
      component.confirmApproveBenefit();
      expect(component.confirmApproveBenefit).toBeDefined();
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should show Reject modal', () => {
      component.modifyHoldForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(component.modifyHoldForm);
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('returnBenefit', () => {
    it('should show returnBenefit modal', () => {
      component.modifyHoldForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnBenefit();
      expect(component.returnBenefit).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      const noteText = 'afdfdf';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
  });
  //ValidatorBaseHelperComponent

  describe('setHeading', () => {
    it('should setHeading', () => {
      component.setHeading('', '', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Non-Occupational Disability Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Non-Occupational Disability Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Jailed Contributor Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Jailed Contributor Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Retirement Pension Benefit (Hazardous Occupation)';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Retirement Pension Benefit (Hazardous Occupation)', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Dependents';
      component.benefitType = 'Early Retirement Pension Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Early Retirement Pension Benefit', 'Add/Modify Dependents', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Heirs';
      component.benefitType = 'Heir Pension Missing Contributor Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Heir Pension Missing Contributor Benefit', 'Add/Modify Heirs', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Add/Modify Heirs';
      component.benefitType = 'Heir Pension Dead Contributor Benefit';
      expect(component.benefitType).toEqual(component.benefitType);
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Heir Pension Dead Contributor Benefit', 'Add/Modify Heirs', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Stop Benefit Waive';
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Stop Benefit Waive', 'Stop Benefit Waive', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.requestType = 'Start Benefit Waive';
      expect(component.requestType).toEqual(component.requestType);
      component.setHeading('Start Benefit Waive', 'Start Benefit Waive', '');
      expect(component.setHeading).toBeDefined();
    });
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should rejectTransaction', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should returnTransaction', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.returnTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should  requestInspection', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.requestInspection(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should show cancel template', () => {
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showCancelTemplate(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'Validator1';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'Validator2';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'GeneralDirectorofOperationsandInsuranceServices';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'FinanceController';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
    it('should setButtonConditions', () => {
      const assignedRole = 'FCApprover';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });

    it('should setButtonConditions', () => {
      const assignedRole = 'Doctor';
      component.setButtonConditions(assignedRole);
      expect(component.setButtonConditions).toBeDefined();
    });
  });
});
