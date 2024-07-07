import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeEnum, ApplicationTypeToken, RouterData, RouterDataToken, bindToObject } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceStub, configListData, configListregularSession, ActivatedRouteStub } from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  SessionFilterRequest,
  SessionLimitRequest,
  SessionRequest,
  ConfigurationList,
  MbRouteConstants
} from '../../../../shared';
import { ConfigurationListDcComponent } from '../configuration-list-dc/configuration-list-dc.component';
import { SessionConfigurationScComponent } from './session-configuration-sc.component';
import { BehaviorSubject, of } from 'rxjs';

describe('SessionConfigurationScComponent', () => {
  let component: SessionConfigurationScComponent;
  let fixture: ComponentFixture<SessionConfigurationScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SessionConfigurationScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(SessionConfigurationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SessionConfigurationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      spyOn(component, 'getSessionRecords').and.callThrough();
      component.ngOnInit();
      expect(component).toBeTruthy();
    });
  });
  describe('test suite for filtering', () => {
    it('It should filter', () => {
      component.sessionList = new ConfigurationListDcComponent(new BehaviorSubject('en'));
      spyOn(component.sessionList, 'onResetPagination').and.callThrough();
      spyOn(component, 'getSessionRecords').and.callThrough();
      const filterItem = new SessionFilterRequest();
      component.sessionRequest = new SessionRequest();
      component.onFilter(filterItem);
      expect(component.sessionRequest.filter).toEqual(filterItem);
      expect(component.sessionRequest).toBeDefined();
      expect(component.sessionList.onResetPagination).toHaveBeenCalled();
      expect(component.sessionList).toBeDefined();
    });
  });
  describe('test suite for pagination ', () => {
    it('It should paginate', () => {
      spyOn(component, 'getSessionRecords').and.callThrough();
      const limit = new SessionLimitRequest();
      component.sessionRequest = new SessionRequest();
      component.onLimit(limit);
      expect(component.sessionRequest.limit).toEqual(limit);
      expect(component.sessionRequest).toBeDefined();
    });
  });
  describe('test suite for reset pagination ', () => {
    it('It should reset pagination', () => {
      component.sessionList = new ConfigurationListDcComponent(new BehaviorSubject('en'));
      spyOn(component.sessionList, 'onResetPagination').and.callThrough();
      component.resetPagination();
      expect(component.sessionList.onResetPagination).toHaveBeenCalled();
      expect(component.sessionList).toBeDefined();
    });
  });
  it('It should navigate to regular session', () => {
    const id = 36;
    const list = bindToObject(new ConfigurationList(), configListregularSession);
    const template = { elementRef: null, createEmbeddedView: null };
    component.isRegular = true;
    component.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS]);
    component.navigateToSessionDetails(list);
    expect(component.router.navigate).toBeDefined();
    expect(component.sessionId).not.toBe(null);
  });
  it('It should navigate to adhoc session', () => {
    const list = bindToObject(new ConfigurationList(), configListData);
    const template = { elementRef: null, createEmbeddedView: null };
    component.isRegular = true;
    component.router.navigate([MbRouteConstants.ROUTE_SESSION_CONFIGURATION_DETAILS]);
    component.navigateToSessionDetails(list);
    expect(component.router.navigate).toBeDefined();
    expect(component.sessionId).not.toBe(null);
  });
});
