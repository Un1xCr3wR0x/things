import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CurrencySar,
  CurrencyToken,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BillingConstants } from '../../../../shared/constants';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  DetailedBillServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';

import { ViolationDetailedBillScComponent } from './violation-detailed-bill-sc.component';

describe('ViolationDetailedBillScComponent', () => {
  let component: ViolationDetailedBillScComponent;
  let fixture: ComponentFixture<ViolationDetailedBillScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ViolationDetailedBillScComponent],
      providers: [
        FormBuilder,
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
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
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printViolationDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
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
  });
  describe('test suite for getInstallmentDetailsOnSelectedDate', () => {
    it('It should get the getInstallmentDetailsOnSelectedDate', () => {
      spyOn(component.router, 'navigate');
      //component.idNumber = 504096157;
      component.getViolationDetailsOnSelectedDate('2019-09-01');
      expect(component.itemizedBills).not.toEqual(null);
      expect(component.getTabsetValue).not.toEqual(null);
    });
  });
  describe('on navigate to new tab', () => {
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.DEBIT-ADJUSTMENTS');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.RECEIPTS-AND-CREDITS');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.CONTRIBUTION');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.LATE-PAYMENT-FEES');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.REJECTED-OH-CLAIMS');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('navToNewTabSelected', () => {
      component.selectedDateValue = '2019-04-01';
      component.isMofFlag = true;
      component.billViolationNumber = 177;
      component.regNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.navToNewTabSelected('BILLING.INSTALLMENT');
      component.routeUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
      expect(component.routeUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.routeUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDateValue,
            billNumber: component.billViolationNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.regNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadViolationDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
  describe('test suite for getBillingHeaderDetail', () => {
    it('It should get the getBillingHeaderDetail', () => {
      spyOn(component.detailedBillService, 'getBillingHeader').and.callThrough();
      component.getBillingHeaderDetail(504096157);
      expect(component.establishmentHeaderDetails).not.toEqual(null);
      expect(component.detailedBillService.getBillingHeader).toHaveBeenCalledWith(504096157, true);
    });
  });
});
