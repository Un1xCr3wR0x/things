/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  ExchangeRateService,
  LookupService,
  RouterData,
  RouterDataToken,
  RouterConstants,
  ExchangeRate,
  bindToObject,
  bindToForm
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  establishmentDetailsGCC,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  rejectionReasonListData,
  eventFormData,
  exchangeRateMockData,
  commentFormData
} from 'testing';
import {
  BillEstablishmentServiceStub,
  ContributionPaymentServiceStub,
  ExchangeRateServiceStub
} from 'testing/mock-services';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { EstablishmentDetails } from '../../../shared/models';
import { ContributionPaymentService, EstablishmentService } from '../../../shared/services';
import { ValidatePaymentScComponent } from './validate-payment-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaymentForm } from 'testing/mock-components';

describe('ValidatePaymentScComponent', () => {
  let component: ValidatePaymentScComponent;
  let fixture: ComponentFixture<ValidatePaymentScComponent>;

  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getRegistrationReturnReasonList',
    'getEstablishmentRejectReasonList'
  ]);
  lookupServiceSpy.getEstablishmentRejectReasonList.and.returnValue(of(rejectionReasonListData));
  lookupServiceSpy.getRegistrationReturnReasonList.and.returnValue(of(rejectionReasonListData));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidatePaymentScComponent],
      providers: [
        FormBuilder,
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        {
          provide: ContributionPaymentService,
          useClass: ContributionPaymentServiceStub
        },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },

        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidatePaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for payment details', () => {
      expect(component.showContent).not.toEqual(null);
      expect(component.rejectReasonList).not.toEqual(null);
      expect(component.returnReasonList).not.toEqual(null);
    });
  });
  describe('intialise the view', () => {
    it('should intialise the view for validator', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'receive-contribution';
      token.taskId = '131';
      token.payload = '{"registrationNo":502351249,"id":100036}';
      token.assignedRole = 'Validator2';
      spyOn(component.documentService, 'getDocuments').and.returnValue(of(documentListItemArray));
      component.ngOnInit();
      expect(component.paymentDetails).not.toBe(undefined);
    }));
  });

  describe('get data for view', () => {
    it('should get data for gcc establishment', () => {
      const payload = { registartionNo: 502351249, id: 100036 };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(new EstablishmentDetails().fromJsonToObject(establishmentDetailsGCC))
      );
      component.getDataForView(payload);
      expect(component.gccFlag).toBeTruthy();
    });

    it('should get data for mof', () => {
      const payload = { registartionNo: 502351249, id: 100036 };
      component.isMOF = true;
      component.getDataForView(payload);
      expect(component.paymentDetails).toBeTruthy();
    });
  });

  describe('get screen header', () => {
    it('should get heading for gcc establishment admin', () => {
      component.isGOL = true;
      component.gccFlag = true;
      component.getScreenHeaders();
      expect(component.mainHeading).toContain('GCC');
    });
    it('should get heading for non gcc establishment admin', () => {
      component.isGOL = true;
      component.gccFlag = false;
      component.getScreenHeaders();
      expect(component.mainHeading).toContain('NOTICE');
    });
  });

  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.returnTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm reject transaction', () => {
    it('should confirm the rejection of transaction', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component, 'navigateToInbox');
      component.confirmReject();
      expect(component.modalRef).not.toEqual(null);
    });
    it('should throw error on reject', () => {
      spyOn(component.validatorService, 'rejectPayment').and.returnValue(throwError(genericError));
      component.modalRef = new BsModalRef();
      spyOn(component, 'navigateToInbox');
      component.confirmReject();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm approve transaction', () => {
    it('should confirm the approval of transaction', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component, 'navigateToInbox').and.callThrough();
      component.confirmApprove();
      expect(component.modalRef).not.toEqual(null);
    });
    it('should throw error on approve', () => {
      spyOn(component.validatorService, 'approvePayment').and.returnValue(throwError(genericError));
      component.modalRef = new BsModalRef();
      spyOn(component, 'navigateToInbox');
      component.confirmApprove();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('confirm return transaction', () => {
    it('should confirm the return of transaction', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component, 'navigateToInbox').and.callThrough();
      component.confirmReturn();
      expect(component.modalRef).not.toEqual(null);
    });
    it('should throw error on return', () => {
      spyOn(component.validatorService, 'returnPayment').and.returnValue(throwError(genericError));
      component.modalRef = new BsModalRef();
      spyOn(component, 'navigateToInbox');
      component.confirmReturn();
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();

      expect(component.modalRef).not.toEqual(null);
    });
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('navigate to edit screen', () => {
    it('should navigate to capture details screen on edit', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToCapture();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
  });

  describe('navigate to edit document screen', () => {
    it('should navigate to document screen on edit', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToScan();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'decline');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('getConversionRate', () => {
    xit('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
      component.getConversionRates(eventFormData);
      expect(component.currencyDetails.exchangeRate).not.toBeNull();
      expect(component.paymentDetails).toBeDefined();
      expect(component.currency).toBeDefined();
    });
  });
  describe('navigateToInbox', () => {
    it('It should navigate to navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      component.navigateToInbox('pass');
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('navigateToCapture', () => {
    it('It should navigate to navigateToCapture', () => {
      spyOn(component.router, 'navigate');
      component.navigateToCapture();
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('navigateToScan', () => {
    it('It should navigate to navigateToScan', () => {
      spyOn(component.router, 'navigate');
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('confirmCancel', () => {
    it('It should navigate to confirmCancel', () => {
      spyOn(component.router, 'navigate');
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should submit payment details after edit', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);
      component.paymentValidatorForm.addControl('comments', commentsForm);
      spyOn(component.router, 'navigate');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalledTimes(0);
    });
  });

  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.returnTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('approve transation', () => {
    it('should trigger the approve popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.paymentValidatorForm = getForm();
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
});

function getForm() {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    taskId: [null],
    receiptNumber: [null],
    user: [null],
    type: [null]
  });
}
