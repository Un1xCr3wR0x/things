import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  bindToObject,
  CurrencySar,
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
import { BehaviorSubject, of } from 'rxjs';
import {
  DetailedBillServiceStub,
  exchangeRateMockData,
  ExchangeRateServiceStub,
  LookupServiceStub,
  receiptFilterDetailsMockData,
  ReportStatementServiceStub,
  requestListMockData
} from 'testing';
import { BillingConstants } from '../../../../shared/constants';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { ReceiptCreditDetailedBillScComponent } from './receipt-credit-detailed-bill-sc.component';

describe('ReceiptCreditDetailedBillScComponent', () => {
  let component: ReceiptCreditDetailedBillScComponent;
  let fixture: ComponentFixture<ReceiptCreditDetailedBillScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ReceiptCreditDetailedBillScComponent],
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
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptCreditDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    component.isMofFlag = false;
    component.idNumber = 502351249;
    component.selectedDate = '2019-04-01';
    component.initialStartDate = '2019-04-01';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for getPreviousMonthSummary', () => {
    it('It should get the previous month bill summary details', () => {
      component.idNumber = 504096157;
      component.getReceiptCreditDetailedBillDetailsOnSelectedDate('2019-09-01');
      expect(component.tabDetails).not.toEqual(null);
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
      component.currencyChange(currency1.code.value.english);
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
      component.currencyChange(currency2.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
  });
  describe('test suite for getReceiptCreditDetails', () => {
    it('It should get the receipt and credit  details', () => {
      component.idNumber = 504096157;
      component.getReceiptCreditDetails(new Date('2020-09-01'), new Date('2020-07-01'));
      expect(component.ReceiptDetails).not.toEqual(null);
    });
  });
  describe('test suite for goToNewTabs ', () => {
    it('should toggle to DEBIT-ADJUSTMENTS ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.DEBIT-ADJUSTMENTS');
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
    // it('should toggle to contribution ', () => {
    //   spyOn(component.router, 'navigate');
    //   component.goToNewTabs('BILLING.CONTRIBUTION');
    //   expect(component.router.navigate).toHaveBeenCalledWith(
    //     ['home/billing/establishment/detailed-bill/contribution'],
    //     Object({
    //       queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177, mofFlag: false, registerNo: 502351249 })
    //     })
    //   );
    // });
    it('should toggle to receipt-credit ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.RECEIPTS-AND-CREDITS');
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
    it('should toggle to contribution ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.CONTRIBUTION');
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
    it('should toggle to rejectedOH', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.REJECTED-OH-CLAIMS');
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
    it('should toggle to lateFee ', () => {
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.LATE-PAYMENT-FEES');
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
  describe('test suite for getItemizedAdjustmentForSelectedPage', () => {
    it('It should get itemized adjustment for  WAGE_DECREASE', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedAdjustmentForSelectedPage('WAGE_DECREASE');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should get itemized adjustment for  PERIOD_DECREASE', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedAdjustmentForSelectedPage('PERIOD_DECREASE');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should get itemized adjustment for  COVERAGE_REMOVAL', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedAdjustmentForSelectedPage('COVERAGE_REMOVAL');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
  });
  describe('test suite for mofCalDatechanged', () => {
    it('It should get itemized adjustment  on mofCalDatechanged', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillBreakup').and.callThrough();
      component.mofCalDatechanged('2020-10-06');
      expect(component.detailedBillService.getBillBreakup).toHaveBeenCalled();
    });
  });
  describe('test suite for getReceiptSortList', () => {
    it('It should  getReceiptSortList', () => {
      spyOn(component.detailedBillService, 'getReceipts').and.callThrough();
      component.getReceiptSortList('CONTRIBUTOR_NAME_ENG');
      expect(component.detailedBillService.getReceipts).toHaveBeenCalled();
    });
  });
  describe('test suite for getCreditSearchValues', () => {
    it('It should  getCreditSearchValues', () => {
      spyOn(component, 'getadjustmentdetails').and.callThrough();
      component.getCreditSearchValues('CONTRIBUTOR_NAME_ENG', 'WAGE_DECREASE');
      expect(component.getadjustmentdetails).toHaveBeenCalled();
    });
  });

  describe('test suite for getCreditAdjustmentFilterDetails', () => {
    it('It should  getCreditAdjustmentFilterDetails', () => {
      spyOn(component, 'getadjustmentdetails').and.callThrough();
      component.getCreditAdjustmentFilterDetails(requestListMockData, 'WAGE_DECREASE');
      component.getCreditAdjustmentFilterDetails(requestListMockData, 'PERIOD_DECREASE');
      component.getCreditAdjustmentFilterDetails(requestListMockData, 'COVERAGE_REMOVAL');
      expect(component.getadjustmentdetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getPaymentReceiptList', () => {
    it('It should  getPaymentReceiptList', () => {
      spyOn(component.detailedBillService, 'getReceipts').and.callThrough();
      component.getPaymentReceiptList(receiptFilterDetailsMockData);
      expect(component.detailedBillService.getReceipts).toHaveBeenCalled();
    });
  });
  describe('test suite for getCreditTransferselectPageDetails', () => {
    it('it should getCreditTransferselectPageDetails', () => {
      component.getCreditTransferselectPageDetails(1);
      expect(component.pageNo).toEqual(1);
    });
  });
  describe('test suite for getLateFeeWavierselectPageDetails', () => {
    it('it should getLateFeeWavierselectPageDetails', () => {
      component.getLateFeeWavierselectPageDetails(1);
      expect(component.pageNo).toEqual(1);
    });
  });
  describe('test suite for getCreditsSortList', () => {
    it('It should  getCreditsSortList', () => {
      spyOn(component.detailedBillService, 'getReceipts').and.callThrough();
      component.getReceiptSelectPageNo(1);
      expect(component.detailedBillService.getReceipts).toHaveBeenCalled();
    });
    it('getDashboardBillDetails', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.billingRoutingService, 'navigateToDashboardBill').and.callThrough();
      component.getDashboardBillDetails();
      component.getItemizedBillBreakUpServices(555);

      expect(component.billDetails).not.toEqual(null);
    });
    it('getselectPageNo', () => {
      spyOn(component, 'getItemizedAdjustmentForSelectedPage').and.callThrough();
      component.getselectPageNo(1, 'gggg');
      component.pageNo = 1;
      expect(component.getItemizedAdjustmentForSelectedPage).toHaveBeenCalled();
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printReceiptDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });

  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadReceiptDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
  describe('on navigate to new tab', () => {
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.DEBIT-ADJUSTMENTS');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/adjustments';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.RECEIPTS-AND-CREDITS');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/receipt-credit';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.CONTRIBUTION');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/contribution';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.LATE-PAYMENT-FEES');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/lateFee';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.REJECTED-OH-CLAIMS');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/rejectedOH';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
    it('goToNewTabs', () => {
      component.selectedDate = '2019-04-01';
      component.isMofFlag = true;
      component.billNumber = 177;
      component.idNumber = 502351249;
      component.initialStartDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.goToNewTabs('BILLING.INSTALLMENT');
      component.selectedUrl = BillingConstants.ROUTE_DETAILED_BILL + '/installment';
      expect(component.selectedUrl).not.toEqual(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [component.selectedUrl],
        Object({
          queryParams: Object({
            monthSelected: component.selectedDate,
            billNumber: component.billNumber,
            mofFlag: component.isMofFlag,
            registerNo: component.idNumber,
            billStartDate: component.initialStartDate
          })
        })
      );
    });
  });
  describe('on get payment list', () => {
    it('getPaymentReceiptList', () => {
      component.startDate = new Date();
      component.endDate = new Date();
      const isSearch = true;
      spyOn(component.detailedBillService, 'getReceipts').and.callThrough();
      component.getPaymentReceiptList(isSearch);
      component.pageNo = 0;
      component.getReceiptCreditDetails(component.startDate, component.endDate);
      expect(component.detailedBillService.getReceipts).toHaveBeenCalled();
    });
  });
  describe('getCreditsSortList', () => {
    it('It should getCreditsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Contributor Name', arabic: '' }
        }
      };
      component.lang = 'en';
      component.getCreditsSortList(sortList);

      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTOR_NAME_ENG');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Contributor Name', arabic: '' }
        }
      };
      component.lang = 'ar';
      component.getCreditsSortList(sortList);

      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTOR_NAME_ARB');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Adjustment Contributory Wage', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTORY_WAGE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Adjustment Date', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('ADJUSTMENT_DATE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Late Fees', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('LATE_FEE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Total Amount', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('TOTAL_AMOUNT');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Period (From)', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('ADJ_FROM_PERIOD');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Calculation Rate (New)', arabic: '' }
        }
      };
      component.getCreditsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTORY_WAGE');
    });
  });
  describe('getConversionRate', () => {
    it('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
      component.currencyChange('SAR');
      // expect(component.currencyDetails.exchangeRate).not.toBeNull();
      expect(component.exchangeRate).toBeDefined();
      expect(component.CurrencyDetails).toBeDefined();
    });
  });
});
