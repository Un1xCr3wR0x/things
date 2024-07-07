/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppConstants, BPMTaskConstants } from '../constants';
import { BPMOperators, WorkFlowActions } from '../enums';

import { AlertService } from './alert.service';
import { CryptoService } from './crypto.service';
import { IdentityManagementService } from './identity-management.service';
import {
  buildMergePayload,
  removeTaskNullValues,
  setCommentRequest,
  setCommentResponse,
  setTicketCommentResponse
} from '../utils/common';
import { BpmTaskRequest } from '../models/bpm-task-request';
import { BPMResponse, BPMTask, TaskCountResponse } from '../models/bpm-tasks';
import { BPMUpdateRequest } from '../models/bpm-update-request';
import { GetPriorityResponse } from '../models/get-priority-response';
import { ItTicketHistory } from '../models/it-ticket-history';
import { ItTicketRequest } from '../models/it-ticket-request';
import { TransactionReferenceData } from '../models/transaction-reference-data';
import { TransactionWorkflowDetails } from '../models/transaction-workflow-item';
import { BilingualText, BPMPriorityResponse, BPMRequest, ItTicketV2Request } from '../models';
import { ITSMReopenRequest } from '../models/ITSM-Reopen-Request';


/**
 * StorageService for handling browser default
 * localstorage and sessionstorage
 */
