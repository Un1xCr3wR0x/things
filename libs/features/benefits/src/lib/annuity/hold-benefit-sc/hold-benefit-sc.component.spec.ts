/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  Lov,
  RouterData,
  RouterDataToken,
  WizardItem,
  LovList,
  CoreActiveBenefits,
  HoldPensionDetails
} from '@gosi-ui/core';
import { DateTypePipe, GosiDatePipe, ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, GosiDatePipeMock, ModalServiceStub, Form } from 'testing';
import {
  AnnuityResponseDto,
  HoldBenefitDetails,
  ManageBenefitService,
  BenefitResponse,
  SanedBenefitService,
  ModifyBenefitService,
  Contributor,
  HoldBenefitHeading,
  BenefitType,
  StopSubmitRequest
} from '../../shared';
import { DateTypePipeMock } from '../../shared/Mock/date-type-pipe-mock';
import { HoldBenefitScComponent } from './hold-benefit-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
/*const holdServicespy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', ['getSavedActiveBenefit',
'getHoldBenefitDetails',
'submitHoldDetails',
'submitStoppedDetails',
'holdBenefitDetails',
'revertHoldBenefit',
'getReqDocsForHoldBenefit']);*/
//holdServicespy.getHoldBenefitDetails.and.returnValue(of(new HoldBenefitDetails()));
const activeBenefit = {
  sin: 2325444,
  benefitRequestId: 1023544566,
  referenceNo: 10233666566,
  benefitType: { english: 'Women Lumpsum Benefit', arabic: '' }
};
const payload = {
  registrationNo: 1234,
  socialInsuranceNo: 1234,
  identifier: 1034681524,
  id: 1234,
  repayId: 1234,
  transactionNumber: 1000045428,
  taskId: 123456,
  resource: '',
  referenceNo: 1234,
  channel: 'field-office',
  user: 'avijit',
  assignedRole: 'Validator 1',
  beneficiaryId: 1234
};

