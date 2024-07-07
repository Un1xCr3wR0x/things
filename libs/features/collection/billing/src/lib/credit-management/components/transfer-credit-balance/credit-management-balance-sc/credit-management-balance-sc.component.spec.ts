/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  StorageServiceStub,
  CreditManagementServiceServiceStub,
  ModalServiceStub,
  BillEstablishmentServiceStub,
  BillingRoutingServiceStub,
  DocumentServiceStub
} from 'testing/mock-services';
import { RouterTestingModule } from '@angular/router/testing';
import {
  RouterDataToken,
  LanguageToken,
  CurrencyToken,
  ApplicationTypeToken,
  RegistrationNoToken
} from '@gosi-ui/core/lib/tokens';
import { RouterData, WizardItem, DocumentItem, BilingualText, RegistrationNumber } from '@gosi-ui/core/lib/models';

import { BehaviorSubject, throwError } from 'rxjs';
import { bindToForm, StorageService, bindToObject, DocumentService } from '@gosi-ui/core';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  BilingualTextPipeMock,
  branchBreakUpFormData,
  checkFormData,
  CreditManagmentForm,
  ProgressWizardDcMockComponent,
  totalAmountForm,
  genericError,
  contributionPaymentMockToken,
  FeildOfficeData,
  documentListItemArray
} from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingRoutingService, CreditManagementService, EstablishmentService } from '../../../../shared/services';
import { CreditManagementBalanceScComponent } from '../credit-management-balance-sc/credit-management-balance-sc.component';
import { BillingConstants } from '../../../../shared/constants/billing-constants';

