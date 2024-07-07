/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CurrencySar,
  RouterDataToken,
  RouterData,
  LookupService,
  ExchangeRateService,
  CurrencyToken,
  LanguageToken,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';
import {
  LookupServiceStub,
  ExchangeRateServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RejectedohDetailedBillScComponent } from './rejected-oh-detailed-bill-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RejectedohDetailedBillScComponent', () => {
  let component: RejectedohDetailedBillScComponent;
  let fixture: ComponentFixture<RejectedohDetailedBillScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [RejectedohDetailedBillScComponent],
      providers: [
        FormBuilder,
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedohDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    component.initialStartDate = '2019-05-01';
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
      component.getRejectedOHDetailsOnSelectedDate('2020-06-01');
      expect(component.itemizedBills).not.toEqual(null);
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
      component.currencyValueChanges(currency1.code.value.english);
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
      component.currencyValueChanges(currency2.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
    it('getDashboardBillDetailsForLatefee', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToDashboardBill').and.callThrough();
      component.getDashboardBillDetailsForRejectedOH();
      component.getBillBreakUpDetails(555);
      expect(component.billDetails).not.toEqual(null);
    });
  });
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to DEBIT-ADJUSTMENTS ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabSelected('BILLING.DEBIT-ADJUSTMENTS');
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
      component.goToNewTabSelected('BILLING.CONTRIBUTION');
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
      component.goToNewTabSelected('BILLING.RECEIPTS-AND-CREDITS');
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
      component.goToNewTabSelected('BILLING.LATE-PAYMENT-FEES');
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
  describe('test suite for getselectPageNo ', () => {
    it('getselectPageNo', () => {
      spyOn(component, 'getItemizedRejectedOH').and.callThrough();
      component.getselectPage(1);
      component.pageNo = 1;
      expect(component.getItemizedRejectedOH).toHaveBeenCalled();
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printRejectedOhDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadRejectedOhDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
});
