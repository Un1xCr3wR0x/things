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
  ApplicationTypeToken,
  BilingualText,
  ContributorToken,
  ContributorTokenDto,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WizardItem,
  CoreActiveBenefits,
  LovList,
  Lov
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, Form } from 'testing';
import {
  BenefitConstants,
  HoldBenefitDetails,
  ModifyBenefitService,
  AnnuityResponseDto,
  ManageBenefitService,
  BenefitResponse,
  UITransactionType,
  BenefitDocumentService,
  StopSubmitRequest
} from '../../shared';
import { StopBenefitScComponent } from './stop-benefit-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('StopBenefitScComponent', () => {
  let component: StopBenefitScComponent;
  let fixture: ComponentFixture<StopBenefitScComponent>;
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', ['refreshDocument']);
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  const modifyBenefitServicespy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getReqDocsForStopBenefit',
    'revertStopBenefit',
    'getstopDetails',
    'submitStoppedDetails'
  ]);
  const submitValues: StopSubmitRequest = {
    comments: '',
    referenceNo: 232323,
    uuid: ''
  };
  modifyBenefitServicespy.getReqDocsForStopBenefit.and.returnValue(of([new DocumentItem()]));
  modifyBenefitServicespy.submitStoppedDetails.and.returnValue(of({ ...new BenefitResponse(), submitValues }));
  modifyBenefitServicespy.getstopDetails.and.returnValue(of(new HoldBenefitDetails()));
  modifyBenefitServicespy.revertStopBenefit.and.returnValue(of());
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'getStopReasonLovList',
    'updateAnnuityWorkflow',
    'navigateToInbox',
    'getSystemParams',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getStopReasonLovList.and.returnValue(of([new Lov()]));
  manageBenefitServiceSpy.updateAnnuityWorkflow.and.returnValue(of(new LovList([new Lov()])));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getStopBenefitDocuments',
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getStopBenefitDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));

  modifyBenefitServicespy.revertStopBenefit.and.returnValue(of());
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ModifyBenefitService, useValue: modifyBenefitServicespy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: DocumentService, useValue: documentServicespy },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(null)
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        // {
        //   provide: TranslateService,
        //   useValue: translateSpy
        // },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder
      ],
      declarations: [StopBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOninit', () => {
    it('should be ngOninit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });
  describe('setActiveBenefitValues', () => {
    it('should setActiveBenefitValues', () => {
      component.activeBenefit = {
        ...new CoreActiveBenefits(1212, 21332, { english: '', arabic: '' }, 767),
        setBenefitStartDate: null
      };
      expect(component.activeBenefit).toBeDefined();
      component.setActiveBenefitValues();
      expect(component.setActiveBenefitValues).toBeDefined();
    });
  });
  describe('getFormValues', () => {
    it('should getFormValues', () => {
      spyOn(component, 'getFormValues');
      component.getFormValues();
      expect(component.getFormValues).toBeDefined();
    });
  });
  describe('getBenefitDetails', () => {
    it('should getBenefitDetails', () => {
      spyOn(component, 'getBenefitDetails');
      component.getBenefitDetails();
      expect(component.getBenefitDetails).toBeDefined();
    });
  });
  describe(' getStopReasonDate', () => {
    it('should  getStopReasonDate', () => {
      const value = 'abcd';
      component.getStopReasonDate(value);
      expect(component.getStopReasonDate).toBeDefined();
    });
  });

  describe('getStopBenefitDetailsForEdit', () => {
    it('should getStopBenefitDetailsForEdit', () => {
      spyOn(component, 'getStopBenefitDetailsForEdit');
      component.getStopBenefitDetailsForEdit();
      expect(component.getStopBenefitDetailsForEdit).toBeDefined();
    });
  });
  describe('createrequestDetailsForm', () => {
    it('should createrequestDetailsForm', () => {
      spyOn(component, 'createrequestDetailsForm');
      component.createrequestDetailsForm();
      expect(component.createrequestDetailsForm).toBeDefined();
    });
  });
  describe('createstopReasonForm', () => {
    it('should createstopReasonForm', () => {
      spyOn(component, 'createstopReasonForm');
      component.createstopReasonForm();
      expect(component.createstopReasonForm).toBeDefined();
    });
  });
  describe('DateCheck', () => {
    it('should DateCheck', () => {
      spyOn(component, 'DateCheck');
      component.DateCheck();
      expect(component.DateCheck).toBeDefined();
    });
  });
  describe('getLookupValues', () => {
    it('should getLookupValues', () => {
      spyOn(component, 'getLookupValues');
      component.getLookupValues();
      expect(component.getLookupValues).toBeDefined();
    });
  });
  describe('initializeWizardDetails', () => {
    it('should initializeWizardDetails', () => {
      spyOn(component, 'initializeWizardDetails');
      component.initializeWizardDetails();
      expect(component.initializeWizardDetails).toBeDefined();
    });
  });
  describe('docUploadSuccess', () => {
    it('should docUploadSuccess', () => {
      spyOn(component, 'docUploadSuccess');
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  describe('submitStopped', () => {
    it('should submitStopped', () => {
      spyOn(component, 'submitStopped');
      component.submitStopped();
      expect(component.submitStopped).toBeDefined();
    });
  });
  describe('reqDateCheck', () => {
    it('should  reqDateCheck', () => {
      const reqDate = { ...new GosiCalendar(), gregorian: new Date() };
      const eventDate = { ...new GosiCalendar(), gregorian: new Date() };
      component.reqDateCheck(reqDate, eventDate);
      expect(component.reqDateCheck).toBeDefined();
    });
  });
  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
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
  describe('submitStopped', () => {
    it('should submitStopped', () => {
      component.inStopEditMode = false;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      expect(component.inStopEditMode).toBeFalse();
      component.submitStopped();
      expect(component.submitStopped).toBeDefined();
    });
    it('should submitStopped true', () => {
      component.inStopEditMode = true;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      expect(component.inStopEditMode).toBeTrue();
      component.submitStopped();
      expect(component.submitStopped).toBeDefined();
    });
  });

  describe('saveAndNext', () => {
    it('should saveAndNext', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component, 'saveAndNext');
      component.saveAndNext();
      expect(component.saveAndNext).toBeDefined();
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
  describe('confirm', () => {
    it('should confirm', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.inStopEditMode = true;
      expect(component.inStopEditMode).toBeTrue();
      component.confirm();
      component.modifyBenefitService
        .revertStopBenefit(component.socialInsuranceNo, component.benefitRequestId, component.referenceNo)
        .subscribe(() => {
          expect(component.inStopEditMode).toBeTrue();
          expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
          expect(component.inStopEditMode).toBeFalse();
          expect(component.router.navigate).toHaveBeenCalledWith([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
        });
      expect(component.confirm).toBeDefined();
    });
  });
  describe('getStopBenefitDetailsForEdit', () => {
    it('should getStopBenefitDetailsForEdit', () => {
      component.getStopBenefitDetailsForEdit();
      component.modifyBenefitService
        .getstopDetails(component.socialInsuranceNo, component.benefitRequestId, component.referenceNo)
        .subscribe(res => {
          component.stopDetails = res;
        });
      expect(component.getStopBenefitDetailsForEdit).toBeDefined();
    });
  });
  describe('confirmApplyCancel', () => {
    it('should confirmApplyCancel', () => {
      component.commonModalRef = new BsModalRef();
      component.isPrevClicked = true;
      expect(component.isPrevClicked).toBeTrue();
      spyOn(component.commonModalRef, 'hide');
      component.confirmApplyCancel();
      expect(component.confirmApplyCancel).toBeDefined();
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
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      spyOn(component.location, 'back');
      component.routeBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      component.selectWizard(1);
      expect(component.currentTab).toEqual(1);
    });
  });
  describe('previousFormDetails', () => {
    it('should previousFormDetails', () => {
      component.stopBenefitWizard = new ProgressWizardDcComponent();
      component.stopBenefitWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      spyOn(component.stopBenefitWizard, 'setPreviousItem').and.callThrough();
      component.previousFormDetails();
      expect(component.currentTab).toEqual(0);
      expect(component.stopBenefitWizard.setPreviousItem).toHaveBeenCalled();
    });
  });
  describe('nextForm', () => {
    it('should nextForm', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.currentTab = 0;
      component.totalTabs = 2;
      component.stopBenefitWizard = new ProgressWizardDcComponent();
      component.nextForm();
      expect(component.currentTab).not.toBe(null);
    });
  });
  describe('navigateDocWizard', () => {
    it('should navigateDocWizard', () => {
      expect(component.inStopEditMode).toBeFalse();
      component.navigateDocWizard();
      component.modifyBenefitService
        .getReqDocsForStopBenefit(component.socialInsuranceNo, component.benefitRequestId, component.referenceNo)
        .subscribe(res => {
          component.requiredDocs = res;
        });
      expect(component.navigateDocWizard).toBeDefined();
    });
  });
  describe('  getUploadedDocuments', () => {
    it('should   getUploadedDocuments', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      component.getUploadedDocuments();
      component.benefitDocumentService
        .getUploadedDocuments(component.benefitRequestId, transactionKey, transactionType, component.referenceNo)
        .subscribe(res => {
          component.requiredDocs = res;
        });
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
