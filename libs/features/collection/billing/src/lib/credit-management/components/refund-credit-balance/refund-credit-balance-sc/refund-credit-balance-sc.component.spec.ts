/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  AuthTokenService,
  bindToForm,
  bindToObject,
  DocumentService,
  LookupService,
  RouterConstants,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import {
  BilingualText,
  BPMUpdateRequest,
  DocumentItem,
  RegistrationNumber,
  RouterData,
  WizardItem
} from '@gosi-ui/core/lib/models';
import {
  ApplicationTypeToken,
  CurrencyToken,
  LanguageToken,
  RegistrationNoToken,
  RouterDataToken
} from '@gosi-ui/core/lib/tokens';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  bankDetailsByIBAN,
  bankDetailsByPersonId,
  BilingualTextPipeMock,
  CreditManagmentForm,
  creditRefundRequestDetailsMockData,
  documentListItemArray,
  gccEstablishmentDetailsMockData,
  genericError,
  routerTestdata,
  ProgressWizardDcMockComponent
} from 'testing';
import {
  AuthTokenServiceStub,
  CreditManagementServiceServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  StorageServiceStub,
  WorkflowServiceStub
} from 'testing/mock-services';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { CreditBalanceDetails, EstablishmentDetails } from '../../../../shared/models';
import { CreditManagementService } from '../../../../shared/services';
import { RefundCreditBalanceScComponent } from '../refund-credit-balance-sc/refund-credit-balance-sc.component';

/*import { ExceptionalBulkPenaltyDetails } from '../../../../validator/components';*/

