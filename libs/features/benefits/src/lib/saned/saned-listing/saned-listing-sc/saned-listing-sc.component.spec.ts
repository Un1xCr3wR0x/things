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
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  AlertService,
  CoreContributorService,
  BilingualText
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  benefitHistory,
  ManagePersonServiceStub,
  ModalServiceStub,
  uiBenefits,
  uiHistory,
  AlertServiceStub,
  ManageBenefitMockService,
  ActivatedRouteStub
} from 'testing';
import { SanedListingScComponent } from './saned-listing-sc.component';
import {
  Benefits,
  ActiveBenefits,
  BenefitResponse,
  UiBenefitsService,
  ManageBenefitService,
  SanedBenefitService,
  AdjustmentService,
  BypassReassessmentService
} from '../../../shared';
import { Router, ActivatedRoute } from '@angular/router';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('SanedListingScComponent', () => {
  let component: SanedListingScComponent;
  let fixture: ComponentFixture<SanedListingScComponent>;
  /*const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'identifier'
  ]);
  adjustmentServiceSpy.identifier = 1234;*/
  const contributorServiceSpy = jasmine.createSpyObj<CoreContributorService>('CoreContributorService', [
    'selectedSIN',
    'nin',
    'personId'
  ]);

  contributorServiceSpy.selectedSIN = 12345678;
  contributorServiceSpy.nin = 12345678;
  contributorServiceSpy.personId = 1234543;
  const uiBenefitServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', ['getUIBenefits']);
  uiBenefitServiceSpy.getUIBenefits.and.returnValue(of({ ...new Benefits(), uiBenefits }));
  const sanedBenefitServiceSpy = jasmine.createSpyObj<SanedBenefitService>('SanedBenefitService', [
    'getBenefitsWithStatus',
    'getActiveUiBenefits'
  ]);
  sanedBenefitServiceSpy.getBenefitsWithStatus.and.returnValue(
    of([
      {
        ...new ActiveBenefits(1234, 1234, { english: '', arabic: '' }, 1234),
        status: { english: '', arabic: '' },
        setBenefitStartDate: null,
        benefitType: { english: '', arabic: '' }
      }
    ])
  );
  sanedBenefitServiceSpy.getActiveUiBenefits.and.returnValue(
    of([
      {
        ...new ActiveBenefits(1234, 1234, { english: '', arabic: '' }, 1234),
        status: { english: '', arabic: '' },
        setBenefitStartDate: null,
        benefitType: { english: '', arabic: '' }
      }
    ])
  );
  const bypassReaassessmentServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReassessmentService', [
    'appealMedicalAssessment',
    'accceptMedicalAssessment'
  ]);
  bypassReaassessmentServiceSpy.appealMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReaassessmentServiceSpy.accceptMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, BrowserDynamicTestingModule],
      declarations: [SanedListingScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        //{ provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BypassReassessmentService, useValue: bypassReaassessmentServiceSpy },
        { provide: CoreContributorService, useValue: contributorServiceSpy },
        { provide: ManageBenefitService, useClass: ManageBenefitMockService },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: UiBenefitsService, useValue: uiBenefitServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanedListingScComponent);
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

  describe('getUIBenefits', () => {
    it('should getUIBenefits', () => {
      component.getUIBenefits(230066639);
      expect(component.uibenefits).not.toEqual(null);
    });
  });

  describe('getAnnuityBenefits', () => {
    it('should getAnnuityBenefits', () => {
      component.getAnnuityBenefits(230066639);
      expect(component.annuitybenefits).not.toEqual(null);
    });
  });

  describe('getBenefitsWithStatus', () => {
    it('should getBenefitsWithStatus', () => {
      component.getBenefitsWithStatus();
      expect(component.activeBenefitsList).not.toEqual(null);
    });
  });
  it('should cancelVic', () => {
    component.cancelVic();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
  it('should directPaymentNavigate', () => {
    component.directPaymentNavigate();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should adjustmentDetailsNavigate', () => {
    component.personId = 1234;
    component.registrationNo = 1234;
    component.socialInsuranceNo = 1234;
    component.adjustmentDetailsNavigate();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should onAppeal', () => {
    component.socialInsuranceNo = 1234;
    component.onAppeal({ benefitRequestId: 1234, assessmentId: 1234 });
    expect(component.benefitResponse).not.toEqual(null);
  });
  it('should getContributorPersonalDetails', () => {
    component.getContributorPersonalDetails();
    expect(component.person).not.toEqual(null);
  });
  it('should routeToPension', () => {
    component.socialInsuranceNo = 1234;
    component.routeToPension({ benefitRequestId: 1234, assessmentId: 1234 });
    expect(component.benefitResponse).not.toEqual(null);
  });
  //SanedbaseComponent
  /* describe('getViewEligibilityPopupData', () => {
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'',arabic:''}};
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Unemployment Insurance',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Unemployment Insurance');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Woman Lumpsum Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Woman Lumpsum Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Retirement Pension Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Retirement Pension Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Retirement Lumpsum Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Retirement Lumpsum Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Early Retirement Pension Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Early Retirement Pension Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Non-Occupational Disability Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Non-Occupational Disability Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Non-Occupational Disability Lumpsum Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Non-Occupational Disability Lumpsum Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Non-Occupational Disability Pension Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Non-Occupational Disability Pension Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Jailed Contributor Pension Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Jailed Contributor Pension Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Jailed Contributor Lumpsum Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Jailed Contributor Lumpsum Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Retirement Pension Benefit (Hazardous Occupation)',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Retirement Pension Benefit (Hazardous Occupation)');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Retirement Lumpsum Benefit (Hazardous Occupation)',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Retirement Lumpsum Benefit (Hazardous Occupation)');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Heir Lumpsum Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Heir Lumpsum Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Heir Pension Benefit',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Heir Pension Benefit');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
    it('should  getViewEligibilityPopupData', () => {
      const benefit = {...new Benefits,benefitType:{english:'Funeral grant',arabic:''}};
      expect(benefit.benefitType.english).toEqual('Funeral grant');
      component.getViewEligibilityPopupData(benefit);
      expect(component.getViewEligibilityPopupData).toBeDefined();
    });
  });*/
});
