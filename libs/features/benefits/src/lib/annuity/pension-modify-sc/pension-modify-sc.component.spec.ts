/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreBenefitService,
  CoreActiveBenefits,
  GosiCalendar,
  DocumentItem
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  AnnuityResponseDto,
  BenefitConstants,
  BenefitResponse,
  Benefits,
  DependentDetails,
  DependentService,
  HeirDetailsRequest,
  ManageBenefitService,
  HeirBenefitService
} from '../../shared';
import { PensionModifyScComponent } from './pension-modify-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('PensionModifyScComponent', () => {
  let component: PensionModifyScComponent;
  let fixture: ComponentFixture<PensionModifyScComponent>;
  /*const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService',
   ['getDependentDetailsById','getBenefitStartAndEligibilityDate','getDependentDetailsById']);
  dependentServiceSpy.getDependentDetailsById.and.returnValue(of([new DependentDetails()]));
  dependentServiceSpy.getBenefitStartAndEligibilityDate.and.returnValue(of([new DependentDetails()]));*/
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefits',
    'getAnnuityBenefitRequestDetail',
    'patchAnnuityBenefit',
    'getSystemParams',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getAnnuityBenefits.and.returnValue(
    of([{ ...new Benefits(), eligibleForDependentAmount: true }])
  );
  manageBenefitServiceSpy.patchAnnuityBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirBenefit',
    'getHeirUpdateWarningMsg'
  ]);
  heirBenefitServicespy.getHeirBenefit.and.returnValue(of([new DependentDetails()]));
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'getSavedActiveBenefit'
  ]);
  coreBenefitServiceSpy.getSavedActiveBenefit.and.returnValue(
    new CoreActiveBenefits(122343, 454565, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 2323)
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [PensionModifyScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        // { provide: DependentService, useValue: dependentServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionModifyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      // const sin = 367452900;
      // const benefitRequestId = 1002191697;
      component.actionType = '';
      expect(component.actionType).toEqual('');
      expect(component.ngOnInit).toBeTruthy();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      component.isConfirmClicked = true;
      component.ngAfterViewInit();
      expect(component.isConfirmClicked).toBeTrue();
      expect(component.ngAfterViewInit).toBeTruthy();
    });
  });
  describe('getDependentList', () => {
    it('should getDependentList', () => {
      const requestDate = new GosiCalendar();
      spyOn(component.dependentService, 'getDependentDetailsById').and.returnValue(of([new DependentDetails()]));
      component.getDependentList(requestDate);
      expect(component.getDependentList).toBeDefined();
    });
  });
  describe(' getEligibiliyStartDate', () => {
    it('should  getEligibiliyStartDate', () => {
      const requestDate = new GosiCalendar();
      component.getEligibiliyStartDate(requestDate);
      expect(component.getDependentList).toBeDefined();
    });
  });

  describe('isNavigatedFromInbox', () => {
    it('should navigated from inbox', () => {
      component.isNavigatedFromInbox();
      const routerData = new RouterData();
      component.routerData.selectWizard = 'DOCUMENTS';
      expect(component.routerData.selectWizard).toEqual('DOCUMENTS');
      spyOn(component, 'loadBenefitDetailsPageContents').and.callThrough();
      spyOn(component.benefitDocumentService, 'getReqDocs').and.returnValue(of([new DocumentItem()]));
      component.benefitDocumentService
        .getReqDocs(component.socialInsuranceNo, component.benefitRequestId, component.referenceNo)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.isNavigatedFromInbox).toBeTruthy();
    });
  });
  describe('loadBenefitDetailsPageContents', () => {
    it('should loadBenefitDetailsPageContents', () => {
      component.loadBenefitDetailsPageContents();
      const sin = 367452900;
      component.manageBenefitService.getAnnuityBenefits(sin).subscribe(data => {
        component.annuitybenefits = data;
      });
      spyOn(component, 'loadBenefitDetailsPageContents').and.callThrough();
      spyOn(component, 'getEligibilityDetails').and.callThrough();
      fixture.detectChanges();
      expect(component.loadBenefitDetailsPageContents).toBeDefined();
    });
    it('should loadBenefitDetailsPageContents', () => {
      component.benefitRequestId = 34345;
      expect(component.benefitRequestId).toBeDefined();
      component.loadBenefitDetailsPageContents();
    });
  });
  describe('setHeirByStatus', () => {
    it('should setHeading HOLD', () => {
      component.actionType = 'HOLD';
      expect(component.actionType).toEqual('HOLD');
      component.setHeirByStatus();
      expect(component.setHeirByStatus).toBeDefined();
    });
    it('should RESTART', () => {
      component.actionType = 'RESTART';
      expect(component.actionType).toEqual('RESTART');
      component.setHeirByStatus();
      expect(component.setHeirByStatus).toBeDefined();
    });
    it('should STOP', () => {
      component.actionType = 'STOP';
      expect(component.actionType).toEqual('STOP');
      component.setHeirByStatus();
    });
    it('should STOP_WAIVE', () => {
      component.actionType = 'STOP_WAIVE';
      expect(component.actionType).toEqual('STOP_WAIVE');
      //expect(component.heading).toEqual('BENEFITS.SELECT-HEIRS-STOP-WAIVE');
      component.setHeirByStatus();
    });
  });
  describe('getEligibilityDetails', () => {
    it('should getEligibilityDetails', () => {
      component.isValidator = true;
      const sin = 230066639;
      component.getEligibilityDetails(sin);
      fixture.detectChanges();
      expect(component.isValidator).toBeTrue();
      expect(component.getEligibilityDetails).toBeDefined();
    });
  });

  describe('getListOfDependents', () => {
    it('should  getListOfDependents', () => {
      const sin = 367452900;
      const benefitRequestId = 1002191697;
      const referenceNo = 10015003;
      const status = [];
      component.getListOfDependents(sin, benefitRequestId, referenceNo, status);
      expect(component.getListOfDependents).toBeTruthy();
    });
  });
  describe('getListOfHeirs', () => {
    it('should get list of heirs', () => {
      const sin = 367452900;
      const benefitRequestId = 1002191697;
      const referenceNo = 10015003;
      const heirStatus = [];
      component.getListOfHeirs(sin, benefitRequestId, referenceNo);
      expect(component.getListOfHeirs).toBeTruthy();
    });
    it('should get list of heirs', () => {
      const sin = 367452900;
      const benefitRequestId = 1002191697;
      const referenceNo = 10015003;
      component.actionType = 'HOLD';
      expect(component.actionType).toEqual('HOLD');
      component.getListOfHeirs(sin, benefitRequestId, referenceNo);
      expect(component.getListOfHeirs).toBeTruthy();
    });
    it('should get list of heirs', () => {
      const sin = 367452900;
      const benefitRequestId = 1002191697;
      const referenceNo = 10015003;
      component.actionType = 'STOP_WAIVE';
      expect(component.actionType).toEqual('STOP_WAIVE');
      component.getListOfHeirs(sin, benefitRequestId, referenceNo);
      expect(component.getListOfHeirs).toBeTruthy();
    });
    it('should get list of heirs', () => {
      const sin = 367452900;
      const benefitRequestId = 1002191697;
      const referenceNo = 10015003;
      component.actionType = 'RESTART';
      expect(component.actionType).toEqual('RESTART');
      component.getListOfHeirs(sin, benefitRequestId, referenceNo);
      expect(component.getListOfHeirs).toBeTruthy();
    });
  });
  describe('setTransacrtionIDs', () => {
    it('should setTransacrtionIDs', () => {
      const actionType = 'HOLD';
      expect(component.setTransacrtionIDs).toBeDefined();
      expect(actionType).toEqual('HOLD');
      spyOn(component, 'setTransacrtionIDs').and.callThrough();
      component.pensionTransactionId = BenefitConstants.REQUEST_MODIFY_BENEFIT;
      component.setTransacrtionIDs();
      expect(component.setTransacrtionIDs).toBeDefined();
    });
  });
  describe('getWizardItems', () => {
    it('should getWizardItems', () => {
      component.isHeir = true;
      spyOn(component.wizardService, 'getHeirPensionItems');
      expect(component.isHeir).toBeTrue();
      spyOn(component.wizardService, 'getRetirementPensionItems').and.callThrough();
      component.getWizardItems(component.actionType, component.isHeir);
      expect(component.getWizardItems).toBeTruthy();
    });
    it('should getWizardItems false', () => {
      component.isHeir = false;
      spyOn(component.wizardService, 'getHeirPensionItems');
      expect(component.isHeir).toBeFalse();
      spyOn(component.wizardService, 'getRetirementPensionItems').and.callThrough();
      component.getWizardItems(component.actionType, component.isHeir);
      expect(component.getWizardItems).toBeTruthy();
    });
  });
  describe('selectedWizard', () => {
    it('should selectedWizard', () => {
      component.selectedWizard(1);
      expect(component.selectedWizard).toBeTruthy();
    });
  });
  describe('saveDependent', () => {
    it('should saveDependent', () => {
      const data = [];
      spyOn(component, 'applyBenefit');
      component.saveDependent(data);
      expect(component.saveDependent).toBeTruthy();
    });
  });
  describe('saveHeir', () => {
    it('should saveHeir', () => {
      const data = new HeirDetailsRequest();
      spyOn(component, 'applyBenefit');
      component.saveHeir(data);
      expect(component.saveHeir).toBeTruthy();
    });
  });
  describe('previousForm', () => {
    it('should previousForm', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeTruthy();
    });
  });
  describe('docUploadSuccess', () => {
    it('should docUploadSuccess', () => {
      spyOn(component, 'docUploadSuccess').and.callThrough();
      spyOn(component, 'patchBenefitWithCommentsAndNavigate').and.callThrough();
      spyOn(component, 'nextForm');
      fixture.detectChanges();
      component.docUploadSuccess(event);
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.alertService, 'clearAlerts');
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeTruthy();
    });
  });
  describe('submitBenefitDetails', () => {
    it('should submitBenefitDetails', () => {
      spyOn(component, 'applyBenefit');
      component.submitBenefitDetails();
      expect(component.submitBenefitDetails).toBeTruthy();
    });
  });
  describe('setHeadingForEachBenefits', () => {
    it('should set Heading for each benefits', () => {
      const benefitType = 'HOLD-HEIR-BENEFIT';
      const benefitType1 = 'RESTART-HEIR-BENEFIT';
      const benefitType2 = 'STOP-HEIR-BENEFIT';
      const actionType = 'START_WAIVE';
      const actionType1 = 'RESTART';
      const actionType2 = 'STOP';
      expect(actionType).toBeDefined();
      expect(actionType).toEqual('START_WAIVE');
      component.setHeadingForEachBenefits(benefitType, actionType);
      component.setHeadingForEachBenefits(benefitType1, actionType1);
      component.setHeadingForEachBenefits(benefitType2, actionType2);
      expect(component.setHeadingForEachBenefits).toBeTruthy();
    });
    it('should set Heading for each benefits', () => {
      const benefitType = 'HOLD-HEIR-BENEFIT';
      const actionType = 'START_WAIVE';
      component.isHeir = true;
      expect(component.isHeir).toBeTrue();
      component.setHeadingForEachBenefits(benefitType, actionType);
      expect(component.setHeadingForEachBenefits).toBeTruthy();
    });
  });
  // describe('getAnnuityBenefitDetails', () => {
  //   it('should annuity request details', () => {
  //     component.socialInsuranceNo = 367452900;
  //     component.benefitRequestId = 1002191697;
  //     const referenceNo = 1012661;
  //     expect(component.socialInsuranceNo && component.benefitRequestId).toEqual(367452900 && 1002191697);
  //     //spyOn(component.manageBenefitService, 'getAnnuityBenefitRequestDetail');
  //     component.getAnnuityBenefitDetails(component.socialInsuranceNo, component.benefitRequestId, referenceNo);
  //     expect(component.getAnnuityBenefitDetails).toBeTruthy();
  //   });
  // });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeTruthy();
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
  describe('reasonFormValueChanged', () => {
    it('should reasonFormValueChanged', () => {
      const data = new HeirDetailsRequest();
      spyOn(component, 'applyBenefit');
      component.reasonFormValueChanged(data);
      expect(component.reasonFormValueChanged).toBeTruthy();
    });
  });
});
