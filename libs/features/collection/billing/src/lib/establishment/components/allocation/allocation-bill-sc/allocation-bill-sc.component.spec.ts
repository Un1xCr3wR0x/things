/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBillScomponent } from './allocation-bill-sc.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BillDashboardService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import {
  BillDashboardServiceStub,
  ExchangeRateServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing/mock-services';
import { RouterTestingModule } from '@angular/router/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock } from 'testing';
import {
  RouterDataToken,
  LanguageToken,
  CurrencyToken,
  ApplicationTypeToken,
  RegistrationNoToken
} from '@gosi-ui/core/lib/tokens';
import { RegistrationNumber, RouterData } from '@gosi-ui/core/lib/models';

import { BehaviorSubject } from 'rxjs';
import { ExchangeRateService } from '@gosi-ui/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AllocationBillScComponent', () => {
  let component: AllocationBillScomponent;
  let fixture: ComponentFixture<AllocationBillScomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [AllocationBillScomponent],
      providers: [
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        FormBuilder,
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ExchangeRateService,
          useClass: ExchangeRateServiceStub
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationBillScomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should  form for the date picker', () => {
    component.ngOnInit();
    expect(component.allocationDetails).toBeTruthy();
    expect(component.allocationForm).toBeTruthy();
  });
  describe('test suite for getPreviousMonthSummary', () => {
    it('It should get the previous month bill summary details', () => {
      component.idNumber = 504096157;
      component.getallocationBillNumber(504096157);
      expect(component.allocationDetails).not.toEqual(null);
    });
  });
  describe('test suite for selectAllocationStartDate', () => {
    it('It should fetch the allocation start date', () => {
      component.idNumber = 504096157;
      component.selectAllocationStartDate('05-10-2020');
      component.getallocationBillNumber(504096157);
      expect(component.allocationDetails).not.toEqual(null);
    });
  });
});
