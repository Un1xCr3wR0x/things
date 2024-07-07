import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterDataToken,
  RouterData
} from '@gosi-ui/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateLoaderStub, ActivatedRouteStub, ModalServiceStub } from 'testing';
import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation } from '../../../../shared';

import { DisabilityAssessmentScComponent } from './disability-assessment-sc.component';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation } from '../../../..';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('DisabilityAssessmentScComponent', () => {
  let component: DisabilityAssessmentScComponent;
  let fixture: ComponentFixture<DisabilityAssessmentScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
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
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      declarations: [DisabilityAssessmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
