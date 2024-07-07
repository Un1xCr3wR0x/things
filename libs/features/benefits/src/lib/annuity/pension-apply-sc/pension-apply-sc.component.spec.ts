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
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  TransactionReferenceData
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, of, config } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TabsMockComponent, TranslateLoaderStub } from 'testing';
import {
  AdjustmentDetailsDto,
  AttorneyDetailsWrapper,
  BenefitDocumentService,
  BenefitRequestsService,
  Benefits,
  DependentDetails,
  DependentService,
  DependentTransaction,
  EachHeirDetail,
  HeirDetailsRequest,
  HeirHistory,
  ValidateHeir,
  ValidateRequest,
  BenefitConstants,
  BenefitDetails,
  BenefitResponse,
  AnnuityResponseDto,
  PersonalInformation,
  ManageBenefitService
} from '../../shared';
import { PensionApplyScComponent } from './pension-apply-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('PensionApplyScComponent', () => {
  let component: PensionApplyScComponent;
  let fixture: ComponentFixture<PensionApplyScComponent>;
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getReqDocs'
  ]);
  benefitDocumentServicespy.getReqDocs.and.returnValue(of([new DocumentItem()]));
  const dependentServicespy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'imprisonmentDetails',
    'getDependentDetails',
    'getBenefitStartAndEligibilityDate',
    'getBenefitHistory',
    'getDependents'
  ]);
  dependentServicespy.getDependentHistoryDetails.and.returnValue(of([new DependentTransaction()]));
  dependentServicespy.getBenefitHistory.and.returnValue(of([new BenefitDetails()]));
  const benefitRequestsServicespy = jasmine.createSpyObj<BenefitRequestsService>('BenefitRequestsService', [
    'getEligibleBenefitByBenefitType'
  ]);
  benefitRequestsServicespy.getEligibleBenefitByBenefitType.and.returnValue(of(new Benefits()));
  /*const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getBenefitsByType',
    'setHeirUpdateWarningMsg',
    'getHeirUpdateWarningMsg',
    'getHeirPensionItems',
    'validateHeir',
    'getHeirHistoryDetails',
    'getBenefitReasonList'
  ]);
 
  heirBenefitServicespy.getBenefitsByType.and.returnValue(of([new Benefits()]));
  heirBenefitServicespy.validateHeir.and.returnValue(of([new ValidateRequest()]));
  heirBenefitServicespy.getHeirHistoryDetails.and.returnValue(of([new HeirHistory()]));
  heirBenefitServicespy.getBenefitReasonList.and.returnValue(of(new LovList([new Lov()])));*/

  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'updateForAnnuityBenefit',
    'applyForBenefit',
    'getAnnuityBenefitRequestDetail',
    'getSelectedAuthPerson',
    'getBenefitCalculationDetailsByRequestId',
    'getAnnuityBenefits',
    'patchAnnuityBenefit',
    'updateForAnnuityBenefit',
    'getAnnuityBenefitCalculations',
    'getSystemParams',
    'getPersonDetailsWithPersonId',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getAnnuityBenefits.and.returnValue(of([new Benefits()]));
  manageBenefitServiceSpy.getAnnuityBenefitCalculations.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.updateForAnnuityBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.patchAnnuityBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getSelectedAuthPerson.and.returnValue(of([new AttorneyDetailsWrapper()]));
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.applyForBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.updateForAnnuityBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [PensionApplyScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        // { provide: HeirBenefitService, useValue: heirBenefitServicespy  },
        { provide: BenefitRequestsService, useValue: benefitRequestsServicespy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: DependentService, useValue: dependentServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        // { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionApplyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should ngAfterViewInit', () => {
      component.ngAfterViewInit();
      const payload = {
        registrationNo: 1234,
        socialInsuranceNo: 1234,
        identifier: 1034681524,
        id: 1234,
        repayId: 1234,
        transactionNumber: 1000045428,
        taskId: 123456,
        miscPaymentId: 502351234,
        resource: '',
        referenceNo: 1234,
        channel: 'field-office',
        user: 'avijit',
        assignedRole: 'Validator 1',
        beneficiaryId: 1234,
        adjustmentRepayId: 1234
      };
      component.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
      expect(component.routerData.selectWizard).toEqual(BenefitConstants.UI_DOCUMENTS);
      const routerData = {
        ...new RouterData(),
        payload: JSON.stringify(payload),
        referenceNo: 232332,
        draftRequest: true,
        taskId: '',
        assigneeId: '',
        selectWizard: '',
        comments: [{ ...new TransactionReferenceData(), comments: 'dddd' }],
        fromJsonToObject: json => json
      };
      expect(component.ngAfterViewInit).toBeDefined();
    });
  });
  describe('getBenefitValues', () => {
    it('should getBenefitValues', () => {
      spyOn(component, 'getBenefitValues').and.callThrough();
      spyOn(component, 'setValues').and.callThrough();
      expect(component.isEarlyRetirement).toBeFalse();
      expect(component.benefitType).toEqual('Retirement Pension Benefit');
      component.getBenefitValues();
      fixture.detectChanges();
      expect(component.getBenefitValues).toBeDefined();
    });
  });
  describe('setValues', () => {
    it('should setValues', () => {
      spyOn(component, 'setValues').and.callThrough();
      component.setValues();
      fixture.detectChanges();
      expect(component.setValues).toBeDefined();
    });
    it('should setValues for EarlyRetirement', () => {
      component.isEarlyRetirement = true;
      expect(component.isEarlyRetirement).toBeTrue();
      component.setValues();
      expect(component.benefitType).toEqual('Early Retirement Pension Benefit');
      expect(component.setValues).toBeDefined();
    });
    it('should setValues for isNonOcc', () => {
      component.isNonOcc = true;
      expect(component.isNonOcc).toBeTrue();
      component.setValues();
      expect(component.benefitType).toEqual('Non-Occupational Disability Pension Benefit');
      expect(component.setValues).toBeDefined();
    });
    it('should setValues for isJailed', () => {
      component.isJailed = true;
      expect(component.isJailed).toBeTrue();
      component.setValues();
      expect(component.benefitType).toEqual('Jailed Contributor Pension Benefit');
      expect(component.setValues).toBeDefined();
    });
    it('should setValues for isHazardous', () => {
      component.isHazardous = true;
      expect(component.isHazardous).toBeTrue();
      component.setValues();
      expect(component.benefitType).toEqual('Retirement Pension Benefit (Hazardous Occupation)');
      expect(component.setValues).toBeDefined();
    });
    it('should setValues for isHeir', () => {
      component.isHeir = true;
      expect(component.isHeir).toBeTrue();
      component.setValues();
      expect(component.benefitType).toEqual('Heir Pension Benefit');
      expect(component.setValues).toBeDefined();
    });
  });
  /*describe('getDependentDetailsByRequestId', () => {
    it('should getDependentDetailsByRequestId', () => {
      const sin = 367189827;
      const benefitRequestId = 1002210558;
      const referenceNo = 128457;
      component.getDependentDetailsByRequestId(sin, benefitRequestId, referenceNo);
      spyOn(component, 'getDependentDetailsByRequestId').and.callThrough();
      fixture.detectChanges();
      expect(component.getDependentDetailsByRequestId).toBeDefined();
    });
  });*/
  describe('previousForm', () => {
    it('should previousForm', () => {
      spyOn(component, 'goToPreviousForm');
      component.previousForm();
      expect(component.previousForm).toBeDefined();
    });
  });

  describe('routeBack', () => {
    it('should routeBack', () => {
      const payload = {
        registrationNo: 1234,
        socialInsuranceNo: 1234,
        identifier: 1034681524,
        id: 1234,
        repayId: 1234,
        transactionNumber: 1000045428,
        taskId: 123456,
        miscPaymentId: 502351234,
        resource: '',
        referenceNo: 1234,
        channel: 'field-office',
        user: 'avijit',
        assignedRole: 'Validator 1',
        beneficiaryId: 1234,
        adjustmentRepayId: 1234
      };
      const routerData = {
        ...new RouterData(),
        payload: JSON.stringify(payload),
        referenceNo: 232332,
        draftRequest: true,
        taskId: '',
        assigneeId: '',
        comments: [{ ...new TransactionReferenceData(), comments: 'dddd' }],
        fromJsonToObject: json => json
      };
      expect(routerData.draftRequest).toBeTrue();
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('ShowEligibilityPopup', () => {
    it('should show modal', () => {
      const commonModalRef = { elementRef: null, createEmbeddedView: null };
      component.commonModalRef = new BsModalRef();
      //  spyOn(component.manageBenefitService, 'getAnnuityBenefits').and.returnValue(of([{...new Benefits(),benefitType:{english:'',arabic:''}}]));
      spyOn(component.modalService, 'show');
      component.showEligibilityPopup(commonModalRef);
      expect(component.modalService.show).toHaveBeenCalled();
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
  describe('showAddContactWizard', () => {
    it('should showAddContactWizard', () => {
      const event = true;
      spyOn(component, 'showAddContactWizard').and.callThrough();
      component.showAddContactWizard(event);
      fixture.detectChanges();
      expect(component.showAddContactWizard).toBeDefined();
    });
  });
  // describe('getEligibilityDetails', () => {
  //   it('should getEligibilityDetails', () => {
  //     const sin = 230066639;
  //     spyOn(component, 'getEligibilityDetails').and.callThrough();
  //     component.getEligibilityDetails(sin);
  //     fixture.detectChanges();
  //     expect(component.getEligibilityDetails).toBeDefined();
  //   });
  // });
  describe('getBenefitCalculationByType', () => {
    it('should getBenefitCalculationByType', () => {
      const benefitType = 'Heir Pension Benefit';
      const reqDate = {
        gregorian: new Date('2020-11-21T00:00:00.000Z'),
        hijiri: '1442-04-06'
      };
      /*spyOn(component.manageBenefitService, 'getAnnuityBenefitCalculations').and.returnValue(of({...new BenefitDetails(),deathDate:{
        gregorian: new Date('2020-11-21T00:00:00.000Z'),
        hijiri: '1442-04-06'
      }}));
      component.manageBenefitService
        .getAnnuityBenefitCalculations(component.socialInsuranceNo, benefitType,reqDate)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });*/
      component.getBenefitCalculationByType(benefitType);
      fixture.detectChanges();
      expect(component.getBenefitCalculationByType).toBeDefined();
    });
  });
  describe('requestDateChanged', () => {
    it('should requestDateChanged', () => {
      const date = new GosiCalendar();
      component.requestDateChanged(date);
      fixture.detectChanges();
      expect(component.requestDateChanged).toBeDefined();
    });
  });
  // describe('createHeirForm', () => {
  //   it('should get deduction plan', () => {
  //     component.createHeirForm();
  //   });
  // });
  describe('initialiseTabWizards', () => {
    it('should initialise tab wizards', () => {
      const benefitType = 'Heir Pension Benefit';
      const eligibleDependent = true;
      component.initialiseTabWizards(benefitType, eligibleDependent);
      expect(component.initialiseTabWizards).toBeDefined();
    });
  });
  describe('createRequestPensionForm', () => {
    it('should initialise request pension form', () => {
      component.createRequestPensionForm();
      expect(component.createRequestPensionForm).toBeDefined();
    });
  });
  describe('geMonthForTrans', () => {
    it('should get month labels', () => {
      const date = new GosiCalendar();
      component.geMonthForTrans(date);
      expect(component.geMonthForTrans).toBeDefined();
    });
  });
  describe('getSystemParam', () => {
    it('to get system params', () => {
      /* component.manageBenefitService.getSystemParams().subscribe(response => {
        expect(response).toBeTruthy();
      });*/
      expect(component.getSystemParam).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('showCancelTemplate', () => {
    it('should show cancel template', () => {
      component.showCancelTemplate();
      component.applyForBenefit;
      expect(component.showCancelTemplate).toBeDefined();
    });
  });
  describe('getBenefitHistoryDetails', () => {
    it('should getBenefitHistoryDetails', () => {
      const sin = 2123232344;
      const benefitRequestId = 123243;
      component.getBenefitHistoryDetails(sin, benefitRequestId);
      expect(component.getBenefitHistoryDetails).toBeDefined();
    });
  });
  /*describe('getBenefitEligibility', () => {
    it('should  getBenefitEligibility', () => {
      const sin = 2123232344;
      const benefitType = 'HOLD-HEIR-BENEFIT';
    });
  });*/
  describe('getBankName', () => {
    it('should getBankName', () => {
      const backcode = 12233232;
      component.getBankName(backcode);
      expect(component.getBankName).toBeDefined();
    });
  });
  describe('', () => {
    it('should  getPersonDetailsWithPersonId', () => {
      const personId = 12233232;
      component.getPersonDetailsWithPersonId(personId);
      expect(component.getPersonDetailsWithPersonId).toBeDefined();
    });
  });
  describe('getPersonContactDetails', () => {
    it('should  getPersonContactDetails', () => {
      const nin = 12233232;
      component.getPersonContactDetails(nin);
      expect(component.getPersonContactDetails).toBeDefined();
    });
  });
  describe('getContirbutorRefundDetails', () => {
    it('should  getContirbutorRefundDetails', () => {
      component.getContirbutorRefundDetails();
      expect(component.getContirbutorRefundDetails).toBeDefined();
    });
  });
  describe('getAppliedBenefitDetails', () => {
    it('should  getAppliedBenefitDetails', () => {
      component.socialInsuranceNo = 23342423;
      component.benefitRequestId = 23434234;
      component.referenceNo = 2334233;
      /*spyOn(component.manageBenefitService, 'getSelectedAuthPerson').and.returnValue(
        of([new AttorneyDetailsWrapper()])
      );*/
      component.getAppliedBenefitDetails(
        component.socialInsuranceNo,
        component.benefitRequestId,
        component.referenceNo
      );
      expect(component.getAppliedBenefitDetails).toBeDefined();
    });
  });
  describe('getDependentHistoryDetails', () => {
    it('should  getDependentHistoryDetails', () => {
      component.socialInsuranceNo = 23342423;
      component.benefitRequestId = 23434234;
      component.referenceNo = 2334233;
      component.getDependentHistoryDetails(
        component.socialInsuranceNo,
        component.benefitRequestId,
        component.referenceNo
      );
      expect(component.getDependentHistoryDetails).toBeDefined();
    });
  });
  xdescribe('getPersonDetailsWithPersonId', () => {
    it('should getPersonDetailsWithPersonId', () => {
      component.getPersonDetailsWithPersonId(component.personId);
      expect(component.getPersonDetailsWithPersonId).toBeDefined();
    });
  });
  describe('getAnnuityCalculation', () => {
    it('should getAnnuityCalculation', () => {
      const sin = 12234334;
      const benefitRequestId = 2343422;
      const referenceNo = 2342332134;
      /*spyOn(component.manageBenefitService, 'getBenefitCalculationDetailsByRequestId').and.returnValue(
        of(new BenefitDetails())
      );*/
      component.getAnnuityCalculation(sin, benefitRequestId, referenceNo);
      expect(component.getAnnuityCalculation).toBeDefined();
    });
  });
  describe('getPersonDetails', () => {
    it('should getPersonDetails', () => {
      component.getPersonDetails();
      expect(component.getPersonDetails).toBeDefined();
    });
  });
  /*describe('getAttorneyDetails', () => {
    it('should getAttorneyDetails', () => {
      const id = 2312334;
      const status = 'Active';
      component.getAttorneyDetails(id, status);
      expect(component.getAttorneyDetails).toBeDefined();
    });
  });*/
  describe('getDependentsBackdated', () => {
    it('should  getDependentsBackdated', () => {
      const requestDate = new GosiCalendar();
      const benefitRequestId = 12323122;
      const referenceNo = 1213121;
      component.getDependentsBackdated(requestDate, benefitRequestId, referenceNo);
      expect(component.getDependentsBackdated).toBeDefined();
    });
  });
  describe('getHeirHistoryDetails', () => {
    it('should  getHeirHistoryDetails', () => {
      const sin = 233423231;
      const benefitRequestId = 12323122;
      const transactionTraceId = 1213121;
      spyOn(component.heirBenefitService, 'getHeirHistoryDetails').and.returnValue(of([new HeirHistory()]));
      component.getHeirHistoryDetails(transactionTraceId, benefitRequestId, sin);
      expect(component.getHeirHistoryDetails).toBeDefined();
    });
  });
  describe('getAdjustmentDetails', () => {
    it('should getAdjustmentDetails', () => {
      const sin = 233423231;
      const benefitRequestId = 12323122;
      spyOn(component.benefitPropertyService, 'getAdjustmentDetails').and.returnValue(of(new AdjustmentDetailsDto()));
      component.getAdjustmentDetails(sin, benefitRequestId);
      expect(component.getAdjustmentDetails).toBeDefined();
    });
  });
  describe('getHeirEligibilityDetails', () => {
    it('should getHeirEligibilityDetails', () => {
      const sin = 233423231;
      const benefitRequestId = 12323122;
      const data = new ValidateHeir();
      const page = 'terminationOfReemployment';
      const benefitType = 'abcd';
      spyOn(component.heirBenefitService, 'validateHeir').and.returnValue(of([new ValidateRequest()]));
      component.getHeirEligibilityDetails(sin, data, page, benefitRequestId, benefitType);
      expect(component.getHeirEligibilityDetails).toBeDefined();
    });
  });
  describe(' checkValidatorEditFlow', () => {
    it('should  checkValidatorEditFlow', () => {
      component.checkValidatorEditFlow();
      expect(component.checkValidatorEditFlow).toBeDefined();
    });
  });
  describe('setDeductionPercentage', () => {
    it('should set deduction percentage', () => {
      const percentage = 1;
      component.setDeductionPercentage(percentage);
      expect(component.setDeductionPercentage).toBeDefined();
    });
  });
  xdescribe(' checkBankEntered', () => {
    it('should  checkBankEntered', () => {
      const wiardComp = new ProgressWizardDcComponent();
      component.checkBankEntered(wiardComp);
      expect(component.checkBankEntered).toBeDefined();
    });
  });
  xdescribe('checkRequestDateValidity', () => {
    it('should checkRequestDateValidity', () => {
      const wiardComp = new ProgressWizardDcComponent();
      component.checkRequestDateValidity(wiardComp);
      expect(component.checkRequestDateValidity).toBeDefined();
    });
  });
  xdescribe(' checkReasonRequestValidity', () => {
    it('should  checkReasonRequestValidity', () => {
      const wiardComp = new ProgressWizardDcComponent();
      component.checkReasonRequestValidity(wiardComp);
      expect(component.checkReasonRequestValidity).toBeDefined();
    });
  });
  describe('getImprisonmentDetails', () => {
    it('should getImprisonmentDetails', () => {
      const sin = 230066639;
      const benefitType = 'Jailed Contributor Pension Benefit';
      //spyOn(component.manageBenefitService,'getAnnuityBenefits').and.returnValue(of([{...new Benefits(),benefitType:{english:'',arabic:''}}]));
      component.getImprisonmentDetails(sin, benefitType);
      expect(component.getImprisonmentDetails).toBeDefined();
    });
  });

  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('docUploadSuccess', () => {
    it('should handle document upload', () => {
      // const comment = 'success';
      // const event = { comment };
      spyOn(component, 'docUploadSuccess');
      fixture.detectChanges();
      expect(component.docUploadSuccess).toBeDefined();
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
  describe('depcancel', () => {
    it('should sent input to dependent component to  cancel', () => {
      component.depcancel();
      expect(component.depcancel).toBeDefined();
    });
  });
  xdescribe('saveDependent', () => {
    it('should sent input to dependent component to  trigger save dependent', () => {
      const dependent = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.saveDependent(dependent);
      expect(component.saveDependent).toBeDefined();
    });
  });
  xdescribe('applyForBenefitWithHier', () => {
    it('should applyForBenefitWithHier', () => {
      const heirData = {
        ...new HeirDetailsRequest(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.applyForBenefitWithHier(heirData);
      expect(component.applyForBenefitWithHier).toBeDefined();
    });
  });
  xdescribe('closePopup', () => {
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('showIneligibilityDetails', () => {
    it('should showIneligibilityDetails', () => {
      const details = new ValidateRequest();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showIneligibilityDetails(templateRef, details);
      expect(component.closePopup).toBeDefined();
    });
  });
  describe('showBenefitsWagePopup', () => {
    it('should showBenefitsWagePopup', () => {
      const details = new EachHeirDetail();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showBenefitsWagePopup(templateRef, details);
      expect(component.showBenefitsWagePopup).toBeDefined();
    });
  });
  describe('saveHeirDetailAction', () => {
    it('should sent input to heir component to  trigger save heir', () => {
      component.saveHeirDetailAction();
      expect(component.saveHeirDetailAction).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should get screen size', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
