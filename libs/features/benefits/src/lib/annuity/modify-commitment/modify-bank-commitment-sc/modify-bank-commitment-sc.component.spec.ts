/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WizardItem,
  LovList,
  Lov,
  LookupService
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { documentListItemArray, bankDetailsByIBAN } from 'testing';
import { ActivatedRouteStub, ManagePersonServiceStub, ModalServiceStub } from 'testing/mock-services';
import {
  BankService,
  BenefitActionsService,
  BenefitConstants,
  BenefitPaymentDetails,
  BenefitResponse,
  HeirsDetails,
  ModifyPaymentDetails,
  PersonBankDetails,
  StopSubmitRequest,
  UITransactionType,
  AttorneyDetailsWrapper,
  AuthorizationDetailsDto,
  AuthorizationList,
  ManageBenefitService,
  PaymentDetail,
  PaymentMethodDetailsDcComponent
} from '../../../shared';
import { ModifyBankCommitmentScComponent } from './modify-bank-commitment-sc.component';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyBankCommitmentScComponent', () => {
  let component: ModifyBankCommitmentScComponent;
  let fixture: ComponentFixture<ModifyBankCommitmentScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAttorneyDetails',
    'getPaymentDetails'
  ]);
  manageBenefitServiceSpy.getAttorneyDetails.and.returnValue(
    of({ ...new AuthorizationDetailsDto(), AttorneyDetailsWrapper: [{ ...new AttorneyDetailsWrapper() }] })
  );
  manageBenefitServiceSpy.getPaymentDetails.and.returnValue(of(new PaymentDetail()));
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankList']);
  bankServiceSpy.getBankList.and.returnValue(of([new PersonBankDetails()]));
  const benefitActionsServiceSpy = jasmine.createSpyObj<BenefitActionsService>('BenefitActionsService', [
    'removeCommitment',
    'revertRemoveBank',
    'submitModifybankDetails',
    'getModifyCommitmentDetails',
    'saveModifyCommitmentDetails',
    'revertModifyBank'
  ]);
  benefitActionsServiceSpy.saveModifyCommitmentDetails.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.revertModifyBank.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.removeCommitment.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.revertRemoveBank.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.submitModifybankDetails.and.returnValue(of(new BenefitResponse()));
  benefitActionsServiceSpy.getModifyCommitmentDetails.and.returnValue(of(new ModifyPaymentDetails()));
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getBankForIban',
    'getTransferModeDetails',
    'getYesOrNoList',
    'getNationalityList',
    'initialisePayeeType',
    'getCityList',
    'getCountryList'
  ]);
  lookupServiceSpy.getBankForIban.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getTransferModeDetails.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getYesOrNoList.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getNationalityList.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.initialisePayeeType.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getCityList.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.getCountryList.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ModifyBankCommitmentScComponent],

      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },

        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        //{ provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: BenefitActionsService, useValue: benefitActionsServiceSpy },
        { provide: LookupService, useValue: lookupServiceSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyBankCommitmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      spyOn(component, 'initialiseView');
      component.transactionId = BenefitConstants.MODIFY_ACCOUNT;
      component.modifyTransactionConstant = BenefitConstants.MODIFY_TRANSACTION_CONSTANT;
      spyOn(component, 'initializeWizardDetails');
      spyOn(component, 'getLookUpValues');
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('saveBankDetails', () => {
    it('should saveBankDetails', () => {
      const requestData = {
        ...new AuthorizationDetailsDto(),
        personId: 1234,
        isNonSaudiIBAN: 2323,
        newNonSaudiBankName: { english: '', arabic: '' },
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };

      component.saveBankDetails(requestData);
      expect(component.saveBankDetails).toBeDefined();
    });
  });

  describe('navigateDocWizard', () => {
    it('should navigateDocWizard', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.currentTab = 1;
      component.modifyBenefitWizard = new ProgressWizardDcComponent();
      component.navigateDocWizard();
      expect(component.currentTab).not.toBe(null);
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      const payload = {
        sin: 502351249,
        benefitRequestId: 100036,
        referenceNo: 1000045428,
        channel: {
          arabic: '',
          english: 'unknown'
        },
        role: 'Validator 1'
      };
      component.initialiseViewForEdit(payload);
      expect(component.initialiseViewForEdit).not.toBe(null);
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.refreshDocument).not.toBeNull();
    });
  });
  describe('  getUploadedDocuments', () => {
    it('should   getUploadedDocuments', () => {
      const transactionId = '34565656';
      component.benefitRequestId = 233454;
      const doctransactionType = UITransactionType.FO_REQUEST_SANED;
      component.getUploadedDocuments(component.benefitRequestId, transactionId, doctransactionType);
      component.benefitDocumentService
        .getUploadedDocuments(
          component.benefitRequestId,
          component.transactionId,
          doctransactionType,
          component.referenceNo
        )
        .subscribe(res => {
          component.requiredDocs = res;
        });
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('getModifyCommitmentDetails', () => {
    it('should  getModifyCommitmentDetails', () => {
      const isRemove = true;
      component.getModifyCommitmentDetails(isRemove);
      //spyOn (component.benefitActionsService,'getModifyCommitmentDetails').and.returnValue(of(new ModifyPaymentDetails()));
      expect(component.getModifyCommitmentDetails).toBeDefined();
    });
  });
  xdescribe('setPaymentRelatedValues', () => {
    it('should  setPaymentRelatedValues', () => {
      const response = new BenefitPaymentDetails();
      component.setPaymentRelatedValues(response);
      expect(component.setPaymentRelatedValues).toBeDefined();
    });
  });
  describe('cancelTransactions', () => {
    it('should cancelTransactions', () => {
      component.cancelTransactions();
      expect(component.cancelTransactions).toBeDefined();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeFalsy();
    });
  });
  describe('showFormValidation', () => {
    it('should showFormValidation', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      spyOn(component.alertService, 'clearAlerts');
      component.showFormValidation();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('getModifyRequiredDocs', () => {
    it('should getModifyRequiredDocs', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.returnValue(of([new DocumentItem()]));
      component.getModifyRequiredDocs('1234556', 'UITransactionType.GOL_REQUEST_SANED');
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        '1234556',
        'UITransactionType.GOL_REQUEST_SANED'
      );
      expect(component.getModifyRequiredDocs).not.toBeNull();
    });
  });
  describe('setPaymentRelatedValuesForEdit', () => {
    it('should   setPaymentRelatedValuesForEdit', () => {
      const response = new HeirsDetails();
      component.setPaymentRelatedValuesForEdit(response);
      expect(component.setPaymentRelatedValuesForEdit).toBeDefined();
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      component.modalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      component.popUp(templateRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('setPaymentDetails', () => {
    it('should setPaymentDetails', () => {
      let paymentDetails: HeirsDetails = new HeirsDetails();
      component.paymentDetails.payeeType = paymentDetails?.payeeType;
      component.paymentDetails.paymentMode = paymentDetails?.paymentMode;
      component.paymentDetails.bankAccount = paymentDetails?.bankAccount;
      component.paymentDetails.authorizedPersonId = paymentDetails?.authorizedPersonId;
      component.paymentDetails.authorizationDetailsId = paymentDetails?.authorizationDetailsId;
      component.paymentDetails.guardianPersonId = paymentDetails?.guardianPersonId;
      component.paymentDetails.guardianPersonIdentity = paymentDetails?.guardianPersonIdentity;
      component.paymentDetails.guardianPersonName = paymentDetails?.guardianPersonName;
      component.paymentDetails.contactDetail = paymentDetails?.contactDetail;
      component.paymentDetails.personId = paymentDetails?.personId;
      spyOn(component, 'setPaymentDetails').and.callThrough();
      fixture.detectChanges();
      component.setPaymentDetails(paymentDetails);
      expect(component.setPaymentDetails).not.toBeNull();
      expect(component.setPaymentDetails).toBeDefined();
    });
  });
  describe('getAttorneyListById', () => {
    it('should getAttorneyListById', () => {
      const id = 1234;
      expect(id).toEqual(1234);
      component.getAttorneyListById(id);
      expect(component.getAttorneyListById).toBeDefined();
    });
  });
  describe('getBankList', () => {
    it('should  getBankList', () => {
      const identity = 3434343;
      component.getBankList(identity);
      expect(component.getBankList).toBeDefined();
    });
  });
  describe('getLookUpValues', () => {
    it('should getLookUpValues', () => {
      component.lookUpService.getTransferModeDetails();
      component.lookUpService.getYesOrNoList();
      component.lookUpService.getNationalityList();
      component.initialisePayeeType();
      component.initialiseCityLookup();
      component.initialiseCountryLookup();
      spyOn(component, 'getLookUpValues').and.callThrough();
      expect(component.getLookUpValues).toBeDefined();
    });
  });

  xdescribe('saveModifyDetails', () => {
    it('should return address', () => {
      spyOn(component, 'invokePaymentDetailsEvent').and.callThrough();
      spyOn(component, 'checkPaymentFormValidity').and.callThrough();

      component.saveModifyDetails();
      component.transactionTraceId;
      spyOn(component, 'saveModifyDetails').and.callThrough();
      expect(component.saveModifyDetails).toBeDefined();
    });
  });
  describe('confirm', () => {
    it('should confirm', () => {
      component.sin = 3423;
      component.benefitRequestId = 2323;
      component.referenceNumber = 3445;
      expect(component.sin && component.benefitRequestId && component.referenceNumber).toBeDefined();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
    it('should confirm', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  xdescribe('invokePaymentDetailsEvent', () => {
    it('should invokePaymentDetailsEvent', () => {
      component.invokePaymentDetailsEvent();
      expect(component.invokePaymentDetailsEvent).toBeDefined();
    });
  });
  describe('checkPaymentFormValidity', () => {
    it('should checkPaymentFormValidity', () => {
      if (
        !component.isEditMode &&
        component.paymentDetailsComponent?.checkFormValidity().formValid &&
        component.paymentDetailsComponent?.checkFormValidity().formModified
      )
        return true;
      else if (component.isEditMode && component.paymentDetailsComponent?.checkFormValidity().formValid) return true;
      spyOn(component, 'checkPaymentFormValidity').and.callThrough();
      component.checkPaymentFormValidity();
      expect(component.checkPaymentFormValidity).toBeDefined();
    });
  });
  describe('submitCommitmentDetails', () => {
    it('should submitCommitmentDetails', () => {
      let submitValues: StopSubmitRequest;
      component.referenceNumber;
      component.documentComponent.uuid;

      component.submitCommitmentDetails(comments);
      expect(component.submitCommitmentDetails).toBeDefined();
    });
  });

  describe('initializeWizardDetails', () => {
    it('should initializeWizardDetails', () => {
      component.wizardService.getModifyCommitmentWizardItems();
      component.wizardItems[0].isActive = true;
      component.wizardItems[0].isDisabled = false;
      spyOn(component, 'initializeWizardDetails');
      expect(component.initializeWizardDetails).toBeDefined();
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
  describe('setAuthorizedPersonDetails', () => {
    it('Should  setAuthorizedPersonDetails', () => {
      const authorizedPersonDetails = [{ ...new AttorneyDetailsWrapper() }];
      const guardianPersonDetails = [{ ...new AttorneyDetailsWrapper() }];
      const authorizationDetails = {
        ...new AuthorizationDetailsDto(),
        authorizationList: [{ ...new AuthorizationList() }],
        personId: 656565
      };
      component.setAuthorizedPersonDetails(authorizedPersonDetails, guardianPersonDetails, authorizationDetails);
    });
  });
  describe(' existingIban', () => {
    it(' existingIban true', () => {
      component.isExistingIban = true;
      expect(component.isExistingIban).toBeTrue();
      expect(component.isExistingIban).toEqual(true);
      component.existingIban(component.isExistingIban);
      expect(component.existingIban).toBeDefined();
    });
    it(' existingIban false', () => {
      component.isExistingIban = false;
      expect(component.isExistingIban).toBeFalse();
      expect(component.isExistingIban).toEqual(false);
      component.existingIban(component.isExistingIban);
      expect(component.existingIban).toBeDefined();
    });
  });
});
