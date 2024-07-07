import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  CurrencySar,
  CurrencyToken,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  bindToObject,
  ExchangeRate
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BilingualTextPipeMock, genericError } from 'testing';
import {
  ActivatedRouteStub,
  BillDashboardServiceStub,
  BillingRoutingServiceStub,
  DetailedBillServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub
} from 'testing/mock-services';
import { exchangeRateMockData } from 'testing/test-data';
import { BillDashboardService, BillingRoutingService, DetailedBillService } from '../../../../shared/services';

import { BillAccountScComponent } from './bill-account-sc.component';
export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });

describe('BillAccountScComponent', () => {
  let component: BillAccountScComponent;
  let fixture: ComponentFixture<BillAccountScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [BillAccountScComponent, BilingualTextPipeMock],
      providers: [
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
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
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
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAccountScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for establishment admin', () => {
      expect(component.idNumber).not.toEqual(null);
    });
  });
  describe('test suite for getBillNumber', () => {
    it('It should get the getBillNumber', () => {
      component.idNumber = 507121934;
      component.getBillNumber(component.idNumber, true);
      expect(component.billNumber).not.toBeNull();
    });
    // it('should getBillNumber error', () => {
    //   spyOn(component.detailedBillService, 'getBillNumber').and.returnValue(throwError(genericError));
    //   component.getBillNumber(507121934, true);
    // });
  });
  describe('test suite for getBillingHeaderDetails', () => {
    it('It should get the details of establishemnt ', () => {
      component.getBillingHeaderDetails(507121934);
      expect(component.isGccCountry).not.toEqual(null);
    });
  });
  describe('test suite for getBillDetailsOnSelectedDate', () => {
    it('It should get the details of bill ', () => {
      component.getBillDetailsOnSelectedDate();
      expect(component.billNumber).not.toEqual(null);
    });
  });
  describe('test suite for getBillBreakUpService', () => {
    it('It should get the bill breakup details', () => {
      component.billNumber = 177;
      component.getBillBreakUpService(504096157);
      expect(component.billDetails).not.toEqual(null);
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
  describe('getConversionRate', () => {
    xit('should get conversion rate for currencies', () => {
      spyOn(component.exchangeRateService, 'getExchangeRate').and.returnValue(
        of(bindToObject(new ExchangeRate(), exchangeRateMockData))
      );
    });
  });
  describe('routeToDashboard', () => {
    it('It should navigate to routetodashboard', () => {
      spyOn(component.router, 'navigate');
      component.routetodashboard();
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('routeToHistory', () => {
    it('It should navigate to routeToHistory', () => {
      spyOn(component.router, 'navigate');
      component.routeToHistory();
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
});
