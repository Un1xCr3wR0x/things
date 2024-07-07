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
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  Role,
  RouterData,
  RouterDataToken,
  AuthTokenService,
  PersonWrapperDto
} from '@gosi-ui/core';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, ModalServiceStub, AuthTokenServiceStub } from 'testing';
import { IndividualBenefitsScComponent } from '..';
import {
  ActiveBenefits,
  BenefitResponse,
  Benefits,
  BypassReassessmentService,
  ManageBenefitService,
  SanedBenefitService,
  UiBenefitsService,
  BenefitConstants
} from '../../shared';

describe('IndividualBenefitsScComponent', () => {
  let component: IndividualBenefitsScComponent;
  let fixture: ComponentFixture<IndividualBenefitsScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

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
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getOccBenefits',
    'getAnnuityBenefits',
    'getPersonIdentifier'
  ]);
  manageBenefitServiceSpy.getPersonIdentifier.and.returnValue(of(new PersonWrapperDto()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getAnnuityBenefits.and.returnValue(of([new Benefits()]));
  manageBenefitServiceSpy.getOccBenefits.and.returnValue(of(new Benefits()));
  const uiBenefitServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', ['getUIBenefits']);
  uiBenefitServiceSpy.getUIBenefits.and.returnValue(of(new Benefits()));
  const bypassReassessmentServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReaassessmentService', [
    'appealMedicalAssessment',
    'accceptMedicalAssessment'
  ]);
  const authTokenServiceSpy = jasmine.createSpyObj<AuthTokenService>('AuthTokenService', ['getIndividual']);
  authTokenServiceSpy.getIndividual.and.returnValue(32323);
  bypassReassessmentServiceSpy.appealMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReassessmentServiceSpy.accceptMedicalAssessment.and.returnValue(of(new BenefitResponse()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [IndividualBenefitsScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: BypassReassessmentService, useValue: bypassReassessmentServiceSpy },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: AuthTokenService, useValue: authTokenServiceSpy },
        { provide: UiBenefitsService, useValue: uiBenefitServiceSpy },
        { provide: SanedBenefitService, useValue: sanedBenefitServiceSpy },

        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },

        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualBenefitsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' setIdentifier', () => {
    it('should  setIdentifier', () => {
      const identifier = 3455466;
      component.setIdentifier(identifier);
      expect(component.setIdentifier).toBeDefined();
    });
  });
  describe(' getBenefitsWithStatus', () => {
    it('should  getBenefitsWithStatus', () => {
      component.getBenefitsWithStatus();
      expect(component.getBenefitsWithStatus).toBeDefined();
    });
  });
  describe(' getAnnuityBenefits', () => {
    it('should  getAnnuityBenefits', () => {
      component.nationalIndcator = 2344545;
      component.getAnnuityBenefits(component.nationalIndcator);
      expect(component.getAnnuityBenefits).toBeDefined();
    });
  });
  describe('getSystemParam', () => {
    it('should  getSystemParam', () => {
      component.getSystemParam();
      expect(component.getSystemParam).toBeDefined();
    });
  });
  describe('getUIBenefits', () => {
    it('should getUIBenefits', () => {
      component.nationalIndcator = 2344545;
      component.getUIBenefits(component.nationalIndcator);
      expect(component.getUIBenefits).toBeDefined();
    });
  });
  describe('getOccbenefits', () => {
    it('should  getOccbenefits', () => {
      component.getOccbenefits();
      expect(component.getOccbenefits).toBeDefined();
    });
  });
  describe('checkIfValidator', () => {
    it('should  checkIfValidator', () => {
      const assignedRole = Role.VALIDATOR;
      component.checkIfValidator(assignedRole);
      expect(component.checkIfValidator).toBeDefined();
    });
  });
  describe('onAppeal', () => {
    it('should  onAppeal', () => {
      const assessmentValues = 23344554;
      component.onAppeal(assessmentValues);
      expect(component.onAppeal).toBeDefined();
    });
  });
  describe('routeToPension', () => {
    it('should routeToPension', () => {
      const assessmentValues = 23344554;
      component.routeToPension(assessmentValues);
      expect(component.router.navigate).toBeDefined();
      component.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY]);
      expect(component.routeToPension).toBeDefined();
    });
  });
});
