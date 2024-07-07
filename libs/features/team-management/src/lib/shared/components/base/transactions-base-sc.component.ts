/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AssignmentFilter,
  AuthTokenService,
  Environment,
  EnvironmentToken,
  FilterClause,
  RequestSort,
  RouterService,
  TransactionService,
  TransactionState,
  WorkflowService
} from '@gosi-ui/core';
import { BPMTaskConstants } from '@gosi-ui/core/lib/constants/bpm-task-list-constants';
import { TabProps } from '../../enums';
import { MyTeamResponse, ReporteeObject } from '../../models';
import { TeamManagementService } from '../../services';
import { TeamTransactionsNavDcComponent } from '../team-transactions-nav-dc/team-transactions-nav-dc.component';
import { TeamBaseScComponent } from './team-base-sc.component';

@Directive()
export abstract class TransactionsBaseScComponent extends TeamBaseScComponent implements OnInit {
  /**
   * local variables
   */
  assigneeId: string = null;
  sortItem: RequestSort = new RequestSort();
  reporteesList: ReporteeObject[];
  highPriorityTransactions = 0;
  mediumPriorityTransactions = 0;
  lowPriorityTransactions = 0;
  pendingTransactions = 0;
  olaExceededTransactions = 0;
  totalCount: number;
  allTransactionsCount: number;
  onholdTransactionsCount: number;
  isSupervisor: boolean;

  @ViewChild('navbar') navbar: TeamTransactionsNavDcComponent;

  /**
   *
   * @param tmService
   * @param workflowService
   */
  constructor(
    readonly tmService: TeamManagementService,
    readonly workflowService: WorkflowService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {
    super(workflowService, tmService, environment, transactionService, routerService, authTokenService);
  }

  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.fromTeam = true;
    this.getReportees();
  }
  /**
   * method to get reportee list
   */
  getReportees() {
    if (this.showCount) this.getCountTransactionsForAll();
    if (!this.tmService.myTeamInitialListOfReportees) {
      this.tmService.getMyTeamMembers().subscribe((response: MyTeamResponse) => {
        this.tmService.myTeamInitialListOfReportees = response;
        this.reporteesList = response.response;
        this.reporteesList?.forEach(item => {
          item = this.setResponse(item, true);
        });
      });
    } else {
      this.reporteesList = this.tmService.myTeamInitialListOfReportees.response;
      this.reporteesList?.forEach(item => {
        item = this.setResponse(item, true);
      });
    }
  }
  /**
   * method to get transactions count
   */
  getCountTransactionsForAll() {
    const totalCount = BPMTaskConstants.COUNT_REQUEST;
    totalCount.predicate.assignmentFilter = AssignmentFilter.REPORTEES;
    this.workflowService.getTransactionCount(totalCount, null).subscribe(response => {
      this.allTransactionsCount = response.taskCountResponse;
    });
    this.workflowService.getTransactionCount(this.getBPMRequest(1), null).subscribe(response => {
      this.onholdTransactionsCount = response.taskCountResponse;
    });
  }
  /**
   * method to assign withdrawn status
   */
  get withDrawnStateAssign() {
    const withdrawnClause = new FilterClause();
    withdrawnClause.column.columnName = TransactionState.STATE;
    withdrawnClause.operator = 'EQ';
    withdrawnClause.value = BPMTaskConstants.TRN_STATE_WITHDRAWN;
    return withdrawnClause;
  }
  /**
   * method to assign onHold status
   */
  get onHoldStateAssign() {
    const onholdClause = new FilterClause();
    onholdClause.column.columnName = TransactionState.STATE;
    onholdClause.operator = 'EQ';
    onholdClause.value = BPMTaskConstants.TRN_STATE_SUSPENDED;
    return onholdClause;
  }
  /**
   * method to assign return status
   */
  get returnStateAssign() {
    const returnClause = new FilterClause();
    returnClause.column.columnName = TransactionState.TEXTATTRIBUTE6;
    returnClause.operator = 'EQ';
    returnClause.value = 'RETURN';
    return returnClause;
  }
  /**
   * method to assign Assigned status
   */
  get assignStateAssign() {
    const assignClause = new FilterClause();
    assignClause.column.columnName = TransactionState.STATE;
    assignClause.operator = 'EQ';
    assignClause.value = BPMTaskConstants.TRN_STATE_ASSIGNED;
    return assignClause;
  }
  /**
   * method to get bpm request
   * @param index
   */
  getBPMRequest(index) {
    const request = JSON.parse(JSON.stringify(this.bpmRequest));
    const predicate = request.taskQuery.predicate;
    delete request.taskQuery;
    delete request.limit;
    request['predicate'] = predicate;
    if (index === 0 || index === 1) {
      request['predicate']['assignmentFilter'] = AssignmentFilter.REPORTEES;
      if (index === 1) {
        request['predicate']['predicate']['clause'] = [this.onHoldStateAssign];
      }
    } else {
      request['predicate']['assignmentFilter'] = AssignmentFilter.MY;
    }
    return request;
  }
  /**method to get transaction state
   *
   * @param assigneeId
   */
  getTransactionsAndStats(assigneeId) {
    this.onHold = false;
    this.isSupervisor =
      assigneeId === TabProps.ALL_TRANSACTIONS || assigneeId === TabProps.ONHOLD_TRANSACTIONS ? true : false;
    this.tmService.selectedTransactions.next([]);
    this.navbar?.resetNavBar();
    if (assigneeId === TabProps.ONHOLD_TRANSACTIONS) {
      this.onHold = true;
      assigneeId = null;
      this.getList(assigneeId, this.isSupervisor);
    } else if (assigneeId === TabProps.ALL_TRANSACTIONS) {
      assigneeId = null;
      this.getList(assigneeId, this.isSupervisor);
    } else {
      this.bpmRequest.taskQuery.predicate.assignmentFilter = AssignmentFilter.MY;
      this.getList(assigneeId, this.isSupervisor);
      this.getPerformance(30);
    }
  }

  /**
   * method to get current validator
   */
  getList(value: string = null, isSupervisor) {
    this.currentValidator = value;
    this.getRequest(isSupervisor);
  }
}