describe('CreditManagementBalanceScomponent', () => {
  let component: CreditManagementBalanceScComponent;
  let fixture: ComponentFixture<CreditManagementBalanceScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [CreditManagementBalanceScComponent, ProgressWizardDcMockComponent],
      providers: [
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        { provide: CreditManagementService, useClass: CreditManagementServiceServiceStub },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        FormBuilder,
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },

        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditManagementBalanceScComponent);
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
      component.getEstablishmentDetail(502351249);
      component.getBranchDetails(502351249);
      expect(component.lang).not.toEqual(null);
    });
  });
  describe('ngOnInit', () => {
    // component.isAppPrivate = false;
    // component.regNumber = 502351249;
    // component.requestNo = 789;
    // component.referenceNumber = 502351249;
    // component.inWorkflow = true;
    // spyOn(component, 'getAllcreditDetails').and.callThrough();

    // component.routerDataToken.payload = true;
    // component.ngOnInit();
    // component.initialiseViewForEdit(502351249);
    // expect(component.getAllcreditDetails).toHaveBeenCalled();
    // expect(component.lang).not.toEqual(null);
    it('should initialise the components', inject([RouterDataToken], token => {
      token.taskId = 'asdasdasd';
      token.payload = '{"regNumber": 231, "requestNo ": 231,"referenceNumber ": 231}';
      component.isAppPrivate = false;
      component.regNumber = 502351249;
      component.requestNo = 789;
      component.referenceNumber = 502351249;
      component.inWorkflow = true;
      component.ngOnInit();
      component.initialiseViewForEdit(502351249);
      expect(component.referenceNumber).toBeDefined();
      expect(component.lang).not.toEqual(null);
    }));
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocuments(document);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe(' getScannedDocuments', () => {
    it('should  getScannedDocuments', () => {
      component.getScannedDocuments(502351249);
      expect(component.documentList).not.toEqual(null);
    });
  });
  describe('searchValues', () => {
    it('should searchValues', () => {
      component.searchValues(true);
      expect(component.isSerach).not.toEqual(null);
    });
  });
  describe('getEstablishmentDetails', () => {
    it('should get establishment details', () => {
      component.getEstablishmentDetail(502351249);
      expect(component.establishmentDetails).not.toEqual(null);
    });
  });
  describe('getBranchDetails', () => {
    it('should getBranch details', () => {
      component.getBranchDetails(502351249);
      expect(component.branchDetails).not.toEqual(null);
    });
    //     it('should throw error for getBranch', () => {
    //  spyOn(component.establishmentService, 'getBranchDetails').and.returnValue(throwError(genericError));
    //     spyOn(component.alertService, 'showError').and.callThrough();
    //     spyOn(component, 'getBranchDetails').and.callThrough();
    //     expect(component.showError).toHaveBeenCalled();
    //     });
  });

  describe('getAvailableBalanceDetails', () => {
    it('should get availableBalance Details', () => {
      component.getAvailableBalanceDetails(502351249);
      expect(component.creditBalanceDetails).not.toEqual(null);
    });
    it('should throw error for getAvailableBalanceDetails', () => {
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getAvailableBalanceDetails(502351249);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw alert error', () => {
      spyOn(component.alertService, 'showErrorByKey');

      component.wrongSearchValue();
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    //     it('should show popup Cancel', () => {
    //       spyOn(component, 'getAvailableBalanceDetails');
    //      component.isSerach = true;
    //  expect(component.getAvailableBalanceDetails).toHaveBeenCalled();
    //     });
  });
  describe('test suite for selectWizard', () => {
    it('It should navigate to selected section', () => {
      component.selectWizards(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      component.regNumber = contributionPaymentMockToken.registrationNumber;
      component.receiptNumber = contributionPaymentMockToken.receiptNo;
      component.searchResult = false;
      spyOn(component, 'getEstablishmentDetail').and.callThrough();
      spyOn(component, 'getAllcreditDetails').and.callThrough();
      component.initialiseViewForEdit(contributionPaymentMockToken);
      expect(component.getEstablishmentDetail).toHaveBeenCalled();
      expect(component.getAllcreditDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for selectedBranchList', () => {
    it('It should selectedBranchList', () => {
      component.getBranch(FeildOfficeData[0]);
      component.selectedBranchList(FeildOfficeData);
    });
  });
  describe('test suite for searchBranches', () => {
    it('It should searchBranches', () => {
      const regno = '123456';
      spyOn(component.establishmentService, 'getEstablishment').and.callThrough();
      component.searchBranches(regno);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelAvailableCreditPage', () => {
    it('It should cancelAvailableCreditPage', () => {
      component.inWorkflow = true;
      spyOn(component, 'navigateToBack');
      component.cancelAvailableCreditPage();
      expect(component.navigateToBack).toHaveBeenCalled();
    });
    it('It should cancelAvailableCreditPage', () => {
      component.inWorkflow = false;
      spyOn(component, 'cancelDetails');
      component.cancelAvailableCreditPage();
      expect(component.cancelDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for cancelDetails', () => {
    it('It should cancelDetails', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.cancelDetails();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor']);
    });
    it('It should cancelDetails', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      component.cancelDetails();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
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
  describe('test suite for document fetch', () => {
    it('retrieveScannedDocument', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments().subscribe();
      component.retrieveScannedDocument();
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_MANAGEMENT_ID,
        BillingConstants.CREDIT_MANAGEMENT_TRANSACTION_GOL_TYPE
      );
    });
  });

  describe('test suite for saveCreditDetails ', () => {
    it('It should saveCreditDetails', () => {
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.saveCreditDetails();
      expect(component.creditDetailsReq.recipientDetail).not.toBeNull();
    });
  });
  describe('test suite for confirmToDocumentPage', () => {
    it('It should confirmToDocumentPage', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.inWorkflow = true;
      component.confirmToDocumentPage();

      expect(component.currentTab).toEqual(1);
    });
  });
  describe('test suite for saveCreditDetails ', () => {
    it('It should saveCreditDetails', () => {
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      bindToForm(commentForm, commentForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.creditManagmentMainForm.addControl('commentForm', commentForm);
      component.creditManagmentMainForm.addControl('checkForm', checkForm);
      component.createFormData();
      expect(component.isValid).toBeTrue();
    });
  });
  describe('test suite for confirmToDocumentPage', () => {
    it('It should confirmToDocumentPage', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.inWorkflow = false;
      component.confirmToDocumentPage();
      expect(component.documentList).not.toEqual(null);
    });
  });
  xdescribe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      component.inWorkflow = false;
      component.cancelCreditUpload();
      expect(component.router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate navigateBackToValidator', () => {
      spyOn(component.creditManagementService, 'revertDocumentDetails').and.callThrough();
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.inWorkflow = true;
      component.cancelCreditUpload();
      // expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
      expect(component.creditManagementService.revertDocumentDetails).toHaveBeenCalled();
    });
  });
  describe('cancelPopUp()', () => {
    it('Should CancelPopup', () => {
      component.cancelPopups();
      expect(component.isSave).toBeFalsy();
    });
  });
  describe('cancelPopUp()', () => {
    it('Should CancelPopup', () => {
      component.isSerach = true;
      spyOn(component, 'getBranchDetails').and.callThrough();
      component.popupCancel();
      expect(component.getBranchDetails).toHaveBeenCalled();
    });
  });
  describe('showError', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError');
      component.showError(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for submitDocumentPage', () => {
    it('It should submitDocumentPage', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      bindToForm(commentForm, commentForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.creditManagmentMainForm.addControl('commentForm', commentForm);
      component.creditManagmentMainForm.addControl('checkForm', checkForm);
      component.inWorkflow = false;
      component.isAppPrivate = true;
      spyOn(component.router, 'navigate');
      component.submitDocumentPage();

      expect(component.searchResult).toBeTruthy();
    });
    it('It should submitDocumentPage', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      bindToForm(commentForm, commentForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.creditManagmentMainForm.addControl('commentForm', commentForm);
      component.creditManagmentMainForm.addControl('checkForm', checkForm);
      component.inWorkflow = true;
      component.isAppPrivate = true;
      spyOn(component.router, 'navigate');
      component.submitDocumentPage();

      expect(component.searchResult).toBeTruthy();
    });
    it('It should submitDocumentPage', () => {
      component.creditManagementWizard = new ProgressWizardDcComponent();
      component.inWorkflow = false;
      component.isAppPrivate = false;
      component.submitDocumentPage();
      expect(component.currentTab).toEqual(2);
    });
  });
  describe('checkFormValidity', () => {
    it('should check validity', () => {
      expect(component.checkFormValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      bindToForm(commentForm, commentForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.creditManagmentMainForm.addControl('commentForm', commentForm);
      component.creditManagmentMainForm.addControl('checkForm', checkForm);
      spyOn(component.router, 'navigate');
      component.isValid = true;
      component.inWorkflow = true;
      component.isAppPrivate = true;
      component.submittPage(modalRef, 'lg');
      expect(component.searchResult).toBeTruthy();
    });
    it('navigate to home in private screen', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const form = new CreditManagmentForm();
      const checkForm = form.checkForm();
      const branchBreakupForm = form.getBranchBreakupForm();
      const totalForm = form.getOutsideTotalAmountForm();
      const commentForm = form.createWavierUploadDetailForm();
      bindToForm(checkForm, checkFormData);
      bindToForm(branchBreakupForm, branchBreakUpFormData);
      bindToForm(totalForm, totalAmountForm);
      bindToForm(commentForm, commentForm);
      component.creditManagmentMainForm.addControl('branchBreakupForm', branchBreakupForm);
      component.creditManagmentMainForm.addControl('commentForm', commentForm);
      component.creditManagmentMainForm.addControl('checkForm', checkForm);
      spyOn(component.router, 'navigate');
      component.isValid = false;
      component.submittPage(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('CreditManagmentBalanceBaseScComponent', () => {
    it('should getAvailableBalanceDetails', () => {
      component.getAvailableBalanceDetails(110000103);
      expect(component.creditBalanceDetails).not.toBeNull();
    });
    it('should getAllcreditDetails', () => {
      component.requestNo = 1234;
      component.getAllcreditDetails(110000103, 1234);
      expect(component.creditDetailsReq).not.toBeNull();
    });
    it('should refreshDocuments', () => {
      component.regNumber = 110000103;
      component.referenceNumber = 12345;
      component.uuid = '';
      component.refreshDocuments(bindToObject(new DocumentItem(), { name: new BilingualText() }));
    });
  });

  describe('navigateBackToInbox', () => {
    it('Should navigate to private Inbox', () => {
      component.isAppPrivate = true;
      spyOn(component.routingService, 'navigateToInbox').and.callThrough();
      component.navigateBackToInbox();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('navigateBackToInbox', () => {
    it('Should navigate to public inbox', () => {
      component.isAppPrivate = false;
      spyOn(component.routingService, 'navigateToPublicInbox').and.callThrough();
      component.navigateBackToInbox();
      expect(component.routingService.navigateToPublicInbox).toHaveBeenCalled();
    });
  });

  describe('navigateToBack', () => {
    it('Should navigate to private Inbox', () => {
      spyOn(component.routingService, 'navigateToValidator').and.callThrough();
      component.navigateToBack(true);
      expect(component.routingService.navigateToValidator).toHaveBeenCalled();
    });
    it('Should navigate to public inbox', () => {
      spyOn(component.routingService, 'navigateToInbox').and.callThrough();
      component.navigateToBack(false);
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
});
