import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import {
  ApplicationTypeToken,
  RouterData,
  RouterDataToken,
  LanguageToken,
  DocumentItem,
  bindToObject,
  BilingualText,
  Alert,
  LovList,
  LookupService,
  WizardItem
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MiscPaymentScComponent } from './misc-payment-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  PaymentService,
  MiscellaneousPayment,
  MiscellaneousPaymentRequest,
  PaymentConstants,
  PatchPaymentResponse
} from '../../../shared';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { paymentDetail } from '../../../shared/test-data/payment';
import { AlertService, DocumentService } from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  LookupServiceStub
} from 'testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';

describe('MiscPaymentScComponent', () => {
  let component: MiscPaymentScComponent;
  let fixture: ComponentFixture<MiscPaymentScComponent>;
  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>('PaymentService', [
    'fetchPaymentdetails',
    'validatorDetails',
    'getPaymentRejectReasonList',
    'getPaymentReturnReasonList',
    'submitPaymentDetails',
    'editPaymentDetails',
    'handleAnnuityWorkflowActions',
    'patchPaymentDetails'
  ]);
  paymentServiceSpy.getPaymentRejectReasonList.and.returnValue(of(<LovList>new LovList([])));
  paymentServiceSpy.getPaymentReturnReasonList.and.returnValue(of(<LovList>new LovList([])));
  paymentServiceSpy.fetchPaymentdetails.and.returnValue(of(bindToObject(new MiscellaneousPayment(), paymentDetail)));
  paymentServiceSpy.validatorDetails.and.returnValue(
    of(bindToObject(new MiscellaneousPaymentRequest(), paymentDetail))
  );
  paymentServiceSpy.submitPaymentDetails.and.returnValue(of(paymentDetail));
  paymentServiceSpy.editPaymentDetails.and.returnValue(
    of({ ...new PatchPaymentResponse(), referenceNo: 1234, message: { english: '', arabic: '' } })
  );
  paymentServiceSpy.handleAnnuityWorkflowActions.and.returnValue(of({}));
  paymentServiceSpy.patchPaymentDetails.and.returnValue(
    of({ ...new PatchPaymentResponse(), message: { english: '', arabic: '' } })
  );
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'validator' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [MiscPaymentScComponent],
      providers: [
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), taskId: '', assigneeId: '', referenceNo: 1234, miscPaymentId: 1234 }
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: LookupService, useClass: LookupServiceStub },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('paymentTypeChange', () => {
    it('should sadad', () => {
      const paymentType = 'sadad';
      component.paymentTypeChange(paymentType);
      expect(component.paymentType).toEqual('sadad');
    });
    it('should other', () => {
      const paymentType = 'other';
      component.paymentTypeChange(paymentType);
      expect(component.paymentType).toEqual('other');
    });
  });
  describe('getValidatorDetailService', () => {
    it('should getValidatorDetailService', () => {
      component.getValidatorDetailService();
      expect(component.paymentService.validatorDetails).toHaveBeenCalled();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
    describe('test suite for selected Wizard', () => {
      it('It should navigate to selected section', () => {
        component.selectedWizard(1);
        expect(component.currentTab).toEqual(1);
      });
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popups', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([PaymentConstants.ROUTE_PAYONLINE_SEARCH]);
      expect(component.modalRef).not.toEqual(null);
    });
    it('should hide  popups', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.fromValidator = true;
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalled();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      const payload = {
        registrationNo: 1234,
        identifier: 1034681524,
        transactionNumber: 1000045428,
        taskId: 123456,
        miscPaymentId: 502351234,
        user: 'avijit',
        role: 'Validator 1'
      };
      component.initialiseView(payload);
      expect(component.initialiseView).toBeDefined();
    });
  });
  describe('navToNextForm ', () => {
    it('Should navigate to next tab ', () => {
      component.currentTab = 0;
      component.miscPayWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.nextTab();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  /* describe('navToNextForm ', () => {
    it('Should navigate to next tab ', () => {
      component.currentTab = 1;
      component.miscPayWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.navigateToPreviousTab();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(0);
    });
  });*/
  describe('popUp', () => {
    it('should popUp modal', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('ibanTypeChange', () => {
    it('should ibanTypeChange', () => {
      const isdisable = true;
      component.ibanTypeChange(isdisable);
      expect(component.isSaveDisabled).toEqual(isdisable);
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('navigateToPaymentSearch', () => {
    it('should navigateToPaymentSearch', () => {
      spyOn(component.router, 'navigate');
      component.navigateToPaymentSearch();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/payment/payonline/search']);
    });
  });
  describe('setErrorMessage', () => {
    it('should setError message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.isEligibleUser).toBeTrue();
      component.setError(messageKey);
      expect(component.showErrorMessage).toBeDefined();
    });
  });

  describe('getRequiredDocument', () => {
    it('should getRequiredDocument', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getRequiredDocument('1234556', 'UITransactionType.GOL_REQUEST_SANED', false);
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        '1234556',
        'UITransactionType.GOL_REQUEST_SANED'
      );
      expect(component.documents).not.toBeNull();
    });
  });
  /*describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      component.hideModal();
      expect(component.decline).toBeDefined();
    });
  });*/
  describe('popUp', () => {
    it('should show popUp', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.popUp(modalRef);
      expect(component.popUp).toBeDefined();
    });
  });
  describe('payment features', () => {
    it('should setData', () => {
      component.setData(paymentDetail);
      expect(component.isUserHaveBankDetails).toEqual(true);
    });
    it('should setBankRequest', () => {
      component.setBankRequest(paymentDetail.bankAccountList[0]);
      expect(component.bankDetails).not.toEqual(null);
    });
    it('should saveBankDetails', () => {
      component.saveBankDetails({ newBankAccount: { bankCode: 1234 } });
      expect(component.bankName).not.toEqual(null);
    });
    it('should saveAndNext', () => {
      component.bankDetails = { newBankAccount: { bankName: null } };
      component.bankName = {
        arabic: 'string',
        english: 'string'
      };
      component.identifier = 1234;
      spyOn(component, 'getRequiredDocument');
      spyOn(component, 'nextTab');
      component.saveAndNext();
      expect(component.paymentSuccessResponse).not.toEqual(null);
    });
    it('should edit saveAndNext', () => {
      component.bankDetails = { newBankAccount: { bankName: { english: '', arabic: '' } } };
      component.paymentSuccessResponse = {
        referenceNo: 1234,
        miscPaymentId: 1234
      };
      component.identifier = 1234;
      spyOn(component, 'getRequiredDocument');
      spyOn(component, 'nextTab');
      component.saveAndNext();
      expect(component.paymentSuccessMsg).not.toEqual(null);
    });
    it('should refreshDocument', () => {
      component.paymentSuccessResponse = { miscPaymentId: 1234, referenceNo: 1234 };
      component.refreshDocument({
        ...new DocumentItem(),
        fromJsonToObject: json => json,
        name: { english: '', arabic: '' }
      });
    });
    it('should onSubmitDocuments for val1', () => {
      component.documents = [new DocumentItem()];
      component.identifier = 1234;
      component.paymentSuccessResponse = { miscPaymentId: 1234, referenceNo: 1234 };
      component.parentForm = new FormGroup({
        documentsForm: new FormGroup({ comments: new FormControl({ value: '' }) })
      });
      component.role = 'Validator1';
      spyOn(component.router, 'navigate');
      component.onSubmitDocuments();
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should onSubmitDocuments', () => {
      component.documents = [new DocumentItem()];
      component.identifier = 1234;
      component.paymentSuccessResponse = { miscPaymentId: 1234, referenceNo: 1234 };
      component.parentForm = new FormGroup({
        documentsForm: new FormGroup({ comments: new FormControl({ value: '' }) })
      });
      spyOn(component.router, 'navigate');
      component.onSubmitDocuments();
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('should setSuccess', () => {
      spyOn(component.router, 'navigate');
      component.setSuccess({ message: { english: '', arabic: '' } });
      expect(component.router.navigate).toHaveBeenCalled();
    });
    it('Should saveWorkFlowInEdit', () => {
      component.role = '';
      component.parentForm = new FormGroup({
        documentsForm: new FormGroup({ comments: new FormControl({ value: '' }) })
      });
      component.saveWorkFlowInEdit();
    });
  });
});
