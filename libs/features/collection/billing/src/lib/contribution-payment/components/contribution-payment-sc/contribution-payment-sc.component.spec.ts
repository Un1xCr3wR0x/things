/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  AppConstants,
  ApplicationTypeToken,
  bindToForm,
  bindToObject,
  DocumentItem,
  DocumentService,
  ExchangeRate,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  StorageService,
  WizardItem
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { PaymentForm, ProgressWizardDcMockComponent } from 'testing/mock-components';
import {
  AlertServiceStub,
  BillEstablishmentServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  ReportStatementServiceStub,
  StorageServiceStub
} from 'testing/mock-services';
import {
  branchBreakupErrorFormData,
  branchBreakupFormData,
  branchBreakupTempFormData,
  branchDetailsMockData,
  chequeErrorFormData,
  chequeFormData,
  commentFormData,
  docList,
  establishmentDetailsGCC,
  eventFormData,
  exchangeRateMockData,
  genericError,
  receiptModeFormData
} from 'testing/test-data';
import { BillingConstants, RouteConstants } from '../../../shared/constants';
import { MOFDocumentType } from '../../../shared/enums';
import { BranchDetails, EstablishmentDetails } from '../../../shared/models';
import { ContributionPaymentService, EstablishmentService, ReportStatementService } from '../../../shared/services';
import { ContributionPaymentScComponent } from './contribution-payment-sc.component';

const documentListItemArray = docList.map(doc => bindToObject(new DocumentItem(), doc));

