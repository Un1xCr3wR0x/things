/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
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
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  AuthTokenServiceStub,
  DetailedBillServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  ReportStatementServiceStub
} from 'testing/mock-services';
import { requestListMockData } from 'testing/test-data/features/billing';
import { DetailedBillService, ReportStatementService } from '../../../../shared/services';
import { AdjustmentDetailedBillScComponent } from './adjustment-detailed-bill-sc.component';

describe('AdjustmentDetailedBillScComponent', () => {
  let component: AdjustmentDetailedBillScComponent;
  let fixture: ComponentFixture<AdjustmentDetailedBillScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AdjustmentDetailedBillScComponent],
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
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentDetailedBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.billNumber = 177;
    component.initialStartDate = '2019-01-20';
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
  describe('ngOnInit', () => {
    it('should initialise for establishment admin', () => {
      component.ngOnInit();
      expect(component.exchangeRate).not.toEqual(null);
    });
  });
  describe('test suite for getPreviousMonthSummary', () => {
    it('It should get the previous month bill summary details', () => {
      spyOn(component.router, 'navigate');
      //component.idNumber = 504096157;
      component.getAdjustmentBillDetailsOnSelectedDate('2019-09-01');
      expect(component.adjustmentItemizedBillList).not.toEqual(null);
      expect(component.getItemizedTabsetDetails).not.toEqual(null);
    });
  });
  describe('test suite for getItemizedTabsetDetails', () => {
    it('It should get the itemized tabset details', () => {
      // component.idNumber = 504096157;
      component.getItemizedTabsetDetails();
      expect(component.adjustmentItemizedBillList).not.toEqual(null);
    });
  });
  describe('test suite for getBillingHeaderDetails', () => {
    it('It should get the details of establishemnt ', () => {
      // component.idNumber = 504096157;
      component.isGccCountry = false;
      component.getAdjustmentBillingHeaderService(component.idNumber);
      expect(component.adjustmentEstablishmentHeader).not.toEqual(null);
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
      component.selectedCountry = currency1.code.value.english;
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
      component.goToNewTab('BILLING.DEBIT-ADJUSTMENTS');
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/adjustments'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billNumber: 177,
            mofFlag: false,
            registerNo: 502351249,
            billStartDate: '2019-01-20'
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
      // );
      // expect(component.adjustUrl).toEqual(
      //   'home/billing/establishment/detailed-bill/contribution',
      //   Object({
      //     queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177, mofFlag: false, registerNo: 502351249 })
      //   })
      // );
    });
    // it('should toggle to receipt-credit ', () => {
    //   component.goToNewTab('BILLING.RECEIPTS-AND-CREDITS');
    //   expect(component.adjustUrl).toEqual(
    //     'home/billing/establishment/detailed-bill/receipt-credit',
    //     Object({
    //       queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177, mofFlag: false, registerNo: 502351249 })
    //     })
    //   );
    // });
  });
  describe('test suite for mofCalendarDatechanged', () => {
    it('It should navigate with new date selected', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillBreakup').and.callThrough();
      component.mofCalendarDatechanged('2019-09-01');
      expect(component.detailedBillService.getBillBreakup).toHaveBeenCalled();
    });
  });
  describe('test suite for getSearchValues', () => {
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'BACKDATED_REGISTRATION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'PERIOD_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'WAGE_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'BACKDATED_COVERAGE_ADDITION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getSearchValues', () => {
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'BACKDATED_REGISTRATION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'PERIOD_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'WAGE_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the search details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getSearchValues('111', 'BACKDATED_COVERAGE_ADDITION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
  });

  describe('test suite for getAdjustmentFilterDetails', () => {
    it('It should get the adjustment  details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getAdjustmentFilterDetails(requestListMockData, 'BACKDATED_REGISTRATION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the adjustment  details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getAdjustmentFilterDetails(requestListMockData, 'PERIOD_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the adjustment  details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getAdjustmentFilterDetails(requestListMockData, 'WAGE_INCREASE');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
    it('It should get the adjustment  details', () => {
      spyOn(component, 'getAdjustmentDetails').and.callThrough();
      component.getAdjustmentFilterDetails(requestListMockData, 'BACKDATED_COVERAGE_ADDITION');
      expect(component.getAdjustmentDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getAdjustmentDashboardBillDetails', () => {
    it('It should get ', () => {
      spyOn(component.billingRoutingService, 'navigateToDashboardBill');
      component.getAdjustmentBillBreakUpService(55555);
      expect(component.adjustmentBillDetails).not.toEqual(null);
    });
  });
  describe('test suite for getAdjustmentDashboardBillDetails', () => {
    it('It should get ', () => {
      spyOn(component.billingRoutingService, 'navigateToDashboardBill');
      spyOn(component, 'getAdjustmentBillBreakUpService').and.callThrough();
      component.getAdjustmentDashboardBillDetails();
      expect(component.adjustmentBillDetails).not.toEqual(null);
    });
  });
  describe('test suite for getItemizedCreditForSelectedPage', () => {
    it('It should get the itemizedcredit for selected page', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedCreditForSelectedPage('BACKDATED_COVERAGE_ADDITION');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should get the itemizedcredit for selected page', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedCreditForSelectedPage('PERIOD_INCREASE');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should get the itemizedcredit for selected page', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedCreditForSelectedPage('WAGE_INCREASE');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should get the itemizedcredit for selected page', () => {
      spyOn(component.detailedBillService, 'getItemizedDebitAdjustment').and.callThrough();
      component.getItemizedCreditForSelectedPage('BACKDATED_REGISTRATION');
      expect(component.detailedBillService.getItemizedDebitAdjustment).toHaveBeenCalled();
    });
    it('It should getselectPageNumber', () => {
      component.getselectPageNumber(1, 'page');
      component.pageNo = 1;
      component.getItemizedCreditForSelectedPage('page');
      expect(component.wageChange).not.toEqual(null);
    });
  });
  describe('test suite for printTransaction', () => {
    it('It should print transaction', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.printAdjustmentDetailedBill();
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
  describe('getDebitsSortList', () => {
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Contributor Name', arabic: '' }
        }
      };
      component.lang = 'en';
      component.getDebitsSortList(sortList);

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
      component.getDebitsSortList(sortList);

      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTOR_NAME_ARB');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Adjustment Contributory Wage', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTORY_WAGE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Adjustment Date', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('ADJUSTMENT_DATE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Late Fees', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('LATE_FEE');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Total Amount', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('TOTAL_AMOUNT');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Period (From)', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('ADJ_FROM_PERIOD');
    });
    it('It should getDebitsSortList', () => {
      const sortList = {
        sortBy: {
          value: { english: 'Calculation Rate (New)', arabic: '' }
        }
      };
      component.getDebitsSortList(sortList);
      expect(component.filterSearchDetails?.sort?.column).not.toEqual(null);
      expect(component.filterSearchDetails?.sort?.column).toBe('CONTRIBUTORY_WAGE');
    });
  });
  describe('test suite for getselectPageDetails', () => {
    it('It should getselectPageDetails', () => {
      const selectedpageNo = 1;
      const toEntity = 'THIRD_PARTY';
      spyOn(component, 'getselectPageDetail');
      component.getselectPageDetails(selectedpageNo, toEntity);
      expect(component.getselectPageDetail).toHaveBeenCalled();
    });
  });
  describe('test suite for downloadTransaction', () => {
    it('It should download file', () => {
      spyOn(component.reportStatementService, 'downloadDetailedBill').and.returnValue(of(new Blob()));
      spyOn(window, 'open');
      component.downloadAdjustmentDetailedBill('PDF');
      expect(component.reportStatementService.downloadDetailedBill).toHaveBeenCalled();
    });
  });
});
