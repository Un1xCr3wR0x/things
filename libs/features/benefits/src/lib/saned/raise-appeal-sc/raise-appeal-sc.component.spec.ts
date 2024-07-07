/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  CoreContributorService,
  DocumentService,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService,
  BilingualText,
  Alert,
  DocumentItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import {
  ActiveSanedAppeal,
  AppealDetails,
  BankService,
  BenefitResponse,
  Benefits,
  ManageBenefitService,
  PersonBankDetails,
  PersonConstants,
  SanedBenefitService,
  UiBenefitsService,
  UITransactionType,
  WizardService,
  UnemploymentResponseDto
} from '../../shared';
import { RaiseAppealScComponent } from './raise-appeal-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';

describe('RaiseAppealScComponent', () => {
  let component: RaiseAppealScComponent;
  let fixture: ComponentFixture<RaiseAppealScComponent>;
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankDetails']);
  bankServiceSpy.getBankDetails.and.returnValue(
    of({ ...new PersonBankDetails(), ibanBankAccountNo: 'SA595504ASG66086110DS591'.slice(4, 6) })
  );
  const contributorServiceSpy = jasmine.createSpyObj<CoreContributorService>('CoreContributorService', ['selectedSIN']);
  contributorServiceSpy.selectedSIN = 12345678;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemRunDate',
    'getSystemParams'
  ]);
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getAppealWizardItems',
    'getBenefitRequestDetails',
    'updateBenefit',
    'applySanedBenefit',
    'patchBenefit'
  ]);
  sanedBenefitServiceSpy.getAppealWizardItems.and.returnValue([new WizardItem('', '', true)]);
  sanedBenefitServiceSpy.getBenefitRequestDetails.and.returnValue(of(new UnemploymentResponseDto()));
  sanedBenefitServiceSpy.updateBenefit.and.returnValue(of(new BenefitResponse()));
  sanedBenefitServiceSpy.applySanedBenefit.and.returnValue(
    of({ ...new BenefitResponse(), benefitRequestId: 1234, referenceNo: 1234 })
  );
  sanedBenefitServiceSpy.patchBenefit.and.returnValue(of(new BenefitResponse()));
  const uiBenefitServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', [
    'getActiveSanedAppeal',
    'getUIBenefits'
  ]);
  uiBenefitServiceSpy.getActiveSanedAppeal.and.returnValue(
    new ActiveSanedAppeal(new AppealDetails(), new PersonBankDetails(), 1234, new GosiCalendar(), 1234)
  );
  uiBenefitServiceSpy.getUIBenefits.and.returnValue(of(new Benefits()));
  const wizardServiceSpy = jasmine.createSpyObj<WizardService>('WizardService', [
    'isWizardItemAvailable',
    'restrictProgress'
  ]);
  wizardServiceSpy.isWizardItemAvailable.and.returnValue(1);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, BrowserDynamicTestingModule, RouterTestingModule],
      declarations: [RaiseAppealScComponent],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: { ...new RouterData(), assignedRole: 'Validator1' }
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BankService, useValue: bankServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CoreContributorService, useValue: contributorServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe,
        FormBuilder,
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: WizardService, useValue: wizardServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseAppealScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getForm', () => {
    component.getForm();
    expect(component.getForm).toBeDefined();
  });
  it('should getEligiblePeriod', () => {
    component.getEligiblePeriod({
      ...new Benefits(),
      eligiblePeriods: [
        {
          endDate: {
            gregorian: new Date('2021-04-10T00:00:00.000Z'),
            hijiri: '1442-08-28',
            entryFormat: 'GREGORIAN'
          },
          startDate: {
            gregorian: new Date('2021-12-01T00:00:00.000Z'),
            hijiri: '1443-04-26',
            entryFormat: 'GREGORIAN'
          }
        }
      ]
    });
    expect(component.getEligiblePeriod).toBeDefined();
  });
  describe('confirm', () => {
    it('confirm', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'confirm');
      component.confirm();
      expect(component.alertService.clearAlerts).toBeDefined();
      expect(component.confirm).toBeDefined();
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
  describe('previousForm', () => {
    it('should go to previous form', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });
  it('should cancelTransaction', () => {
    component.commonModalRef = new BsModalRef();
    component.confirmTemplate = { elementRef: null, createEmbeddedView: null };
    component.cancelTransaction();
    expect(component.confirmTemplate).not.toBeNull();
  });
  it('should confirm', () => {
    spyOn(component.alertService, 'clearAlerts');
    component.commonModalRef = new BsModalRef();
    spyOn(component.commonModalRef, 'hide');
    component.confirm();
    expect(component.confirm).toBeDefined();
    component.routeBack();
    expect(component.routeBack).toBeDefined();
  });
  it('should decline', () => {
    component.commonModalRef = new BsModalRef();
    component.decline();
    expect(component.decline).toBeDefined();
  });
  it('should saveAndNext', () => {
    const requestDate = {
      gregorian: new Date('2021-12-01T00:00:00.000Z'),
      hijiri: '1443-04-26',
      entryFormat: 'GREGORIAN'
    };
    component.appealForm = new FormGroup({
      bankAccount: new FormGroup({
        ibanBankAccountNo: new FormControl({ value: '123456' }),
        bankCode: new FormControl({ value: 123 }),
        bankName: new FormGroup({
          english: new FormControl({ value: 'Riyadh Bank' }),
          arabic: new FormControl({ value: 'Riyadh Bank' })
        })
      }),
      appealDetails: new FormGroup({
        periodSelected: new FormControl({ value: 0 }),
        reasonForAppeal: new FormGroup({
          english: new FormControl({ value: '' }),
          arabic: new FormControl({ value: '' })
        }),
        otherReason: new FormControl({ value: '' })
      }),
      requestDate: new FormControl({ value: requestDate })
    });
    component.activeBenefit = new ActiveSanedAppeal(
      new AppealDetails(),
      new PersonBankDetails(),
      1234,
      requestDate,
      1234
    );
    component.wizardItems = [new WizardItem('', '', true)];
    component.transactionType = UITransactionType.APPROVE_SANED;
    component.benefitRequestId = 1234;
    component.referenceNo = 1234;
    component.socialInsuranceNo = 1234;
    component.eligiblePeriods = [
      {
        endDate: {
          gregorian: new Date('2021-04-10T00:00:00.000Z'),
          hijiri: '1442-08-28',
          entryFormat: 'GREGORIAN'
        },
        startDate: {
          gregorian: new Date('2021-12-01T00:00:00.000Z'),
          hijiri: '1443-04-26',
          entryFormat: 'GREGORIAN'
        }
      }
    ];
    component.saveAndNext();
    expect(component.saveAndNext).toBeDefined();
  });
  it('should docUploadSuccess', () => {
    component.socialInsuranceNo = 1234;
    component.benefitRequestId = 1234;
    component.referenceNo = 1234;
    component.docUploadSuccess({ comments: '' });
    expect(component.docUploadSuccess).toBeDefined();
  });
  it('should getBankDetails', () => {
    component.getBankDetails('1234');
    expect(component.getBankDetails).toBeDefined();
  });
  // it('should setBankDetails', () => {
  //   const bankRes = {... [new PersonBankDetails()], ibanBankAccountNo:"SA595504ASG66086110DS591".slice(4,6),fromJsonToObject: json => json};
  //   component.setBankDetails(bankRes);
  //   expect(component.setBankDetails).toBeDefined();
  // });
  //BenefitBaseSCcomponent
  it('should showFormValidation', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    spyOn(component.alertService, 'clearAlerts');
    component.showFormValidation();
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });
  it('should refreshDocument', () => {
    const document = new DocumentItem();
    component.refreshDocument(document);
    expect(component.refreshDocument).toBeDefined();
  });
  it('should changeCheck', () => {
    component.changeCheck({ target: { checked: true } });
    expect(component.declarationDone).toEqual(true);
  });
  it('should  getSystemParam', () => {
    component.getSystemParam();
    expect(component.getSystemParam).toBeDefined();
  });
  it('should  getSystemParam', () => {
    component.getSystemRunDate();
    expect(component.getSystemRunDate).toBeDefined();
  });
  it('should  viewContributorDetails', () => {
    component.viewContributorDetails();
    expect(component.viewContributorDetails).toBeDefined();
  });
  it('should saveWorkflowInEdit', () => {
    spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.callThrough();
    const comments = 'comment';
    component.saveWorkflowInEdit({ comments: comments });
    expect(component.saveWorkflowInEdit).toBeDefined();
  });
  it('should navigateToAdjustmentDetailsHeir', () => {
    const heir = {
      benefitAmount: 1212,
      identifier: 2323,
      name: { english: '', arabic: '' },
      payeeType: { english: '', arabic: '' },
      paymentMode: { english: '', arabic: '' },
      relationship: { english: '', arabic: '' },
      lastPaidDate: null,
      status: { english: '', arabic: '' },
      amountBeforeUpdate: 12,
      marriageGrant: 232,
      personId: 3232,
      heirIdentifier: { idType: 'IQAMA', id: 210145454 },
      //for UI
      hasCreditAdjustment: true
    };
    component.navigateToAdjustmentDetailsHeir(heir);
    //component.navigateToScan();
    expect(component.navigateToAdjustmentDetailsHeir).toBeDefined();
  });
});
