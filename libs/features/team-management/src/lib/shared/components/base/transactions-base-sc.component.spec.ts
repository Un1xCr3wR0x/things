/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsBaseScComponent } from './transactions-base-sc.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Component } from '@angular/core';

import {
  RouterService,
  RouterDataToken,
  RouterData,
  LanguageToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  TransactionState,
  BPMTaskConstants,
  bindToObject,
  GetPriorityResponse,
  BPMRequest,
  AssignmentFilter,
  EnvironmentToken
} from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { PriorityList, TeamManagementData } from 'testing';
import { TabProps } from '../../enums';
import { TeamRequest } from '../../models';

@Component({
  selector: 'transactions-base-derived'
})
export class DerivedTransactionsBaseScComponent extends TransactionsBaseScComponent {}

describe('TransactionsBaseScComponent', () => {
  let component: DerivedTransactionsBaseScComponent;
  let fixture: ComponentFixture<DerivedTransactionsBaseScComponent>;

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
        DatePipe,
        FormBuilder,
        RouterService,
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      declarations: [DerivedTransactionsBaseScComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedTransactionsBaseScComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('withDrawnStateAssign', () => {
    it('Should get withDrawnStateAssign', () => {
      const clause = component.withDrawnStateAssign;
      expect(clause.column.columnName).toBe(TransactionState.STATE);
      expect(clause.operator).toBe('EQ');
      expect(clause.value).toBe(BPMTaskConstants.TRN_STATE_WITHDRAWN);
    });
  });
  describe('returnStateAssign', () => {
    it('Should get returnStateAssign', () => {
      const clause = component.returnStateAssign;
      expect(clause.column.columnName).toBe(TransactionState.TEXTATTRIBUTE6);
      expect(clause.operator).toBe('EQ');
      expect(clause.value).toBe('RETURN');
    });
  });
  describe('assignStateAssign', () => {
    it('Should get assignStateAssign', () => {
      const clause = component.assignStateAssign;
      expect(clause.column.columnName).toBe(TransactionState.STATE);
      expect(clause.operator).toBe('EQ');
      expect(clause.value).toBe(BPMTaskConstants.TRN_STATE_ASSIGNED);
    });
  });

  describe('get the list of transactions', () => {
    it('Should get the list of transactions', () => {
      spyOn(component, 'getRequest').and.callThrough();
      component.getList('admin', true);
      expect(component.currentValidator).toBe('admin');
      expect(component.getRequest).toHaveBeenCalledWith(true);
    });
  });
  describe(' getTransactionsAndStats', () => {
    it('Should getTransactionsAndStats', () => {
      const assigneeId = TabProps.ALL_TRANSACTIONS;
      component.getTransactionsAndStats(assigneeId);
      expect(component.isSupervisor).not.toEqual(null);
    });
    it('Should getTransactionsAndStats', () => {
      const assigneeId = TabProps.ONHOLD_TRANSACTIONS;
      component.getTransactionsAndStats(assigneeId);
      expect(component.isSupervisor).not.toEqual(null);
    });
    it('Should getTransactionsAndStats', () => {
      const assigneeId = null;
      component.bpmRequest = new BPMRequest();
      component.bpmRequest.taskQuery.predicate.assignmentFilter = AssignmentFilter.MY;
      component.getTransactionsAndStats(assigneeId);
      expect(component.bpmRequest.taskQuery.predicate.assignmentFilter).not.toEqual(null);
    });
  });
  describe('get reportees', () => {
    it('Should get reportees', () => {
      component.tmService.myTeamInitialListOfReportees = null;
      spyOn(component.tmService, 'getMyTeamMembers').and.returnValue(
        of(bindToObject(new TeamRequest(), TeamManagementData))
      );
      component.getReportees();
      expect(component.reporteesList).not.toEqual(null);
    });
    it('Should get reportees', () => {
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.getReportees();
      expect(component.reporteesList).not.toEqual(null);
    });
  });
});
