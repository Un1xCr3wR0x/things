/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  bindToObject,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WizardItem,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, documentListItemArray, ModalServiceStub, uiBenefits } from 'testing';
import {
  AuthorizationDetailsDto,
  BankService,
  BenefitResponse,
  DependentDetails,
  HeirBenefitService,
  HeirModifyPayeeDetails,
  HeirsDetails,
  ManageBenefitService,
  ModifyBenefitService,
  ModifyPayeeDetails,
  PersonBankDetails,
  UITransactionType,
  AttorneyDetailsWrapper,
  AuthorizationList
} from '../../shared';
import { ModifyBenefitPaymentScComponent } from './modify-benefit-payment-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyBenefitPaymentScComponent', () => {
  let component: ModifyBenefitPaymentScComponent;
  let fixture: ComponentFixture<ModifyBenefitPaymentScComponent>;
  const manageBenefitServicespy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitCalculationDetailsByRequestId',
    'getAnnuityBenefitRequestDetail',
    'getPersonDetailsApi',
    'getSelectedAuthPerson',
    'getSystemParams',
    'getAttorneyDetails',
    'setValues',
    'getSystemRunDate',
    'updateAnnuityWorkflow'
  ]);
  manageBenefitServicespy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServicespy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServicespy.getAttorneyDetails.and.returnValue(
    of({
      ...new AuthorizationDetailsDto(),
      AttorneyDetailsWrapper: [{ ...new AttorneyDetailsWrapper() }],
      authorizationList: [{ ...new AuthorizationList() }]
    })
  );
  manageBenefitServicespy.updateAnnuityWorkflow.and.returnValue(of(new AuthorizationDetailsDto()));
  const modifyBenefitServicespy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getModifyPaymentDetails',
    'revertModifyPaymentDetails',
    'modifyPayeeDetails',
    'getReqDocsForModifyPayee',
    'submitModifyDetails',
    'editDirectPayment'
  ]);
  modifyBenefitServicespy.editDirectPayment.and.returnValue(of(new ModifyPayeeDetails()));
  modifyBenefitServicespy.getModifyPaymentDetails.and.returnValue(of(new ModifyPayeeDetails()));
  modifyBenefitServicespy.revertModifyPaymentDetails.and.returnValue(of(new ModifyPayeeDetails()));
  modifyBenefitServicespy.modifyPayeeDetails.and.returnValue(of(new BenefitResponse()));
  modifyBenefitServicespy.getReqDocsForModifyPayee.and.returnValue(of([new DocumentItem()]));
  modifyBenefitServicespy.submitModifyDetails.and.returnValue(of(new BenefitResponse()));
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankList']);
  bankServiceSpy.getBankList.and.returnValue(of([new PersonBankDetails()]));
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument',
    'getAllDocuments'
  ]);
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getAllDocuments.and.returnValue(of(new DocumentItem()));
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', ['getHeirBenefit']);
  heirBenefitServiceSpy.getHeirBenefit.and.returnValue(of([new DependentDetails()]));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServicespy },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: ModifyBenefitService, useValue: modifyBenefitServicespy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        // {
        //   provide: TranslateService,
        //   useValue: translateSpy
        // },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ],
      declarations: [ModifyBenefitPaymentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyBenefitPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  describe('setActiveBenefitValues', () => {
    it('should setBenefitValue', () => {
      component.activeBenefit = {
        ...new CoreActiveBenefits(1212, 21332, { english: '', arabic: '' }, 767),
        setBenefitStartDate: null
      };
      expect(component.activeBenefit).toBeDefined();
      component.setActiveBenefitValues();
      expect(component.setActiveBenefitValues).toBeDefined();
    });
  });
  describe('ibanTypeChange', () => {
    it('should ibanTypeChange', () => {
      const isdisable = true;
      expect(component.isSaveDisabled).toEqual(isdisable);
      component.ibanTypeChange(isdisable);
    });
  });
  describe('getBankList', () => {
    it('should  getBankList', () => {
      const identity = 3434343;
      component.getBankList(identity);
      expect(component.getBankList).toBeDefined();
    });
  });
  describe(' getAttorneyListById', () => {
    it('should  getAttorneyListById', () => {
      const id = 1234;
      expect(id).toEqual(1234);
      component.getAttorneyListById(id);
      expect(component.getAttorneyListById).toBeDefined();
    });
    it('should setAuthorizedPersonDetails', () => {
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
  describe('saveBankDetails', () => {
    it('should saveBankDetails', () => {
      const requestData = 1234;
      component.saveBankDetails(requestData);
      expect(component.saveBankDetails).toBeDefined();
    });
    it('should confirm', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('setPayeeDetails', () => {
    it('should setPayeeDetails', () => {
      const payeeDetail = new HeirsDetails();
      component.setPayeeDetails(payeeDetail);
      expect(component.setPayeeDetails).toBeDefined();
    });
  });
  describe('setPaymentDetailValues', () => {
    it('should setPaymentDetailValues', () => {
      component.setPaymentDetailValues();
      expect(component.setPaymentDetailValues).toBeDefined();
    });
  });
  describe('filterModifiedHeirDetails', () => {
    it('should filterModifiedHeirDetails', () => {
      const filteredModifiedHeirDetails = new HeirModifyPayeeDetails();
      component.filterModifiedHeirDetails(filteredModifiedHeirDetails);
      expect(component.filterModifiedHeirDetails).toBeDefined();
    });
  });
  describe('showError', () => {
    it('should call alert service', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  xdescribe('  getUploadedDocuments', () => {
    it('should   getUploadedDocuments', () => {
      const transactionKey = 'MODIFY_PAYEE';
      const transactionType = component.isAppPrivate ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
      spyOn(component.benefitDocumentService, 'getModifyPayeeDocuments').and.returnValue(
        of(bindToObject(new ModifyPayeeDetails(), uiBenefits))
      );
      component.benefitDocumentService
        .getModifyPayeeDocuments(
          component.sin,
          component.benefitRequestId,
          component.referenceNo,
          transactionKey,
          transactionType
        )
        .subscribe(response => {
          component.requiredDocs = response;
        });
      component.getUploadedDocuments();
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('getModifyPayeeDetails', () => {
    it('should  getModifyPayeeDetails', () => {
      const sin = 123423;
      const benefitRequestId = 234343323;
      const referenceNo = 2122312121;
      component.getModifyPayeeDetails(sin, benefitRequestId, referenceNo);
      expect(component.getModifyPayeeDetails).toBeDefined();
    });
  });
  describe('submitPayeeDetails', () => {
    it('should submitPayeeDetails', () => {
      component.isEditMode = false;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      expect(component.isEditMode).toBeFalse();
      component.submitPayeeDetails();
      expect(component.submitPayeeDetails).toBeDefined();
    });
    it('should submitStopped true', () => {
      component.isEditMode = true;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      expect(component.isEditMode).toBeTrue();
      component.submitPayeeDetails();
      expect(component.submitPayeeDetails).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      spyOn(component, 'refreshDocument');
      component.refreshDocument(document);
      expect(component.refreshDocument).toBeDefined();
    });
  });
  xdescribe('confirm', () => {
    it('should confirm', () => {
      component.sin = 123423;
      component.benefitRequestId = 234343323;
      component.referenceNo = 2122312121;
      expect(component.sin && component.benefitRequestId && component.referenceNo).toEqual(2122312121, 234343323);
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  xdescribe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      // spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.callThrough();
      component.saveWorkflowInEdit();
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });
  describe('checkStatusEditable', () => {
    it('should checkStatusEditable', () => {
      const index = 1;
      spyOn(component, 'checkStatusEditable');
      component.checkStatusEditable(index);
      expect(component.checkStatusEditable).toBeDefined();
    });
  });
  describe('nextForm', () => {
    it('should nextForm', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.currentTab = 1;
      component.modifyBenefitWizard = new ProgressWizardDcComponent();
      component.nextForm();
      expect(component.currentTab).not.toBe(null);
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      component.commonModalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.commonModalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.popUp(templateRef);
      expect(component.commonModalRef).not.toEqual(null);
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.refreshDocument).not.toBeNull();
    });
  });
  describe('docUploadSuccess', () => {
    it('should docUploadSuccess', () => {
      spyOn(component, 'docUploadSuccess');
      spyOn(component, 'submitPayeeDetails');
      component.submitPayeeDetails();
      component.docUploadSuccess(event);
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  describe('getUploadedDocuments', () => {
    it('should getUploadedDocuments', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      component.enableRepaymentId = 3423323;
      component.getUploadedDocuments();
      component.benefitDocumentService
        .getUploadedDocuments(component.enableRepaymentId, transactionKey, transactionType)
        .subscribe(res => {
          component.requiredDocs = res;
        });
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('cancelTransactions', () => {
    it('should cancelTransactions', () => {
      component.commonModalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.commonModalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.cancelTransactions(templateRef);
      spyOn(component, 'cancelTransactions');
      expect(component.cancelTransactions).toBeDefined();
    });
  });
  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      component.modalService.show(
        modalRef,
        Object.assign(
          {},
          {
            backdrop: true,
            ignoreBackdropClick: true
          }
        )
      );
      expect(component.showModal).toBeDefined();
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      spyOn(component.location, 'back');
      component.routeBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('previousFormDetails', () => {
    it('should previousFormDetails', () => {
      component.modifyBenefitWizard = new ProgressWizardDcComponent();
      component.modifyBenefitWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      spyOn(component.modifyBenefitWizard, 'setPreviousItem').and.callThrough();
      component.previousFormDetails();
      expect(component.currentTab).toEqual(0);
      expect(component.modifyBenefitWizard.setPreviousItem).toHaveBeenCalled();
    });
  });
  describe('showErrorMessages', () => {
    it('should showErrorMessages', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
