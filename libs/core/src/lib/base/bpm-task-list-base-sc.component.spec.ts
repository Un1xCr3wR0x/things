/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowService } from '../services';
import { WorkflowServiceStub } from 'testing';
import { RouterDataToken, ApplicationTypeToken, LanguageToken, EnvironmentToken } from '../tokens';
import { ApplicationTypeEnum, SearchColumn, BPMOperators, TransactionState } from '../enums';
import { RouterData, BPMRequest, RequestSort, FilterClause, Column } from '../models';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BPMTaskConstants } from '../constants';
import { BPMTaskListBaseComponent } from './bpm-task-list-base-sc.component';

@Component({
  selector: 'inbox-base-derived'
})
export class DerivedBPMTaskListBaseComponent extends BPMTaskListBaseComponent {}
describe('BPMTaskListBaseComponent', () => {
  let component: DerivedBPMTaskListBaseComponent;
  let fixture: ComponentFixture<DerivedBPMTaskListBaseComponent>;

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
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      declarations: [DerivedBPMTaskListBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedBPMTaskListBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should get request', () => {
    it('should  get request', () => {
      component.workflowService.bpmRequest = null;
      spyOn(component, 'initiateSort').and.callThrough();
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'initiateRequest').and.callThrough();
      component.getRequest();
      expect(component.initiateSort).toHaveBeenCalled();
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.initiateRequest).toHaveBeenCalled();
    });
  });

  describe('should initiateSort', () => {
    it('initiateSort', () => {
      component.isWorkList = false;
      component.initiateSort();
      expect(component).toBeDefined();
    });
  });
  describe('should initiateSort', () => {
    it('initiateSort', () => {
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      spyOn(component, 'resetPagination').and.callThrough();
      component.initiateRequest();
      expect(component.resetPagination).toHaveBeenCalled();
    });
  });

  describe('should searchTransactions else case', () => {
    it('searchTransactions else case', () => {
      const value = null;
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      spyOn(component, 'initiateRequest').and.callThrough();
      component.searchTransactions(value, false);
      expect(component.initiateRequest).toHaveBeenCalled();
    });
  });
  describe('should onSort', () => {
    it('onSort', () => {
      const sort = new RequestSort();
      spyOn(component, 'resetPagination').and.callThrough();
      component.onSort(sort);
      expect(component.resetPagination).toHaveBeenCalled();
    });
  });

  describe('should filterTransactions if case', () => {
    it('filterTransactions if case', () => {
      const value = null;
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      spyOn(component, 'resetPagination').and.callThrough();
      component.filterTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
    });
  });
  describe('should filterTransactions else case Returned', () => {
    it('filterTransactions else case Returned', () => {
      const value = 'RETURNED';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      component.bpmRequest.taskQuery.predicate.predicate.clause[0] = new FilterClause();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column = new Column();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column.columnName = SearchColumn.TITLEENGLISH;
      const request = new FilterClause();
      const defaultRequest = new FilterClause();
      defaultRequest.column.columnName = TransactionState.STATE;
      defaultRequest.operator = BPMOperators.EQUAL;
      defaultRequest.value = BPMTaskConstants.TRN_STATE_ASSIGNED;
      request.column.columnName = TransactionState.TEXTATTRIBUTE6;
      request.operator = BPMOperators.EQUAL;
      request.value = BPMTaskConstants.TRN_STATE_RETURN;
      component.bpmRequest.join.joinOperator = BPMOperators.AND;
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getTotalCount').and.callThrough();
      spyOn(component, 'requestHandler').and.callThrough();
      component.filterTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.getTotalCount).toHaveBeenCalled();
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });
  describe('should filterTransactions else case Assigned', () => {
    it('filterTransactions else case Assigned', () => {
      const value = 'ASSIGNED';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      component.bpmRequest.taskQuery.predicate.predicate.clause[0] = new FilterClause();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column = new Column();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column.columnName = SearchColumn.TITLEENGLISH;
      const request = new FilterClause();
      const defaultRequest = new FilterClause();
      defaultRequest.column.columnName = TransactionState.STATE;
      defaultRequest.operator = BPMOperators.EQUAL;
      defaultRequest.value = BPMTaskConstants.TRN_STATE_ASSIGNED;
      request.column.columnName = TransactionState.SUBSTATE;
      request.operator = BPMOperators.NOT_EQUAL;
      request.value = BPMTaskConstants.TRN_STATE_REASSIGNED;
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getTotalCount').and.callThrough();
      spyOn(component, 'requestHandler').and.callThrough();
      component.filterTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.getTotalCount).toHaveBeenCalled();
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });
  describe('should filterTransactions else case Reassigned', () => {
    it('filterTransactions else case Reassigned', () => {
      const value = 'REASSIGNED';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      component.bpmRequest.taskQuery.predicate.predicate.clause[0] = new FilterClause();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column = new Column();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column.columnName = SearchColumn.TITLEENGLISH;
      const request = new FilterClause();
      const defaultRequest = new FilterClause();
      defaultRequest.column.columnName = TransactionState.STATE;
      defaultRequest.operator = BPMOperators.EQUAL;
      defaultRequest.value = BPMTaskConstants.TRN_STATE_ASSIGNED;
      request.column.columnName = TransactionState.SUBSTATE;
      request.operator = BPMOperators.EQUAL;
      request.value = BPMTaskConstants.TRN_STATE_REASSIGNED;
      component.bpmRequest.join.joinOperator = BPMOperators.AND;
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getTotalCount').and.callThrough();
      spyOn(component, 'requestHandler').and.callThrough();
      component.filterTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.getTotalCount).toHaveBeenCalled();
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });
  describe('should filterTransactions else case Withdrawn', () => {
    it('filterTransactions else case Withdrawn', () => {
      const value = 'WITHDRAWN';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      component.bpmRequest.taskQuery.predicate.predicate.clause[0] = new FilterClause();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column = new Column();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column.columnName = SearchColumn.TITLEENGLISH;
      const request = new FilterClause();
      const defaultRequest = new FilterClause();
      defaultRequest.column.columnName = TransactionState.STATE;
      defaultRequest.operator = BPMOperators.EQUAL;
      defaultRequest.value = BPMTaskConstants.TRN_STATE_ASSIGNED;
      request.column.columnName = TransactionState.STATE;
      request.operator = BPMOperators.EQUAL;
      request.value = BPMTaskConstants.TRN_STATE_WITHDRAWN;
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getTotalCount').and.callThrough();
      spyOn(component, 'requestHandler').and.callThrough();
      component.filterTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.getTotalCount).toHaveBeenCalled();
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });
  describe('should searchTransactions if case', () => {
    it('searchTransactions if case', () => {
      const value = 'abc';
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      component.bpmRequest.taskQuery.predicate.predicate.clause[0] = new FilterClause();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column = new Column();
      component.bpmRequest.taskQuery.predicate.predicate.clause[0].column.columnName = SearchColumn.TITLEENGLISH;
      const staleRequest = new FilterClause();
      staleRequest.operator = BPMOperators.NOT_EQUAL;
      staleRequest.value = BPMTaskConstants.TRN_STATE_STALE;
      staleRequest.column.columnName = TransactionState.STATE;
      component.bpmRequest.join.joinOperator = BPMOperators.AND;
      const request = new FilterClause();
      request.operator = BPMOperators.EQUAL;
      request.value = value;
      spyOn(component, 'resetPagination').and.callThrough();
      spyOn(component, 'getTotalCount').and.callThrough();
      component.searchTransactions(value, false);
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.getTotalCount).toHaveBeenCalled();
    });
  });
  describe('should getPageLimit', () => {
    it('getPageLimit', () => {
      const page = 2;
      component.itemsPerPage = 10;
      component.getPageLimit(page);
      expect(component.taskLimit.end).not.toBe(0);
      expect(component.taskLimit.start).not.toBe(0);
    });
  });
  describe('should selectPage', () => {
    it('selectPage', () => {
      const page = 2;
      component.currentPage = page;
      component.bpmRequest = new BPMRequest();
      spyOn(component, 'getPageLimit').and.callThrough();
      spyOn(component, 'requestHandler').and.callThrough();
      component.selectPage(page);
      expect(component.getPageLimit).toHaveBeenCalled();
      expect(component.requestHandler).toHaveBeenCalled();
    });
    describe('should getPerformance', () => {
      it('getPerformance', () => {
        const days = 2;
        component.getPerformance(days);
        expect(component.selectPage).toBeDefined();
      });
    });
  });

  describe('should resetPagination', () => {
    it('resetPagination', () => {
      component.taskLimit.end = 10;
      component.taskLimit.start = 1;
      component.bpmRequest = new BPMRequest();
      component.resetPagination();
      expect(component.bpmRequest.limit.start).not.toBe(null);
      expect(component.bpmRequest.limit.end).not.toBe(null);
    });
  });
});
