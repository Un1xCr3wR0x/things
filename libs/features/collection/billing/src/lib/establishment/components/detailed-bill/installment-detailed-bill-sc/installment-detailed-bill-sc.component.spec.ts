import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  bindToObject,
  CurrencyToken,
  ExchangeRate,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  DetailedBillServiceStub,
  exchangeRateMockData,
  ExchangeRateServiceStub,
  genericError,
  LookupServiceStub,
  ReportStatementServiceStub
} from 'testing';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';

import { InstallmentDetailedBillScComponent } from './installment-detailed-bill-sc.component';

describe('InstallmentDetailedBillScComponent', () => {
  let component: InstallmentDetailedBillScComponent;
  let fixture: ComponentFixture<InstallmentDetailedBillScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [InstallmentDetailedBillScComponent],
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
    fixture = TestBed.createComponent(InstallmentDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    (component.selectedDateValue = '2019-04-01'), (component.initialStartDate = '2019-03-01');
    component.isMofFlag = false;
    component.idNumber = 502351249;
    component.billStartDate = '2019-04-01';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for getInstallmentDetailsOnSelectedDate', () => {
    it('It should get the getInstallmentDetailsOnSelectedDate', () => {
      spyOn(component.router, 'navigate');
      // spyOn(component.detailedBillService, 'getBillNumber');
      //component.idNumber = 504096157;
      component.getInstallmentDetailsOnSelectedDate('2019-09-01');
      expect(component.itemizedBills).not.toEqual(null);
      expect(component.getTabsetDetails).not.toEqual(null);
      // expect(component.detailedBillService.getBillNumber).toHaveBeenCalled();
    });
    it('It should get the getInstallmentDetailsOnSelectedDate', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillNumber').and.returnValue(throwError(genericError));
      //component.idNumber = 504096157;
      component.getInstallmentDetailsOnSelectedDate('2019-09-01');
      expect(component.errorMessage).not.toBeNull();
      // expect(component.itemizedBills.length).toEqual(null);
      // expect(component.getTabsetDetails).toEqual(null);
      // expect(component.detailedBillService.getBillNumber).toHaveBeenCalled();
    });
  });
  describe('test suite for getDashboardBillDetailsForContribution', () => {
    it('It should getDashboardBillDetailsForContributione', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToMofDetailedBill').and.callThrough();
      component.isMofFlag = false;
      component.getDashboardBillItemsForRejectedOH();
      component.getBillBreakUp(525525555);
      expect(component.installmentDetails).not.toEqual(null);
    });
  });
  describe('test suite for getInstallmentDetails', () => {
    it('It should getInstallmentDetails', () => {
      spyOn(component.detailedBillService, 'getInstallmentDetails').and.callThrough();
      component.getInstallmentDetails();
      expect(component.installmentDetails).not.toEqual(null);
      expect(component.detailedBillService.getInstallmentDetails).toHaveBeenCalled();
    });
    it('It should throw err for getInstallmentDetails', () => {
      spyOn(component, 'getTabsetDetails');
      spyOn(component.detailedBillService, 'getInstallmentDetails').and.returnValue(throwError(genericError));
      component.getInstallmentDetails();
      // expect(component.installmentDetails).toEqual(null);
      expect(component.getTabsetDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to DEBIT-ADJUSTMENTS ', () => {
      spyOn(component.router, 'navigate');
      component.onNavToNewTab('BILLING.DEBIT-ADJUSTMENTS');
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
      component.onNavToNewTab('BILLING.CONTRIBUTION');
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
      component.onNavToNewTab('BILLING.RECEIPTS-AND-CREDITS');
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
      component.onNavToNewTab('BILLING.LATE-PAYMENT-FEES');
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
    it('should toggle to rejectedOH', () => {
      spyOn(component.router, 'navigate');
      component.onNavToNewTab('BILLING.REJECTED-OH-CLAIMS');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/rejectedOH'],
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
    it('should toggle to installment', () => {
      spyOn(component.router, 'navigate');
      component.onNavToNewTab('BILLING.INSTALLMENT');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/installment'],
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
    it('should toggle to violation', () => {
      spyOn(component.router, 'navigate');
      component.onNavToNewTab('BILLING.VIOLATIONS');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/violation'],
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
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to contribution ', () => {
      spyOn(component.router, 'navigate');
      component.routeToAvailableTabs();
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
      expect(component.billDetails.totalContribution).not.toEqual(0);
    });
  });
  describe('getConversionRate', () => {
    it('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
      component.onCurrencyValueChange('SAR');
      // expect(component.currencyDetails.exchangeRate).not.toBeNull();
      expect(component.exchangeRateValue).toBeDefined();
      expect(component.currencyKeys).toBeDefined();
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printInstallmentDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadInstallmentDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
});
