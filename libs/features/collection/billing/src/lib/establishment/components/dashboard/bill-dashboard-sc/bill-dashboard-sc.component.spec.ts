/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
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
import { BehaviorSubject, of, throwError } from 'rxjs';
import { genericError } from 'testing';
import {
  ActivatedRouteStub,
  BillDashboardServiceStub,
  BillingRoutingServiceStub,
  DetailedBillServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  ReportStatementServiceStub
} from 'testing/mock-services';
import {
  BillDashboardService,
  BillingRoutingService,
  DetailedBillService,
  ReportStatementService
} from '../../../../shared/services';
import { BillDashboardScComponent } from './bill-dashboard-sc.component';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });

describe('BillDashboardScComponent', () => {
  let component: BillDashboardScComponent;
  let fixture: ComponentFixture<BillDashboardScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [BillDashboardScComponent],
      providers: [
        FormBuilder,
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        {
          provide: CurrencyToken,
          useValue: new BehaviorSubject<string>('SAR')
        },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillDashboardScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialise for establishment admin', () => {
      component.route.queryParams = of({
        isSearch: 'true',
        monthSelected: '20-05-2020',
        billNumber: 123,
        billStartDate: '20-04-2020'
      });
      component.ngOnInit();
      expect(component.isAppPrivate).toBeFalsy();
      expect(component.idNumber).not.toEqual(null);
    });
    it('should initialise for establishment admin', () => {
      component.route.queryParams = of({
        isSearch: 'true',
        billStartDate: '20-04-2020'
      });
      component.ngOnInit();
      expect(component.isAppPrivate).toBeFalsy();
      expect(component.idNumber).not.toEqual(null);
    });
    it('should set bill number', () => {
      component.ngOnInit();
      expect(component.billNumber).not.toEqual(null);
      expect(component.billNumber).not.toEqual(undefined);
    });
  });

  describe('test suite for getBillBreakUpService', () => {
    it('It should get the bill breakup details', () => {
      component.billNumber = 177;
      component.getBillBreakUpService(504096157);
      expect(component.billDetails).not.toEqual(null);
    });
  });
  describe('initialiseWithRoute', () => {
    it('should initialiseWithRoute', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: 987654321
        })
      );
      spyOn(component, 'getBillDetails');
      component.initialiseWithRoute();
      expect(component.getBillDetails).toHaveBeenCalled();
    });
  });

  describe('test suite for getBillWidgets', () => {
    it('It should get the bill widgets', () => {
      spyOn(component, 'getBillBreakUpService').and.callThrough();
      component.isAdmin = true;
      component.idNumber = 507121934;
      component.billNumber = 177;
      component.isGccCountry = true;
      component.getBillWidgets();
      expect(component.getBillBreakUpService).toHaveBeenCalled();
    });
    it('It should get the bill widgetss', () => {
      spyOn(component, 'getBillBreakUpService').and.callThrough();
      component.isAdmin = false;
      component.idNumber = 507121934;
      component.billNumber = 177;
      component.isGccCountry = true;
      component.getBillWidgets();
      expect(component.isHeader).toBeTruthy();
    });
  });
  describe('test suite for getBillNumber', () => {
    it('It should get the getBillNumber', () => {
      component.isAdmin = true;
      component.idNumber = 507121934;
      component.getBillNumber(component.idNumber, true);
      expect(component.billNumber).not.toBeNull();
    });
    it('should getBillNumber error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.detailedBillService, 'getBillNumber').and.returnValue(throwError(genericError));
      component.getBillNumber(507121934, true);
      expect(component.errorMessage).not.toBeNull();
    });
  });
  // describe('test suite for getBillingSummary', () => {
  //   it('It should get the bill summary details', () => {
  //     spyOn(component.router, 'navigate');
  //     component.idNumber = 504096157;getBillNumber
  //     component.getBillingSummary();
  //     expect(component.router.navigate).toHaveBeenCalledWith(
  //       [[['home/billing/establishment/detailed-bill/contribution'], Object({ queryParams: Object({ monthSelected: '2021-03-01', billNumber: Object({ bills: [Object({ billNumber: 177, issueDate: Object({ gregorian: 'Fri Apr 09 2021 03:00:00 GMT+0300 (Arabian Standard Time))', hijiri: '' }), details: [Object, Object, Object, Object, Object] }), Object({ billNumber: 177, issueDate: Object({ gregorian: 'Fri Apr 09 2021 03:00:00 GMT+0300 (Arabian Standard Time))', hijiri: '' }), details: [Object, Object, Object, Object, Object] })], firstBillIssueDate: Object({ gregorian: 'Fri Apr 09 2021 03:00:00 GMT+0300 (Arabian Standard Time))', hijiri: '' }) }) }) })]]
  //     )
  //   });
  // });
  describe('test suite for getBillDetailsOnSelectedDate', () => {
    it('It should getBillDetailsOnSelectedDate', () => {
      component.monthSelectedDate = '2020/04/30';
      component.getBillDetailsOnSelectedDate(component.monthSelectedDate);
      component.isBillNumber = false;
      component.isNoBill = false;
      expect(component.monthSelectedDate).not.toEqual(null);
    });
  });
  describe('test suite for getBillingHeaderDetails', () => {
    it('It should get the details of establishemnt ', () => {
      component.getBillingHeaderDetails(507121934);
      expect(component.establishmentHeaderValue).not.toEqual(null);
    });
  });

  describe('test suite for currencyChange', () => {
    it('It should get the exchange rate', () => {
      component.isGccCountry = true;
      const currency1 = {
        label: 'BHD',
        code: {
          value: {
            english: 'BHD',
            arabic: ''
          },
          sequence: 1
        }
      };
      component.currencyExchange(currency1.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
    it('It should get the exchange rate', () => {
      component.isGccCountry = true;
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
      component.currencyExchange(currency2.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
  });
  describe('getBillDetails', () => {
    it('should getBillDetails error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.detailedBillService, 'getBillingHeader').and.returnValue(throwError(genericError));
      component.getBillDetails(504096157);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for getBillDetails', () => {
    it('It should get the bill summary details', () => {
      component.getBillDetails(504096157);
      component.isSearch = true;
      expect(component.billNumber).not.toEqual(null);
    });

    it('It should navigate to goToReceiptHistory', () => {
      spyOn(component.router, 'navigate');
      component.goToReceiptHistory();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/receipt/establishment'],
        Object({ queryParams: Object({ isSearch: true }) })
      );
      expect(component.billDashboardService.paymentReceiptOrigin).toBeTruthy();
    });
    it('It should navigate to navigateToBillHistory', () => {
      spyOn(component.billingRoutingService, 'navigateToBillHistory');
      spyOn(component.router, 'navigate');
      component.navigateToBillHistory();
      expect(component.billingRoutingService.navigateToBillHistory).toHaveBeenCalled();
    });
  });
});
