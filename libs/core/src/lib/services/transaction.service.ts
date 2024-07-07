/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Transaction, TransactionWorkflowDetails, TaskCountResponse, Environment, NotificationCount, AppealResponse, AppealRequest, AppealDetailsResponse, PsFeaturesModel, BilingualText, Lov, LovList, RoleLovList } from '../models';
import { TransactionStatus } from '../enums/transaction-status';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap ,catchError} from 'rxjs/operators';
import { getChannel } from '../utils/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConstants, BPMTaskConstants } from '../constants';
import { EnvironmentToken } from '../tokens';
import { CryptoService } from './crypto.service';
import { Transactions } from '../models/transaction-globalsearch';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { AlertService } from './alert.service';
import { AppealOnViolationDetailsResponse } from '../models/appeal-on-violation-details-response';
import { IAppealOnViolation, ViolationTransaction } from '@gosi-ui/features/violations/lib/shared';
import { NotesTimelineResponse, NoteRequestPayload} from '@gosi-ui/foundation/transaction-tracing/lib/models';
declare const require;
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transaction: Transaction;
  private baseUrl = '/api/v1';
  private filterData: any;
  transactionsJson = require('transactions.json');
  workflowSubject = new Subject<TransactionWorkflowDetails>();
  notificationTotalCount = new BehaviorSubject<number>(null);
  notificationUnViewedCount = new BehaviorSubject<number>(null);
  transactionCount = new BehaviorSubject<number>(null);
  transactionCount$ = this.transactionCount.asObservable();
  transactionCountUncliamed = new BehaviorSubject<number>(null);
  transactionCountUnclaimed$ = this.transactionCountUncliamed.asObservable();
  notificationTotalCount$ = this.notificationTotalCount.asObservable();
  notificationUnViewedCount$ = this.notificationUnViewedCount.asObservable();
  currentTab: number;
  transGlobalSearchList= [];
  reassignSuccessMsg:BilingualText = new BilingualText();
  constructor(
    readonly http: HttpClient,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly cryptoService: CryptoService,
    readonly alertService :AlertService,
    @Inject(EnvironmentToken) readonly environment: Environment
  ) {}

  /**
   * Method to get the transaction
   */
  getTransactionDetails() {
    return this.transaction;
  }
  saveFilterData(data: any) {
    this.filterData = data;
  }
  getFilterData() {
    return this.filterData;
  }
  clearFilterData() {
    this.filterData = null;
  }

  /**
   * Method to set variable transaction
   * @param transaction
   */
  setTransactionDetails(transaction) {
    this.transaction = new Transaction().fromJsonToObject(transaction);
  }
  /**
   * return the subject that emits workflow retail
   * @returns workflowSubject
   */
  getWorkflowDetails() {
    return this.workflowSubject;
  }
  /**
   * Method to set variable workflow
   * @param workflow
   */
  setWorkflowDetails(workflow) {
    this.workflowSubject.next(workflow);
  }
  /**
   * Method to get the transaction from API
   * @param transactionTraceId
   */
  getTransaction(transactionTraceId) {
    const encryptedId = this.cryptoService.encrypt(transactionTraceId);
    const getTxnUrl = `${this.baseUrl}/transaction/${encryptedId}`;
    return this.http.get<Transaction>(getTxnUrl).pipe(
      map((transaction: Transaction) => {
        transaction.channel = getChannel(transaction?.channel?.english);
        return transaction;
      })
    );
  }

  getInboxCount() {
    const request = { ...BPMTaskConstants.COUNT_REQUEST };
    return this.http.post(AppConstants.INBOX_COUNT_URL, request).pipe(
      tap((res: TaskCountResponse) => {
        this.transactionCount.next(res.taskCountResponse);
      })
    );
  }
  getInboxCountUnclaimed() {
    const request = { ...BPMTaskConstants.COUNT_REQUEST_UNCLAIMED };
    return this.http.post(AppConstants.INBOX_COUNT_URL, request).pipe(
      tap((res: TaskCountResponse) => {
        this.transactionCountUncliamed.next(res.taskCountResponse);
      })
    );
  }

  getNotificationCount() {
    return this.http.get(`${AppConstants.NOTIFICATION_URL}?page.pageNo=0&page.size=1`).pipe(
      tap((res: NotificationCount) => {
        this.notificationUnViewedCount.next(res.unViewedCount);
        this.notificationTotalCount.next(res.totalCount);
      })
    );
  }

  navigate(transaction: Transaction) {
    if (transaction.status.english.toUpperCase() !== TransactionStatus.DRAFT.toUpperCase()) {
      this.transaction = transaction;
      this.router.navigate(['home', 'transactions', 'view', transaction.transactionId, transaction.transactionRefNo]);
    }
  }

  releaseTasks(taskId) {
    const apiUrl = `/api/process-manager/v1/taskservice/releasetasks`;

    const payload = {
      taskId: taskId
    };
    return this.http.post(apiUrl, payload);
  }
  accquireTasks(taskId) {
    const apiUrl = `/api/process-manager/v1/taskservice/acquiretasks`;

    const payload = {
      taskId: taskId
    };
    return this.http.post(apiUrl, payload);
  }
  resetTransaction() {
    this.transaction = null;
  }
  setTab(currentTab: number) {
    this.currentTab = currentTab;
  }
  getTab() {
    return this.currentTab;
  }

  /**
   * This method is to fetch the Transaction with transaction trace number
   * @param TraceNumber
   */
  getTransactionGlobalSearch(TraceNumber: number): Observable<Transactions> {
    const getTransactionUrl = `/api/v1/transaction-search/${TraceNumber}`;
      return this.http.get<Transactions>(getTransactionUrl);
    }

  getAppealDetails(transactionRefNo : number): Observable<AppealDetailsResponse>{
    let url = `${this.baseUrl}/appeal?transactionRefNumber=${transactionRefNo}`;
    return this.http.get<AppealDetailsResponse>(url);
  }

  getAppealOnViolationDetails(transactionRefNo : number): Observable<AppealOnViolationDetailsResponse>{
    let url = `${this.baseUrl}/appeal/aov?transactionRefNumber=${transactionRefNo}`;
    return this.http.get<AppealOnViolationDetailsResponse>(url);
  }


  getAppealDetailsById(appealId : number): Observable<AppealDetailsResponse>{
    let url = `${this.baseUrl}/appeal?appealId=${appealId}`;
    return this.http.get<AppealDetailsResponse>(url);
  }

  getAppealOnViolationDetailsById(appealId : number): Observable<AppealOnViolationDetailsResponse>{
    let url = `${this.baseUrl}/appeal/aov?appealId=${appealId}`;
    return this.http.get<AppealOnViolationDetailsResponse>(url);
  }

  getNotesTimeline(transactionTraceId: number): Observable<NotesTimelineResponse[]>{
    const url = `${this.baseUrl}/crm/notes?transactionRefNo=${transactionTraceId}`;
    return this.http.get<NotesTimelineResponse[]>(url);
  }

  submitNote(requestPayload: NoteRequestPayload){
    const url = `${this.baseUrl}/crm/notes`;
    return this.http.post<BilingualText>(url, requestPayload);
  }

  getViolationDetails(violationId: number, estRegNo: number): Observable<ViolationTransaction> {
    const url = `/api/v1/establishment/${estRegNo}/violation/${violationId}`;
    return this.http.get<ViolationTransaction>(url);
  }

  getAllowedPSFeatures(): Observable<PsFeaturesModel>{
    const url = `/api/v1/ppa-services/shared/features`;
    return this.http.get<PsFeaturesModel>(url);
  }

  submitAppeal(requestPaylod: AppealRequest){
    let url = `${this.baseUrl}/appeal`;
    return this.http.post<AppealResponse>(url, requestPaylod);
  }

  returnAppeal(requestPaylod: AppealRequest, appealId : number){
    let url = `${this.baseUrl}/appeal/${appealId}`;
    return this.http.patch<AppealResponse>(url, requestPaylod);
  }

  /** Method to call system params api to limit joining date of an engagement */
  getSystemParams(): Observable<SystemParameterWrapper[]> {
    const url = `/api/v1/lov/system-parameters?name=ReopenComplaintEnquiryEffectiveDate`;
    return this.http.get<SystemParameterWrapper[]>(url).pipe();
  }
  reassignTask(taskId, taskAssignee, type, comments) {
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
        this.alertService.showError(error?.error?.message);
        throw error;
      })
    );
  }
  setReassignSuccessMsg(reassignSuccessMsg){
    this.reassignSuccessMsg = reassignSuccessMsg
  }
  getReassignSuccessMsg(){
    return this.reassignSuccessMsg
  }
  reassignRequestClarification(
    payloadRequestClarification,
    titleEnglish?,
    socialInsuranceNo?,
    injuryId?,
    identifier?,
    assessmentReqId?
  ): Observable<number> {
    let url = '';
    titleEnglish === 'Close Complication' || titleEnglish === 'Close Injury'
      ? (url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/re-assign`)
      : url =`/api/v1/participant/${identifier}/assessment-request/${assessmentReqId}/re-assign`;
    return this.http.put<number>(url, payloadRequestClarification);
  }

  getAppealDetailsAov(appealId: number, transactionRefNumber: number): Observable<IAppealOnViolation> {
    const url = `/api/v1/appeal/${appealId}/getAppealDetails/aov`;
    return this.http.get<IAppealOnViolation>(url);
  }


 // **method to fetch swim lane role Lov list */
  getRoleLovList(): Observable<RoleLovList[]> {
    const url = `/api/v1/inbox-filter/role-type`;
    return this.http.get<RoleLovList[]>(url);
  }
  getTnxLovList(): Observable<RoleLovList[]> {
    const url = `/api/v1/inbox-filter/transaction-name`;
    return this.http.get<RoleLovList[]>(url);
  }
}
