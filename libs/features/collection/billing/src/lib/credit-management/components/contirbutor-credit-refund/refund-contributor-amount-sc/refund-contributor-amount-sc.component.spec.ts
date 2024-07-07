/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  BilingualText,
  bindToObject,
  DocumentItem,
  LanguageToken,
  RouterData,
  RouterDataToken,
  Alert,
  bindToForm,
  WizardItem,
  LookupService,
  DocumentService
} from '@gosi-ui/core';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsFormData,
  BilingualTextPipeMock,
  CreditManagementServiceServiceStub,
  CreditManagmentForm,
  EstablishmentServiceStub,
  genericError,
  bankDetailsByIBAN,
  LookupServiceStub,
  bankDetailsByPersonId,
  DocumentServiceStub,
  ProgressWizardDcMockComponent
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { CreditManagementService, EstablishmentService } from '../../../../shared/services';
import { isDocumentsValid } from '../../../../shared/utils';
import { RefundContributorAmountScComponent } from './refund-contributor-amount-sc.component';

describe('RefundContributorAmountScComponent', () => {
  let component: RefundContributorAmountScComponent;
  let fixture: ComponentFixture<RefundContributorAmountScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundContributorAmountScComponent, ProgressWizardDcMockComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: CreditManagementService, useClass: CreditManagementServiceServiceStub },
        {
          provide: EstablishmentService,
          useClass: EstablishmentServiceStub
        },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundContributorAmountScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should call methods if in workflow mode', () => {
      component.route.queryParams = of({ workflow: 'true' });
      spyOn(component, 'getDocumentsOnValidatorEdit');
      spyOn(component, 'getBackdatedTerminationValues');
      component.ngOnInit();
      expect(component.getDocumentsOnValidatorEdit).toHaveBeenCalled();
      expect(component.getBackdatedTerminationValues).toHaveBeenCalled();
    });
  });
  describe('getDocumentsOnValidatorEdit', () => {
    it('should get getDocumentsOnValidatorEdit', () => {
      spyOn(component.documentService, 'getDocuments').and.callThrough();
      component.getDocumentsOnValidatorEdit();
      expect(component.documentService.getDocuments).toHaveBeenCalledWith(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE,
        component.sin,
        component.referenceNumber
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
  describe('getEstablishmentDetails', () => {
    it('should get establishment details error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.getEstDetails(34564566);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getEstablishmentDetails', () => {
    it('should get establishment details', () => {
      component.getEstDetails(34564566);
      expect(component.status).not.toEqual(null);
    });
  });
  describe('getCreditBalance', () => {
    it('should get getCreditBalance', () => {
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.callThrough();
      component.getCreditBalance();
      expect(component.creditManagementService.getAvailableCreditBalance).toHaveBeenCalled();
    });
    it('should get throw error for getCreditBalance', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(throwError(genericError));
      component.getCreditBalance();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getEstablishmentDetails', () => {
    it('should get establishment details error', () => {
      component.personId = 57896666;
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getContirbutorIbanDetails').and.returnValue(throwError(genericError));
      component.getContributorDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('test suite for getDocuments', () => {
    it('should get documents for mof', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.retrieveScannedContributorRefundDocs();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE
      );
    });
  });

  describe('navigateToDocPage', () => {
    it('should navigateToDocPage', () => {
      component.isWorkflow = false;
      spyOn(component, 'retrieveScannedContributorRefundDocs');
      component.navigateToDocPage();
      expect(component.currentTab).toEqual(1);
      expect(component.retrieveScannedContributorRefundDocs).toHaveBeenCalled();
    });
    it('should navigateToDocPage', () => {
      component.isWorkflow = true;
      spyOn(component, 'navToNextForm');
      component.navigateToDocPage();
      expect(component.currentTab).toEqual(1);
      expect(component.navToNextForm).toHaveBeenCalled();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocuments(document);
      expect(component.documents).not.toBeNull();
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrors').and.callThrough();
      component.refreshDocuments(new DocumentItem());
      expect(component.showErrors).toHaveBeenCalled();
    });
  });

  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showErrors({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('test suite for saveCreditDetails ', () => {
    it('It should saveCreditDetails', () => {
      const form = new CreditManagmentForm();
      const contributorBankDetailsForm = form.createBankForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(contributorBankDetailsForm, bankDetailsFormData);
      bindToForm(commentForm, commentForm);
      component.contributorRefundMainForm.addControl('contributorBankDetailsForm', contributorBankDetailsForm);
      component.contributorRefundMainForm.addControl('commentForm', commentForm);
      component.createContributorRefundData();
      expect(component.contributorRefundRequest.paymentMode).not.toBeNull();
    });
  });

  describe('test suite for saveCreditDetails ', () => {
    it('It should saveCreditDetails', () => {
      expect(isDocumentsValid(component.documents)).toBeTruthy();
      const form = new CreditManagmentForm();
      const contributorBankDetailsForm = form.createBankForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(contributorBankDetailsForm, bankDetailsFormData);
      bindToForm(commentForm, commentForm);
      component.contributorRefundMainForm.addControl('contributorBankDetailsForm', contributorBankDetailsForm);
      component.contributorRefundMainForm.addControl('commentForm', commentForm);
      component.bankName = bankDetailsByIBAN.value;
      component.submitContributorRefundDetails();
      expect(component.isUserLoggedIn).toBeFalsy();
    });
  });

  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.cancelRefundAmountPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
    });
  });

  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBackToContributorRefundPage();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/credit-transfer/contributor-refund-credit-balance/request'],
        Object({
          queryParams: Object({ socialInsuranceNo: undefined, registrationNumber: undefined, isUserLoggedIn: true })
        })
      );
    });
  });

  describe('test suite for refund contributor  document fetch', () => {
    it('retrieveScannedContributorRefundDocs', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      expect(component.documents).not.toBeNull();
    });
  });

  describe('test suite for refund contributor  error ', () => {
    it('Should call showErrorMessage for refund contributor ', () => {
      spyOn(component.alertService, 'showError');
      component.showErrors({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('selectWizard ', () => {
    it('Should clear all alerts and set current tab ', () => {
      component.currentTab = 0;
      spyOn(component.alertService, 'clearAlerts');
      component.selectWizard(1);
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });

  describe('navToNextForm ', () => {
    it('Should navigate to next tab ', () => {
      component.currentTab = 0;
      component.contributorRefundWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.navToNextForm();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('navigateToInbox', () => {
    it('Should navigate to Inbox', () => {
      spyOn(component.routingService, 'navigateToInbox');
      component.navigateToInbox();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('getBackdatedTerminationValues', () => {
    it('Should get backdated value', () => {
      spyOn(component.creditManagementService, 'getBackdatedTerminationDetails').and.callThrough();
      component.getBackdatedTerminationValues();
      expect(component.creditManagementService.getBackdatedTerminationDetails).toHaveBeenCalled();
    });
  });
  describe('getBackdatedTerminationValues', () => {
    it('Should get backdated value error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getBackdatedTerminationDetails').and.returnValue(
        throwError(genericError)
      );
      component.getBackdatedTerminationValues();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  xdescribe('handleWorkflow', () => {
    it('Should handle workflow', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.routingService, 'navigateToInbox');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      component.handleWorkflow();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
  });
  describe('handleWorkflow', () => {
    it('Should handle workflow error', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showError');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      component.handleWorkflow();
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
  describe('previousFormDet', () => {
    it('Should navigate to pervious sectionr', () => {
      component.contributorRefundWizard = new ProgressWizardDcComponent();
      component.contributorRefundWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      spyOn(component.contributorRefundWizard, 'setPreviousItem').and.callThrough();
      component.previousFormDet();
      expect(component.currentTab).toEqual(0);
      expect(component.contributorRefundWizard.setPreviousItem).toHaveBeenCalled();
    });
  });
});
