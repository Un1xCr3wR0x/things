/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  GosiCalendar
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  DocumentServiceStub,
  genericErrorOh,
  LookupServiceStub,
  ManagePersonServiceStub,
  ModalServiceStub
} from 'testing';
import {
  AnnuityResponseDto,
  ReturnLumpsumDetails,
  ReturnLumpsumResponse,
  ReturnLumpsumService,
  BenefitConstants,
  ReturnLumpsumPaymentDetails,
  ManageBenefitService
} from '../../../shared';
import { ReturnLumpsumScComponent } from './return-lumpsum-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('ReturnLumpsumScComponent', () => {
  let component: ReturnLumpsumScComponent;
  let fixture: ComponentFixture<ReturnLumpsumScComponent>;
  const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('put') };
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'refreshDocument',
    'getRequiredDocuments'
  ]);
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getSavedActiveBenefit',
    'getActiveBenefitDetails',
    'repaymentPost',
    'submitSadadPayment',
    'setIsUserSubmitted',
    'getBankLovList',
    'getReqDocsForReturnLumpsum',
    'sortLovList',
    'repaymentPost',
    'setIsUserSubmitted',
    'getRepayId',
    'otherPaymentSubmit',
    'getActiveBenefitDetails',
    'getLumpsumRepaymentDetails'
  ]);
  returnLumpsumServicespy.getReqDocsForReturnLumpsum.and.returnValue(of([new DocumentItem()]));
  returnLumpsumServicespy.otherPaymentSubmit.and.returnValue(of(new ReturnLumpsumResponse()));
  returnLumpsumServicespy.submitSadadPayment.and.returnValue(of(new ReturnLumpsumResponse()));
  returnLumpsumServicespy.getActiveBenefitDetails.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      personId: 1234,
      benefitType: { english: 'Pension', arabic: 'Pension' },
      enabledRestoration: true,
      fromJsonToObject: json => json
    })
  );
  returnLumpsumServicespy.repaymentPost.and.returnValue(of(new ReturnLumpsumResponse()));
  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(of(new ReturnLumpsumDetails()));
  //returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(throwError(genericError));
  returnLumpsumServicespy.getActiveBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getSystemRunDate',
    'updateAnnuityWorkflow',
    'revertAnnuityBenefit'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.updateAnnuityWorkflow.and.returnValue(of());
  manageBenefitServiceSpy.revertAnnuityBenefit.and.returnValue(of());
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ReturnLumpsumScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: HttpClient, useValue: httpSpy },
        { provide: LookupService, useClass: LookupServiceStub },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnLumpsumScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect(component.getLookupValues).not.toEqual(null);
      expect(component.getDocumentRelatedValues).not.toEqual(null);
    });
  });
  describe('paymentTypeChange', () => {
    it('should toggle the payment method', () => {
      const paymentType = 'sadad';
      component.paymentTypeChange(paymentType);
      expect(component.paymentTypeChange).toBeDefined();
    });
  });
  describe('paymentTypeChange other', () => {
    it('should toggle the payment method', () => {
      const paymentType = 'other';
      component.paymentTypeChange(paymentType);
      expect(component.paymentTypeChange).toBeDefined();
      expect(component.getLookupValues).toBeDefined();
      expect(component.getDocumentRelatedValues).toBeDefined();
    });
  });
  describe('getDocumentRelatedValues', () => {
    it('should getDocumentRelatedValues', () => {
      //spyOn(component.returnLumpsumService, 'getReqDocsForReturnLumpsum').and.callThrough();
      component.getDocumentRelatedValues();
      expect(component.otherPaymentReqDocument).not.toEqual(null);
    });
  });
  describe('createSadadPaymentForm', () => {
    it('should createSadadPaymentForm', () => {
      component.createSadadPaymentForm();
      expect(component.createSadadPaymentForm).toBeDefined();
    });
  });
  xdescribe('getBenefitDetails', () => {
    it('should getBenefitDetails', () => {
      component.sin = 367189827;
      component.benefitRequestId = 1002210558;
      expect(component.sin && component.benefitRequestId).toBeDefined();
      component.referenceNumber = 105582;
      component.getBenefitDetails(component.sin, component.benefitRequestId, component.referenceNumber);
      expect(component.appledBenefitDetails).not.toEqual(null);
      expect(component.nin).not.toEqual(null);
      expect(component.benefitAmount).not.toEqual(null);
    });
  });
  describe('getActiveBenefitDetails', () => {
    it('should  getActiveBenefitDetails', () => {
      component.sin = 367189827;
      component.benefitRequestId = 1002210558;
      component.referenceNumber = 105582;
      component.getActiveBenefitDetails(component.sin, component.benefitRequestId, component.referenceNumber);
      expect(component.getActiveBenefitDetails).toBeDefined();
    });
  });
  xdescribe('getSanadAccNo', () => {
    it('should getSanadAccNo', () => {
      component.sin = 367189827;
      component.benefitRequestId = 1002210558;
      component.referenceNumber = 105582;
      spyOn(component.returnLumpsumService, 'getActiveBenefitDetails');
      component.returnLumpsumService.getActiveBenefitDetails(
        component.sin,
        component.benefitRequestId,
        component.referenceNumber
      );
      expect(component.appledBenefitDetails).not.toBeNull();
    });
  });
  xdescribe('getActiveBenefitDetails', () => {
    it('shouldgetActiveBenefitDetails', () => {
      component.sin = 367189827;
      component.benefitRequestId = 1002210558;
      component.referenceNumber = 105582;
      component.getActiveBenefitDetails(component.sin, component.benefitRequestId, component.referenceNumber);
      expect(component.getActiveBenefitDetails).toBeDefined();
    });
  });
  describe('sadadPaymentFormSubmit', () => {
    it('should sadadPaymentFormSubmit', () => {
      spyOn(component, 'sadadPaymentFormSubmit').and.callThrough();
      const Return: ReturnLumpsumPaymentDetails = {
        paymentMethod: { english: '', arabic: '' },
        additionalPaymentDetails: 'ab',
        // paymentReferenceNo: 12133,
        amountTransferred: 43434,
        // bankName?: BilingualText;
        bankType: { english: '', arabic: '' },
        referenceNo: 232323,
        transactionDate: null,
        receiptMode: { english: '', arabic: '' },
        uuid: ''
      };
      component.sadadPaymentFormSubmit(Return);
      expect(component.sadadPaymentFormSubmit).not.toBeNull();
    });
  });
  describe('submitOtherPaymentDetails', () => {
    it('should submitOtherPaymentDetails', () => {
      component.inEditMode = false;
      // component.totalAmountToBePaid = 1234;
      component.referenceNumber = 1234;
      //component.personId = 1234;
      //component.adjustmentRepayId = 1234;
      component.receiveContributionMainForm = new FormGroup({
        repaymentDetails: new FormGroup({
          amountTransferred: new FormGroup({ amount: new FormControl({ value: 1234 }) }),
          comments: new FormControl({ value: '' }),
          additionalPaymentDetails: new FormControl({ value: '' }),
          bankName: new FormControl({ value: '' }),
          // paymentReferenceNo: new FormControl({ value: '1234' }),
          transactionDate: new FormControl({ value: new GosiCalendar() })
        }),
        receiptMode: new FormGroup({ receiptMode: new FormControl({ value: '' }) })
      });
      component.submitOtherPaymentDetails();
      expect(component.returnPaymentResponse).not.toEqual(null);
    });
  });
  describe('sadadProceedTopay', () => {
    it('should sadadProceedTopay', () => {
      spyOn(component, 'sadadProceedTopay').and.callThrough();
      const Return: ReturnLumpsumPaymentDetails = {
        paymentMethod: { english: '', arabic: '' },
        additionalPaymentDetails: 'ab',
        paymentReferenceNo: 12133,
        amountTransferred: 43434,
        // bankName?: BilingualText;
        bankType: { english: '', arabic: '' },
        referenceNo: 232323,
        transactionDate: null,
        receiptMode: { english: '', arabic: '' },
        uuid: ''
      };
      component.sadadProceedTopay(Return);
      expect(component.sadadProceedTopay).not.toBeNull();
    });
  });
  xdescribe('sadadPaymentFormSubmit', () => {
    it('should  sadadPaymentFormSubmit', () => {
      const returnLumpsum = {
        paymentMethod: {
          arabic: '',
          english: 'unknown'
        },
        additionalPaymentDetails: null,
        amountTransferred: 2000,
        bankName: {
          arabic: '',
          english: 'unknown'
        },
        bankType: {
          arabic: '',
          english: 'unknown'
        },

        referenceNo: 1000045428,
        transactionDate: { gregorian: new Date('2020-12-01'), hijiri: '' },
        receiptMode: {
          arabic: '',
          english: 'unknown'
        },
        uuid: 'uuid'
      };
      //spyOn(component.returnLumpsumService, 'repaymentPost').and.callThrough();
      component.sadadProceedTopay(returnLumpsum);
      //spyOn(component.returnLumpsumService, 'submitSadadPayment').and.callThrough();
      component.sadadPaymentFormSubmit(returnLumpsum);
      component.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
      expect(component.router.navigate).toBeDefined();
      expect(component.repayID).not.toBeNull();
      expect(component.sadadPaymentFormSubmit).not.toBeNull();
    });
    // it('should  sadadPaymentFormSubmit', () => {
    //   const returnLumpsum = {
    //     paymentMethod: {
    //       arabic: '',
    //       english: 'unknown'
    //     },
    //     additionalPaymentDetails: null,
    //     amountTransferred: 2000,
    //     bankName: {
    //       arabic: '',
    //       english: 'unknown'
    //     },
    //     bankType: {
    //       arabic: '',
    //       english: 'unknown'
    //     },

    //     referenceNo: 1000045428,
    //     transactionDate: { gregorian: new Date('2020-12-01'), hijiri: '' },
    //     receiptMode: {
    //       arabic: '',
    //       english: 'unknown'
    //     },
    //     uuid: 'uuid'
    //   };
    //   spyOn(component.returnLumpsumService, 'submitSadadPayment').and.callThrough();
    //   component.sadadPaymentFormSubmit(returnLumpsum);
    // });

    it('should throw error ', () => {
      const returnLumpsum = {
        paymentMethod: {
          arabic: '',
          english: 'unknown'
        },
        additionalPaymentDetails: null,
        amountTransferred: 2000,
        bankName: {
          arabic: '',
          english: 'unknown'
        },
        bankType: {
          arabic: '',
          english: 'unknown'
        },

        referenceNo: 1000045428,
        transactionDate: { gregorian: new Date('2020-12-01'), hijiri: '' },
        receiptMode: {
          arabic: '',
          english: 'unknown'
        },
        uuid: 'uuid'
      };
      // spyOn(component.returnLumpsumService, 'repaymentPost').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showErrorMessage').and.callThrough();
      component.sadadProceedTopay(returnLumpsum);
      expect(component.showErrorMessage).toBeDefined();
    });
  });
  describe('filterrecepitModes', () => {
    it('should filterrecepitModes', () => {
      component.filterrecepitModes();
      expect(component.filterrecepitModes).toBeDefined();
    });
  });
  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      //spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.callThrough();
      component.saveWorkflowInEdit();
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
    it('should throw error ', () => {
      //spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showErrorMessage').and.callThrough();
      component.saveWorkflowInEdit();
      expect(component.showErrorMessage).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      component.refreshDocument(document);
      expect(component.refreshDocument).toBeDefined();
    });
  });
  describe('getUploadedDocuments', () => {
    it('should fetch documents', () => {
      spyOn(component, 'getUploadedDocuments').and.callThrough();
      component.getUploadedDocuments();
      expect(component.benefitDocumentService.getUploadedDocuments).toBeDefined();
      expect(component.otherPaymentReqDocument).not.toBeNull();
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      const payload = {
        sin: 502351249,
        benefitRequestId: 100036,
        repayID: 1000045428,
        channel: {
          arabic: '',
          english: 'unknown'
        },
        role: 'Validator 1'
      };
      component.initialiseViewForEdit(payload);
      expect(component.receiptDetails).not.toEqual(null);
    });
  });
  xdescribe('initialiseViewForEdit', () => {
    it('should get initialiseViewForEdit error', () => {
      const payload = {
        sin: 502351249,
        benefitRequestId: 100036,
        repayID: 1000045428,
        channel: {
          arabic: '',
          english: 'unknown'
        },
        role: 'Validator 1'
      };
      spyOn(component.alertService, 'showError');
      component.initialiseViewForEdit(payload);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('cancelForm', () => {
    it('should cancelForm', () => {
      component.inEditMode = true;
      component.cancelForm();
      spyOn(component.router, 'navigate');
      // spyOn(component.manageBenefitService, 'revertAnnuityBenefit').and.callThrough();
      expect(component.cancelForm).toBeDefined();
    });
    it('should cancelForm', () => {
      component.inEditMode = false;
      spyOn(component.router, 'navigate');
      //spyOn(component.manageBenefitService, 'revertAnnuityBenefit').and.callThrough();
      component.cancelForm();
      expect(component.cancelForm).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('handle error', () => {
    it('should showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('goToTop', () => {
    it('should goToTop', () => {
      component.goToTop();
      expect(component.goToTop).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
