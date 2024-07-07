/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ExchangeRateService,
  LookupService,
  CurrencySar,
  RouterDataToken,
  RouterData,
  CurrencyToken,
  LanguageToken,
  bindToObject,
  ExchangeRate,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExchangeRateServiceStub,
  LookupServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing/mock-services';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { FormBuilder } from '@angular/forms';
import { ContributionDetailedBillScComponent } from './contribution-detailed-bill-sc';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { exchangeRateMockData, requestListMockData } from 'testing/test-data/features/billing';
import { genericError } from 'testing';
describe('ContributionDetailedBillScComponent', () => {
  let component: ContributionDetailedBillScComponent;
  let fixture: ComponentFixture<ContributionDetailedBillScComponent>;
  //let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ContributionDetailedBillScComponent],
      providers: [
        FormBuilder,
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
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
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
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
    fixture = TestBed.createComponent(ContributionDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    component.initialStartDate = '2019-03-01';
    component.isMofFlag = false;
    component.idNumber = 502351249;
    component.selectedDate = '2019-04-01';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for ngOninit', () => {
    it('It should check the inital conditions for the component', () => {
      component.isMofFlag = true;
      component.ngOnInit();
      expect(component.currentCurrency).not.toEqual(null);
      expect(component.gccCurrencyList).not.toEqual(null);
      expect(component.currentCurrency).not.toEqual(null);
      expect(component.entityType).toBe('ESTABLISHMENT');
      expect(component.isAdmin).toBeTruthy();
    });
  });

  describe('test suite for getBillBreakUpService', () => {
    it('It should get the bill breakup details', () => {
      component.getBillBreakUpService(500965975);
      expect(component.billDetails).not.toEqual(null);
    });
  });

  describe('test suite for getItemizedContributionDetails', () => {
    it('It should get the itemized bill details', () => {
      component.billNumber = 77;
      component.getItemizedContributionDetails();
      expect(component.contributionDetails).not.toEqual(undefined);
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
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to DEBIT-ADJUSTMENTS ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabSections('BILLING.DEBIT-ADJUSTMENTS');
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
      component.goToNewTabSections('BILLING.CONTRIBUTION');
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
      component.goToNewTabSections('BILLING.RECEIPTS-AND-CREDITS');
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
      component.goToNewTabSections('BILLING.LATE-PAYMENT-FEES');
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
    it('should toggle to rejectedOH ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabSections('BILLING.REJECTED-OH-CLAIMS');
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
    it('should toggle to installment ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabSections('BILLING.INSTALLMENT');
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
    it('should toggle to violation ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabSections('BILLING.VIOLATIONS');
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
  describe('test suite for mofCalDatechanged', () => {
    it('It should navigate with new date selected', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillBreakup').and.callThrough();
      component.mofCalDatechanged('2019-09-01');
      expect(component.detailedBillService.getBillBreakup).toHaveBeenCalled();
    });
    it('It throw err for getBillNumber', () => {
      spyOn(component.detailedBillService, 'getBillNumber').and.returnValue(throwError(genericError));
      component.mofCalDatechanged('2019-09-01');
      expect(component.isBillNumber).toBe(true);
      expect(component.errorMessage).not.toBeNull();
    });
  });
  describe('test suite for getSortingParams', () => {
    it('It should navigate with new date selected', () => {
      spyOn(component, 'getItemizedContributionDetails').and.callThrough();
      component.getSortingParams(requestListMockData);
      expect(component.getItemizedContributionDetails).toHaveBeenCalled();
    });
    it('getContributorSearchValue', () => {
      spyOn(component, 'getItemizedContributionDetails').and.callThrough();
      component.getContributorSearchValue(1522);
      component.pageNo = 0;
      expect(component.getItemizedContributionDetails).toHaveBeenCalled();
    });
    it('getselectPageNo', () => {
      spyOn(component, 'getItemizedContributionDetails').and.callThrough();
      component.getselectPageNo(1);
      component.pageNo = 1;
      expect(component.getItemizedContributionDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getDashboardBillDetailsForContribution', () => {
    it('It should getDashboardBillDetailsForContributione', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToMofDetailedBill').and.callThrough();
      component.isMofFlag = true;
      component.getDashboardBillDetailsForContribution();
      component.getBillBreakUpService(525525555);
      expect(component.contributionDetails).not.toEqual(null);
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printContributorDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadContributorDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
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
      spyOn(component, 'getTabsetValue');
      spyOn(component.detailedBillService, 'getInstallmentDetails').and.returnValue(throwError(genericError));
      component.getInstallmentDetails();
      // expect(component.installmentDetails).toEqual(null);
      expect(component.getTabsetValue).toHaveBeenCalled();
    });
  });

  describe('test suite for getContributionBillDetailsOnSelectedDate', () => {
    it('It should get the getContributionBillDetailsOnSelectedDate', () => {
      spyOn(component.router, 'navigate');
      component.getContributionBillDetailsOnSelectedDate('Tue Dec 01 2020 00:00:00 GMT+0300 (Arabian Standard Time)');
      component.getInstallmentDetails();
      component.getViolationDetails();
      expect(component.billDetails).not.toEqual(null);
      expect(component.getTabsetValue).not.toEqual(null);
      expect(component.billNumber).not.toEqual(null);
    });
    it('It should get the getContributionBillDetailsOnSelectedDate', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillNumber').and.returnValue(throwError(genericError));
      //component.idNumber = 504096157;
      component.getContributionBillDetailsOnSelectedDate('Tue Dec 01 2020 00:00:00 GMT+0300 (Arabian Standard Time)');
      component.getInstallmentDetails();
      component.getViolationDetails();
      expect(component.errorMessage).not.toBeNull();
    });
  });
  describe('getConversionRate', () => {
    it('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
      component.currencyValueChange('SAR');
      // expect(component.currencyDetails.exchangeRate).not.toBeNull();
      expect(component.exchangeRate).toBeDefined();
      expect(component.currencyType).toBeDefined();
    });
  });
});
