/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBillVicScomponent } from './allocation-bill-vic-sc.component';
import { FormBuilder } from '@angular/forms';
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
import { RouterDataToken, LanguageToken, CurrencyToken, ApplicationTypeToken } from '@gosi-ui/core/lib/tokens';
import { RouterData } from '@gosi-ui/core/lib/models';

import { BehaviorSubject } from 'rxjs';
import { ExchangeRateService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AllocationBillScComponent', () => {
  let component: AllocationBillVicScomponent;
  let fixture: ComponentFixture<AllocationBillVicScomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AllocationBillVicScomponent],
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
    fixture = TestBed.createComponent(AllocationBillVicScomponent);
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
    expect(component.getVicCreditDetails).not.toEqual(null);
  });
  describe('test suite for getVicAllocationDetails', () => {
    it('It should get the vic allocation details', () => {
      component.billNo = 1334;
      component.sinNo = 420985290;
      component.getVicAllocationDetails();
      expect(component.allocationDetails).not.toEqual(null);
    });
  });
  describe('test suite for getVicCreditDetails', () => {
    it('It should get the vic credit details', () => {
      component.dateSelected = '05-10-2020';
      component.sinNo = 420985290;
      component.getVicCreditDetails();
      expect(component.billNo).not.toEqual(null);
    });
  });
  describe('test suite for setContributorName', () => {
    it('It should set contributor Name', () => {
      component.setContributorName(component.allocationDetails);
      expect(component.contributorName).not.toEqual(null);
    });
  });
  describe('test suite for getvICAllocationValues', () => {
    it('It should set vic allocation values', () => {
      component.getvICAllocationValues(component.allocationDetails);
      expect(component.creditSummaryValue).not.toEqual(null);
    });
  });
  describe('test suite for selectAllocationStartDate', () => {
    it('It should fetch the allocation start date', () => {
      component.selectAllocationStartDate('05-10-2020');
      component.getVicCreditDetails();
      expect(component.allocationDetails).not.toEqual(null);
    });
  });
  describe('navigateBack', () => {
    it('navigate back to  screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBack();
      expect(component.billingRoutingService.navigateToVicBillHistory).not.toEqual(null);
    });
    it(' goToNewTab', () => {
      component.goToNewTab('5');
      component.selectedTab = '5';
      expect(component.selectedTab).not.toEqual(null);
    });
  });
});
