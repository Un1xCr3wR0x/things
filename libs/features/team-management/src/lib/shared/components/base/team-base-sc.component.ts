/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnInit } from '@angular/core';
import {
  AssignmentFilter,
  AuthTokenService,
  BPMOperators,
  BPMTaskConstants,
  BPMTaskListBaseComponent,
  Channel,
  Environment,
  EnvironmentToken,
  RouterService,
  TransactionService,
  TransactionState,
  ValidatorStatus,
  WorkflowService
} from '@gosi-ui/core';
import { StatusLabelEnum } from '../../enums';
import { BlockPeriod, ReporteeObject } from '../../models';
import { TeamManagementService } from '../../services';
/**
 * variables
 */

@Directive()
export class TeamBaseScComponent extends BPMTaskListBaseComponent implements OnInit {
  showCount = true;
  /**
   *
   * @param workflowService
   * @param tmService
   */
  constructor(
    readonly workflowService: WorkflowService,
    readonly tmService: TeamManagementService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {
    super(workflowService, environment, transactionService, routerService, authTokenService);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.isWorkList = true;
    this.fromTeam = true;
  }
  /**
   * method to set count and response
   * @param reporteeItem
   * @param isCountOnly
   */
  setResponse(reporteeItem: ReporteeObject, isCountOnly = false) {
    const countRequest = { ...BPMTaskConstants.COUNT_REQUEST };
    countRequest.predicate.assignmentFilter = AssignmentFilter.REPORTEES;
    countRequest.predicate.predicate.clause.push({
      column: {
        columnName: TransactionState.ASSIGNEES
      },
      value: reporteeItem.id + ',user',
      operator: BPMOperators.EQUAL
    });
    if (this.showCount){
      this.workflowService.getTransactionCount(countRequest, reporteeItem?.id).subscribe(response => {
        reporteeItem.pendingTransaction = response?.taskCountResponse;
      });
      countRequest.predicate.predicate.clause.push({
        column: {
          columnName: TransactionState.PROTECTEDTEXTATTRIBUTE7
        },
        value: BPMTaskConstants.TRN_OLA_EXCEEDED,
        operator: BPMOperators.EQUAL
      });
      this.workflowService.getTransactionCount(countRequest, reporteeItem?.id).subscribe(response => {
        reporteeItem.olaCount = response?.taskCountResponse;
      });
      countRequest.predicate.predicate.clause.pop();
    }
    if (!isCountOnly)
      this.tmService.getVacationPeriods(reporteeItem?.id, true).subscribe((response: BlockPeriod[]) => {
        if (response?.length > 0) {
          if (response[0].channel === Channel.TAMAM) {
            reporteeItem.statusLabel = StatusLabelEnum.BLOCKED;
            reporteeItem.status = ValidatorStatus.BLOCKED;
          } else {
            reporteeItem.statusLabel = StatusLabelEnum.BLOCKED;
            reporteeItem.status = ValidatorStatus.BLOCKED;
          }
        } else if (response?.length === 0) {
          reporteeItem.statusLabel = StatusLabelEnum.ACTIVE;
          reporteeItem.status = ValidatorStatus.ACTIVE;
        }
      });
    if (this.tmService?.myTeamInitialListOfReportees?.response)
      this.tmService.myTeamInitialListOfReportees.response[
        this.tmService?.myTeamInitialListOfReportees?.response?.indexOf(
          this.tmService?.myTeamInitialListOfReportees?.response?.find(reportee => reportee?.id === reporteeItem?.id)
        )
      ] = reporteeItem;
    return reporteeItem;
  }
}