describe('ContributionPaymentScComponent', () => {
  let component: ContributionPaymentScComponent;
  let fixture: ComponentFixture<ContributionPaymentScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ContributionPaymentScComponent, ProgressWizardDcMockComponent],
      providers: [
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: ContributionPaymentService,
          useClass: ContributionPaymentServiceStub
        },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },

        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ContributionPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('ngOnInit', () => {
    it('should initialize component', () => {
      spyOn(component, 'identifyModeOfTransaction');
      spyOn(component, 'filterReceiptModes');
      spyOn(component, 'getScreenHeading');
      component.ngOnInit();
      expect(component.identifyModeOfTransaction).toHaveBeenCalled();
      expect(component.filterReceiptModes).toHaveBeenCalled();
      expect(component.getScreenHeading).toHaveBeenCalled();
      expect(component.isAppPrivate).toBeDefined();
    });
  });
  describe('identify mode of txn', () => {
    it('should check for edit mode in est refund', inject([ActivatedRoute], route => {
      route.url = of([{ path: 'establishment-payment' }, { path: 'edit' }]);
      component.identifyModeOfTransaction();
      expect(component.inWorkflow).toBeTruthy();
      expect(component.mofFlag).toBe(false);
    }));
    it('should check for edit mode in est refund', inject([ActivatedRoute], route => {
      route.url = of([{ path: 'mof-payment' }, { path: 'edit' }]);
      component.identifyModeOfTransaction();
      expect(component.inWorkflow).toBeTruthy();
      expect(component.mofFlag).toBe(true);
    }));
  });
  describe('checkIsEditMode', () => {
    it('should get check mode of transaction', inject([RouterDataToken], (token: RouterData) => {
      token.payload = '{}';
      component.inWorkflow = true;
      spyOn(component, 'initialiseViewForEdit');
      component.checkIsEditMode();
      expect(component.initialiseViewForEdit).toHaveBeenCalled();
    }));
  });
  describe('checkIsEditMode', () => {
    it('should get check mode of transaction', () => {
      component.inWorkflow = false;
      component.isAppPrivate = false;
      component.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, 365246);
      spyOn(component, 'getEstablishmentDetails');
      component.checkIsEditMode();
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
  describe('getGCCBankList', () => {
    it('should get gcc bank list', () => {
      component.getGCCBankList('KUWAIT');
      expect(component.gccBankList$).toBeDefined();
    });
  });
  describe('getScreenHeading', () => {
    it('should get screen heading for establishment admin', () => {
      component.isAppPrivate = false;
      component.getScreenHeading();
      expect(component.headerValue).toContain('NOTICE');
    });
  });
  describe('getScreenHeading', () => {
    it('should get screen heading for mof', () => {
      component.mofFlag = false;
      component.getScreenHeading();
      expect(component.headerValue).toContain('PAYMENT');
    });
  });
  describe('checkBranchesClosed', () => {
    it('should check establishment branch eligibilty for establishment with no branches', () => {
      const flag = component.checkBranchesClosed([]);
      expect(flag).toBeTruthy();
    });
  });

  describe('test suite for  get EstablishmentDetails ', () => {
    it('It should throw error on retreving establishment details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.getEstablishmentDetails(504096157, false);
      expect(component.searchResult).toBeFalsy();
    });
    it('It should get the establishment details', () => {
      component.getEstablishmentDetails(504096157, true);
      expect(component.establishmentDetails).not.toEqual(null);
    });
    xit('should get gcc establishment details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(new EstablishmentDetails().fromJsonToObject(establishmentDetailsGCC))
      );
      component.getEstablishmentDetails(502351249, false);
      expect(component.gccFlag).toBeFalsy();
    });
    it('should throw error on getting branch details', () => {
      spyOn(component.establishmentService, 'getBranchDetails').and.returnValue(throwError(genericError));
      component.getEstablishmentDetails(504096157, true);
      expect(component.branchDetails.length).toEqual(0);
    });
  });

  describe('test suite for savePaymentDetails ', () => {
    it('It should save the payment details', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      const branchBreakupFormArray = form.branchBreakupFormArray();
      const tempBreakupFormArray = form.branchBreakupFormArray();
      const outSideBranchBreakupFormArray = form.branchBreakupFormArray();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeFormData);
      branchBreakupFormArray.setValue(branchBreakupFormData);
      tempBreakupFormArray.setValue(branchBreakupTempFormData);
      outSideBranchBreakupFormArray.setValue(branchBreakupFormData);
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.receiveContributionMainForm.addControl('branchBreakupForm', branchBreakupFormArray);
      component.receiveContributionMainForm.addControl('tempBranchList', tempBreakupFormArray);
      component.receiveContributionMainForm.addControl('outSideBranchBreakupForm', outSideBranchBreakupFormArray);
      branchDetailsMockData.forEach(item => {
        component.branchDetails.push(new BranchDetails().fromJsonToObject(item));
      });
      component.receiveContributionWizard = new ProgressWizardDcComponent();
      component.savePaymentDetails();
      expect(component.paymentResponse.parentReceiptNo).not.toEqual(null);
    });
    it('It should update the payment details', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      const branchBreakupFormArray = form.branchBreakupFormArray();
      const outSideBranchBreakupFormArray = form.branchBreakupFormArray();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeFormData);
      branchBreakupFormArray.setValue(branchBreakupFormData);
      outSideBranchBreakupFormArray.setValue(branchBreakupFormData);
      spyOn(component, 'setAmount').and.callThrough();
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.receiveContributionMainForm.addControl('branchBreakupForm', branchBreakupFormArray);
      component.receiveContributionMainForm.addControl('outSideBranchBreakupForm', outSideBranchBreakupFormArray);
      branchDetailsMockData.forEach(item => {
        component.branchDetails.push(new BranchDetails().fromJsonToObject(item));
      });
      component.isPaymentSaved = true;
      component.inWorkflow = true;
      component.editFlag = false;
      component.mofFlag = false;
      component.gccFlag = false;
      component.receiveContributionWizard = new ProgressWizardDcComponent();
      component.savePaymentDetails();
      expect(component.paymentResponse.parentReceiptNo).not.toEqual(null);
      expect(component.isPaymentSaved).toBe(true);
      expect(component.inWorkflow).toBe(true);
    });
    it('It should throw error on saving payment details', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      const branchBreakupFormArray = form.branchBreakupFormArray();
      const outSideBranchBreakupFormArray = form.branchBreakupFormArray();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeFormData);
      branchBreakupFormArray.setValue(branchBreakupFormData);
      outSideBranchBreakupFormArray.setValue(branchBreakupFormData);
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.receiveContributionMainForm.addControl('branchBreakupForm', branchBreakupFormArray);
      component.receiveContributionMainForm.addControl('outSideBranchBreakupForm', outSideBranchBreakupFormArray);
      branchDetailsMockData.forEach(item => {
        component.branchDetails.push(new BranchDetails().fromJsonToObject(item));
      });
      component.receiveContributionWizard = new ProgressWizardDcComponent();
      spyOn(component.contributionPaymentService, 'savePaymentDetails').and.returnValue(throwError(genericError));
      component.savePaymentDetails();
      expect(component.paymentResponse.parentReceiptNo).toBeUndefined();
    });
    it('It should throw error on updating payment details', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      const branchBreakupFormArray = form.branchBreakupFormArray();
      const outSideBranchBreakupFormArray = form.branchBreakupFormArray();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeFormData);
      branchBreakupFormArray.setValue(branchBreakupFormData);
      outSideBranchBreakupFormArray.setValue(branchBreakupFormData);
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.receiveContributionMainForm.addControl('branchBreakupForm', branchBreakupFormArray);
      component.receiveContributionMainForm.addControl('outSideBranchBreakupForm', outSideBranchBreakupFormArray);
      branchDetailsMockData.forEach(item => {
        component.branchDetails.push(new BranchDetails().fromJsonToObject(item));
      });
      component.inWorkflow = true;
      component.isPaymentSaved = true;
      component.errorFlag = false;
      component.receiveContributionWizard = new ProgressWizardDcComponent();
      spyOn(component.contributionPaymentService, 'updatePayment').and.returnValue(throwError(genericError));
      component.savePaymentDetails();
      expect(component.paymentResponse.parentReceiptNo).toBeUndefined();
      expect(component.isPaymentSaved).toBe(true);
      expect(component.inWorkflow).toBe(true);
    });

    it('should throw mandatory error', () => {
      component.savePaymentDetails();
      expect(component.errorFlag).toBeFalsy();
    });
  });
  describe('create data', () => {
    it('should create data for gcc establishment with wrong data', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      const branchBreakupFormArray = form.branchBreakupFormArray();
      const outSideBranchBreakupFormArray = form.branchBreakupFormArray();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeFormData);
      branchBreakupFormArray.setValue(branchBreakupErrorFormData);
      outSideBranchBreakupFormArray.setValue(branchBreakupFormData);
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.receiveContributionMainForm.addControl('branchBreakupForm', branchBreakupFormArray);
      component.receiveContributionMainForm.addControl('outSideBranchBreakupForm', outSideBranchBreakupFormArray);
      branchDetailsMockData.forEach(item => {
        component.branchDetails.push(new BranchDetails().fromJsonToObject(item));
      });

      component.gccFlag = true;

      component.createFormData();

      expect(component.errorFlag).toBeTruthy();
    });
    it('should create data for mof with wrong data', () => {
      const form = new PaymentForm();
      const receiptModeForm = form.receiptModeForm();
      const paymentDetailsForm = form.chequeForm();
      bindToForm(receiptModeForm, receiptModeFormData);
      bindToForm(paymentDetailsForm, chequeErrorFormData);
      component.receiveContributionMainForm.addControl('paymentDetails', paymentDetailsForm);
      component.receiveContributionMainForm.addControl('receiptMode', receiptModeForm);
      component.mofFlag = true;
      component.createFormData();
      expect(component.paymentDetails.branchAmount).toBeNull();
    });
  });

  describe('test suite for getDocuments', () => {
    it('should get documents for mof', () => {
      component.mofFlag = true;
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments('Personnel Cheque');

      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.SCAN_TRANSACTION_ID,
        MOFDocumentType.PERSONNEL_CHEQUE
      );
    });
  });

  describe('test suite for submitPaymentDetails ', () => {
    xit('It should submit the payment details', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      component.inWorkflow = false;
      component.paymentReceived = true;
      bindToForm(commentsForm, commentFormData);
      spyOn(component.contributionPaymentService, 'submitPaymentDetails').and.callThrough();
      component.receiveContributionMainForm.addControl('comments', commentsForm);
      component.submitPaymentDetails();
      expect(component.paymentReceived).toBeTruthy();
      expect(component.inWorkflow).toBe(false);
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    xit('It throw error on submit payment details', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);
      component.receiveContributionMainForm.addControl('comments', commentsForm);
      component.inWorkflow = false;
      spyOn(component.alertService, 'showError');
      spyOn(component.contributionPaymentService, 'submitPaymentDetails').and.returnValue(throwError(genericError));
      component.submitPaymentDetails();
      expect(component.alertService.showError);
      expect(component.paymentReceived).toBeFalsy();
      expect(component.inWorkflow).toBe(false);
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should submit payment details after edit', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);
      component.receiveContributionMainForm.addControl('comments', commentsForm);
      component.inWorkflow = true;
      spyOn(component.router, 'navigate');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.submitPaymentDetails();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalledTimes(0);
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should throw error on submit after edit', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);

      component.receiveContributionMainForm.addControl('comments', commentsForm);
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      component.inWorkflow = true;
      component.submitPaymentDetails();

      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalledTimes(0);
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It throw error on check mandatory documents uploaded', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);
      component.receiveContributionMainForm.addControl('comments', commentsForm);
      component.isAppPrivate = false;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');

      component.submitPaymentDetails();

      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });

    it('It throw error on check mandatory documents scanned', () => {
      const form = new PaymentForm();
      const commentsForm = form.commentForm();
      bindToForm(commentsForm, commentFormData);
      component.receiveContributionMainForm.addControl('comments', commentsForm);
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');

      component.submitPaymentDetails();

      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
  });

  describe('getConversionRate', () => {
    xit('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
      component.getConversionRate(eventFormData);
      expect(component.currencyDetails.exchangeRate).not.toBeNull();
      expect(component.countryValue).toBeDefined();
      expect(component.newTransactionDate).toBeDefined();
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should cancel the transaction in workflow after edit', () => {
      component.inWorkflow = true;
      component.editFlag = true;
      spyOn(component.billingRoutingService, 'navigateToValidator');
      spyOn(component.router, 'navigate');
      spyOn(component, 'navigateBack').and.callThrough();
      component.cancelForm();

      expect(component.navigateBack).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should cancel the transaction in workflow without edit', () => {
      component.inWorkflow = true;
      component.isAppPrivate = false;
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component.router, 'navigate');
      spyOn(component, 'navigateBack').and.callThrough();
      component.cancelForm();

      expect(component.navigateBack).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should throw error on cancelling the transaction', () => {
      component.inWorkflow = true;
      component.editFlag = true;
      spyOn(component.billingRoutingService, 'navigateToInbox');
      spyOn(component.router, 'navigate');
      spyOn(component, 'navigateBack');
      spyOn(component.contributionPaymentService, 'revertPaymentDetails').and.returnValue(throwError(genericError));

      component.cancelForm();

      expect(component.navigateBack).toHaveBeenCalledTimes(0);
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should cancel the transaction in csr screen', () => {
      spyOn(component, 'navigateOnCancel').and.callThrough();
      spyOn(component.router, 'navigate');
      component.cancelForm();
      expect(component.currentTab).toEqual(0);
      expect(component.navigateOnCancel).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should cancel the transaction in csr screen', () => {
      component.idNumber = 12352;
      spyOn(component.router, 'navigate');
      component.navigateOnCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouteConstants.EST_PROFILE_ROUTE(component.idNumber)]);
    });
  });
  describe('test suite for cancelForm', () => {
    it('It should cancel if payment is saved', () => {
      component.inWorkflow = false;
      component.isPaymentSaved = true;
      spyOn(component.router, 'navigate');
      spyOn(component.contributionPaymentService, 'cancelPaymentDetails').and.callThrough();
      component.cancelForm();
      expect(component.contributionPaymentService.cancelPaymentDetails).toHaveBeenCalled();
      expect(component.cancelDetails.comments).toBeNull();
      expect(component.cancelDetails.reasonForCancellation).toBeNull();
    });
    it('It should cancel if payment is saved', () => {
      component.inWorkflow = false;
      component.isPaymentSaved = true;
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showError');
      spyOn(component.contributionPaymentService, 'cancelPaymentDetails').and.returnValue(throwError(genericError));
      component.cancelForm();
      expect(component.contributionPaymentService.cancelPaymentDetails).toHaveBeenCalled();
      expect(component.cancelDetails.comments).toBeNull();
      expect(component.alertService.showError);
      expect(component.cancelDetails.reasonForCancellation).toBeNull();
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.receiveContributionWizard = new ProgressWizardDcComponent();
      component.receiveContributionWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.previousForm();

      expect(component.currentTab).toEqual(0);
    });
  });
  describe('test suite for selectWizard', () => {
    it('It should navigate to selected section', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });

  describe('test suite to intialse the view in edit mode', () => {
    it('It should be able to view the branch details,receipt details on edit', inject(
      [RouterDataToken],
      (token: RouterData) => {
        token.tabIndicator = 1;
        const payload = { registrationNo: 502351249, id: 100036 };
        spyOn(component, 'getEstablishmentDetails');
        spyOn(component, 'getReceiptDetails').and.callThrough();
        spyOn(component, 'retrieveScannedDocuments');
        branchDetailsMockData.forEach(branch => {
          component.branchDetails.push(new BranchDetails().fromJsonToObject(branch));
        });
        component.initialiseViewForEdit(token, payload);
        expect(component.getReceiptDetails).toHaveBeenCalled();
      }
    ));
    it('should create alert error', () => {
      spyOn(component.alertService, 'showErrorByKey');

      component.outSideBranchValidate(true);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('It should be able to view the branch details,receipt details on edit for mof', inject(
      [RouterDataToken],
      (token: RouterData) => {
        const payload = { registrationNo: 502351249, id: 100036 };
        component.mofFlag = true;
        spyOn(component, 'getReceiptDetails');
        spyOn(component, 'getEstablishmentDetails');
        component.initialiseViewForEdit(token, payload);
        expect(component.getReceiptDetails).toHaveBeenCalled();
      }
    ));
    it('It should throw error on retrieveing branches', inject([RouterDataToken], (token: RouterData) => {
      const payload = { registrationNo: 502351249, id: 100036 };
      spyOn(component, 'getEstablishmentDetails');
      spyOn(component.establishmentService, 'getBranchDetails').and.returnValue(throwError(genericError));
      component.initialiseViewForEdit(token, payload);
      expect(component.branchDetails.length).toBe(0);
    }));
  });
  describe('getPaymentSummary', () => {
    it('should getPaymentSummary', () => {
      component.idNumber = 13200432;
      component.receiptNumber = 321;
      component.mofFlag = true;
      spyOn(component.contributionPaymentService, 'getReceiptDetails').and.callThrough();
      component.getPaymentSummary();
      expect(component.contributionPaymentService.getReceiptDetails).toHaveBeenCalled();
    });
  });
  describe('getReceiptDetails', () => {
    it('should throw error on retrieving receiptDetails', inject([RouterDataToken], (token: RouterData) => {
      spyOn(component.contributionPaymentService, 'getReceiptDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getReceiptDetails(token);
      expect(component.alertService.showError).toHaveBeenCalled();
    }));
  });
  describe('searchBranches', () => {
    it('should search branch', () => {
      component.searchBranches('13200432');
      expect(component.branchDetails).not.toEqual(null);
    });
  });
  describe('getbranchFilter', () => {
    it('should filter branch', () => {
      const branchDetails = {
        fieldOffice: [{ english: '', arabic: '' }],
        status: [{ english: '', arabic: '' }],
        molEstIncluded: true
      };

      component.idNumber = 13200432;
      component.getbranchFilter(branchDetails);
      expect(component.branchFilterDetails).not.toBeNull();
    });
  });

  describe('searchOutsideBranches', () => {
    it('should search outside branches if fieldArray is null', () => {
      const regNo = '13200432';
      component.fieldArray = null;
      component.searchOutsideBranches(regNo);
      expect(component.branchFilterDetails).not.toBeNull();
    });
    it('should search outside branches if fieldArray is not null', () => {
      const regNo = '13200432';
      component.fieldArray = [];
      component.searchOutsideBranches(regNo);
      expect(component.branchFilterDetails).not.toBeNull();
    });
  });

  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.documentList).not.toBeNull();
    });
  });

  describe('getPenlaityIndicator', () => {
    it('should getPenlaityIndicator', () => {
      const penaltyIndicator = true;
      component.getPenlaityIndicator(penaltyIndicator);
      expect(penaltyIndicator).toBe(true);
    });
  });
  describe('getEventDate', () => {
    it('should getEventDate', () => {
      const values = {
        transactionDate: new Date(),
        countryName: 'SAR'
      };
      component.getEventDate(values);
      expect(values).not.toEqual(null);
    });
  });
  describe('retrieveScannedDocuments', () => {
    it('should retrieve ScannedDocuments', () => {
      const receiptMode = 'Cash Transfer';
      component.retrieveScannedDocuments(receiptMode);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('getAnotherTransaction', () => {
    it('should go to main screen', () => {
      component.isAppPrivate = true;
      component.idNumber = 1234;
      spyOn(component.router, 'navigate');
      component.getAnotherTransaction();
      expect(component.router.navigate).toHaveBeenCalledWith([RouteConstants.EST_PROFILE_ROUTE(component.idNumber)]);
      expect(component.receiptNumber).toBeNull();
      expect(component.isPaymentSaved).toBeFalsy();
      expect(component.paymentReceived).toBeFalsy();
      expect(component.currentTab).toBe(0);
    });
  });
  describe('inValidatorEditMode', () => {
    it('should check screen is opened properly in edit mode', inject(
      [ActivatedRoute, RouterDataToken],
      (route: ActivatedRoute, token: RouterData) => {
        route.queryParams = of({ mof: 'true' });
        token.taskId = 'wkne';
        token.payload = '{}';
        component.inWorkflow = true;
        spyOn(component, 'initialiseViewForEdit');
        component.checkIsEditMode();
        expect(component.initialiseViewForEdit).toHaveBeenCalled();
      }
    ));
  });
  describe('inNormalMode', () => {
    it('should check screen is opened properly not in edit mode', () => {
      component.isAppPrivate = false;
      component.inWorkflow = false;
      component.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, 365246);
      spyOn(component, 'getEstablishmentDetails');
      component.checkIsEditMode();
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'generatePaymentsReport').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printTransaction();
      expect(component.reportStatementService.generatePaymentsReport).toHaveBeenCalled();
    });
  });
});
