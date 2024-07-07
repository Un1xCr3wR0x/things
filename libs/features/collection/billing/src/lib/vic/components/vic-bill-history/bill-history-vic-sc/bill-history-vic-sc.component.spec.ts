import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillHistoryVicScComponent } from './bill-history-vic-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterDataToken, LanguageToken } from '@gosi-ui/core/lib/tokens/tokens';
import { RouterData } from '@gosi-ui/core/lib/models/router-data';
import { BillDashboardService } from '../../../../shared/services';
import { BillDashboardServiceStub } from 'testing/mock-services/features/billing/bill-dashboard-service-stub';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { AuthTokenServiceStub, BilingualTextPipeMock, LookupServiceStub } from 'testing';
import { AuthTokenService, LookupService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BillHistoryRouterDetails, BillHistoryFilterParams } from '../../../../shared/models';
import { BillingConstants } from '../../../../shared/constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BillHistoryVicScComponent', () => {
  let component: BillHistoryVicScComponent;
  let fixture: ComponentFixture<BillHistoryVicScComponent>;
  let routeDetails: BillHistoryRouterDetails;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [BillHistoryVicScComponent],
      providers: [
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
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
    fixture = TestBed.createComponent(BillHistoryVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for routeTo', () => {
    it('It should cancel the transaction in csr screen', () => {
      routeDetails = {
        index: 0,
        destinationPageName: BillingConstants.BIILL_HISTORY_ROUTE_ALLOCATOIN
      };
      spyOn(component.router, 'navigate');
      component.routeToMof(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/vic/bill-allocation'],
        Object({
          queryParams: Object({
            monthSelected: '2019-04-01',
            billIssueDate: '2019-04-01',
            maxBilldate: '2019-04-01',
            sinNo: undefined,
            entryFormat: undefined
          })
        })
      );
    });

    it('It should navigate to Allocation', () => {
      routeDetails = {
        index: 0,
        destinationPageName: ''
      };
      spyOn(component.router, 'navigate');
      component.routeToMof(routeDetails);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/vic/dashboard'],
        Object({ queryParams: Object({ monthSelected: '2019-04-01', billNumber: undefined, entryFormat: undefined }) })
      );
    });
  });
  describe('test suite for applyVicSearchFilter', () => {
    it('should get filter details', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      filterParams.isFilter = true;
      filterParams.isSearch = true;
      component.pageNumber = 1;
      component.isSearchPagination = false;
      spyOn(component.billDashboardService, 'getBillHistoryVicSearchFilter').and.callThrough();
      component.applyVicSearchFilter(filterParams);
      expect(component.billDashboardService.getBillHistoryVicSearchFilter).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for applyVicSearchFilter', () => {
    it('should get details without search and filter applied', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      filterParams.isFilter = false;
      filterParams.isSearch = false;
      component.pageNumber = 1;
      component.isSearchPagination = false;
      spyOn(component.billDashboardService, 'getBillHistoryVicSearchFilter').and.callThrough();
      component.applyVicSearchFilter(filterParams);
      expect(component.billDashboardService.getBillHistoryVicSearchFilter).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for applyVicSearchFilter', () => {
    it('should get filter details', () => {
      let filterParams: BillHistoryFilterParams = new BillHistoryFilterParams();
      spyOn(component, 'applyVicSearchFilter');
      component.applyVicSearchFilter(filterParams);
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for pageChangedValue', () => {
    it('should get page change values', () => {
      component.filterSearchDetails.isFilter = true;
      spyOn(component.billDashboardService, 'getBillHistoryVicSearchFilter').and.callThrough();
      component.pageChangedValue(1);
      expect(component.billDashboardService.getBillHistoryVicSearchFilter).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('test suite for pageChangedValue', () => {
    it('should get page change values if no filter is applied', () => {
      component.filterSearchDetails.isFilter = false;
      component.filterSearchDetails.isSearch = false;
      spyOn(component.billDashboardService, 'getBillHistoryVic').and.callThrough();
      component.pageChangedValue(1);
      expect(component.billDashboardService.getBillHistoryVic).toHaveBeenCalled();
      expect(component.billHistoryDetails).not.toBeNull();
    });
  });
  describe('routeToVicBillDashboard', () => {
    it('navigate to vic dashborad  screen', () => {
      spyOn(component.router, 'navigate');
      component.routeToVicBillDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/billing/vic/dashboard'],
        Object({ queryParams: Object({ billNumber: undefined }) })
      );
    });
  });
});
