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
  ApplicationTypeToken,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  BilingualText,
  Alert,
  PersonWrapperDto,
  Person
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent, TabsetConfig } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TabsMockComponent, genericError } from 'testing';
import {
  Benefits,
  HeirDetailsRequest,
  DependentDetails,
  BenefitRequestsService,
  BenefitType,
  BenefitDetails,
  ManageBenefitService,
  BenefitResponse,
  DependentModify,
  BenefitPropertyService,
  DependentService,
  ImprisonmentDetails,
  PersonalInformation,
  AuthorizationDetailsDto,
  AuthorizationList,
  AttorneyDetailsWrapper
} from '../../shared';
import { LumpsumAppplyScComponent } from './lumpsum-apply-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('LumpsumAppplyScComponent', () => {
  let component: LumpsumAppplyScComponent;
  let fixture: ComponentFixture<LumpsumAppplyScComponent>;
  const benefitRequestsServiceSpy = jasmine.createSpyObj<BenefitRequestsService>('BenefitRequestsService', [
    'getEligibleBenefitByBenefitType',
    'validateBenefit'
  ]);
  benefitRequestsServiceSpy.getEligibleBenefitByBenefitType.and.returnValue(of(new Benefits()));
  //benefitRequestsServiceSpy.validateBenefit.and.returnValue(of(new ValidateHeirBenefitResponse()));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefits',
    'getAnnuityBenefitCalculations',
    'updateForAnnuityBenefit',
    'getSystemParams',
    'getSystemRunDate',
    'patchAnnuityBenefit',
    'getPersonDetailsWithPersonId',
    'getNin',
    'setNin',
    'getAttorneyDetails',
    'getPersonIdentifier'
  ]);
  manageBenefitServiceSpy.getAttorneyDetails.and.returnValue(
    of({
      ...new AuthorizationDetailsDto(),
      AttorneyDetailsWrapper: [{ ...new AttorneyDetailsWrapper() }],
      authorizationList: [{ ...new AuthorizationList() }]
    })
  );
  manageBenefitServiceSpy.getPersonIdentifier.and.returnValue(
    of({
      ...new PersonWrapperDto(),
      listOfPersons: [
        { ...new Person(), personId: 1234, sex: { english: 'Male', arabic: '' }, fromJsonToObject: json => json }
      ]
    })
  );
  manageBenefitServiceSpy.setNin.and.returnValue();
  manageBenefitServiceSpy.getNin.and.returnValue(635436564);
  manageBenefitServiceSpy.patchAnnuityBenefit.and.returnValue(
    of({ ...new BenefitResponse(), benefitRequestId: 1234, referenceNo: 1234, message: { english: '', arabic: '' } })
  );
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getAnnuityBenefits.and.returnValue(of([new Benefits()]));
  manageBenefitServiceSpy.getAnnuityBenefitCalculations.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.updateForAnnuityBenefit.and.returnValue(of(new BenefitResponse()));
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(
    of({
      ...new PersonalInformation(),
      identity: [],
      fromJsonToObject: json => json,
      name: {
        english: { name: '' },
        guardianPersonId: 2323,
        arabic: { firstName: '', secondName: '', thirdName: '', familyName: '', fromJsonToObject: json => json },
        fromJsonToObject: json => json
      }
    })
  );
  const benefitPropertyServiceSpy = jasmine.createSpyObj<BenefitPropertyService>('BenefitPropertyService', [
    'setEligibleDependentAmount',
    'setBenType',
    'getAnnuityStatus',
    'setAnnuityStatus',
    'getReferenceNo',
    'setBenefitAppliedMessage',
    'setReferenceNo'
  ]);
  benefitPropertyServiceSpy.setEligibleDependentAmount.and.returnValue();
  benefitPropertyServiceSpy.setBenefitAppliedMessage.and.returnValue();
  benefitPropertyServiceSpy.setBenType.and.returnValue();
  benefitPropertyServiceSpy.getAnnuityStatus.and.returnValue('fgf');
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getImprisonmentDetails',
    'imprisonmentDetails'
  ]);
  dependentServiceSpy.getImprisonmentDetails.and.returnValue(of(new ImprisonmentDetails()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [LumpsumAppplyScComponent],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BenefitRequestsService, useValue: benefitRequestsServiceSpy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: DependentService, useValue: dependentServiceSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        // { provide: BenefitRequestsService, useValue: benefitRequestsServicespy  },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: BenefitPropertyService, useValue: benefitPropertyServiceSpy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LumpsumAppplyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      //spyOn(component, 'getImprisonmentDetails').and.callThrough();
      spyOn(component, 'getPersonDetails').and.callThrough();
      spyOn(component, 'getDependents').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('isNonocc', () => {
      component.isNonOcc = true;
      component.callPensionDocsApi = true;
      component.benefitType = BenefitType.nonOccLumpsumBenefitType;
      component.pensionTransactionId = '302010';
      expect(component.isNonOcc).toBeTrue();
      component.getBenefitCalculationByType(component.benefitType);
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
  xdescribe('saveDependent', () => {
    it('should sent input to dependent component to  trigger save dependent', () => {
      const dependents = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.saveDependent(dependents);
      expect(component.saveDependent).toBeDefined();
    });
  });
  describe('navigateToPrevAdjustment', () => {
    it('should  navigateToPrevAdjustment', () => {
      // const dependents = {...new HeirDetailsRequest(), personId: 1234, fromJsonToObject: json => json, setValidatedValues: () => {}, setSelectedStatus: () => {}};
      component.navigateToPrevAdjustment();
      spyOn(component.router, 'navigate').and.callThrough();
      expect(component.navigateToPrevAdjustment).toBeDefined();
    });
  });
  describe('submitBenefitDetails', () => {
    it('should submit benefit details', () => {
      // spyOn(component, 'applyBenefit');
      // component.submitBenefitDetails();
      expect(component.submitBenefitDetails).toBeDefined();
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
  /* describe('showAddContactWizard', () => {
    it('should showAddContactWizard', () => {
      const event = true;
      spyOn(component, 'showAddContactWizard').and.callThrough();
      component.showAddContactWizard(event);
      fixture.detectChanges();
      expect(component.showAddContactWizard).toBeDefined();
    });
  });
 describe('getImprisonmentDetails', () => {
    it('should getImprisonmentDetails', () => {
      const sin = 230066639;
      const benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.getImprisonmentDetails(sin, benefitType);
      spyOn(component, 'getImprisonmentDetails').and.callThrough();
      fixture.detectChanges();
      spyOn(component.manageBenefitService, 'getAnnuityBenefits').and.returnValue(of([new Benefits()]));
      component.manageBenefitService.getAnnuityBenefits(sin).subscribe(response => {
        expect(response).toBeTruthy();
        component.annuitybenefits = response;
      });
      expect(component.getImprisonmentDetails).toBeDefined();
    });
  });*/
  describe('getEligibilityDetails', () => {
    it('should getEligibilityDetails', () => {
      const sin = 230066639;
      component.isValidator = true;
      expect(component.isValidator).toBeTrue();
      component.getEligibilityDetails(sin);
      expect(component.getEligibilityDetails).toBeDefined();
    });
    it('getBenefitCalculationByType', () => {
      component.getBenefitCalculationByType('67665665');
      //spyOn(component.manageBenefitService,'getAnnuityBenefitCalculations').and.returnValue(of(new BenefitDetails()));
      expect(component.getBenefitCalculationByType).toBeDefined();
    });
    it('getBenefitCalculationByType', () => {
      component.getBenefitCalculationByType('67665665');
      // spyOn(component.manageBenefitService,'getAnnuityBenefitCalculations').and.returnValue(throwError(genericError));
      expect(component.getBenefitCalculationByType).toBeDefined();
    });
  });
  describe('requestDateChanged', () => {
    it('should requestDateChanged', () => {
      const date = new GosiCalendar();
      component.requestDateChanged(date);
      component.benefitRequestsService
        .getEligibleBenefitByBenefitType(component.socialInsuranceNo, component.benefitType, date)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      expect(component.requestDateChanged).toBeDefined();
    });
  });
  xdescribe('getDependents', () => {
    it('should getDependents', () => {
      const sin = 230066639;
      const benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.getDependents(sin, benefitType);
      spyOn(component, 'getDependents').and.callThrough();
      fixture.detectChanges();
      component.dependentService.getDependentDetails(sin, benefitType, null, null).subscribe(response => {
        expect(response).toBeTruthy();
      });
      expect(component.getDependents).toBeDefined();
    });
  });
  describe('goToAddHeir', () => {
    it('should goToAddHeir', () => {
      const heirData = new HeirDetailsRequest();
      const config = new TabsetConfig();
      // const renderer = new Renderer2();
      // const elementRef = new ElementRef(1);
      // const tabset = new TabsetComponent(config, renderer, elementRef);
      const wiardComp = new ProgressWizardDcComponent();
      // component.goToAddHeir(heirData, tabset, wiardComp);
      spyOn(component, 'goToAddHeir').and.callThrough();
      fixture.detectChanges();
      expect(component.goToAddHeir).toBeDefined();
    });
  });
  describe('initialiseTabWizards', () => {
    it('should initialise tab wizards', () => {
      const benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.initialiseTabWizards(benefitType);
      expect(component.initialiseTabWizards).toBeDefined();
    });
  });
  describe('showCancelTemplate', () => {
    it('should show cancel template', () => {
      component.showCancelTemplate();
      expect(component.showCancelTemplate).toBeDefined();
    });
  });
  describe('showFormValidation', () => {
    it('should show form validation', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.showFormValidation();
      expect(component.showFormValidation).toBeDefined();
    });
  });

  describe('cancelTransaction', () => {
    it('should handle cancellation of transaction', () => {
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('clearAlerts', () => {
    it('should clear alerts', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.clearAlerts();
      expect(component.clearAlerts).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should get Screen Size', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
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
  describe('clearAllAlerts', () => {
    it('should clear all alerts', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.clearAllAlerts();
      expect(component.clearAllAlerts).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component, 'clearAllAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
