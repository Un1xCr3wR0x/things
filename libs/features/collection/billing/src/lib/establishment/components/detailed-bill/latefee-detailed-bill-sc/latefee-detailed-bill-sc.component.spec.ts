/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LatefeeDetailedBillScComponent } from './latefee-detailed-bill-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CurrencySar,
  RouterDataToken,
  RouterData,
  LookupService,
  ExchangeRateService,
  CurrencyToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { DetailedBillService, ReportStatementService, BillDashboardService } from '../../../../shared/services';
import {
  LookupServiceStub,
  ExchangeRateServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub,
  BillDashboardServiceStub
} from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LatefeeDetailedBillScComponent', () => {
  let component: LatefeeDetailedBillScComponent;
  let fixture: ComponentFixture<LatefeeDetailedBillScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [LatefeeDetailedBillScComponent],
      providers: [
        FormBuilder,
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub },
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatefeeDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    component.initialStartDate = '2019-04-01';
    component.selectedDate = '2019-04-01';
    component.idNumber = 502351249;
    component.isMofFlag = false;
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for getPreviousMonthSummary', () => {
    it('It should get the previous month bill summary details', () => {
      component.idNumber = 504096157;
      component.billNumber = 155;
      component.getLatefeeBillDetailsOnSelectedDate('2020-06-01');
      expect(component.itemizedBillList).not.toEqual(null);
    });
  });
  describe('test suite for currencyChange', () => {
    it('It should get the exchange rate', () => {
      const currency1 = {
        label: 'AED',
        code: {
          value: {
            english: 'AED',
            arabic: ''
          },
          sequence: 1
        }
      };
      component.currencyValueChange(currency1.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
    it('It should get the exchange rate', () => {
      const currency2 = {
        label: 'SAR',
        code: {
          value: {
            english: CurrencySar.ENGLISH,
            arabic: ''
          },
          sequence: 1
        }
      };
      component.currencyValueChange(currency2.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
    it('getDashboardBillDetailsForLatefee', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToDashboardBill').and.callThrough();
      component.getDashboardBillDetailsForLatefee();
      component.getBillBreakUpServiceDetails(555);
      expect(component.billDetails).not.toEqual(null);
    });
  });
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to DEBIT-ADJUSTMENTS ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTab('BILLING.DEBIT-ADJUSTMENTS');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/adjustments'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billNumber: 177,
            mofFlag: false,
            registerNo: 502351249,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('should toggle to contribution ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTab('BILLING.CONTRIBUTION');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/contribution'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billNumber: 177,
            mofFlag: false,
            registerNo: 502351249,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('should toggle to receipt-credit ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTab('BILLING.RECEIPTS-AND-CREDITS');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/receipt-credit'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billNumber: 177,
            mofFlag: false,
            registerNo: 502351249,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('should toggle to lateFee ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTab('BILLING.LATE-PAYMENT-FEES');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/lateFee'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billNumber: 177,
            mofFlag: false,
            registerNo: 502351249,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printLatefeeDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadLatefeeDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
});
