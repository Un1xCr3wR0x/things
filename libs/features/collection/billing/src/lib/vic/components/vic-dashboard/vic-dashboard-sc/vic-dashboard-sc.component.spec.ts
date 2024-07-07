/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  convertToYYYYMMDD,
  LanguageToken,
  RouterData,
  RouterDataToken,
  startOfMonth
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { BehaviorSubject, throwError } from 'rxjs';
import { genericError } from 'testing';
import { AlertServiceStub, BillDashboardServiceStub, ReportStatementServiceStub } from 'testing/mock-services';
import { VicDashboardScComponent } from '..';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { BillDashboardService, ReportStatementService } from '../../../../shared/services';
describe('VicDashboardScComponent', () => {
  let component: VicDashboardScComponent;
  let fixture: ComponentFixture<VicDashboardScComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicDashboardScComponent],
      providers: [
        FormBuilder,
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PUBLIC' },
        { provide: ContributorToken, useValue: new ContributorTokenDto() },

        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ReportStatementService, useClass: ReportStatementServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VicDashboardScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialise for vic', () => {
      component.ngOnInit();
      expect(component.lang).not.toEqual(null);
    });
  });
  describe('test suite for navigateToVicBillHistory', () => {
    it('It should navigate to navigate To vic BillDashBoard', () => {
      spyOn(component.billingRoutingService, 'navigateToVicBillHistory');
      component.navigateToVicBillHistory();
      expect(component.billingRoutingService.navigateToVicBillHistory).toHaveBeenCalled();
    });
  });
  describe('test suite for vic getBillDetailsOnSelectedDate ', () => {
    it('It should get vicBilldetails', () => {
      component.getVicBillDetailsOnSelectedDate('2020-03-01');
      expect(component.billDetails).not.toEqual(null);
    });
  });
  describe('test suite for vic getBillDetailsOnSelectedDate 1 ', () => {
    it('should set bill number', () => {
      component.monthSelectedDate = convertToYYYYMMDD(
        startOfMonth(moment(new Date('2020-03-01'), 'YYYY-MM-DD').toDate()).toString()
      );
      spyOn(component.billDashboardService, 'getBillNumber').and.returnValue(
        throwError({
          error: {
            code: 'EST-12-1001',
            message: {
              english: BillingConstants.ERROR_MESSAGE,
              arabic: BillingConstants.ERROR_MESSAGE
            }
          }
        })
      );
      component.getVicBillDetailsOnSelectedDate('2020-03-01');
      expect(component.isDisable).toBeTruthy;
      expect(component.billNumber).not.toBeNull();
    });
  });
  describe('test suite for vic getBillDetailsOnSelectedDate 1 ', () => {
    it('should throw error on getting getBillNumber', () => {
      spyOn(component.billDashboardService, 'getBillNumber').and.returnValue(throwError(genericError));
      component.getVicBillDetailsOnSelectedDate('2020-01-01');
      expect(component.isBillNumber).toBeTruthy();
    });
  });
  describe('goToVicReceiptHistory', () => {
    it('navigate to vic receipt  screen', () => {
      component.sinNumber = 95665668764;
      spyOn(component.router, 'navigate');
      component.goToVicReceiptHistory();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_VIC_RECIEPT],
        Object({ queryParams: Object({ isSearch: true, idNo: 95665668764 }) })
      );
    });
  });
  describe('test suite for vic getBillDetailsOnSelectedDate 2 ', () => {
    it('should throw error on getting VicBillBreakupDetails', () => {
      spyOn(component.billDashboardService, 'getBillNumber').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.getVicBillBreakupDetails(44444);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for vic getBillDetailsOnSelectedDate 3', () => {
    it('It should get vicBilldetails', () => {
      component.getVicBillBreakupDetails(123456);
      expect(component.billDetails).not.toEqual(null);
    });
  });
});
