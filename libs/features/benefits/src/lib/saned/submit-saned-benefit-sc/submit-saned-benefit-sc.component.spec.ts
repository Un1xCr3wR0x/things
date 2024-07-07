/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  WizardItem,
  CoreContributorService,
  AlertService,
  DocumentService,
  BilingualText,
  Alert,
  GosiCalendar
} from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ModalServiceStub,
  SanedBenefitMockService,
  ManageBenefitMockService,
  personResponse,
  bankDetailsReponse,
  bankDetailsByIBAN,
  TranslateLoaderStub,
  BilingualTextPipeMock,
  ActivatedRouteStub,
  ManagePersonServiceStub,
  TabsMockComponent,
  AlertServiceStub,
  DocumentServiceStub
} from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { ManageBenefitService } from '../../shared/services/manage-benefit.service';
import { SanedBenefitService } from '../../shared/services/saned-benefit.service';
import { SubmitSanedBenefitScComponent } from './submit-saned-benefit-sc.component';
import { PersonBankDetails } from '../../shared/models/person-bank-details';
import { UITransactionType } from '../../shared/enum/ui-tranasction-type';
import { RouterTestingModule } from '@angular/router/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import {
  UiBenefitsService,
  BankService,
  PersonConstants,
  HeirBenefitService,
  BenefitDocumentService
} from '../../shared';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('SubmitSanedBenefitScComponent', () => {
  let component: SubmitSanedBenefitScComponent;
  let fixture: ComponentFixture<SubmitSanedBenefitScComponent>;
  const sin = 385093829;
  const id = 1003227956;
  const referenceNo = 357900;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/home/benefits/saned/apply' };
  /*const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemRunDate',
    'updateAnnuityWorkflow'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));*/
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', [
    'getBank',
    'initialisePayeeType',
    'initialisePaymentMode',
    'getCityList',
    'getCountryList'
  ]);
  lookupServiceSpy.getBank.and.returnValue(of(new LovList([bankDetailsByIBAN])));
  lookupServiceSpy.initialisePayeeType.and.returnValue(of(new LovList([])));
  lookupServiceSpy.initialisePaymentMode.and.returnValue(of(new LovList([])));
  lookupServiceSpy.getCityList.and.returnValue(of(new LovList([])));
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankDetails']);

  bankServiceSpy.getBankDetails.and.returnValue(
    of({
      ...new PersonBankDetails(),
      ibanBankAccountNo: '123456789',
      isNonSaudiIBAN: false,
      approvalStatus: PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS
    })
  );
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getBenefitReasonList',
    'setHeirUpdateWarningMsg'
  ]);
  heirBenefitServiceSpy.getBenefitReasonList.and.returnValue(of(new LovList([])));
  const benefitDocumentServiceSpy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'addDocumentIcon'
  ]);
  benefitDocumentServiceSpy.addDocumentIcon.and.returnValue([new WizardItem('', '', true)]);
  const contributorServiceSpy = jasmine.createSpyObj<CoreContributorService>('CoreContributorService', ['selectedSIN']);
  contributorServiceSpy.selectedSIN = 12345678;
  const payload = {
    id: id,
    socialInsuranceNo: sin,
    referenceNo: referenceNo
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        RouterTestingModule
      ],
      declarations: [SubmitSanedBenefitScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: {
            ...new RouterData(),
            payload: JSON.stringify(payload),
            assignedRole: 'Validator1',
            taskId: '',
            assigneeId: ''
          }
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CoreContributorService, useValue: contributorServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useValue: lookupServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: Router,
          useValue: routerSpy
        },
        { provide: BenefitDocumentService, useValue: benefitDocumentServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: SanedBenefitService, useClass: SanedBenefitMockService },
        //{ provide: ManageBenefitService, useClass: ManageBenefitMockService },
        DatePipe,
        FormBuilder,
        { provide: TabsetComponent, useClass: TabsMockComponent },
        { provide: UiBenefitsService, useClass: ManageBenefitMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSanedBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setValuesForValidator', () => {
    component.setValuesForValidator();
    expect(component.setValuesForValidator).toBeDefined();
  });
  describe('setWizardValues', () => {
    it('should setWizardValues', () => {
      component.isAppPrivate = true;
      component.setWizardValues();
      expect(component.setWizardValues).toBeDefined();
    });
  });
  // describe('selectedWizard', () => {
  //   it('should select wizard', () => {
  //     const index = 1;
  //     spyOn(component, 'selectWizard');
  //     component.selectedWizard(index);
  //     expect(component.selectedWizard).toBeDefined();
  //   });
  // });
  describe('setWizardValues', () => {
    it('should setWizardValues', () => {
      component.isAppPrivate = true;
      component.setWizardValues();
      expect(component.setWizardValues).toBeDefined();
    });
  });
  describe('getBankDetails', () => {
    it('should get  the bank details', () => {
      component.benefitType = '';
      component.referenceNo = 1234;
      component.getBankDetails();
      expect(component.bankDetails).not.toEqual(null);
    });
  });
  it('Should getBank', () => {
    component.getBank(55);
    expect(component.bankNameList).not.toEqual(null);
  });
  // describe('bindToBankForm', () => {
  //   it('should bindToBankForm', () => {
  //     component.bindToBankForm(new FormGroup({}));
  //     expect(component.bankParentForm.getRawValue()).toBeDefined();
  //   });
  // });
  describe('Show Bank Details Modal', () => {
    it('should trigger popup', () => {
      component.commonModalRef = new BsModalRef();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showBankDetailsModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
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
  describe('showMandatoryDocErrorMessage', () => {
    it('should showMandatoryDocErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showMandatoryDocErrorMessage({ error: 'error' });
      component.showMandatoryDocErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('hideModal', () => {
    it('should hideModal', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('requestDateChanged', () => {
    it('should requestDateChanged', () => {
      const date = new GosiCalendar();
      component.requestDateChanged(date);
      expect(component.requestDateChanged).toBeDefined();
    });
  });
  describe('previousForm', () => {
    it('should go to previous form', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      const index = 1;
      spyOn(component, 'selectWizard');
      component.selectedWizard(index);
      expect(component.selectedWizard).toBeDefined();
    });
  });

  describe('hideBankModal', () => {
    it('should hideBankModal', () => {
      component.commonModalRef = new BsModalRef();
      component.hideBankModal();
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      component.commonModalRef = new BsModalRef();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
  });

  describe('setError', () => {
    it('should setError', () => {
      const messageKey = 'error';
      component.setError(messageKey);
      expect(component.showOtpError).not.toBeNull();
    });
  });
  // describe('modalScroll', () => {
  //   it('should modalScroll', () => {
  //     component.modalScroll();
  //     expect(component.modalScroll).toBeDefined();
  //   });
  // });
  /*describe('test suite for apply', () => {
    it('apply', () => {
      const sin = 385093829;
      const benefitRequestId = 1003227956;
      const referenceNo = 357900;
      const selectedDate = '2021-11-11';
      component.benefitsForm = new FormGroup({
        bankAccount: new FormGroup({
          ibanBankAccountNo: new FormControl({ value: 'SA123' }),
          bankCode: new FormControl({ value: 55 }),
          bankName: new FormGroup({ english: new FormControl({ value: '' }), arabic: new FormControl({ value: '' }) })
        }),
        requestDate: new FormControl({ value: customDate })
      });
      component.apply();
      expect(component.benefitResponse).not.toEqual(null);
    });
  });*/
  describe('test suite for saveWorkflowInEdit', () => {
    it('saveWorkflowInEdit', () => {
      const sin = 385093829;
      const benefitRequestId = 1003227956;
      const comments = 'comment';
      component.referenceNo = 1234;
      component.saveWorkflowInEdit({ comments: comments });
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.commonModalRef = new BsModalRef();
      const templateRef = { elementRef: null, createEmbeddedView: null };
      component.confirmTemplate = templateRef;
      component.cancelTransaction();
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('test suite for confirm', () => {
    it('confirm', () => {
      component.commonModalRef = new BsModalRef();
      component.confirm();
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.commonModalRef).not.toBeNull();
    });
  });
  describe('validateDeclarationCheck', () => {
    it('should validateDeclarationCheck', () => {
      component.benefitsForm = new FormGroup({ checkBoxFlag: new FormControl({ value: true }) });
      spyOn(component, 'apply');
      component.validateDeclarationCheck();
      expect(component.apply).toHaveBeenCalled();
    });
  });

  describe('test suite for getDocuments', () => {
    it('should get documents', () => {
      component.socialInsuranceNo = 385093829;
      component.benefitRequestId = 1003227956;
      component.transactionType = UITransactionType.APPROVE_SANED;
      component.fetchDocuments();
      expect(component.documentList).not.toEqual(null);
    });
  });

  describe('getBenefitRequestDetails', () => {
    it('should  getBenefitRequestDetails', () => {
      component.socialInsuranceNo = 385093829;
      component.benefitRequestId = 1003227956;
      component.referenceNo = referenceNo;
      component.getBenefitRequestDetails();
      expect(component.getBenefitRequestDetails).toBeDefined();
    });
  });
  // describe('showMandatoryDocErrorMessage', () => {
  //   it('showMandatoryDocErrorMessage', () => {
  //     component.showMandatoryDocErrorMessage(false);
  //  });
  // });
  describe('showFormSuccessMessage', () => {
    it('should  showFormSuccessMessage', () => {
      component.socialInsuranceNo = 385093829;
      component.benefitRequestId = 1003227956;
      component.referenceNo = 357900;
      component.showFormSuccessMessage({ comments: '' });
      expect(component.benefitResponse).not.toEqual(null);
    });
  });

  describe('isFutureDate', () => {
    it('should isFutureDate', () => {
      component.isFutureDate('11/11/2021');
      expect(component.isFutureDate).toBeDefined();
    });
  });
});
// export function bindToModel(model, cast) {
//   Object.keys(model).forEach(key => {
//     model[key] = cast[key];
//   });
//   return cast;
// }
const customDate = {
  gregorian: new Date('2021-04-10T00:00:00.000Z'),
  hijiri: '1442-08-28',
  entryFormat: 'GREGORIAN'
};
