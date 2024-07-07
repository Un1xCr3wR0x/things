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
  GosiCalendar,
  BilingualText
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  ManagePersonServiceStub,
  ModalServiceStub,
  TranslateLoaderStub
} from 'testing';
import { BenefitTypeScComponent } from './benefit-type-sc.component';
import {
  ManageBenefitService,
  BenefitRecalculation,
  AnnuityResponseDto,
  PaymentDetail
} from '@gosi-ui/features/benefits/lib/shared';

describe('BenefitTypeScComponent', () => {
  let component: BenefitTypeScComponent;
  let fixture: ComponentFixture<BenefitTypeScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation',
    'getPaymentDetails'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getPaymentDetails.and.returnValue(of(new PaymentDetail()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [BenefitTypeScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },

        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitTypeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' getMonths', () => {
    it('should  getMonths', () => {
      const startDate = new GosiCalendar();
      const EndDate = new GosiCalendar();
      component.getMonths(startDate, EndDate);
      expect(component.getMonths).toBeDefined();
    });
    it('should  getDateFormat', () => {
      component.getDateFormat('');
      expect(component.getDateFormat).toBeDefined();
    });
    it('should getAdjustmentReasons', () => {
      let list: BilingualText[] = [
        {
          arabic: 'الكويت',
          english: 'Region Kuwait'
        }
      ];
      component.getAdjustmentReasons(list);
      expect(component.getAdjustmentReasons).toBeDefined();
    });
  });
});
