/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertService, bindToObject, BPMTask, AuthTokenService, EnvironmentToken } from '@gosi-ui/core';
import { WorkflowService } from '@gosi-ui/core';
import { TeamManagementService } from '../../services';
import { FormBuilder } from '@angular/forms';
import { TabProps, TransactionModalTypeEnum } from '../../enums';
import { TransactionsBaseScComponent } from '../base/transactions-base-sc.component';
import { TeamTransactionsViewScComponent } from './team-transactions-view-sc.component';
import { BehaviorSubject, of } from 'rxjs';
import {
  ActiveReportee,
  genericError,
  TeamManagementData,
  BPMTaskResponse,
  AuthTokenServiceStub,
  WorkflowServiceStub
} from 'testing';
import { TeamRequest } from '../../models';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamTransactionsEntriesDcComponent } from '../team-transactions-entries-dc/team-transactions-entries-dc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeamTransactionsViewScComponent', () => {
  let component: TeamTransactionsViewScComponent;
  let fixture: ComponentFixture<TeamTransactionsViewScComponent>;

  beforeEach(() => {
    const bsModalServiceStub = () => ({ show: (template, config) => ({}) });
    const alertServiceStub = () => ({
      clearAlerts: () => ({}),
      showSuccess: object => ({}),
      showError: object => ({}),
      showSuccessByKey: object => ({})
    });
    const workflowServiceStubs = () => ({
      fetchBPMTaskList: (bpmrequest, userid) => ({ subscribe: f => f({}) }),
      getTransactionCount: (bpmrequest, userid) => ({ subscribe: f => f({}) }),
      getReporteeStatus: userid => ({ subscribe: f => f({}) }),
      getTransactionPriorityStatus: (assigneeid, noofdays) => ({ subscribe: f => f({}) }),
      getPendingCount: (bpmrequest, userid) => ({ subscribe: f => f({}) }),
      getTransactionSummary: (bpmrequest, userid) => ({ subscribe: f => f({}) }),
      getPriorityCount: (bpmrequest, userid) => ({ subscribe: f => f({}) })
    });
    const teamManagementServiceStub = () => ({
      openModal$: { subscribe: f => f({}) },
      selectedTransactions$: { subscribe: f => f({}) },
      openModal: { next: () => ({}) },
      selectedTransactions: {
        next: () => ({}),
        getValue: () => ({ map: () => ({}), length: {}, filter: () => ({}) })
      },
      reassignTask: (array, string, id, string1) => ({ subscribe: f => f({}) }),
      getActiveReportees: () => ({ subscribe: f => f({}) })
    });
    const formBuilderStub = () => ({
      array: array => ({}),
      group: object => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TeamTransactionsViewScComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: BsModalService, useFactory: bsModalServiceStub },
        { provide: AlertService, useFactory: alertServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        {
          provide: TeamManagementService,
          useFactory: teamManagementServiceStub
        },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    });
    fixture = TestBed.createComponent(TeamTransactionsViewScComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`tabProps has default value`, () => {
    expect(component.tabProps).toEqual(TabProps);
  });

  it(`selectedTab has default value`, () => {
    expect(component.selectedTab).toEqual(TabProps.ALL_TRANSACTIONS);
  });

  it(`teamMemberList has default value`, () => {
    expect(component.teamMemberList).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const alertServiceStub: AlertService = fixture.debugElement.injector.get(AlertService);
      const lang = new BehaviorSubject<string>('value');
      component.entries = new TeamTransactionsEntriesDcComponent(lang);
      spyOn(TransactionsBaseScComponent.prototype, 'ngOnInit');
      spyOn(component, 'formInitialization').and.callThrough();
      spyOn(component, 'openModal').and.callThrough();
      spyOn(alertServiceStub, 'clearAlerts').and.callThrough();
      component.ngOnInit();
      expect(TransactionsBaseScComponent.prototype.ngOnInit).toHaveBeenCalled();
      expect(component.formInitialization).toHaveBeenCalled();
      expect(component.openModal).toHaveBeenCalled();
      expect(alertServiceStub.clearAlerts).toHaveBeenCalled();
      expect(component.entries).not.toEqual(null);
    });
  });

  describe('formInitialization', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
      spyOn(formBuilderStub, 'array').and.callThrough();
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.formInitialization();
      expect(formBuilderStub.array).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe('searchTransactionsWithId', () => {
    it('Should set isSupervisor boolean as per the value', () => {
      spyOn(component, 'searchTransactions').and.callFake;
      component.selectedTab = TabProps.ALL_TRANSACTIONS;
      component.searchTransactionsWithId('101');
      expect(component.searchTransactions).toHaveBeenCalledWith('101', true);
    });
  });

  describe('sideMenuChange', () => {
    it('Should change sideMenu', () => {
      const id = 'e001234';
      component.selectedTab = '123';
      spyOn(component, 'getTransactionsAndStats').and.callThrough();
      component.sideMenuChange(id);
      expect(component.selectedTab).toEqual(id);
    });
  });
  describe('hideModal', () => {
    it('should show modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('txn array', () => {
    it('should show txn array', () => {
      const type = 'type';
      const transaction = 'transaction';
      spyOn(component.tmService.selectedTransactions, 'getValue').and.callThrough();
      spyOn(component.tmService.selectedTransactions, 'next').and.callThrough();
      component.transactionInObservableArray({ type, transaction });
      expect(type).not.toEqual(null);
      expect(transaction).not.toEqual(null);
    });
  });
  describe('openModal', () => {
    it('should show modal', () => {
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([]);
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
  });
  describe('modalChange', () => {
    it('should modalChange', () => {
      const key = 'afdhgfjkhu12343v';
      spyOn(component.tmService.openModal, 'next').and.callThrough();
      component.modalChange(key);
      expect(key).not.toEqual(null);
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.tmService, 'getActiveReportees').and.callThrough();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('action event', () => {
    it('should action event', () => {
      const event = 'reassign';
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component.tmService.selectedTransactions, 'getValue').and.callThrough();
      spyOn(component.tmService, 'reassignTask').and.returnValue(
        of(bindToObject(new TeamRequest(), TeamManagementData.response))
      );
      component.actionEvent();
      expect(event).not.toEqual(null);
      expect(component.reporteesList).not.toEqual(null);
    });
  });
  describe('get team member', () => {
    it('should get team member', () => {
      const reportee = ActiveReportee;
      component.selectedTab = component.tabProps.ALL_TRANSACTIONS;
      component.getTeamMembers();
      expect(reportee).not.toEqual(null);
    });
  });
  describe('clear selected txn', () => {
    it('should clear selected txn', () => {
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([]);
      component.clearSelectedTransactions();
      expect(component.tmService.selectedTransactions).toBeDefined();
    });
  });
  describe('filter txn', () => {
    it('should filter txn', () => {
      const item = 'state';
      component.selectedTab = TabProps.ALL_TRANSACTIONS;
      spyOn(component, 'filterTransactions').and.callThrough();
      component.onFilterTransactions(item);
      expect(component.selectedTab).not.toEqual(null);
    });
    it('should filter txn', () => {
      const item = 'state';
      component.selectedTab = null;
      spyOn(component, 'filterTransactions').and.callThrough();
      component.onFilterTransactions(item);
      expect(component.selectedTab).toEqual(null);
    });
  });
  describe('openModal', () => {
    it('should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([BPMTaskResponse]);
      component.openModal(modalRef);
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions).toBeDefined();
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
    it('should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([BPMTaskResponse]);
      const modal = TransactionModalTypeEnum.REASSIGN;
      component.openModal(modal);
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions).toBeDefined();
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
    it('should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([BPMTaskResponse]);
      const modal = TransactionModalTypeEnum.UNHOLD_AND_REASSIGN;
      component.openModal(modal);
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions).toBeDefined();
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
    it('should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([BPMTaskResponse]);
      const modal = TransactionModalTypeEnum.HOLD;
      component.openModal(modal);
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions).toBeDefined();
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
    it('should open modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.tmService.selectedTransactions = new BehaviorSubject<BPMTask[]>([BPMTaskResponse]);
      const modal = TransactionModalTypeEnum.UNHOLD;
      component.openModal(modal);
      expect(component.modalRef).not.toEqual(null);
      expect(component.tmService.selectedTransactions).toBeDefined();
      expect(component.tmService.selectedTransactions.getValue().length).not.toEqual(null);
    });
  });
});
