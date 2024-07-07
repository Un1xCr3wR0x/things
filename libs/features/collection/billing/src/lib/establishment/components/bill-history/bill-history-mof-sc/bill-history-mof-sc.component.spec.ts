import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHistoryMofScComponent } from './bill-history-mof-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken } from '@gosi-ui/core/lib/tokens/tokens';
import { RouterData } from '@gosi-ui/core/lib/models/router-data';
import { BillDashboardService } from '../../../../shared/services';
import { BillDashboardServiceStub } from 'testing/mock-services/features/billing/bill-dashboard-service-stub';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BilingualTextPipeMock, LookupServiceStub } from 'testing';
import { LookupService } from '@gosi-ui/core';
import { BillingConstants } from '../../../../shared/constants/billing-constants';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BillHistoryMofScComponent', () => {
  let component: BillHistoryMofScComponent;
  let fixture: ComponentFixture<BillHistoryMofScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [BillHistoryMofScComponent],
      providers: [
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillHistoryMofScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for pageChange', () => {
    it('It should change the page details', () => {
      component.currentEndDate = '2020-08-31';
      component.currentStartDate = '1980-01-01';
      component.pageChanged(0);
      expect(component.pageNumber).toEqual(0);
      expect(component.billHistoryDetails).not.toEqual(null);
      expect(component.billHistoryDetails).not.toEqual(undefined);
    });
    it('It should change the page details', () => {
      component.filterSearchDetails.billDate.endDate = '2020-08-31';
      component.filterSearchDetails.billDate.startDate = '1980-01-01';
      component.filterSearchDetails.pageSize = 10;
      component.filterSearchDetails.isSearch = true;
      component.filterSearchDetails.amount = 100;
      component.pageChanged(1);
      expect(component.filterSearchDetails.pageNo).toEqual(1);
      expect(component.billHistoryDetails).not.toEqual(null);
      expect(component.billHistoryDetails).not.toEqual(undefined);
    });
  });
  // describe('test suite for getRegistrationStatus', () => {
  //   it('It should get the registration status of establishment', () => {
  //     component.registrationNo = 200085744;
  //     component.registrationStatus = new BilingualText();
  //     component.getRegistrationStatus();
  //     expect(component.registrationStatus).not.toEqual(null);
  //     expect(component.registrationStatus).not.toEqual(undefined);
  //   });
  // });
  describe('routeToMofBillDashboard', () => {
    it('It should navigate to routeToMofBillDashboard', () => {
      spyOn(component.router, 'navigate');
      component.routeToMofBillDashboard();
      expect(component.router.navigate).toHaveBeenCalled;
    });
  });
  describe('test suite for  applySearchFilter', () => {
    it('should get details without search and filter applied', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      filterParams.isFilter = false;
      filterParams.isSearch = false;
      component.pageNumber = 1;
      spyOn(component.billDashboardService, 'getBillHistoryMofSearchFilter').and.callThrough();
      component.applySearchFilter(filterParams);
      expect(component.billDashboardService.getBillHistoryMofSearchFilter).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for routeTo', () => {
    it('It should navigate to Allocation', () => {
      const routeDetails = {
        index: 0,
        destinationPageName: BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN
      };
      spyOn(component.router, 'navigate');
      component.routeToMof(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_BILL_ALLOCATION_MOF],
        Object({ queryParams: Object({ monthSelected: '2019-04-01', maxBilldate: '2019-04-01' }) })
      );
    });
    it('It should navigate to bill details', () => {
      const routeDetails = {
        index: 0,
        destinationPageName: BillingConstants.BIILL_HISTORY_ROUTE_BILL_DETAILS
      };
      spyOn(component.router, 'navigate');
      component.routeToMof(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_DETAILED_BILL_MOF],
        Object({ queryParams: Object({ monthSelected: '2019-04-01' }) })
      );
    });
    it('It should navigate to bill details', () => {
      let routeDetails = new BillHistoryRouterDetails();
      routeDetails.destinationPageName = BillingConstants.ROUTE_DASHBOARD_MOF;
      routeDetails.index = 0;
      spyOn(component.router, 'navigate');
      component.routeToMof(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_DASHBOARD_MOF],
        Object({ queryParams: Object({ monthSelected: '2019-04-01' }) })
      );
    });
  });
});
