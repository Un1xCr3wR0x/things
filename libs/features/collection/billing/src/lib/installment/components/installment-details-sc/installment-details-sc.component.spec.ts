/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  bindToForm,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BilingualTextPipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AuthTokenServiceStub,
  bankGuaranteeFormData,
  BilingualTextPipeMock,
  commentFormTesTData,
  docList,
  DocumentServiceStub,
  EstablishmentServiceStub,
  genericError,
  guaranteeBankingModeFormData,
  guaranteeOtherModeFormData,
  guaranteePromissoryModeFormData,
  InstallemntSubmitRequestMockData,
  InstallmentForm,
  InstallmentStub,
  otherGuaranteeFormData,
  othersGuaranteeFormData,
  pensionGuaranteeForm,
  ProgressWizardDcMockComponent,
  promissoryGuaranteeFormData,
  WorkflowServiceStub
} from 'testing';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { InstallmentGuaranteeDetails, InstallmentPeriodDetails } from '../../../shared/models';
import { EstablishmentService, InstallmentService } from '../../../shared/services';
import { InstallmentDetailsScComponent } from './installment-details-sc.component';

const documentListItemArray = docList.map(doc => bindToObject(new DocumentItem(), doc));
describe('InstallmentDetailsScComponent', () => {
  let component: InstallmentDetailsScComponent;
  let fixture: ComponentFixture<InstallmentDetailsScComponent>;
  const payloadData = {
    id: 1001,
    referenceNo: 100,
    registrationNo: 200085744,
    assignedRole: 'Validator 1'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [InstallmentDetailsScComponent, ProgressWizardDcMockComponent],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: EstablishmentService,
          useClass: EstablishmentServiceStub
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: InstallmentService,
          useClass: InstallmentStub
        },
        {
          provide: RouterDataToken,
          useValue: {
            ...bindToObject(new RouterData(), { comments: [new TransactionReferenceData()] }),
            payload: JSON.stringify(payloadData)
          }
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  describe('navigateBack', () => {
    it('should navigate to home screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBack();
      component.showSearch = true;
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('navigateOnCancel', () => {
    it('should navigate tocancel', () => {
      spyOn(component.router, 'navigate');
      component.navigateOnCancel();
      spyOn(component.alertService, 'clearAlerts');
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' getEstablishmentDet', () => {
    it('should get establishment details error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.searchForEstablishment(34564566);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    describe('getEstablishmentDet', () => {
      it('should show getEstablishmentDet', () => {
        component.searchForEstablishment(34564566);
        expect(component.establishmentDet).not.toEqual(null);
      });
    });
    describe('previousForm', () => {
      it('Should navigate to pervious section', () => {
        component.installmentWizard = new ProgressWizardDcComponent();
        component.installmentWizard.wizardItems = [new WizardItem('Label', 'Icon')];
        component.currentTab = 1;
        spyOn(component.installmentWizard, 'setPreviousItem').and.callThrough();
        component.previousForm();
        expect(component.currentTab).toEqual(0);
      });
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents for getRequiredDocuments', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getRequiredDocuments(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE
      );

      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.CONTRIBUTOR_REFUND_ID,
        BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE
      );
    });
  });
  describe(' getDocuments', () => {
    it('should  getDocuments', () => {
      component.transactionId = BillingConstants.CONTRIBUTOR_REFUND_ID;
      component.transactionType = BillingConstants.CONTRIBUTOR_REFUND_TRANSACTION_TYPE;
      component.regNumber = 110000103;
      component.getDocuments();
      expect(component.documents).not.toEqual(null);
    });
  });
  describe('getValidatorInstallmentDetails', () => {
    it('should getValidatorInstallmentDetails', () => {
      component.getValidatorInstallmentDetails(502351249, 200085744);
      expect(component.installmentRequest).not.toEqual(null);
    });
    it('should throw error on getValidatorInstallmentDetails', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.installmentService, 'getValidatorInstallmentDetails').and.returnValue(throwError(genericError));
      component.getValidatorInstallmentDetails(502351249, 200085744);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocuments(document);
      expect(component.documents).not.toBeNull();
    });
    it('should throw error on refresh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrors').and.callThrough();
      component.refreshDocuments(new DocumentItem());
      expect(component.showErrors).toHaveBeenCalled();
    });
  });
  describe('setDocumentParameters', () => {
    // it('should Bank Guarantee', () => {
    //   component.setDocumentParameters();
    //   expect(component.transactionId).not.toEqual(null);
    // });
    it('should setDocumentParameters if not out of market', () => {
      component.guarantee = 'Bank Guarantee';
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should setDocumentParameters if not out of market', () => {
      component.guarantee = 'Promissory Note';
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should getDocParameter if not out of market', () => {
      component.outOfMarketFlag = false;
      component.guarantee = 'Pension';
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should setDocumentParameters if out of market', () => {
      component.outOfMarketFlag = true;
      component.guarantee = 'Pension';
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should setDocumentParameters if not out of market', () => {
      component.outOfMarketFlag = false;
      component.guarantee = 'Other';
      component.guaranteeType = { english: 'No Guarantee', arabic: '' };
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should setDocumentParameters if out of market', () => {
      component.outOfMarketFlag = true;
      component.guarantee = 'Other';
      component.guaranteeType = { english: 'Establishment owner is on a job', arabic: '' };
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
    it('should setDocumentParameters if out of market', () => {
      component.outOfMarketFlag = true;
      component.guarantee = 'Other';
      component.guaranteeType = { english: 'Deceased / no source of income', arabic: '' };
      component.setDocumentParameters();
      expect(component.transactionId).not.toEqual(null);
    });
  });
  describe('test suite for refund contributor  error ', () => {
    it('Should call showErrorMessage for refund contributor ', () => {
      spyOn(component.alertService, 'showError');
      component.showErrors({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for createFormData for Banking ', () => {
    it('It should createFormData', () => {
      const form = new InstallmentForm();
      component.guarantee = 'Bank Guarantee';
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      bindToForm(guaranteeModeForm, guaranteeBankingModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.createFormData();
      expect(component.isValid).not.toBeNull();
    });
  });
  describe('test suite for createFormData  for promissory', () => {
    it('It should createFormData', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      component.guarantee = 'Promissory Note';
      component.isdownPayment = true;
      component.downPaymentPercentage = 50;
      component.extraAddedGrace = 10;
      bindToForm(guaranteeModeForm, guaranteePromissoryModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.createFormData();
      expect(component.isValid).not.toBeNull();
    });
  });
  describe('test suite for createFormData  for pension', () => {
    it('It should createFormData', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      component.guarantee = 'Pension';
      component.isdownPayment = true;
      component.downPaymentPercentage = 50;
      bindToForm(guaranteeModeForm, guaranteePromissoryModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.installmentMainForm.addControl('pensionTypeForm', pensionTypeForm);
      component.createFormData();
      expect(component.isValid).not.toBeNull();
    });
  });
  describe('test suite for createFormData  for Other', () => {
    it('It should createFormData', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createGuaranteeTypeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      const otherTypeForm = form.createOthersSalaryAmountForm();
      component.guarantee = 'Other';
      bindToForm(guaranteeModeForm, guaranteeOtherModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      bindToForm(otherTypeForm, otherGuaranteeFormData);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.installmentMainForm.addControl('pensionTypeForm', pensionTypeForm);
      component.installmentMainForm.addControl('otherTypeForm', otherTypeForm);
      component.createFormData();
      expect(component.isValid).not.toBeNull();
      expect(component.isOwnerOnJob).toBeTruthy();
    });
  });
  xdescribe('test suite for createFormData ', () => {
    it('It should createFormData', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      bindToForm(guaranteeModeForm, guaranteeBankingModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.guarantee = 'Bank Guarantee';
      component.saveAndNext();
      expect(component.currentTab).toBe(0);
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.installmentWizard = new ProgressWizardDcComponent();
      component.installmentWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.nextForm();

      expect(component.currentTab).toEqual(0);
    });
  });
  describe('test suite for getGuaranteeType', () => {
    it('It should getGuaranteeType', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      spyOn(component, 'getInstallmentDetails').and.callThrough();
      bindToForm(guaranteeModeForm, guaranteePromissoryModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.getGuaranteeType();
      expect(component.getInstallmentDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getGuaranteeType', () => {
    it('It should getGuaranteeType', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      const commentForm = form.createCommentForm();
      component.installmentSubmitRequest = InstallemntSubmitRequestMockData;
      bindToForm(guaranteeModeForm, guaranteePromissoryModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      bindToForm(commentForm, commentFormTesTData);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.installmentMainForm.addControl('commentsForm', commentForm);
      component.inWorkflow = false;
      spyOn(component.router, 'navigate');
      component.submitInstallmentDetails();
      expect(component.successMessage).not.toBeNull();
    });
  });
  describe('test suite for getGuaranteeType', () => {
    it('It should getGuaranteeType', () => {
      const form = new InstallmentForm();
      const guaranteeModeForm = form.createGuaranteeModeForm();
      const guaranteeTypeModeForm = form.createOthersGuaranteeForm();
      const bankingTypeForm = form.createBankGuaranteeForm();
      const promissoryTypeForm = form.createPromissoryGuaranteeForm();
      const pensionTypeForm = form.createPensionGuaranteeForm();
      const commentForm = form.createCommentForm();
      component.installmentSubmitRequest = InstallemntSubmitRequestMockData;
      bindToForm(guaranteeModeForm, guaranteePromissoryModeFormData);
      bindToForm(guaranteeTypeModeForm, othersGuaranteeFormData);
      bindToForm(bankingTypeForm, bankGuaranteeFormData);
      bindToForm(promissoryTypeForm, promissoryGuaranteeFormData);
      bindToForm(pensionTypeForm, pensionGuaranteeForm);
      bindToForm(commentForm, commentFormTesTData);
      component.installmentMainForm.addControl('guaranteeModeForm', guaranteeModeForm);
      component.installmentMainForm.addControl('guaranteeTypeModeForm', guaranteeTypeModeForm);
      component.installmentMainForm.addControl('bankingTypeForm', bankingTypeForm);
      component.installmentMainForm.addControl('promissoryTypeForm', promissoryTypeForm);
      component.installmentMainForm.addControl('commentsForm', commentForm);
      component.inWorkflow = true;
      spyOn(component.router, 'navigate');
      component.submitInstallmentDetails();
      expect(component.successMessage).not.toBeNull();
    });
  });
  describe('checkFormValidity', () => {
    it('should check validity', () => {
      expect(component.checkFormValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('initialise component', () => {
    it('should ngOnInit in workflow', () => {
      component.inWorkflow = true;
      component.ngOnInit();
      expect(component.getLookUpDetails).toBeTruthy;
      expect(component.referenceNumber).not.toEqual(null);
    });
    it('should ngOnInit in not workflow', () => {
      component.inWorkflow = false;
      component.ngOnInit();
      expect(component.showSearch).toBeTrue();
    });
  });
  describe('setDownPaymentAmount', () => {
    it('should setDownPaymentAmount', () => {
      component.setDownPaymentAmount(100);
      expect(component.downPayment).toEqual(100);
    });
  });

  describe('getDownPercentage', () => {
    it('should getDownPercentage', () => {
      component.getDownPercentage(100);
      expect(component.downPaymentPercentage).toEqual(100);
    });
  });
  describe('getExtendedValues', () => {
    it('should getExtendedValues', () => {
      const params = { extraGracePeriod: 10, extensionreason: '', gracePeriod: 5 };
      component.getExtendedValues(params);
      expect(component.gracePeriod).toEqual(5);
    });
  });
  describe('getInstallmentDetails', () => {
    it('should getInstallmentDetails', () => {
      component.guarantee = 'Other';
      component.guaranteeType = { english: 'No Guarantee', arabic: '' };
      component.getInstallmentDetails(110000103);
      expect(component.installmentDetails).not.toEqual(null);
    });
  });
  describe('save', () => {
    it('should save the installment details', () => {
      let installmentDetails = new InstallmentPeriodDetails();
      component.installmentWizard = new ProgressWizardDcComponent();
      installmentDetails.startDate = new Date('2020-02-01');
      installmentDetails.endDate = new Date('2020-03-01');
      component.isGuaranteeDisable = true;
      installmentDetails.lastInstallmentAmount = 23011;
      installmentDetails.periodOfInstallment = 30;
      component.installmentDetailsReq = new InstallmentGuaranteeDetails();
      component.installmentDetailsReq.startDate.gregorian = new Date('2019-09-10');
      component.installmentDetailsReq.endDate.gregorian = new Date('2023-09-10');
      component.guarantee = 'Bank Guarantee';
      component.installmentDetailsReq.endDate.gregorian = new Date('2020-04-01');
      spyOn(component.alertService, 'showErrorByKey');
      component.save(installmentDetails);
      expect(component.alertService.showErrorByKey).not.toEqual(null);
    });
  });
});
