/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BillDashboardService, DetailedBillService, ReportStatementService } from '../../../../shared/services';
import {
  BillDashboardServiceStub,
  ExchangeRateServiceStub,
  DetailedBillServiceStub,
  ReportStatementServiceStub
} from 'testing/mock-services';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken, LanguageToken, CurrencyToken } from '@gosi-ui/core/lib/tokens';
import { RouterData } from '@gosi-ui/core/lib/models';

import { BehaviorSubject } from 'rxjs';
import { ExchangeRateService } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock } from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AllocationBillMofScomponent } from './allocation-bill-mof-sc.component';
import { BillingConstants } from '../../../../shared/constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AllocationBillMofScomponent', () => {
  let component: AllocationBillMofScomponent;
  let fixture: ComponentFixture<AllocationBillMofScomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AllocationBillMofScomponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        FormBuilder,
        {
          provide: ReportStatementService,
          useClass: ReportStatementServiceStub
        },
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
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
    fixture = TestBed.createComponent(AllocationBillMofScomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite for selectAllocationStartDate', () => {
    it('It should fetch the allocation start date', () => {
      component.idNumber = 504096157;
      component.onSelectedMonthChange('05-10-2020');
      component.setPageDatails(1);
      component.getMofallocationDetails();
      component.calculateBalanceAfterAllocation();
      expect(component.allocationOfCredits).not.toEqual(null);
      expect(component.isDebitFlag).toBeTruthy();
    });
  });
  describe('navigateToEstAllocation', () => {
    it('navigate to est allocation  screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateToEstAllocation(5555555);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/establishment/bill-allocation/view'],
        Object({
          queryParams: Object({ monthSelected: undefined, registrationNo: 5555555, fromPage: 'mofAllocation' })
        })
      );
    });
  });
  describe('test suite for  goToNewTab ', () => {
    it('It should get new tab', () => {
      component.goToNewTab('contribution');
      component.selectedTab = 'contribution';
      component.getMofallocationDetails();
      expect(component.allocationOfCredits).not.toEqual(null);
    });
  });
  describe('onSelectedMontgoToNewTabhChange', () => {
    it('should get  details onSelectedMonthChange', () => {
      spyOn(component, 'getMofallocationDetails').and.callThrough();
      component.onSelectedMonthChange('2020-09-10');
      expect(component.getMofallocationDetails).toHaveBeenCalled();
    });
  });
  describe('goToNewTab', () => {
    it('should get  goToNewTab', () => {
      spyOn(component, 'getMofallocationDetails').and.callThrough();
      component.goToNewTab('BILLING.ALLOCATION-OF-CREDITS');
      expect(component.getMofallocationDetails).toHaveBeenCalled();
    });
  });
  describe('onPageChange', () => {
    it('should get  onPageChange', () => {
      spyOn(component, 'getMofallocationDetails').and.callThrough();
      component.onPageChange(1);
      expect(component.getMofallocationDetails).toHaveBeenCalled();
    });
  });
  describe(' navigateBackToMofBillHistory', () => {
    it('Should navigate to home', () => {
      spyOn(component.router, 'navigate');
      component.navigateBackToMofBillHistory();
      expect(component.router.navigate).toHaveBeenCalledWith([BillingConstants.ROUTE_BILL_HISTORY_MOF]);
    });
  });
  describe('onSearch', () => {
    it('should get  onSearch', () => {
      spyOn(component, 'getMofallocationDetails').and.callThrough();
      component.onSearch('name');
      expect(component.getMofallocationDetails).toHaveBeenCalled();
    });
  });
});
