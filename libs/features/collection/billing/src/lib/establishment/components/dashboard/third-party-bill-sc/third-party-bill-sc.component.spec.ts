/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthTokenServiceStub, BillDashboardServiceStub, DetailedBillServiceStub } from 'testing/mock-services';
import { BillDashboardService, DetailedBillService } from '../../../../shared/services';
import { ThirdPartyBillScComponent } from './third-party-bill-sc.component';
import { TranslateModule } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';
import { BillingConstants } from '../../../../shared/constants';
import { AuthTokenService, convertToYYYYMMDD, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { genericError } from 'testing';

describe('ThirdPartyBillScComponent', () => {
  let component: ThirdPartyBillScComponent;
  let fixture: ComponentFixture<ThirdPartyBillScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ThirdPartyBillScComponent],
      providers: [
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyBillScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialise for establishment admin', () => {
      component.route.queryParams = of({
        monthSelected: '20-05-2020',
        billNumber: 123,
        billStartDate: '20-04-2020'
      });
      component.ngOnInit();
      expect(component.idNumber).not.toEqual(null);
    });
  });
  describe('test suite for getDetails', () => {
    it('It should get the mof breakup details', () => {
      component.getDate('2020-03-01', false);
      expect(component.mofEstablishmentBill).not.toEqual(null);
    });
    it('should getBillNumber error', () => {
      spyOn(component.detailedBillService, 'getMofEstablishmentBill').and.returnValue(throwError(genericError));
      component.getDate('2020-03-01', false);
      expect(component.errorMessage).not.toBeNull();
    });
  });
  describe('test suite for getMofEstablishmentBill', () => {
    it('It should get the mof establishment details', () => {
      component.getMofDashboardBillDetails();
      expect(component.mofEstablishmentBill).not.toEqual(null);
    });
  });
  xdescribe('test suite for getMofEstablishmentBill', () => {
    it('It should get the mof establishment details', () => {
      component.monthSelectedDate = '2019-04-01';
      spyOn(component.router, 'navigate');
      component.getBillingSummary();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_DETAILED_BILL_MOF],
        Object({ queryParams: Object({ monthSelected: '2019-04-01' }) })
      );
    });
  });
  describe('navigateToBillHistoryMof', () => {
    it('Should navigate to home', () => {
      spyOn(component.router, 'navigate');
      component.navigateToBillHistoryMof();
      expect(component.router.navigate).toHaveBeenCalledWith([BillingConstants.ROUTE_BILL_HISTORY_MOF]);
    });
  });
  describe('test suite for getBillingSummary ', () => {
    it('It should navigate ', () => {
      const monthSelectedDate = convertToYYYYMMDD(component.monthSelectedDate);
      spyOn(component.router, 'navigate');
      component.getBillingSummary();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/detailed-bill/mof'],
        Object({
          queryParams: Object({ monthSelected: monthSelectedDate, billStartDate: null, initialStartDate: null })
        })
      );
    });
  });
  describe('test suite for goToMofReceiptHistory ', () => {
    it('It should navigate ', () => {
      spyOn(component.router, 'navigate');
      component.goToMofReceiptHistory();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/receipt/mof'],
        Object({
          queryParams: Object({ isSearch: true })
        })
      );
    });
  });
});
