import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitRecalculationScComponent } from './benefit-recalculation-sc.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterDataToken, RouterData, LanguageToken, ApplicationTypeToken, DocumentService } from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoaderStub,
  ModalServiceStub,
  ActivatedRouteStub,
  ManagePersonServiceStub,
  DocumentServiceStub
} from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation, BenefitDetails } from '../../../../shared';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import {
  ManageBenefitService,
  AnnuityResponseDto,
  BenefitRecalculation,
  BenefitDetails
} from '@gosi-ui/features/benefits/lib/shared';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation, BenefitDetails } from '../../../..';

describe('BenefitRecalculationScComponent', () => {
  let component: BenefitRecalculationScComponent;
  let fixture: ComponentFixture<BenefitRecalculationScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation',
    'getBenefitCalculationDetailsByRequestId'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [BenefitRecalculationScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitRecalculationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getBenefits', () => {
    component.personId = 13316198;
    component.requestId = 410588617;
    component.getBenefits();
    expect(component.benefitDetails).not.toEqual(null);
  });
  it('should getBenefitRecalculation', () => {
    component.personId = 13316198;
    component.requestId = 410588617;
    component.getBenefitRecalculation();
    expect(component.benefitRecalculationDetails).not.toEqual(null);
  });
});
