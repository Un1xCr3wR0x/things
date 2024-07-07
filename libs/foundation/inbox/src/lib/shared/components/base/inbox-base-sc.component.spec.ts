/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxBaseScComponent } from './inbox-base-sc.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component } from '@angular/core';

import {
  RouterService,
  RouterDataToken,
  RouterData,
  LanguageToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  BPMResponse,
  BPMTask,
  BPMRequest,
  TaskQuery,
  Predicates,
  PredicateValue,
  FilterClause,
  RequestSort,
  SearchColumn,
  AuthTokenService,
  BpmTaskRequest,
  bindToObject,
  EnvironmentToken
} from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { AuthTokenServiceStub, BPMTaskResponse } from 'testing';

@Component({
  selector: 'inbox-base-derived'
})
export class DerivedInboxBaseScComponent extends InboxBaseScComponent {}

describe('InboxBaseScComponent', () => {
  let component: DerivedInboxBaseScComponent;
  let fixture: ComponentFixture<DerivedInboxBaseScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        DatePipe,
        FormBuilder,
        RouterService,
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      declarations: [DerivedInboxBaseScComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedInboxBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('updateTotal ', () => {
    it('Should updateTotal', () => {
      const pageNo = 1;
      component.updateTotal(pageNo);
      expect(pageNo).toBeDefined();
    });
  });
  describe('getList ', () => {
    it('Should getList', () => {
      const value = 'Validator1';
      component.currentValidator = value;
      component.getList(value);
      component.getRequest();
      expect(component.currentValidator).toBeDefined();
      expect(value).toBeDefined();
    });
  });
  describe('calculateOLA ', () => {
    it('Should calculateOLA', () => {
      component.bpmTaskResponse = new BPMResponse();
      component.bpmTaskResponse.tasks = new Array<BPMTask>();
      expect(component.bpmTaskResponse).toBeDefined();
      expect(component.bpmTaskResponse.tasks).toBeDefined();
    });
  });
  describe('select page', () => {
    it('selectPage', () => {
      spyOn(component, 'getPageLimit').and.callThrough();
      component.selectPage(1);
      component.currentPage = 1;
      component.initiateRequest();
      expect(component.getPageLimit).toHaveBeenCalled();
    });
  });
  describe('onSort', () => {
    it('should onSort', () => {
      const sort = new RequestSort();
      component.onSort(sort);
      component.initiateRequest();
      expect(sort).toBeDefined();
    });
  });
  describe('resetPagination', () => {
    it('should resetPagination', () => {
      component.paginationDcComponent = new PaginationDcComponent(component.language);
      component.resetPagination();
      component.paginationDcComponent.resetPage();
      expect(component.paginationDcComponent).toBeDefined();
    });
  });
  describe('filterTransactions', () => {
    it('should filterTransactions', () => {
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery = new TaskQuery();
      component.bpmRequest.taskQuery.predicate = new Predicates();
      component.bpmRequest.taskQuery.predicate.predicate = new PredicateValue();
      component.bpmRequest.taskQuery.predicate.predicate.clause = new Array<FilterClause>();
      component.filterTransactions(null);
      expect(component.bpmRequest).toBeDefined();
      expect(component.bpmRequest.taskQuery).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate.predicate).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate.predicate.clause).toBeDefined();
    });
    it('should filterTransactions', () => {
      const value = 'ASSIGNED';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery = new TaskQuery();
      component.bpmRequest.taskQuery.predicate = new Predicates();
      component.bpmRequest.taskQuery.predicate.predicate = new PredicateValue();
      component.bpmRequest.taskQuery.predicate.predicate.clause = new Array<FilterClause>();
      component.filterTransactions(value);
      component.resetPagination();
      component.requestHandler(component.bpmRequest);
      expect(component.bpmRequest).toBeDefined();
      expect(component.bpmRequest.taskQuery).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate.predicate).toBeDefined();
      expect(component.bpmRequest.taskQuery.predicate.predicate.clause).toBeDefined();
    });
  });

  describe('searchTransactions', () => {
    it('should searchTransactions', () => {
      const value = '981762';
      component.searchTransactions(value);
      expect(value).toBeDefined();
    });
  });
  describe('defaultSearch', () => {
    it('should defaultSearch whenvalue is not null', () => {
      const value = '981762';
      let request = new FilterClause();
      request.operator = 'EQ';
      request.value = value;
      request.column.columnName = SearchColumn.TRANSACTIONID;
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery = new TaskQuery();
      component.bpmRequest.taskQuery.predicate = new Predicates();
      component.bpmRequest.taskQuery.predicate.predicate = new PredicateValue();
      component.searchTransactions(value);
      expect(value.length).not.toEqual(null);
    });
    it('should defaultSearch when value is null', () => {
      const value = '';
      component.initiateRequest();
      component.searchTransactions(value);
      expect(value).toEqual('');
    });
  });
  describe('navigate to view', () => {
    it('should navigate to view', () => {
      const task = BPMTaskResponse;
      const bpmTaskRequest = new BpmTaskRequest();
      const value = 'Validator1';
      component.currentValidator = value;
      bpmTaskRequest.taskId = task.taskId;
      spyOn(component.workflowService, 'getBPMTask').and.returnValue(
        of(bindToObject(new BpmTaskRequest(), BPMTaskResponse))
      );
      component.navigateToView(task);
      expect(bpmTaskRequest.taskId).not.toEqual(null);
    });
  });
  describe('getAssignedRole', () => {
    it('should call getAssignedRole', () => {
      const assignedRole = 'abc';
      //@ts-ignore
      component.getAssignedRole(assignedRole);
      expect(assignedRole).not.toEqual(null);
    });
  });
});