describe('RefundCreditBalanceScComponent', () => {
  let component: RefundCreditBalanceScComponent;
  let fixture: ComponentFixture<RefundCreditBalanceScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'home/inbox/worklist',
            component: RefundCreditBalanceScComponent
          }
        ])
      ],
      declarations: [RefundCreditBalanceScComponent, ProgressWizardDcMockComponent],
      providers: [
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: StorageService, useClass: StorageServiceStub },

        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CreditManagementService, useClass: CreditManagementServiceServiceStub },
        FormBuilder,
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundCreditBalanceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      component.isAppPrivate = false;
      component.regNumber = 502351249;
      component.ngOnInit();
      component.getEstablishmentDetails(502351249);
      expect(component.lang).not.toEqual(null);
    });
    it('should initialize the component', () => {
      component.isAppPrivate = false;
      component.regNumber = 502351249;
      component.requestNo = 789;
      component.referenceNumber = 502351249;
      component.inWorkflow = true;
      spyOn(component.establishmentService, 'getEstablishment').and.callThrough();
      component.routerDataToken.payload = true;
      component.ngOnInit();
      component.getEstablishmentDetails(502351249);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.lang).not.toEqual(null);
    });
  });
  describe('getEstablishmentDetails', () => {
    it('should get establishment details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
      );
      spyOn(component.contributionPaymentService, 'getWorkFlowStatus').and.callThrough();
      component.getEstablishmentDetails(502351249);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.contributionPaymentService.getWorkFlowStatus).toHaveBeenCalled();
    });
  });
  describe('getEstablishmentDetails', () => {
    it('should throw error for workflowstatus details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.callThrough();
      spyOn(component.contributionPaymentService, 'getWorkFlowStatus').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showErrorByKey');
      component.getEstablishmentDetails(502351249);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
    });
  });
  describe('getEstablishmentDetails', () => {
    it('should throw error for getestablishment details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getEstablishmentDetails(502351249);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for selectWizard', () => {
    it('It should navigate to selected section', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });

  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.creditManagementWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.previousFormDetails();

      expect(component.currentTab).toEqual(0);
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents for mof', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments();

      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_REFUND_ID,
        BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE
      );
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      component.inWorkflow = false;
      component.cancelCreditUpload();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('show error alert', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'revertRefundDocumentDetails').and.returnValue(throwError(genericError));
      component.inWorkflow = true;
      component.cancelCreditUpload();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('navigate navigateBackToValidator', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.inWorkflow = true;
      component.cancelCreditUpload();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });

  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocuments(document);
      expect(component.documentList).not.toBeNull();
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError').and.callThrough();
      component.refreshDocuments(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      component.inWorkflow = false;
      component.cancelAvailableCreditPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('navigateBackToHome', () => {
    it('on throw error', () => {
      spyOn(component.creditManagementService, 'revertRefundDocumentDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.isAppPrivate = true;
      component.inWorkflow = true;
      component.cancelAvailableCreditPage();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('cancelAvailableCreditPage', () => {
    it('cancelAvailableCreditPage', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.inWorkflow = true;
      component.cancelAvailableCreditPage();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });

  describe('submitCreditRefundDetails', () => {
    it('should clear alert and submit request', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'createFormData');
      spyOn(component, 'submitRefundTransfer');
      component.submitCreditRefundDetails();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.createFormData).toHaveBeenCalled();
    });
  });
  describe('submitRefundTransfer', () => {
    it('should submitRefundTransfer', () => {
      const form = new CreditManagmentForm();
      const commentForm = form.createWavierUploadDetailForm();
      component.creditRefundMainForm = new FormGroup({});
      component.creditRefundMainForm.get('commentForm')?.setValue('test');
      component.bankName = bankDetailsByIBAN.value;
      spyOn(component, 'checkMandatoryDocuments');
      spyOn(component, 'createFormData');
      component.creditRefundMainForm.addControl('commentForm', commentForm);
      component.submitRefundTransfer();
      expect(component.checkMandatoryDocuments).toBeTruthy();
      expect(component.creditRefundMainForm).toBeTruthy();
    });
    it('should throw  error for submitRefundTransfer', () => {
      spyOn(component, 'checkMandatoryDocuments');
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.submitRefundTransfer();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('setWorkflowData', () => {
    it('should set the datas for workflow actions', () => {
      component.routerDataToken == routerTestdata;
      component.routerDataToken.payload == routerTestdata.payload;
      const data: BPMUpdateRequest = new BPMUpdateRequest();
      component.setWorkflowData();
      expect(data.taskId).not.toBeNull();
      expect(data.user).not.toBeNull();
      expect(data.outcome).not.toBeNull();
      expect(component.routerDataToken).toBeDefined();
      expect(component.creditRefundMainForm).toBeTruthy();
    });
  });
  describe('test suite for retrieveScannedVicDocuments', () => {
    it('should retrieveScannedVicDocuments', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      spyOn(component, 'nextForm');
      component.retrieveScannedDocuments();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalled();
      expect(component.nextForm).toHaveBeenCalled();
    });
  });
  describe('getAvailableBalanceDetails', () => {
    it('should getAvailableBalanceDetails', () => {
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(
        of(bindToObject(new CreditBalanceDetails(), creditRefundRequestDetailsMockData.creditAccountDetail))
      );
      component.getAvailableBalanceDetails(124536987);
      expect(component.amount).not.toEqual(null);
    });
    it('should get vic credit refund amount error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(throwError(genericError));
      component.getAvailableBalanceDetails(124536987);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('handleWorkflowActions', () => {
    xit('should handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component.routingService, 'navigateToInbox').and.callThrough();
      component.handleWorkflowActions();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('handleWorkflowActions', () => {
    it('should throw error for handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.handleWorkflowActions();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('onGetBankName', () => {
    it('should onGetBankName ', () => {
      const iban = '';
      component.onGetBankName(iban);
      expect(iban).not.toEqual(null);
    });
  });

  describe('onGetBankName', () => {
    it('should onGetBankName ', () => {
      spyOn(component.lookupService, 'getBankForIban').and.callThrough();
      component.onGetBankName(bankDetailsByPersonId.ibanBankAccountNo);
      expect(component.lookupService.getBankForIban).toHaveBeenCalled();
    });
    it('should throw error onGetBankName ', () => {
      spyOn(component, 'showErrorMessage').and.callThrough();
      component.onGetBankName(bankDetailsByPersonId.ibanBankAccountNo);
    });
  });
  describe('showErrorMessage', () => {
    it('should showErrorMessage ', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  /*it('should check validity', () => {
    expect(component.checkFormValidity(new FormGroup({}))).toBeTruthy();
  });*/
  describe('test suite for createFormData ', () => {
    it('It should createFormData', () => {
      const form = new CreditManagmentForm();
      const commentForm = form.createWavierUploadDetailForm();
      const paymentModeForm = form.createPaymentModeForm();
      bindToForm(commentForm, commentForm);
      component.creditRefundMainForm.addControl('commentForm', commentForm);
      component.creditRefundMainForm.addControl('bankModeForm', paymentModeForm);
      component.createFormData();
      expect(component.creditRefundDetailsReq).not.toBeNull();
    });
  });
  describe('test suite for refund credit document fetch', () => {
    it('retrieveScannedDocuments', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      expect(component.documentList).not.toBeNull();
    });
    it('cancel the navigation', () => {
      spyOn(component.routingService, 'navigateToInbox');
      component.navigateBackToInbox();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
    it('cancel the navigations', () => {
      spyOn(component.routingService, 'navigateToValidator');
      component.navigateToBack(true);
      expect(component.routingService.navigateToValidator).toHaveBeenCalled();
    });
    it('should check for edit mode in est refund', inject([ActivatedRoute], route => {
      route.url = of([{ path: 'cancel-establishment-payment' }, { path: 'edit' }]);
      component.identifyModeOfTransaction();
      expect(component.inWorkflow).toBeTruthy();
    }));
    it('should read keys from token in edit mode in est  refund', inject([RouterDataToken], token => {
      token.taskId = 'asdasdasd';
      token.payload = '{"referenceNumber": 200085744, "regNumber":444, requestNo": 231}';
      component.inWorkflow = true;
      expect(component.referenceNumber).toBeUndefined();
      expect(component.searchResult).toBeTruthy();
      //expect(component.successFlag).toBeFalsy();
      component.getEstablishmentDetails(token.payload.regNumber);
      component.getAllcreditDetails(token.payload.regNumber, token.payload.requestNo);
      expect(component.establishmentDetails).not.toBeNull();
      expect(component.creditRefundDetails).not.toBeNull();
    }));
  });
  describe('test suite for getDocuments', () => {
    it('should get documents credit balance ', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.creditManagementWizard.wizardItems = [
        new WizardItem('Label', 'Icon'),
        new WizardItem('Label', 'Icon'),
        new WizardItem('Label', 'Icon')
      ];
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.retrieveScannedDocuments();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_REFUND_ID,
        BillingConstants.CREDIT_REFUND_TRANSACTION_TYPE
      );
    });
  });
  describe('getDetails', () => {
    // it('should getDetails', () => {
    //   const establishmentDetails = new EstablishmentDetails();
    //   // component.inWorkflow = true;
    //   spyOn(component, 'getAllcreditDetails').and.callThrough();
    //   component.getDetails(establishmentDetails);
    //   expect(component.establishmentDetails ).not.toEqual(null);
    //   expect(component.searchResult ).toBeFalsy();
    //   expect(component.oldIban ).not.toEqual(null);
    //   expect(component.ibanNumber ).not.toEqual(null);
    //   // expect(component.getAllcreditDetails).toHaveBeenCalledTimes(0);
    //   expect(component.inWorkflow).toBeFalsy();
    // });
    it('should getDetails', () => {
      const establishmentDetails = new EstablishmentDetails();
      component.inWorkflow = true;
      spyOn(component, 'getAllcreditDetails').and.callThrough();
      component.getDetails(establishmentDetails);
      expect(component.establishmentDetails).not.toEqual(null);
      expect(component.searchResult).toBeFalsy();
      expect(component.oldIban).not.toEqual(null);
      expect(component.ibanNumber).not.toEqual(null);
      expect(component.getAllcreditDetails).toHaveBeenCalled();
      // expect(component.inWorkflow).toBeTruthy();
    });
  });
  describe('test suite for nextForms', () => {
    it('should navigate to next forms', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.creditManagementWizard.wizardItems = [
        new WizardItem('Label', 'Icon'),
        new WizardItem('Label', 'Icon'),
        new WizardItem('Label', 'Icon')
      ];
      component.currentTab = 1;
      component.nextForm();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('popUp', () => {
    it('should popUp modal', () => {
      component.modalRef = new BsModalRef();
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('navigateToDocumentPage', () => {
    it('should navigateToDocumentPage', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.navigateToDocumentPage();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('getCreditRetainedValue', () => {
    it('should getCreditRetainedValue', () => {
      component.iscreditRetained = false;
      component.getCreditRetainedValue(component.iscreditRetained);
      expect(component.iscreditRetained).toBe(false);
    });
  });
  describe('setErrorMessage', () => {
    it('should setErrorMessage', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.setErrorMessage(true);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe('checkMandatoryDocuments', () => {
    it('should checkMandatoryDocuments', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.callThrough();
      component.isAppPrivate = true;
      component.checkMandatoryDocuments();
      expect(component.documentService.checkMandatoryDocuments).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popups', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();

      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('Hide Modals', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.cancelRefundModal();

      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('navToNextForm ', () => {
    it('Should navigate to next Form ', () => {
      component.currentTab = 0;
      component.creditManagementWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.nextForm();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('cancelPopUp()', () => {
    it('Should CancelPopup', () => {
      component.cancelPopup();
      expect(component.isSave).toBeFalsy();
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('newBankDetails', () => {
    it('should newBankDetails', () => {
      const bankDet = {
        Bankname: '',
        iban: ''
      };
      component.newBankDetails(bankDet);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('cancelRefundModal', () => {
    it('should get cancelRefundModal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.cancelRefundModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('decline', () => {
    it('should decline the popUp', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('setAmountToBeRefunded', () => {
    it('setAmountToBeRefunded', () => {
      component.setAmountToBeRefunded(502351249);
      expect(component.AmountToBeRefunded).toEqual(502351249);
    });
  });
  describe('confirmRefundModal', () => {
    it('should confirmRefundModal', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmRefundModal();
      component.currentTab = 1;
      component.inWorkflow = false;
      component.retrieveScannedDocuments();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
    it('should confirmRefundModal', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.modalRef = new BsModalRef();
      component.currentTab = 0;
      component.inWorkflow = true;
      spyOn(component.modalRef, 'hide');
      spyOn(component, 'nextForm');
      component.confirmRefundModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
      expect(component.nextForm).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('checkFormValidity', () => {
    it('should check validity', () => {
      expect(component.checkFormValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe(' confirmCancel', () => {
    it('should cancel the pop up modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
});