@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private responseMessage: BilingualText;
  private _bpmRequest: BPMRequest = undefined;
  private _bpmRequestUnclaimed: BPMRequest = undefined;
  private _teamRequest: BPMRequest = null;
  private _ticketHistory: BehaviorSubject<ItTicketHistory[]> = new BehaviorSubject<ItTicketHistory[]>([]);
  ticketHistory$: Observable<ItTicketHistory[]> = this._ticketHistory.asObservable();
  /**
   * Creates an instance of WorkflowService
   * @memberof  WorkflowService
   * @param _http
   */
  constructor(
    readonly _http: HttpClient,
    readonly alertService: AlertService,
    readonly cryptoService: CryptoService,
    readonly identityManagementService: IdentityManagementService
  ) {}

  /**
   * Method to get task details
   * @param bpmTaskRequest
   * @param headers
   */
  getBPMTask(bpmTaskRequest: BpmTaskRequest, headers?: HttpHeaders) {
    const httpOptions = {
      headers: new HttpHeaders({ bpmTaskId: bpmTaskRequest.taskId })
    };
    return this._http
      .post<BPMTask>('/api/process-manager/v1/task/taskdetailsbyid', { taskId: bpmTaskRequest.taskId }, httpOptions)
      .pipe(
        map((task: BPMTask) => {
          task.assigneeName = task.systemAttributes.assignees.displayName;
          return task;
        })
      );
  }

  get teamRequest(): BPMRequest {
    return this._teamRequest;
  }

  set teamRequest(teamRequest: BPMRequest) {
    this._teamRequest = teamRequest;
  }

  setValidatorResponse(message: BilingualText) {
    if (message) {
      this.responseMessage = new BilingualText();
      this.responseMessage.english = message.english;
      this.responseMessage.arabic = message.arabic;
    } else {
      this.responseMessage = null;
    }
  }

  getValidatorResponse() {
    return this.responseMessage;
  }

  /**
   * This method is used to update the BPM Workflow
   */
  updateTaskWorkflow(bpmUpdateRequest: BPMUpdateRequest, outcome = WorkFlowActions.UPDATE, headers?: HttpHeaders) {
    if (bpmUpdateRequest) {
      const taskUpdateUrl = `/api/process-manager/v1/taskservice/update`;
      let updateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      updateRequest.outcome = bpmUpdateRequest.outcome;
      updateRequest.roleId = bpmUpdateRequest.roleId;
      updateRequest = setCommentRequest(updateRequest, bpmUpdateRequest);
      updateRequest.isExternalComment = bpmUpdateRequest?.isExternalComment
        ? bpmUpdateRequest?.isExternalComment
        : false;
      if (bpmUpdateRequest.rejectionReason) updateRequest.rejectionReason = bpmUpdateRequest.rejectionReason;
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = bpmUpdateRequest.taskId;
      bpmTaskRequest.workflowUser = bpmUpdateRequest.user;
      const httpOptions = this.setRequestHeaders(bpmTaskRequest, headers);
      return this._http.post<BilingualText>(taskUpdateUrl, updateRequest, httpOptions);
    }
  }
  /**
   * Method to set headers for BPM request
   * @param request
   * @param headers
   */
  setRequestHeaders(request: BpmTaskRequest, headers: HttpHeaders) {
    const requestHeader = Object.assign(
      {
        workflowUser: `${request?.workflowUser}`,
        bpmTaskId: `${request?.taskId}`
      },
      headers
    );
    const httpOptions = {
      headers: new HttpHeaders({ ...requestHeader })
    };
    return httpOptions;
  }

  /**
   * This method is to get workflow details
   * @param traceId
   */
  getWorkFlowDetails(traceId: number): Observable<TransactionWorkflowDetails> {
    const encryptedId = this.cryptoService.encrypt(traceId);
    const url = `/api/v1/transaction/${encryptedId}/workflow`;
    return this._http.get<TransactionWorkflowDetails>(url).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  getCommentsUsingTask(bpmTaskRequest: BpmTaskRequest): Observable<TransactionReferenceData[]> {
    const httpOptions = {
      headers: new HttpHeaders({ bpmTaskId: bpmTaskRequest.taskId, workflowUser: bpmTaskRequest.workflowUser })
    };
    return this._http
      .post<BPMTask>('/api/process-manager/v1/task/taskdetailsbyid', { taskId: bpmTaskRequest.taskId }, httpOptions)
      .pipe(
        map((task: BPMTask) => {
          return setCommentResponse(task);
        })
      );
  }

  /**
   * Method to get the transaction Comments
   * @param taskId
   */
  getCommentsById(
    bpmTaskRequest: BpmTaskRequest,
    transactionRefNo?: number,
    getAllTickets = false
  ): Observable<TransactionReferenceData[]> {
    const httpOptions = {
      headers: new HttpHeaders({ bpmTaskId: bpmTaskRequest.taskId, workflowUser: bpmTaskRequest.workflowUser })
    };
    return this._http.get<BPMTask>('/api/process-manager/v1/task/comment', httpOptions).pipe(
      switchMap(res => this.getDisplayName(res)),
      switchMap((response: BPMTask) => {
        const validatorComments = setCommentResponse(response);
        let comments: TransactionReferenceData[] = [];
        comments.push(...validatorComments);
        if (transactionRefNo) {
          return this.getTicketComments(transactionRefNo, getAllTickets).pipe(
            map(
              (resolverComments: TransactionReferenceData[]) => {
                comments.push(...resolverComments);
                comments = comments?.sort(
                  (v1, v2) => Number(new Date(v2.createdDate.gregorian)) - Number(new Date(v1.createdDate.gregorian))
                );
                return comments;
              },
              catchError(() => of(comments))
            )
          );
        } else return of(comments);
      })
    );
  }

  /**
   * Method to get the display name from IAM
   * @param bpmTask
   */
  getDisplayName(bpmTask: BPMTask): Observable<BPMTask> {
    if (
      bpmTask?.initiatorComment !== null &&
      bpmTask?.initiatorComment !== BPMOperators.NULL &&
      bpmTask?.initiatorUserId?.toString().toLowerCase() !== AppConstants.GOSI.toLowerCase()
    )
      return this.identityManagementService.getProfile(bpmTask.initiatorUserId).pipe(
        map(profile => {
          bpmTask.initiatorUserId = profile?.longNameArabic;
          return bpmTask;
        }),
        catchError(() => of(bpmTask))
      );
    else return of(bpmTask);
  }

  /**
   * Method to update task priority
   * @param request
   * @param headers
   */
  updateTaskPriority(request: BPMUpdateRequest, headers?: HttpHeaders) {
    const url = `/api/process-manager/v1/taskservice/priority`;
    const bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.priority = request.priority;
    bpmUpdateRequest.updateType = request.updateType;
    bpmUpdateRequest.commentScope = undefined;
    bpmUpdateRequest.outcome = undefined;
    const bpmTaskRequest = new BpmTaskRequest();
    bpmTaskRequest.taskId = request.taskId;
    bpmTaskRequest.workflowUser = request.user;
    const httpOptions = this.setRequestHeaders(bpmTaskRequest, headers);
    return this._http.post(url, bpmUpdateRequest, httpOptions);
  }
  /**
   * Method to assign a task to a specific user
   * @param request
   * @param headers
   */
  mergeAndUpdateTask(request: BPMUpdateRequest, headers?: HttpHeaders) {
    const url = `/api/process-manager/v1/taskservice/mergeandupdate`;
    let bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.payload = request?.payload;
    if (bpmUpdateRequest?.payload) {
      [...request?.updateMap?.keys()]?.forEach(item => {
        const keys = item?.split('.');
        bpmUpdateRequest.payload = buildMergePayload(bpmUpdateRequest?.payload, keys, 0, request?.updateMap?.get(item));
      });
      bpmUpdateRequest.payload = removeTaskNullValues(bpmUpdateRequest?.payload);
    }
    bpmUpdateRequest.isGccEstablishment = request?.isGccEstablishment;
    bpmUpdateRequest.outcome = request?.outcome;
    bpmUpdateRequest.roleId = request?.roleId;
    bpmUpdateRequest.isExternalComment = request?.isExternalComment;
    if (request?.rejectionReason) bpmUpdateRequest.rejectionReason = request?.rejectionReason;
    if (request?.organizationUser) bpmUpdateRequest.organizationUser = request?.organizationUser;
    bpmUpdateRequest = setCommentRequest(bpmUpdateRequest, request);
    const bpmTaskRequest = new BpmTaskRequest();
    bpmTaskRequest.taskId = request?.taskId;
    bpmTaskRequest.workflowUser = request?.user;
    bpmTaskRequest.workflowUser = request?.user;
    const httpOptions = this.setRequestHeaders(bpmTaskRequest, headers);
    delete bpmUpdateRequest?.updateMap;
    return this._http.post(url, bpmUpdateRequest, httpOptions);
  }
  /**
   * Method to raise ITSM ticket
   * @param request
   */
  raiseItTicket(request: ItTicketRequest) {
    const itsmRequest = {
      Summary: request.ticketSummary,
      Notes: request.ticketNotes
    };
    const url = `/api/v1/support-ticket/Helpdesk_Submit_Service`;
    return this._http.post(url, itsmRequest);
  }

  /**
   * Method to raise ITSM ticket
   * @param request
   */
  raiseItTicketV2(request: ItTicketV2Request) {
    const itsmRequest = {
      type: request.type,
      subtype: request.subtype,
      detailDescription: request.detailDescription,
      attachmentName1: request.attachmentName1,
      attachmentContent1: request.attachmentContent1,
      attachmentName2: request.attachmentName2,
      attachmentContent2: request.attachmentContent2,
      attachmentName3: request.attachmentName3,
      attachmentContent3: request.attachmentContent3,
      service: request.service,
      paymentStop: request.paymentStop,
      financialImpact: request.financialImpact
    };
    const url = `/api/v2/support-ticket/Helpdesk_Submit_Service`;
    return this._http.post(url, itsmRequest);
  }

  raiseItTicketReopen(request: ITSMReopenRequest) {
    const itsmRequest = {
      notes: request.notes,
      incidentNumber: request.incidentNumber
    };
    const url = `/api/v2/support-ticket/reopen`;
    return this._http.post(url, itsmRequest);
  }

  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }

  /**
   * Method to get list of transactions from BPM
   */

  fetchBPMTaskListUnClaimed(bpmRequest: BPMRequest, userId: string, fromTeam = false) {
    if (!fromTeam) this._bpmRequestUnclaimed = bpmRequest;
    this.alertService.clearAllErrorAlerts();
    let httpOptions = {};
    if (userId) {
      const requestHeader = {
        workflowUser: userId
      };
      httpOptions = {
        headers: new HttpHeaders(requestHeader)
      };
    }
    const url = `/api/process-manager/v1/task/query`;
    return this._http.post(url, bpmRequest, httpOptions).pipe(
      map((res: BPMResponse) => {
        res.tasks.forEach(item => {
          item.assigneeId = item.assignees.id;
          item.transactionId = item.referenceNo;
          if (
            item.previousOutcome === BPMTaskConstants.TRN_STATE_RETURN &&
            item.state === BPMTaskConstants.TRN_STATE_ASSIGNED &&
            item.subState === undefined
          ) {
            item.state = BPMTaskConstants.TRN_STATE_RETURN;
          } else if (
            item.subState &&
            item.subState === BPMTaskConstants.TRN_STATE_REASSIGNED &&
            item.state === BPMTaskConstants.TRN_STATE_ASSIGNED
          ) {
            item.state = BPMTaskConstants.TRN_STATE_REASSIGNED;
          }
        });
        return res;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
  fetchBPMTaskList(bpmRequest: BPMRequest, userId: string, fromTeam = false) {
    if (!fromTeam) this.bpmRequest = bpmRequest;
    else this.teamRequest = bpmRequest;
    this.alertService.clearAllErrorAlerts();
    let httpOptions = {};
    if (userId) {
      const requestHeader = {
        workflowUser: userId
      };
      httpOptions = {
        headers: new HttpHeaders(requestHeader)
      };
    }
    const url = `/api/process-manager/v1/task/query`;
    return this._http.post(url, bpmRequest, httpOptions).pipe(
      map((res: BPMResponse) => {
        res.tasks.forEach(item => {
          item.assigneeId = item.assignees.id;
          item.transactionId = item.referenceNo;
          if (
            item.previousOutcome === BPMTaskConstants.TRN_STATE_RETURN &&
            item.state === BPMTaskConstants.TRN_STATE_ASSIGNED &&
            item.subState === undefined
          ) {
            item.state = BPMTaskConstants.TRN_STATE_RETURN;
          } else if (
            item.subState &&
            item.subState === BPMTaskConstants.TRN_STATE_REASSIGNED &&
            item.state === BPMTaskConstants.TRN_STATE_ASSIGNED
          ) {
            item.state = BPMTaskConstants.TRN_STATE_REASSIGNED;
          }
        });
        return res;
      }),
      catchError(error => {
        this.alertService.showError(error?.error?.message);
        return of(null);
      })
    );
  }
  get bpmRequest(): BPMRequest {
    return this._bpmRequest;
  }
  get BPMRequestUnclaimed(): BPMRequest {
    return this._bpmRequestUnclaimed;
  }

  set bpmRequest(bpmRequest: BPMRequest) {
    this._bpmRequest = bpmRequest;
  }
  /**
   *
   *get priority count
   */
  getTransactionSummary(bpmReportRequest, userId: string) {
    this.alertService.clearAllErrorAlerts();
    let httpOptions = {};
    if (userId) {
      const requestHeader = {
        workflowUser: userId
      };
      httpOptions = {
        headers: new HttpHeaders(requestHeader)
      };
    }
    return this._http.post('/api/process-manager/v1/task/taskcountsummary', bpmReportRequest, httpOptions).pipe(
      map(res => {
        return <BPMPriorityResponse>res;
      }),
      catchError(err => this.handleError(err))
    );
  }
  /**
   * method to get transaction count
   * @param bpmRequest
   * @param userId
   */
  getTransactionCount(bpmRequest, userId: string) {
    this.alertService.clearAllErrorAlerts();
    let httpOptions = {};
    if (userId) {
      const requestHeader = {
        workflowUser: userId
      };
      httpOptions = {
        headers: new HttpHeaders(requestHeader)
      };
    }
    return this._http.post(AppConstants.INBOX_COUNT_URL, bpmRequest, httpOptions).pipe(
      map(res => {
        return <TaskCountResponse>res;
      }),
      catchError(err => this.handleError(err))
    );
  }
  // service to get priority data for transaction priority INBOX
  getTransactionPriorityStatus(assigneeId: string, noOfDays: number): Observable<GetPriorityResponse> {
    this.alertService.clearAllErrorAlerts();
    const httpOptions = {
      headers: new HttpHeaders({
        userId: assigneeId
      })
    };
    const url = `/api/v1/worklist/performance?noOfDays=${noOfDays}`;
    return this._http.get<GetPriorityResponse>(url, httpOptions).pipe(catchError(err => this.handleError(err)));
  }
  /**
   * This method is to handle error response.
   * @private
   * @param {string} msg
   * @returns
   * @memberof LookupService
   */
  private handleError(msg: string) {
    return throwError(msg);
  }
  /**
   * Method to get IT ticket history
   * @param referenceNo
   */
  getTicketHistory(referenceNo: number): Observable<ItTicketHistory[]> {
    const encryptedId = this.cryptoService.encrypt(referenceNo);
    const url = `/api/v1/transaction/${encryptedId}/supportticket`;
    return this._http
      .get<ItTicketHistory[]>(url)
      .pipe(
        map(res =>
          res?.sort((v1, v2) => Number(new Date(v2.createdDate.gregorian)) - Number(new Date(v1.createdDate.gregorian)))
        )
      );
  }
  /**
   * Method to get IT ticket resolved comments
   */
  getTicketComments(referenceNo: number, getAllTickets = false): Observable<TransactionReferenceData[]> {
    return this.getTicketHistory(referenceNo).pipe(
      tap(res => {
        this.ticketHistory = res;
      }),
      map(res => {
        return setTicketCommentResponse(res, getAllTickets);
      })
    );
  }
  set ticketHistory(ticketHistory: ItTicketHistory[]) {
    this._ticketHistory.next(ticketHistory);
  }

  updateAllowanceTaskWorkflow(
    bpmUpdateRequest: BPMUpdateRequest,
    outcome = WorkFlowActions.UPDATE,
    headers?: HttpHeaders
  ) {
    if (bpmUpdateRequest) {
      const taskUpdateUrl = `/api/process-manager/v1/taskservice/update`;
      let updateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      updateRequest.outcome = bpmUpdateRequest.outcome;
      updateRequest = setCommentRequest(updateRequest, bpmUpdateRequest);
      updateRequest.isExternalComment = bpmUpdateRequest.isExternalComment;
      if (bpmUpdateRequest.rejectionReason) updateRequest.rejectionReason = bpmUpdateRequest.rejectionReason;
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = bpmUpdateRequest.taskId;
      bpmTaskRequest.workflowUser = bpmUpdateRequest.user;
      const httpOptions = this.setRequestHeaders(bpmTaskRequest, headers);
      return this._http.post<BilingualText>(taskUpdateUrl, updateRequest, httpOptions);
    }
  }
}