describe('HoldBenefitScComponent', () => {
  let component: HoldBenefitScComponent;
  let fixture: ComponentFixture<HoldBenefitScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'updateAnnuityWorkflow',
    'getAnnuityBenefitRequestDetail',
    'getHoldReasonLovList',
    'navigateToInbox'
  ]);
  manageBenefitServiceSpy.updateAnnuityWorkflow.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getHoldReasonLovList.and.returnValue(of([new Lov()]));
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getSanedHoldReasons'
  ]);
  sanedBenefitServiceSpy.getSanedHoldReasons.and.returnValue(of([new BilingualText()]));
  const modifyBenefitServicespy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getHoldBenefitDetails',
    'submitHoldDetails',
    'submitStoppedDetails',
    'holdBenefitDetails',
    'revertHoldBenefit',
    'getReqDocsForHoldBenefit',
    'getReqDocsForHoldBenefit'
  ]);
  const submitValues: StopSubmitRequest = {
    comments: '',
    referenceNo: 232323,
    uuid: ''
  };
  modifyBenefitServicespy.getHoldBenefitDetails.and.returnValue(
    of({
      ...new HoldBenefitDetails(),
      pension: { ...new HoldPensionDetails(), annuityBenefitType: { english: '', arabic: '' } },
      contributor: { ...new Contributor(), identity: [] }
    })
  );
  modifyBenefitServicespy.submitHoldDetails.and.returnValue(of({ ...new BenefitResponse(), submitValues }));
  modifyBenefitServicespy.submitStoppedDetails.and.returnValue(
    of({
      ...new BenefitResponse(),
      submitValues: { ...new StopSubmitRequest(), comments: 'abc', referenceNo: 56536253 }
    })
  );
  modifyBenefitServicespy.holdBenefitDetails.and.returnValue(of(new BenefitResponse()));
  modifyBenefitServicespy.revertHoldBenefit.and.returnValue(of(new BenefitResponse()));
  modifyBenefitServicespy.getReqDocsForHoldBenefit.and.returnValue(of([new DocumentItem()]));
  modifyBenefitServicespy.getReqDocsForHoldBenefit.and.returnValue(of([new DocumentItem()]));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [HoldBenefitScComponent, GosiDatePipeMock, DateTypePipeMock],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: ModifyBenefitService, useValue: modifyBenefitServicespy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useValue: routerSpy },
        {
          provide: GosiDatePipe,
          useClass: GosiDatePipeMock
        },
        {
          provide: DateTypePipe,
          useClass: DateTypePipeMock
        },

        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },

        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        FormBuilder,
        DatePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.isAppPrivate = component.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
      component.ngOnInit();
      expect(component.initializeWizardDetails).toBeDefined();
      spyOn(component, 'getModificationReason');
      expect(component.getModificationReason).toBeDefined();
      expect(component.ngOnInit).toBeDefined();
      if (component.routerData.payload) {
        const payload = JSON.parse(component.routerData.payload);
        component.initialiseViewForEdit(payload);
        component.getHoldDetailsForEdit();
        expect(component.getHoldDetailsForEdit).toHaveBeenCalled();
      }
    });
  });
  xdescribe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      if (component.route.routeConfig) {
        component.route.routeConfig.data = { breadcrumb: component.holdHeading };
        component.holdBnftBrdcmb.breadcrumbs = component.holdBnftBrdcmb.buildBreadCrumb(component.route.root);
      }
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toBeDefined();
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
  it('should initialiseViewForEdit', () => {
    component.initialiseViewForEdit(payload);
    expect(component.referenceNo).toEqual(1234);
  });
  it('should getBenefitDetails', () => {
    const sin = 32546411;
    const benefitReqId = 4454545;
    const referenceNo = 102314555;
    spyOn(component, 'getBenefitDetails');
    component.manageBenefitService
      .getAnnuityBenefitRequestDetail(component.sin, component.benefitRequestId, component.referenceNo)
      .subscribe(response => {
        expect(response).toBeTruthy();
      }),
      err => {
        component.showErrorMessages(err);
        component.goToTop();
      };
    fixture.detectChanges();
    component.getBenefitDetails();
    expect(component.getBenefitDetails).toBeDefined();
  });
  xit('should getHoldDetailsForEdit', () => {
    fixture.detectChanges();
    component.getHoldDetailsForEdit();
    expect(component.getBenefitDetails).toBeDefined();
  });
  it('should getModificationReason', () => {
    spyOn(component, 'getModificationReason').and.callThrough();
    fixture.detectChanges();
    component.sanedBenefitService.getSanedHoldReasons().subscribe(response => {
      component.reasonRes = response;
      component.reasonList = component.reasonRes;
      expect(response).toBeTruthy();
    }),
      err => {
        component.showErrorMessages(err);
        component.goToTop();
      };
    component.getModificationReason();
    expect(component.getModificationReason).toBeDefined();
  });
  it('should submitHoldDetailsFn', () => {
    component.inHoldEditMode = false;
    component.documentForm = new FormGroup({
      uploadDocument: new FormGroup({
        comments: new FormControl({ value: 'sdsdsd' })
      })
    });
    expect(component.inHoldEditMode).toBeFalse();
    component.submitHoldDetailsFn();
    expect(component.submitHoldDetailsFn).toBeDefined();
  });
  it('should submitStopped true', () => {
    component.inHoldEditMode = true;
    component.documentForm = new FormGroup({
      uploadDocument: new FormGroup({
        comments: new FormControl({ value: 'sdsdsd' })
      })
    });
    expect(component.inHoldEditMode).toBeTrue();
    component.submitHoldDetailsFn();
    expect(component.submitHoldDetailsFn).toBeDefined();
  });
  it('should getLookupValues', () => {
    fixture.detectChanges();
    // spyOn(component.manageBenefitService, 'getHoldReasonLovList').and.returnValue(of([new Lov()]));
    component.getLookupValues();
    expect(component.reasonListSorted).not.toEqual(null);
  });
  it('should submitStopped', () => {
    spyOn(component, 'submitStopped');
    component.submitStopped();
    expect(component.submitStopped).toBeDefined();
  });
  xdescribe('saveWorkflowInEdit', () => {
    xit('should saveWorkflowInEdit', () => {
      // const workflowData = new BPMUpdateRequest();
      // workflowData.assignedRole = component.role;
      // workflowData.taskId = component.routerData.taskId;
      // workflowData.user = component.routerData.assigneeId;
      // workflowData.outcome = WorkFlowActions.SUBMIT;
      spyOn(component, 'saveWorkflowInEdit');
      component.saveWorkflowInEdit();
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      component.refreshDocument(document);
      expect(component.refreshDocument).toBeDefined();
    });
  });
  describe(' revertHoldBenefitFn', () => {
    it('should revertHoldBenefitFn', () => {
      component.revertHoldBenefitFn();
      expect(component.revertHoldBenefitFn).toBeDefined();
    });
  });
  describe('confirm', () => {
    it('should confirm', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('confirmApplyCancel', () => {
    it('should confirmApplyCancel', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.confirmApplyCancel();
      expect(component.confirmApplyCancel).toBeDefined();
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
  describe('selecteWizard', () => {
    it('should select wizard', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('confirm', () => {
    it('should confirm', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'confirm');
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('confirmApplyCancel', () => {
    it('should confirmApplyCancel', () => {
      spyOn(component, 'confirmApplyCancel');
      component.confirmApplyCancel();
      expect(component.confirmApplyCancel).toBeDefined();
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
  describe('nextForm ', () => {
    it('Should navigate to nextForm ', () => {
      component.currentTab = 0;
      component.holdBenefitWizard = new ProgressWizardDcComponent();
      spyOn(component.alertService, 'clearAlerts');
      component.nextForm();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('popUp', () => {
    it('should popUp', () => {
      component.commonModalRef = new BsModalRef();
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.commonModalRef = new BsModalRef();
      component.popUp(templateRef);
      expect(component.commonModalRef).not.toEqual(null);
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
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('previousFormDetails', () => {
    it('should previousFormDetails', () => {
      component.holdBenefitWizard = new ProgressWizardDcComponent();
      component.holdBenefitWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      component.previousFormDetails();
      expect(component.currentTab).toEqual(0);
    });
  });
  describe('navigateDocWizard', () => {
    it('should navigateDocWizard', () => {
      component.navigateDocWizard();
      expect(component.navigateDocWizard).toBeDefined();
    });
  });
});
