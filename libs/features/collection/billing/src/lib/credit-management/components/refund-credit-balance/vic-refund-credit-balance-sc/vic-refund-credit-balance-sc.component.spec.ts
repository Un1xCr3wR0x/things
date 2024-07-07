import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  bindToForm,
  CurrencyToken,
  DocumentItem,
  LanguageToken,
  RouterData,
  RouterDataToken,
  StorageService,
  WizardItem,
  bindToObject,
  LookupService,
  AuthTokenService,
  RegistrationNoToken,
  RegistrationNumber,
  DocumentService
} from '@gosi-ui/core';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  CreditManagmentForm,
  genericError,
  ModalServiceStub,
  StorageServiceStub,
  creditDocList,
  vicContributorDetailsMockData,
  creditRefundRequestDetailsMockData,
  creditRefundDetailsTest,
  bankDetailsByIBAN,
  LookupServiceStub,
  bankDetailsByPersonId,
  personRequestData,
  vicCreditRefundIbanMockData,
  AuthTokenServiceStub,
  DocumentServiceStub,
  ProgressWizardDcMockComponent
} from 'testing';
import { BillingConstants } from '../../../../shared/constants';
import { VicRefundCreditBalanceScComponent } from './vic-refund-credit-balance-sc.component';
import {
  CreditBalanceDetails,
  CreditRefundDetails,
  PersonRequest,
  VicCreditRefundIbanDetails
} from '../../../../shared/models';
import { VicContributorDetails } from '../../../../shared/models/vic-contributor-details';

