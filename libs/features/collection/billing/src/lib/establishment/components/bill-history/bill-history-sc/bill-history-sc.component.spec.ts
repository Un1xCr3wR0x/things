import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHistoryScComponent } from './bill-history-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken, CurrencyToken, RegistrationNoToken } from '@gosi-ui/core/lib/tokens/tokens';
import { RouterData } from '@gosi-ui/core/lib/models/router-data';
import { BillDashboardService, DetailedBillService } from '../../../../shared/services';
import { BillDashboardServiceStub } from 'testing/mock-services/features/billing/bill-dashboard-service-stub';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  BilingualTextPipeMock,
  billHistoryMockData,
  ExchangeRateServiceStub,
  LookupServiceStub,
  DetailedBillServiceStub
} from 'testing';
import { BillHistoryRouterDetails } from '../../../../shared/models/bill-history-router-details';
import { BillingConstants } from '../../../../shared/constants';
import { ExchangeRateService, LookupService, CurrencySar, RegistrationNumber } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BillHistoryFilterParams } from '../../../../shared/models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BillHistoryScComponent', () => {
  let component: BillHistoryScComponent;
  let fixture: ComponentFixture<BillHistoryScComponent>;
  let routeDetails: BillHistoryRouterDetails;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [BillHistoryScComponent],
      providers: [
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
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
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: ExchangeRateService,
          useClass: ExchangeRateServiceStub
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
    fixture = TestBed.createComponent(BillHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set bill number', () => {
      component.ngOnInit();
      expect(component.registrationNo).not.toEqual(null);
    });
  });
  describe('test suite for getRegistrationStatus', () => {
    // it('It should get the registration status of establishment', () => {
    //   component.registrationNo = 200085744;
    //   component.registrationStatus = new BilingualText();
    //   component.getRegistrationStatus();
    //   expect(component.registrationStatus).not.toEqual(null);
    //   expect(component.registrationStatus).not.toEqual(undefined);
    // });
  });
  describe('test suite for currencyChange', () => {
    it('It should get the exchange rate', () => {
      const currency1 = 'AED';
      component.currencyExchangeRate(currency1);
      expect(component.exchangeRate).not.toEqual(null);
    });
    it('It should get the exchange rate', () => {
      const currency2 = 'SAR';
      component.currencyExchangeRate(currency2);
      expect(component.exchangeRate).not.toEqual(null);
    });
  });
  describe('test suite for  getParamDetails', () => {
    it('should get details  getParamDetails', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      spyOn(component.billDashboardService, 'getBillHistorySearch').and.callThrough();
      component.getParamDetails(filterParams);
      expect(component.billDashboardService.getBillHistorySearch).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for routeTo', () => {
    it('It should navigate to Allocation', () => {
      routeDetails = {
        index: 0,
        destinationPageName: BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN
      };
      spyOn(component.router, 'navigate');
      component.routeTo(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/bill-allocation/view'],
        Object({
          queryParams: Object({ monthSelected: '2019-04-01', maxBilldate: '2019-04-01', billIssueDate: '2019-04-01' })
        })
      );
    });
  });
  describe('test suite for routeTo', () => {
    it('It should navigate to bill details', () => {
      routeDetails = {
        index: 0,
        destinationPageName: BillingConstants.BIILL_HISTORY_ROUTE_BILL_DETAILS
      };
      spyOn(component.router, 'navigate');
      component.routeTo(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/contribution'],
        Object({ queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177 }) })
      );
    });
  });
  describe('test suite for routeTo', () => {
    it('It should navigate to bill summary', () => {
      routeDetails = {
        index: 0,
        destinationPageName: 'bill-summary'
      };
      component.billNumber = 177;
      spyOn(component.router, 'navigate');
      component.routeTo(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/dashboard/view'],
        Object({
          queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177, isSearch: true })
        })
      );
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
      component.currencyExchangeRate(currency1.code.value.english);
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
      component.currencyExchangeRate(currency2.code.value.english);
      expect(component.exchangeRate).not.toEqual(null);
    });
  });
  describe('test suite for getBillhistoryDetails', () => {
    it('It should get bill history details', () => {
      component.getBillhistoryDetails(5000);
      expect(component.getBillhistoryDetails).not.toEqual(null);
    });
    it('It should get bill history details currentPage', () => {
      component.pageDetails.currentPage = 1;
      component.pageDetails.goToPage = '1';
      component.getBillhistoryDetails(5000);
      expect(component.getBillhistoryDetails).not.toEqual(null);
    });
  });
  describe('test suite for applyVicSearchFilter', () => {
    it('should get filter details', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      spyOn(component, 'getParamDetails');
      component.getParamDetails(filterParams);
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('routeToBillDashboard', () => {
    it('navigate to bill dashborad  screen', () => {
      spyOn(component.router, 'navigate');
      component.routeToBillDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/dashboard/view'],
        Object({ queryParams: Object({ isSearch: true }) })
      );
    });
  });
});
