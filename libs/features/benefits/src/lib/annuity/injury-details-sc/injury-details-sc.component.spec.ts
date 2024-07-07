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
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreBenefitService,
  CoreActiveBenefits
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, ModalServiceStub, TranslateLoaderStub } from 'testing';
import { InjuryDetailsScComponent } from './injury-details-sc.component';
import { InjuryService, InjuryDetails, InjurySummary, DisabilityTimeline } from '../../shared';
describe('InjuryDetailsScComponent', () => {
  let component: InjuryDetailsScComponent;
  let fixture: ComponentFixture<InjuryDetailsScComponent>;
  const injuryServicespy = jasmine.createSpyObj<InjuryService>('injuryService', [
    'getInjuryDetails',
    'getInjurySummary',
    'getDisabilityDetails'
  ]);
  injuryServicespy.getInjuryDetails.and.returnValue(of(new InjuryDetails()));
  injuryServicespy.getInjurySummary.and.returnValue(of(new InjurySummary()));
  injuryServicespy.getDisabilityDetails.and.returnValue(of(new DisabilityTimeline()));
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'getSavedActiveBenefit',
    'getInjuryId'
  ]);
  coreBenefitServiceSpy.getInjuryId.and.returnValue(2323);
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
      declarations: [InjuryDetailsScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: InjuryService, useValue: injuryServicespy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
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
    fixture = TestBed.createComponent(InjuryDetailsScComponent);
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
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('getDisabilityDetails', () => {
    it('should getDisabilityDetails', () => {
      component.getDisabilityDetails();
      component.injuryService.getInjuryDetails();
      expect(component.injuryDetails).not.toBeNull();
    });
  });
});