describe('VicRefundCreditBalanceScComponent', () => {
  let component: VicRefundCreditBalanceScComponent;
  let fixture: ComponentFixture<VicRefundCreditBalanceScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicRefundCreditBalanceScComponent, ProgressWizardDcMockComponent],
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
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: StorageService, useClass: StorageServiceStub },

        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        FormBuilder,
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },

        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VicRefundCreditBalanceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      component.isAppPrivate = false;
      component.socialInsuranceNumber = 502351249;
      component.ngOnInit();
      component.verifyContributorDetails(502351249);
      expect(component.lang).not.toEqual(null);
    });
    it('should initialize the component', () => {
      component.isAppPrivate = false;
      component.socialInsuranceNumber = 502351249;
      component.refNumber = 502351249;
      component.workflowFlag = true;
      spyOn(component, 'getVicCreditRefundAmt').and.callThrough();

      component.routerDataToken.payload = true;
      component.ngOnInit();
      component.verifyContributorDetails(502351249);
      expect(component.getVicCreditRefundAmt).toHaveBeenCalled();
      expect(component.lang).not.toEqual(null);
    });
  });

  describe('intialise the view', () => {
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "requestId": 532231}';
      component.workflowFlag = true;
      spyOn(component, 'verifyContributorDetails');
      spyOn(component, 'getVicCreditRefundAmt');
      spyOn(component, 'getVicDocumentsOnEdit');
      component.ngOnInit();
      expect(component.getVicCreditRefundAmt).toHaveBeenCalled();
      expect(component.getVicCreditRefundAmt).toHaveBeenCalled();
      expect(component.getVicDocumentsOnEdit).toHaveBeenCalled();
    }));
  });
  describe('getWizardItems', () => {
    it('should set wizaditems array', () => {
      component.getWizardItem();
      expect(component.wizardItems).not.toBe(null);
    });
  });
  describe('getVicDocumentsOnEdit', () => {
    it('should get getVicDocumentsOnEdit', () => {
      spyOn(component.documentService, 'getDocuments').and.callThrough();
      component.getVicDocumentsOnEdit();
      expect(component.documentService.getDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
        component.socialInsuranceNumber,
        component.refNumber
      );
    });
  });
  describe('select index', () => {
    it('it should set current tab of wizard', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('verifyContributorDetails', () => {
    it('should get establishment details', () => {
      spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(
        of(bindToObject(new VicContributorDetails(), vicContributorDetailsMockData))
      );
      const sin = 124536987;
      component.isRefundCreditBalance = true;
      component.verifyContributorDetails(sin);
      expect(component.contributorDetails).not.toEqual(null);
      expect(component.isSinVaild).not.toEqual(null);
    });
    it('should get establishment details', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(throwError(genericError));
      component.verifyContributorDetails(124536987);
      expect(component.isSinVaild).toBe(false);
    });
  });

  describe('test suite for cancelForm', () => {
    it('It should throw error on cancelling the transaction', () => {
      component.workflowFlag = true;
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'revertVicRefundDocumentDetails').and.returnValue(
        throwError(genericError)
      );
      component.cancelVicCreditRefundUpload();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should throw error on cancelling the transaction', () => {
      component.workflowFlag = false;
      spyOn(component.router, 'navigate');
      component.cancelVicCreditRefundUpload();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('getContributorRefundDetails', () => {
    xit('should get Contributor Refund details', () => {
      spyOn(component.creditManagementService, 'getContirbutorRefundDetails').and.returnValue(
        of(bindToObject(new CreditBalanceDetails(), creditRefundRequestDetailsMockData.creditAccountDetail))
      );
      component.getContributorRefundDetails(124536987, true);
      expect(component.vicRefundDetials).not.toEqual(null);
    });
  });
  describe('getVicCreditRefundAmt', () => {
    it('should get vic Refund amount', () => {
      spyOn(component.creditManagementService, 'getVicCreditRefundAmountDetails').and.returnValue(
        of(bindToObject(new CreditRefundDetails(), creditRefundDetailsTest))
      );
      component.getVicCreditRefundAmt(124536987, 532231);
      expect(component.amount).not.toEqual(null);
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirmDetails', () => {
    it('should confirmDetails', () => {
      component.ibanNumber = '12323sdij';
      spyOn(component, 'showModal');
      component.confirmDetails();
      expect(component.showModal).toHaveBeenCalled();
      expect(component.ibanNumber).not.toEqual(null);
    });
  });
  describe('test suite for getVicDocuments', () => {
    it('should get vic documents', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getVicDocuments();

      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE
      );
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError');
      component.refreshDocumentForVic(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('submitVicCreditRefundDetails', () => {
    it('should get submitVicCreditRefundDetails', () => {
      spyOn(component, 'createVicFormData');
      spyOn(component.router, 'navigate');
      component.bankName = bankDetailsByIBAN.value;
      component.submitVicCreditRefundDetails();
      expect(component.vicPaymentResponse).not.toEqual(null);
      expect(component.vicSuccessMessage).not.toEqual(null);
    });
  });
  describe('newBankDetails', () => {
    it('should get new Bank Details', () => {
      const iban = 'SADR458999999';
      component.ibanNumber = iban;
      component.newBankDetails(iban);
      component.isIbanEdit = true;
      expect(iban).toBeDefined();
      expect(component.ibanNumber).toEqual(iban);
    });
  });
  // describe('test suite for submitVicCreditRefundDetails ', () => {
  //   it('It should submit the penalty waiver details with valid form', () => {
  //     const form = new PenaltyWaiverForm();
  //     component.createVicFormData();
  //     const vicRefundForm = form.commentForm();
  //     bindToForm(vicRefundForm, creditRefundRequestDetailsMockData);

  //     component.vicCreditRefundMainForm.addControl('wavierDetailForm', vicRefundForm);
  //     spyOn(component.router, 'navigate');
  //     component.submitVicCreditRefundDetails();
  //     expect(component.isSinVaild).not.toBe(null)
  //   });
  // });
  describe('showError', () => {
    it('should call alert service', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    describe('test suite for previousForm', () => {
      it('should navigate to previous section', () => {
        component.vicRefundWizard = new ProgressWizardDcComponent();
        component.vicRefundWizard.wizardItems = [new WizardItem('Label', 'Icon')];
        component.currentTab = 1;
        component.previousFormDetails();

        expect(component.currentTab).toEqual(0);
      });
    });
    describe('test suite for nextForm', () => {
      it('should navigate to next form', () => {
        component.vicRefundWizard = new ProgressWizardDcComponent();
        component.vicRefundWizard.wizardItems = [new WizardItem('Label', 'Icon')];
        component.currentTab = 1;
        component.nextForm();
        expect(component.currentTab).toEqual(1);
      });
    });
    describe('navigateTovicDocumentPage', () => {
      it('should navigate to document page of vic credit refund', () => {
        component.modalRef = new BsModalRef();
        spyOn(component.modalRef, 'hide').and.callThrough();
        component.navigateToVicDocumentPage();
        expect(component.workflowFlag).toBeFalsy();
      });
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      component.cancelDetails();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('test suite for createFormData ', () => {
    it('It should createFormData', () => {
      const form = new CreditManagmentForm();
      const commentForm = form.createWavierUploadDetailForm();
      const paymentModeForm = form.createPaymentModeForm();
      bindToForm(commentForm, commentForm);
      component.vicCreditRefundMainForm.addControl('commentForm', commentForm);
      component.vicCreditRefundMainForm.addControl('bankModeForm', paymentModeForm);
      component.createVicFormData();
      expect(component.vicCreditRefundDetailsReq).not.toBeNull();
    });
  });
  describe('submitVicCreditRefundDetails', () => {
    it('should clear alert and submit request', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'createVicFormData');
      component.submitVicCreditRefundDetails();
      const form = new CreditManagmentForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToObject(component.vicCreditRefundDetailsReq, commentForm.value);
      expect(component.checkVicMandatoryDocuments).toBeTruthy();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.createVicFormData).toHaveBeenCalled();
      expect(component.vicCreditRefundDetailsReq).not.toBeNull();
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.vicRefundWizard = new ProgressWizardDcComponent();
      component.vicRefundWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.nextForm();

      expect(component.currentTab).toEqual(1);
    });
  });
  describe('checkVicMandatoryDocuments', () => {
    it('It should checkVicMandatoryDocuments', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.callThrough();
      component.isAppPrivate = true;
      component.checkVicMandatoryDocuments();
      expect(component.documentService.checkMandatoryDocuments).toHaveBeenCalled();
    });
  });

  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.vicRefundWizard = new ProgressWizardDcComponent();
      component.vicRefundWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.previousFormDetails();

      expect(component.currentTab).toEqual(0);
    });
  });
  describe('test suite for cancelVicCreditRefundPage', () => {
    it('cancelVicCreditRefundPage', () => {
      component.workflowFlag = true;
      spyOn(component.routingService, 'navigateToValidator');
      component.cancelVicCreditRefundPage();
      expect(component.routingService.navigateToValidator).toHaveBeenCalled();
    });
  });
  describe('test suite for setVicAmountToBeRefunded', () => {
    it('setVicAmountToBeRefunded', () => {
      component.setVicAmountToBeRefunded(502351249);
      expect(component.vicAmountToBeRefunded).toEqual(502351249);
    });
  });
  describe('test suite for cancelVicPopup', () => {
    it('cancelVicPopup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide').and.callThrough();
      component.cancelVicPopup();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('test suite for getBankTranser', () => {
    it('getBankTranser', () => {
      component.isBankTransfer = false;
      component.getBankTranser(component.isBankTransfer);
      expect(component.isBankTransfer).toEqual(component.isBankTransfer);
    });
  });
  describe('test suite for getCreditRetainedValue', () => {
    it('getCreditRetainedValue', () => {
      component.iscreditRetained = false;
      component.getCreditRetainedValue(component.iscreditRetained);
      expect(component.iscreditRetained).toEqual(component.iscreditRetained);
    });
  });
  describe('test suite for setVicAmountToBeRefunded', () => {
    it('setVicAmountToBeRefunded', () => {
      component.setVicAmountToBeRefunded(502351249);
      expect(component.vicAmountToBeRefunded).toEqual(502351249);
    });
  });
  describe('test suite for retrieveScannedVicDocuments', () => {
    it('should retrieveScannedVicDocuments', () => {
      spyOn(component, 'getVicDocuments').and.callThrough();
      spyOn(component, 'nextForm').and.callThrough();
      component.getVicDocuments();
      component.documentList = creditDocList;
      expect(component.getVicDocuments).toHaveBeenCalled();
      expect(component.documentList).toBeDefined();
    });
  });
  describe('test suite for getVicDocuments', () => {
    it('should getVicDocuments', () => {
      spyOn(component, 'getVicDocuments').and.callThrough();
      spyOn(component, 'nextForm').and.callThrough();
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getVicDocuments();
      component.documentList = creditDocList;
      expect(component.getVicDocuments).toHaveBeenCalled();
      expect(component.documentList).toBeDefined();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        'CREDIT_REFUND_VIC',
        'CREDIT_REFUND_VIC'
      );
    });
  });
  describe('onGetBankName', () => {
    it('should onGetBankName ', () => {
      const iban = '';
      component.onGetBankName(iban);
      expect(iban).not.toEqual(null);
    });
  });
  describe('checkSinValidity', () => {
    it('should checkSinValidity ', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.contributorDetails.active = false;
      component.checkSinValidity();
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
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
      spyOn(component.alertService, 'showError');
      component.onGetBankName(bankDetailsByPersonId.ibanBankAccountNo);
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('handleWorkflowActions', () => {
    it('should handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component, 'navBackToInbox').and.callThrough();
      component.handleWorkflowActions();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
    it('should throw error for handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.handleWorkflowActions();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getPersonChangeRequest', () => {
    it('Should getPersonChangeRequest', () => {
      const personid = 12345;
      spyOn(component.creditManagementService, 'getChangePersonRequest').and.returnValue(
        of(bindToObject(new PersonRequest(), personRequestData))
      );
      component.isBankRequestinProgress = true;
      component.getPersonChangeRequest(personid);
      expect(component.creditManagementService.getChangePersonRequest).toHaveBeenCalled();
    });
  });
  describe('getPersonChangeRequest', () => {
    it('Should throw error for getPersonChangeRequest', () => {
      const personid = 12345;
      spyOn(component.creditManagementService, 'getChangePersonRequest').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getPersonChangeRequest(personid);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getContributorDetails', () => {
    it('Should getContributorDetails', () => {
      spyOn(component.creditManagementService, 'getVicContirbutorIbanDetails').and.returnValue(
        of(bindToObject(new VicCreditRefundIbanDetails(), vicCreditRefundIbanMockData))
      );
      component.getContributorDetails(1234);
      expect(component.creditManagementService.getVicContirbutorIbanDetails).toHaveBeenCalled();
    });
  });
  describe('getPersonChangeRequest', () => {
    it('Should throw error for getPersonChangeRequest', () => {
      spyOn(component.creditManagementService, 'getVicContirbutorIbanDetails').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getContributorDetails(1234);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for retrieveScannedVicDocuments', () => {
    it('should retrieveScannedVicDocuments', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      spyOn(component, 'nextForm').and.callThrough();
      component.retrieveScannedVicDocuments();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalled();
    });
  });
  describe('test suite for for vic document fetch', () => {
    it('retrieveScannedVicDocuments', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      expect(component.documentList).not.toBeNull();
    });
    it('cancel the navigation for vic credit', () => {
      spyOn(component.routingService, 'navigateToInbox');
      component.navBackToInbox();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  it('should check for edit mode in vic refund', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'cancel-establishment-payment' }, { path: 'edit' }]);
    component.identifyTransaction();
    expect(component.workflowFlag).toBeTruthy();
  }));
  it('should read keys from token in edit mode in vic  refund', inject([RouterDataToken], token => {
    token.taskId = 'asdasdasd';
    token.payload = '{"refNumber": 200085744, "reqNo": 231, "socialInsuranceNumber": 231}';
    component.workflowFlag = true;
    expect(component.refNumber).toBeUndefined();
    expect(component.reqNo).toBeUndefined();
    expect(component.socialInsuranceNumber).toBeUndefined();
    expect(component.isSinVaild).toBeFalsy();
    component.verifyContributorDetails(token.payload.socialInsuranceNumber);
    component.getVicCreditRefundAmt(token.payload.socialInsuranceNumber, token.payload.reqNo);
    expect(component.contributorDetails).not.toBeNull();
    expect(component.amount).not.toBeNull();
  }));
});
