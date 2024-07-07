/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlertService, bindToObject, AuthTokenService, EnvironmentToken } from '@gosi-ui/core';
import { TeamManagementService } from '../../services';
import { MyTeamViewScComponent } from './my-team-view-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountData, TeamManagementData, AuthTokenServiceStub, reporteeObject } from 'testing';
import { ActiveCount, MyTeamResponse, ReporteeObject, TeamRequest } from '../../models';
import { Subscription, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterConstants } from '@gosi-ui/features/team-management';
import { Router, ActivatedRoute } from '@angular/router';
export const routerSpy = { url: RouterConstants.ROUTE_VALIDATOR_PROFILE, navigate: jasmine.createSpy('navigate') };
describe('MyTeamViewScComponent', () => {
  let component: MyTeamViewScComponent;
  let fixture: ComponentFixture<MyTeamViewScComponent>;

  beforeEach(() => {
    const alertServiceStub = () => ({ clearAllErrorAlerts: () => ({}), clearAlerts: () => ({}) });
    const teamManagementServiceStub = () => ({
      getActiveAndLeaveCount: () => ({ subscribe: f => f({}) }),
      getMyTeamMembers: teamRequest => ({ subscribe: f => f({}) }),
      getVacationPeriods: () => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MyTeamViewScComponent],
      providers: [
        { provide: AlertService, useFactory: alertServiceStub },
        {
          provide: TeamManagementService,
          useFactory: teamManagementServiceStub
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
        HttpClientModule
      ]
    });
    fixture = TestBed.createComponent(MyTeamViewScComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOninit', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component, 'requestSetter').and.callThrough();
      spyOn(component, 'getReportees').and.callThrough();
      spyOn(component, 'getActiveCount').and.callThrough();
      component.ngOnInit();
      expect(component.myTeamResponse).not.toEqual(null);
    });
  });
  describe('default pagination', () => {
    it('should paginate', () => {
      component.teamRequest = new TeamRequest();
      component.teamRequest.page.pageNo = 1;
      component.teamRequest.page.size = 10;
      component.currentPage = 1;
      component.itemsPerPage = 10;
      component.defaultPagination();
      expect(component.currentPage).not.toEqual(null);
      expect(component.itemsPerPage).toEqual(10);
      expect(component.pageDetails).not.toEqual(null);
      expect(component.teamRequest).toBeDefined();
      expect(component.teamRequest.page.size).not.toEqual(null);
      expect(component.teamRequest.page.pageNo).not.toEqual(null);
    });
  });
  describe('default search', () => {
    it('should search', () => {
      component.teamSearch.value = undefined;
      component.defaultSearch();
      expect(component.teamSearch.value).toEqual(undefined);
    });
  });
  describe('search team member', () => {
    it('should search team member', () => {
      const value = 'e001234';
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.myTeamResponse = TeamManagementData;
      const response = component.tmService.myTeamInitialListOfReportees?.response?.filter(
        item => item?.name?.includes(value) || item?.id?.includes(value)
      );
      spyOn(component, 'getCount').and.callThrough();
      spyOn(component, 'defaultPagination').and.callThrough();
      component.searchTeamMember(value);
      expect(value).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(component.myTeamResponse.response).not.toEqual(null);
      expect(response).not.toEqual(null);
    });
    it('should search team member', () => {
      const value = '';
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.myTeamResponse = TeamManagementData;
      const response = component.tmService.myTeamInitialListOfReportees?.response?.filter(
        item => item?.name?.includes(value) || item?.id?.includes(value)
      );
      spyOn(component, 'getCount').and.callThrough();
      component.searchTeamMember(value);
      expect(value).toEqual('');
      expect(component.myTeamResponse).not.toEqual(null);
      expect(response).not.toEqual(null);
      expect(component.myTeamResponse.response).not.toEqual(null);
    });
  });
  describe('sort array list', () => {
    it('should sort array list', () => {
      const array = [];
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.myTeamResponse = TeamManagementData;
      const list = ['ay', 'an'];
      list?.forEach(item => {
        const response = component.tmService.myTeamInitialListOfReportees?.response?.find(
          element => element?.name === item
        );
        array.push(response);
      });
      component.sortArrayList(list);
      expect(component.tmService.myTeamInitialListOfReportees).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees?.response).not.toEqual(null);
      expect(component.myTeamResponse.response).not.toEqual(null);
      expect(array).not.toEqual(null);
    });
  });
  describe('sorting name', () => {
    it('should sort name in desc', () => {
      const sort = 'name';
      component.myTeamResponse = TeamManagementData;
      component.sortDirection = 'ASC';
      const descendingList = component.nameValue?.sort((a, b) =>
        a.replace(/\s/g, '').localeCompare(b.replace(/\s/g, ''))
      );
      component.sortTeamMember(sort);
      expect(component.nameValue).not.toEqual(null);
      expect(component.sortDirection).toEqual('DESC');
      expect(descendingList).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(sort).not.toEqual(null);
    });
    it('should sort name in asc', () => {
      const sort = 'name';
      component.myTeamResponse = TeamManagementData;
      component.sortDirection = 'DESC';
      const ascendingList = component.nameValue?.sort((a, b) =>
        b.replace(/\s/g, '').localeCompare(a.replace(/\s/g, ''))
      );
      component.sortTeamMember(sort);
      expect(component.nameValue).not.toEqual(null);
      expect(component.sortDirection).toEqual('ASC');
      expect(ascendingList).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(sort).not.toEqual(null);
    });
  });
  describe('entry request', () => {
    it('should entry request', () => {
      const request = new TeamRequest();
      spyOn(component, 'requestSetter').and.callThrough();
      component.entryRequest(request);
      expect(request).toBeDefined();
    });
  });
  describe('get reportees', () => {
    it('should get reportees', () => {
      component.getReporteeSubscription = new Subscription();
      component.getReporteeSubscription.unsubscribe();
      component.getReportees();
      expect(component.getReporteeSubscription).not.toEqual(null);
    });
    it('should get reportees', () => {
      component.getReporteeSubscription = new Subscription();
      component.getReporteeSubscription.unsubscribe();
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.getReportees();
      expect(component.getReporteeSubscription).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
    });
  });
  describe('get reporteesfilter', () => {
    it('should get reporteesfilter', () => {
      component.getReporteeSubscription = new Subscription();
      component.getReporteeSubscription.unsubscribe();
      spyOn(component.tmService, 'getMyTeamMembers').and.returnValue(
        of(bindToObject(new TeamRequest(), TeamManagementData))
      );
      component.getReporteesFilter();
      expect(component.getReporteeSubscription).toBeDefined();
    });
  });
  describe('get response per page', () => {
    it('should get response per page', () => {
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.myTeamResponse = TeamManagementData;
      component.teamRequest = new TeamRequest();
      component.searchResults = new MyTeamResponse();
      const response = [
        {
          name: 'ay',
          id: 'e001234',
          mail: 'asddff@gfh.com',
          mobile: '1234567890',
          pendingTransaction: 10,
          status: 'Active',
          statusLabel: 'ACTIVE',
          role: [{ role: ['customercareofficer'] }]
        }
      ];
      component.searchResults.response = response;
      component.teamRequest.page.pageNo = 0;
      const pageCount = component.teamRequest.page.pageNo * 10;
      component.getResponsePerPage();
      expect(component.tmService.myTeamInitialListOfReportees?.response).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees?.response?.length).not.toEqual(null);
      expect(component.searchResults.response.length).toBeGreaterThan(pageCount);
    });
    it('should get response per page', () => {
      component.myTeamResponse = TeamManagementData;
      component.teamRequest = new TeamRequest();
      component.searchResults = new MyTeamResponse();
      const response = [
        {
          name: 'ay',
          id: 'e001234',
          mail: 'asddff@gfh.com',
          mobile: '1234567890',
          pendingTransaction: 10,
          status: 'Active',
          statusLabel: 'ACTIVE',
          role: [{ role: ['customercareofficer'] }]
        }
      ];
      component.searchResults.response = response;
      component.teamRequest.page.pageNo = 0;
      const pageCount = component.teamRequest.page.pageNo * 10;
      component.isSearched = true;
      component.getResponsePerPage();
      expect(component.myTeamResponse).not.toEqual(null);
    });
    it('should get response per page', () => {
      component.teamRequest = new TeamRequest();
      component.searchResults = new MyTeamResponse();
      const response = [
        {
          name: 'ay',
          id: 'e001234',
          mail: 'asddff@gfh.com',
          mobile: '1234567890',
          pendingTransaction: 10,
          status: 'Active',
          statusLabel: 'ACTIVE',
          role: [{ role: ['customercareofficer'] }]
        }
      ];
      const teamData = {
        totalCount: 10,
        response: response
      };
      component.myTeamResponse = teamData;
      component.tmService.myTeamInitialListOfReportees = teamData;
      component.searchResults.response = response;
      component.teamRequest.page.pageNo = 0;
      const pageCount = component.teamRequest.page.pageNo * 10;
      component.isSearched = true;
      component.getResponsePerPage();
      expect(teamData.response).not.toEqual(null);
      expect(teamData.response.length).toBeGreaterThan(pageCount);
      expect(component.tmService.myTeamInitialListOfReportees).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees.response).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees.response.length).toBeGreaterThan(pageCount);
      expect(component.myTeamResponse).not.toEqual(null);
    });
  });
  describe('get active inactive count', () => {
    it('should get active inactive count', () => {
      spyOn(component.tmService, 'getActiveAndLeaveCount').and.returnValue(
        of(bindToObject(new ActiveCount(), CountData))
      );
      component.getActiveCount();
      expect(component.activeCount).not.toEqual(null);
      expect(component.onLeaveCount).not.toEqual(null);
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      component.getReporteeSubscription = new Subscription();
      component.getReporteeSubscription.unsubscribe();
      component.getReportees();
      expect(component.getReporteeSubscription).not.toEqual(null);
    });
  });
  describe('navigation', () => {
    it('should navigate', () => {
      const reporteeId = 'e0026212';
      component.router.navigate([RouterConstants.ROUTE_VALIDATOR_PROFILE]);
      component.navigateToProfile(reporteeObject);
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_VALIDATOR_PROFILE]);
      expect(reporteeId).not.toEqual(null);
    });
  });
  describe('search with empty value', () => {
    it('should search with empty value', () => {
      const value = null;
      const event = null;
      component.searchbtn?.searchbutton?.nativeElement?.contains(null);
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.myTeamResponse = TeamManagementData;
      component.isSearched = true;
      spyOn(component, 'getCount').and.callThrough();
      spyOn(component, 'defaultPagination').and.callThrough();
      component.searchwithEmptyValue(value, event);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(component.myTeamResponse).not.toEqual(null);
      expect(component.myTeamResponse.response).not.toEqual(null);
    });
  });
});
