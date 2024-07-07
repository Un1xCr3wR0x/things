/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BPMTask, AlertService, BilingualText, BPMTaskResponse, BPMResponse, Establishment } from '@gosi-ui/core';
import {
  ActiveCount,
  ActiveReportees,
  BlockPeriod,
  MyTeamResponse,
  VacationPeriod,
  VacationResponse,
  ActiveReporteeItem,
  ReporteeObject
} from '../models';
import { catchError, map } from 'rxjs/operators';
import { ReclaimTransactionDetails } from '../models/reclaim-transaction-details';
import { ReclaimRequest } from '../models/reclaim-request';
import { ReclaimPostResponse } from '../models/reclaim-post-response';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {
  /**
   * local variables
   */
  validatorProfile: ReporteeObject = null;

  openModal = new BehaviorSubject<string>(null);
  openModal$ = this.openModal.asObservable();

  selectedTransactions = new BehaviorSubject<BPMTask[]>([]);
  selectedTransactions$ = this.selectedTransactions.asObservable();

  teamUrl: string;
  teamTransactionsSideMenuResponse: MyTeamResponse = null;
  myTeamInitialListOfReportees: MyTeamResponse = null;
  private _selectedTab: string = null;
  /**
   *
   * @param http
   * @param alertService
   */
  constructor(readonly http: HttpClient, readonly alertService: AlertService) {}

  /**
   * Method to reassign the transaction
   * @param taskId
   */
  reassignTask(taskId, workflowUser = 'admin', taskAssignee, type, comments) {
    const body = {
      taskId,
      taskAssignees: { taskAssignee },
      isGroup: 'NA',
      type,
      comments,
      commentScope: 'BPM'
    };
    const claimTaskUrl = `/api/process-manager/v1/taskservice/reassigntasks`;
    return this.http.post(claimTaskUrl, body).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  get selectedTab(): string {
    return this._selectedTab;
  }

  set selectedTab(selectedTab: string) {
    this._selectedTab = selectedTab;
  }

  /**
   * Method to hold tasks
   * @param taskId
   */

  holdTask(taskId, comments) {
    const body = {
      taskId,
      comments
    };
    const url = `/api/process-manager/v1/taskservice/suspendtasks`;
    return this.http.post(url, body).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to unhold tasks
   * @param taskId
   */

  unHoldTask(taskId) {
    const body = {
      taskId
    };
    const url = `/api/process-manager/v1/taskservice/resumetasks`;
    return this.http.post(url, body).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to unhold and reassign the transaction
   * @param taskId
   */
  unholdAndReassignnTask(taskId, workflowUser = 'admin', taskAssignee, type, comments) {
    const body = {
      taskId,
      taskAssignees: { taskAssignee },
      isGroup: 'NA',
      type,
      comments,
      commentScope: 'BPM'
    };
    const claimTaskUrl = `/api/process-manager/v1/taskservice/unholdandreassigntasks`;
    return this.http.post(claimTaskUrl, body).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to get vacation periods
   * @param userId
   */
  getVacationPeriods(userId: string, isActiveVacation = false): Observable<BlockPeriod[]> {
    const vacationUrl = `/api/v1/vacation?userId=${userId}&isActiveVacation=${isActiveVacation}`;
    return this.http.get<BlockPeriod[]>(vacationUrl).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to add vacation periods
   * @param vacationObject
   */
  setVacationPeriods(vacationObject: VacationPeriod): Observable<VacationResponse> {
    const vacationUrl = `/api/v1/vacation`;
    return this.http.post<VacationResponse>(vacationUrl, vacationObject).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to update vacation periods
   * @param vacationObject
   * @param vacationPeriodId
   */
  updateVacationPeriods(vacationObject: VacationPeriod, vacationPeriodId: number): Observable<VacationResponse> {
    const vacationUrl = `/api/v1/vacation?vacationPeriodId=${vacationPeriodId}`;
    return this.http.put<VacationResponse>(vacationUrl, vacationObject).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  /**
   * Method to delete vacation periods
   * @param blockPeriod
   */
  deleteVacationPeriods(blockPeriod: BlockPeriod): Observable<BilingualText> {
    const vacationUrl = `/api/v1/vacation?vacationPeriodId=${blockPeriod.employeeVacationId}&userId=${blockPeriod.userId}`;
    return this.http.delete<BilingualText>(vacationUrl).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * Method to get the Team Members
   * @param request
   */
  getMyTeamMembers(workflowUser?: string) {
    let httpOptions = {};
    if (workflowUser) {
      const requestHeader = {
        workflowUser: workflowUser
      };
      httpOptions = {
        headers: new HttpHeaders(requestHeader)
      };
    }

    this.teamUrl = `/api/v1/team-task/team`;
    return this.http.get<MyTeamResponse>(this.teamUrl, httpOptions).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * method to show alerts
   * @param error
   */
  showAlerts(error) {
    this.alertService.showError(error?.error?.message);
  }
  /**
   * Method to get both active and leave count
   * @param userId
   */
  getActiveAndLeaveCount(): Observable<ActiveCount> {
    const countUrl = `/api/v1/user/reportee/summary`;
    return this.http.get<ActiveCount>(countUrl).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  /**
   * Method to get active reportees
   * @param userId
   */
  getActiveReportees(bpmResponse?: BPMTask[]): Observable<ActiveReporteeItem[]> {
    const reporteeUrl = `/api/v1/user/reportee`;
    let swimlaneRoles: string[] = [];
    if (bpmResponse) {
      bpmResponse.forEach(task => {
        if (!swimlaneRoles.includes(task.swimlaneRole)) {
          swimlaneRoles.push(task.swimlaneRole);
        }
      });
    }
    const params = new HttpParams({
      fromObject: { swimlaneRole: swimlaneRoles }
    });
    return this.http.get<ActiveReportees>(reporteeUrl, { params }).pipe(
      map(res => {
        const activeReportee: ActiveReporteeItem[] = [];
        res?.reportees.forEach((item: ActiveReporteeItem, index) => {
          activeReportee.push(new ActiveReporteeItem(item?.displayName, item?.userId, index + 1));
        });
        return activeReportee;
      }),
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
/**
   * Re
   *
   */

  getReclaimTransactionDetails(transactionRefNo: number): Observable<ReclaimTransactionDetails> {
    const url = `/api/v1/transaction/internal/admin-reclaim/${transactionRefNo}`;
    return this.http.get<ReclaimTransactionDetails>(url);
  }
  saveReclaimTransactionDetails(
    transactionRefNo: number,
    request: ReclaimRequest
    ): Observable<ReclaimPostResponse> {
      const url = `/api/v1/transaction/internal/admin-reclaim/${transactionRefNo}`;
        return this.http.post<ReclaimPostResponse>(url, request);
    }

  }

