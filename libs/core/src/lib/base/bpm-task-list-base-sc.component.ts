/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject } from '@angular/core';

import {
  AssignmentFilter,
  BPMTransactionStatus,
  TransactionState,
  SearchColumn,
  BPMOperators,
  SortDirectionEnum,
  TransactionStatus
} from '../enums';
import { BPMTaskConstants } from '../constants';
import { Subscription, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { EnvironmentToken } from '../tokens';
import { setCommentResponse } from '../utils/common';
import { WorkflowService } from '../services/workflow.service';
import { TransactionService } from '../services/transaction.service';
import { RouterService } from '../services/router.service';
import { AuthTokenService } from '../services/auth-token.service';
import { LovList } from '../models/lov-list';
import { BPMResponse, BPMTask, FilterClause, Limit, Ordering, SortClause, TaskCountResponse } from '../models/bpm-tasks';
import { RequestSort } from '../models/request-sort';
import { BPMRequest } from '../models/bpm-request';
import { BpmTaskRequest } from '../models/bpm-task-request';
import { BPMPriorityResponse } from '../models/bpm-priority-response';
import { Environment } from '../models/environment';
import { BpmPendingCount } from '../models/bpm-pending-count';
import {ClaimedTransactionExpiryTime} from '@gosi-ui/core/lib/models/claimed-transaction-expiry-time'
import * as moment from 'moment';
import { BilingualText } from '../models';
@Directive()
export abstract class BPMTaskListBaseComponent {
  bpmRequest = new BPMRequest();
  bpmRequestUnclaimed = new BPMRequest();
  taskLimit: Limit = {
    start: 1,
    end: 10
  };
  sortItem: RequestSort = new RequestSort();
  isValidator: boolean;
  currentValidator: string = null;
  bpmTaskResponse: BPMResponse;
  bpmTaskResponseUnclaimed: BPMResponse;
  claimedTransactions: ClaimedTransactionExpiryTime[] = new Array<ClaimedTransactionExpiryTime>();
  priorityResponse: BPMPriorityResponse = new BPMPriorityResponse();
  countResponse: BpmPendingCount = new BpmPendingCount();
  currentPage = 1;
  isWorkList: boolean;
  sortList: LovList;
  inboxCount = new BehaviorSubject<number>(null);
  inboxCount$ = this.inboxCount.asObservable();
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  unViewed = 0;
  itemsPerPage = 10;
  httpSubscriptionClaimed: Subscription;
  httpSubscriptionUnClaimed: Subscription;
  selectedDay = 1;
  onHold = false;
  isSearched = false;
  isLoaded = false;
  selectedFilterStatus: BPMTransactionStatus;
  searchParam: string;
  fromTeam = false;
  apiInProgress = false;
  clearSearchView: boolean = false;
  olaSlaFilters: BilingualText[] = [];
  tnxFilters: string[] = [];
  roleFilters: string[] = [];
  currentGoToPage: boolean = false;
  constructor(
    readonly workflowService: WorkflowService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {}
  /**
   * method to get request
   */
  getRequest(isSupervisor = false, isValidator = this.isValidator) {
    if (!this.fromTeam) {
      if (
        this.workflowService.bpmRequest === undefined ||
        (this.workflowService.BPMRequestUnclaimed === undefined && !isValidator)
      ) {
        this.initiateSort();
        this.resetPagination();
        if (this.workflowService.bpmRequest === undefined) {
          this.initiateRequest(isSupervisor);
        }
        if (this.workflowService.BPMRequestUnclaimed === undefined && !isValidator) {
          this.initiateRequestUnClaimed(isSupervisor);
        }
      } else {
        this.bpmRequest = this.workflowService.bpmRequest;
        this.bpmRequestUnclaimed = this.workflowService.BPMRequestUnclaimed;
        this.setResumeRequest();
        this.getTotalCount(false);
        this.requestHandler(this.bpmRequest);
        if (!isValidator) {
          this.setResumeRequestUnclaimed();
          this.getTotalCount(true);
          this.requestHandlerUnclaimed(this.bpmRequestUnclaimed);
        }
      }
    } else {
    if (this.workflowService.teamRequest === null) {
            this.initiateSort();
            this.resetPagination();
            this.initiateRequest(isSupervisor);
            if (!isValidator) {
                    this.initiateRequestUnClaimed(isSupervisor);
                  }
          } else {
            this.bpmRequest = this.workflowService.teamRequest;
            this.setResumeRequest();
            this.getTotalCount();
            this.requestHandler(this.bpmRequest);
          }    }
    this.getSortList();
  }
  private setResumeRequest() {
    if (this.bpmRequest) {
      const currentSortItem = BPMTaskConstants.SORT_FOR_BPM_LIST.find(
        item => item.column === this.bpmRequest.taskQuery.ordering.clause.column
      );
      this.sortItem.column = currentSortItem.column;
      this.sortItem.value = currentSortItem.value;
      if (this.bpmRequest.taskQuery.ordering.clause.sortOrder === BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION) {
        if (this.bpmRequest.taskQuery.ordering.clause.column === 'priority')
          this.sortItem.direction = SortDirectionEnum.ASCENDING;
        else this.sortItem.direction = SortDirectionEnum.DESCENDING;
      } else {
        if (this.bpmRequest.taskQuery.ordering.clause.column === 'priority')
          this.sortItem.direction = SortDirectionEnum.DESCENDING;
        else this.sortItem.direction = SortDirectionEnum.ASCENDING;
      }
      if (
        this.bpmRequest.taskQuery.predicate.predicate.clause.find(
          item => item.value === BPMTaskConstants.TRN_STATE_RETURN
        )
      )
        this.selectedFilterStatus = BPMTransactionStatus.RETURNED;
      else if (
        this.bpmRequest.taskQuery.predicate.predicate.clause.find(
          item => item.value === BPMTaskConstants.TRN_STATE_REASSIGNED
        )
      )
        this.selectedFilterStatus = BPMTransactionStatus.REASSIGNED;
      else if (
        this.bpmRequest.taskQuery.predicate.predicate.clause.find(
          item => item.value === BPMTaskConstants.TRN_STATE_ASSIGNED
        )
      )
        this.selectedFilterStatus = BPMTransactionStatus.ASSIGNED;
      const searchClause = this.bpmRequest.taskQuery.predicate.predicate.clause.find(
        item =>
          item.column.columnName === SearchColumn.TITILEARABIC ||
          item.column.columnName === SearchColumn.TITLEENGLISH ||
          item.column.columnName === SearchColumn.TRANSACTIONID
      );
      if (searchClause) {
        this.searchParam = searchClause.value;
      }
      this.taskLimit = this.bpmRequest.limit;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.taskLimit.end / 10;
    }
  }
  private setResumeRequestUnclaimed() {
    const currentSortItem = BPMTaskConstants.SORT_FOR_BPM_LIST.find(
      item => item.column === this.bpmRequestUnclaimed.taskQuery.ordering.clause.column
    );
    this.sortItem.column = currentSortItem.column;
    this.sortItem.value = currentSortItem.value;
    if (
      this.bpmRequestUnclaimed.taskQuery.ordering.clause.sortOrder === BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION
    ) {
      if (this.bpmRequestUnclaimed.taskQuery.ordering.clause.column === 'priority')
        this.sortItem.direction = SortDirectionEnum.ASCENDING;
      else this.sortItem.direction = SortDirectionEnum.DESCENDING;
    } else {
      if (this.bpmRequestUnclaimed.taskQuery.ordering.clause.column === 'priority')
        this.sortItem.direction = SortDirectionEnum.DESCENDING;
      else this.sortItem.direction = SortDirectionEnum.ASCENDING;
    }
    if (
      this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.find(
        item => item.value === BPMTaskConstants.TRN_STATE_RETURN
      )
    )
      this.selectedFilterStatus = BPMTransactionStatus.RETURNED;
    else if (
      this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.find(
        item => item.value === BPMTaskConstants.TRN_STATE_REASSIGNED
      )
    )
      this.selectedFilterStatus = BPMTransactionStatus.REASSIGNED;
    else if (
      this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.find(
        item => item.value === BPMTaskConstants.TRN_STATE_ASSIGNED
      )
    )
      this.selectedFilterStatus = BPMTransactionStatus.ASSIGNED;
    const searchClause = this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.find(
      item =>
        item.column.columnName === SearchColumn.TITILEARABIC ||
        item.column.columnName === SearchColumn.TITLEENGLISH ||
        item.column.columnName === SearchColumn.TRANSACTIONID
    );
    if (searchClause) {
      this.searchParam = searchClause.value;
    }
    this.taskLimit = this.bpmRequestUnclaimed.limit;
  }
  /**
   * method to initiate sort
   */
  initiateSort() {
    this.sortItem.column =
      BPMTaskConstants && BPMTaskConstants.SORT_FOR_BPM_LIST.find(item => item?.code === 1002)?.column;
    this.sortItem.direction = SortDirectionEnum.DESCENDING;
    this.sortItem.value =
      BPMTaskConstants && BPMTaskConstants.SORT_FOR_BPM_LIST.find(item => item?.code === 1002)?.value;
  }
  private getSortList() {
    if (!this.isWorkList)
      this.sortList = new LovList(
        BPMTaskConstants && BPMTaskConstants.SORT_FOR_BPM_LIST.filter(item => !([1000, 1004, 1006]?.indexOf(item?.code) >= 0))
      );
    else
      this.sortList = new LovList(
        BPMTaskConstants && BPMTaskConstants.SORT_FOR_BPM_LIST.filter(item => !([1005]?.indexOf(item?.code) >= 0))
      );
  }
  /**
   * method to initiate request
   */
  initiateRequest(isSupervisor = false) {
    if (this.bpmRequest && this.bpmRequest && this.bpmRequest.taskQuery) {
      this.resetPagination();
      this.bpmRequest.join.ignoreCase = BPMTaskConstants.BPM_IGNORECASE;
      this.bpmRequest.join.joinOperator = BPMOperators.AND;
      this.bpmRequest.join.tableName = BPMTaskConstants.WFTASK;
      this.bpmRequest.limit = this.taskLimit;
      if (this.bpmRequest.taskQuery.ordering) {
        this.bpmRequest.taskQuery.ordering = new Ordering();
        const clause = new SortClause();
        clause.column = this.sortItem.column;
        clause.sortOrder =
          this.sortItem.direction === SortDirectionEnum.ASCENDING
            ? BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
            : BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION;
        this.bpmRequest.taskQuery.ordering.clause = clause;
      }
      this.bpmRequest.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      if (this.bpmRequest.taskQuery && this.bpmRequest.taskQuery.predicate) {
        this.bpmRequest.taskQuery.predicate.assignmentFilter =
          isSupervisor === false && this.fromTeam === false ? AssignmentFilter.MY : AssignmentFilter.REPORTEES;
        if (this.bpmRequest.taskQuery.predicate.predicate) {
          this.bpmRequest.taskQuery.predicate.predicate.clause = [];
          this.bpmRequest.taskQuery.predicate.predicate.clause.push(
            this.onHold ? BPMTaskConstants.SUSPENDED_FILTER : BPMTaskConstants.ASSIGNED_FILTER
          );
          this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.STALE_FILTER);
          if (isSupervisor === false && this.fromTeam === true) {
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(
              BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator)
            );
          }
        }
      }
    }
    this.getTotalCount(false);
    this.requestHandler(this.bpmRequest);
  }
  initiateRequestUnClaimed(isSupervisor = false) {
    if (this.bpmRequestUnclaimed && this.bpmRequestUnclaimed && this.bpmRequestUnclaimed.taskQuery) {
      this.resetPagination();
      this.bpmRequestUnclaimed.join.ignoreCase = BPMTaskConstants.BPM_IGNORECASE;
      this.bpmRequestUnclaimed.join.joinOperator = BPMOperators.AND;
      this.bpmRequestUnclaimed.join.tableName = BPMTaskConstants.WFTASK;
      this.bpmRequestUnclaimed.limit = this.taskLimit;
      if (this.bpmRequestUnclaimed.taskQuery.ordering) {
        this.bpmRequestUnclaimed.taskQuery.ordering = new Ordering();
        const clause = new SortClause();
        clause.column = this.sortItem.column;
        clause.sortOrder =
          this.sortItem.direction === SortDirectionEnum.ASCENDING
            ? BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
            : BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION;
        this.bpmRequestUnclaimed.taskQuery.ordering.clause = clause;
      }
      this.bpmRequestUnclaimed.taskQuery.optionalInfoList.taskOptionalInfo = BPMTaskConstants.OptionalTaskInfoPayload;
      if (this.bpmRequestUnclaimed.taskQuery && this.bpmRequestUnclaimed.taskQuery.predicate) {
        this.bpmRequestUnclaimed.taskQuery.predicate.assignmentFilter =
          isSupervisor === false && this.fromTeam === false ? AssignmentFilter.GROUP : AssignmentFilter.REPORTEES;
        if (this.bpmRequestUnclaimed.taskQuery.predicate.predicate) {
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause = [];
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(
            this.onHold ? BPMTaskConstants.SUSPENDED_FILTER : BPMTaskConstants.ASSIGNED_FILTER
          );
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.GROUP_FILTER);
          if (isSupervisor === false && this.fromTeam === false) {
            this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.PROTECTEDTEXT_FILTER);
          }
          if (isSupervisor === false && this.fromTeam === true) {
            this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(
              BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator)
            );
          }
        }
      }
    }
    this.getTotalCount(true);
    this.requestHandlerUnclaimed(this.bpmRequestUnclaimed);
  }
  /**
   * method to select sort item
   */
  onSortUnclaimed(sort: RequestSort) {
    this.sortItem = sort;
    this.resetPagination();
    const clause = new SortClause();
    clause.column = this.sortItem.column;
    clause.sortOrder =
      this.sortItem.direction === SortDirectionEnum.ASCENDING
        ? BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
        : BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION;
    this.bpmRequestUnclaimed.taskQuery.ordering.clause = clause;
    if (this.bpmRequestUnclaimed.taskQuery.ordering.clause.column === 'priority') {
      this.bpmRequestUnclaimed.taskQuery.ordering.clause.sortOrder =
        this.bpmRequestUnclaimed.taskQuery.ordering.clause.sortOrder === BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
          ? BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION
          : BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION;
    }
    this.requestHandlerUnclaimed(this.bpmRequestUnclaimed);
  }

  onSort(sort: RequestSort) {
    this.sortItem = sort;
    this.resetPagination();
    const clause = new SortClause();
    clause.column = this.sortItem.column;
    clause.sortOrder =
      this.sortItem.direction === SortDirectionEnum.ASCENDING
        ? BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
        : BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION;
    this.bpmRequest.taskQuery.ordering.clause = clause;
    if (this.bpmRequest.taskQuery.ordering.clause.column === 'priority') {
      this.bpmRequest.taskQuery.ordering.clause.sortOrder =
        this.bpmRequest.taskQuery.ordering.clause.sortOrder === BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION
          ? BPMTaskConstants.SORT_ITEM_DESCENDING_DIRECTION
          : BPMTaskConstants.SORT_ITEM_ASCENDING_DIRECTION;
    }
    this.requestHandler(this.bpmRequest);
  }
  /**
   * method to search from response
   */
  searchTransactions(value: any, isSupervisor = false) {
    if (value.type == 'unclaimed') {
      if (this.bpmRequestUnclaimed.taskQuery && this.bpmRequestUnclaimed.taskQuery.predicate.predicate) {
        this.bpmRequestUnclaimed.taskQuery.predicate.assignmentFilter = AssignmentFilter.GROUP;

        if (value.searchKey && value.searchKey !== '' && value.searchKey !== null) {
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause = this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.filter(
            item => {
              if (
                item.column.columnName !== SearchColumn.TRANSACTIONID &&
                item.column.columnName !== SearchColumn.TITILEARABIC &&
                item.column.columnName !== SearchColumn.TITLEENGLISH
              )
                return item;
            }
          );
          this.resetPagination();
          this.isSearched = true;
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause = [];
          if (this.onHold === true) {
            this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.SUSPENDED_FILTER);
          } else {
            this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.ASSIGNED_FILTER);

            if (isSupervisor === false && this.fromTeam === true) {
              this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(
                BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator)
              );
            }
          }
          this.bpmRequestUnclaimed.join.joinOperator = BPMOperators.AND;
          const request = new FilterClause();
          request.operator = BPMOperators.EQUAL;
          request.value = value.searchKey;
          if (/^\d+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TRANSACTIONID;
          } else if (/^[a-zA-Z ]+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TITLEENGLISH;
          } else if (/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TITILEARABIC;
          } else request.column.columnName = SearchColumn.TITLEENGLISH;
          this.bpmRequestUnclaimed.taskQuery.predicate.predicate.clause.push(request);
          //this.getTotalCount();

          this.requestHandlerUnclaimed(this.bpmRequestUnclaimed);
        } else if (value.searchKey === '' || value.searchKey === null) {
          this.isSearched = false;
          //this.initiateRequest(isSupervisor);
          this.initiateRequestUnClaimed(isSupervisor);
        }
      }
    } else {
      if (this.bpmRequest.taskQuery && this.bpmRequest.taskQuery.predicate.predicate) {
        if (value.searchKey && value.searchKey !== '' && value.searchKey !== null) {
          this.bpmRequest.taskQuery.predicate.predicate.clause = this.bpmRequest.taskQuery.predicate.predicate.clause.filter(
            item => {
              if (
                item.column.columnName !== SearchColumn.TRANSACTIONID &&
                item.column.columnName !== SearchColumn.TITILEARABIC &&
                item.column.columnName !== SearchColumn.TITLEENGLISH
              )
                return item;
            }
          );
          this.resetPagination();
          this.isSearched = true;
          this.bpmRequest.taskQuery.predicate.predicate.clause = [];
          if (this.onHold === true) {
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.SUSPENDED_FILTER);
          } else {
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.ASSIGNED_FILTER);
            if (isSupervisor === false && this.fromTeam === true) {
              this.bpmRequest.taskQuery.predicate.predicate.clause.push(
                BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator)
              );
            }
          }
          this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.STALE_FILTER);
          this.bpmRequest.join.joinOperator = BPMOperators.AND;
          const request = new FilterClause();
          request.operator = BPMOperators.EQUAL;
          request.value = value.searchKey;
          if (/^\d+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TRANSACTIONID;
          } else if (/^[a-zA-Z ]+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TITLEENGLISH;
          } else if (/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/.test(value.searchKey)) {
            request.column.columnName = SearchColumn.TITILEARABIC;
          }
          this.bpmRequest.taskQuery.predicate.predicate.clause.push(request);
          this.getTotalCount();

          this.requestHandler(this.bpmRequest);
        } else if (value.searchKey === '' || value.searchKey === null) {
          this.isSearched = false;
          this.initiateRequest(isSupervisor);
          this.initiateRequestUnClaimed(isSupervisor);
        }
      }
    }
  }
  /**
   * method to filter response
   */
  filterTransactions(value: string, isSupervisor = false) {
    if (this.bpmRequest && this.bpmRequest.taskQuery && this.bpmRequest.taskQuery.predicate.predicate) {
      if (value === null) {
        if (this.isSearched) {
          this.bpmRequest.taskQuery.predicate.predicate.clause = this.bpmRequest.taskQuery.predicate.predicate.clause.filter(
            item => {
              if (
                item.column.columnName === SearchColumn.TRANSACTIONID ||
                item.column.columnName === SearchColumn.TITILEARABIC ||
                item.column.columnName === SearchColumn.TITLEENGLISH
              )
                return true;
              else return false;
            }
          );
          this.resetPagination();
          this.getTotalCount();
          this.requestHandler(this.bpmRequest);
        } else this.initiateRequest(isSupervisor);
      } else {
        if (
          !this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.TRANSACTIONID ||
              item.column.columnName === SearchColumn.TITILEARABIC ||
              item.column.columnName === SearchColumn.TITLEENGLISH ||
              item.column.columnName === SearchColumn.OLABREACHED
            )
              return item;
          })
        )
          this.bpmRequest.join.joinOperator = BPMOperators.OR;
        this.bpmRequest.taskQuery.predicate.predicate.clause = this.bpmRequest.taskQuery.predicate.predicate.clause.filter(
          item => {
            if (
              item.column.columnName === SearchColumn.TRANSACTIONID ||
              item.column.columnName === SearchColumn.TITILEARABIC ||
              item.column.columnName === SearchColumn.TITLEENGLISH ||
              item.column.columnName === SearchColumn.OLABREACHED
            )
              return item;
          }
        );
        if (value !== BPMTaskConstants.TRN_STATE_WITHDRAWN) {
          this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.ASSIGNED_FILTER);
          if (isSupervisor === false && this.fromTeam === true) {
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(
              BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator)
            );
          }
        }
        switch (value) {
          case BPMTaskConstants.TRN_STATE_RETURNED:
            this.bpmRequest.taskQuery.predicate.predicate.clause = [];
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.RETURNED_FILTER);
            this.bpmRequest.join.joinOperator = BPMOperators.AND;
            break;
          // case BPMTaskConstants.TRN_STATE_ASSIGNED:
          //   this.bpmRequest.taskQuery.predicate.predicate.clause.push(
          //     BPMTaskConstants.REASSIGNED_FILTER(BPMOperators.NOT_EQUAL)
          //   );
          //   break;
          case BPMTaskConstants.TRN_STATE_REASSIGNED:
            this.bpmRequest.taskQuery.predicate.predicate.clause = [];
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.REASSIGNED_FILTER());
            this.bpmRequest.join.joinOperator = BPMOperators.AND;
            break;
        }
      }

      if(this.tnxFilters && this.tnxFilters.length>0){
        if (
          !this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.TITLEENGLISH
            )
            this.bpmRequest.taskQuery.predicate.predicate.clause = this.bpmRequest.taskQuery.predicate.predicate.clause.filter(item => item.column.columnName !== SearchColumn.TITLEENGLISH);
          })
        ){
            this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.TRANSACTION_FILTER(this.tnxFilters));
            this.bpmRequest.join.joinOperator = BPMOperators.AND;
        }
      }else{
          let index = this.bpmRequest.taskQuery.predicate.predicate.clause.indexOf(this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.TITLEENGLISH
            )
              return item;
          }));
          if(index>-1){
            this.bpmRequest.taskQuery.predicate.predicate.clause.splice(index,1);
          }
      }

      if(this.roleFilters && this.roleFilters.length>0){
        if (
          !this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.SWIMLANEROLE
            )
              return item;
          })
        ){
              this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.ROLES_FILTER(this.roleFilters));
              this.bpmRequest.join.joinOperator = BPMOperators.AND;
        }
      }else{
          let index = this.bpmRequest.taskQuery.predicate.predicate.clause.indexOf(this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.SWIMLANEROLE
            )
              return item;
          }));
          if(index>-1){
            this.bpmRequest.taskQuery.predicate.predicate.clause.splice(index,1);
          }
      }


      if(this.olaSlaFilters && this.olaSlaFilters.length>0){
        if (
          !this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.OLABREACHED
            )
              return item;
          })
        ){
          this.olaSlaFilters.forEach(element => {
            if(element.english === 'OLA Exceeded'){
              this.bpmRequest.taskQuery.predicate.predicate.clause.push(BPMTaskConstants.OLA_EXCEEDED_FILTER);
              this.bpmRequest.join.joinOperator = BPMOperators.AND;
            }
          });
        }
      }else{
          let index = this.bpmRequest.taskQuery.predicate.predicate.clause.indexOf(this.bpmRequest.taskQuery.predicate.predicate.clause.find(item => {
            if (
              item.column.columnName === SearchColumn.OLABREACHED
            )
              return item;
          }));
          if(index>-1){
            this.bpmRequest.taskQuery.predicate.predicate.clause.splice(index,1);
          }
      }
      this.resetPagination();
      this.getTotalCount();
      this.requestHandler(this.bpmRequest);
    }
  }

  slaOlaFilter(value: BilingualText[]){
    if(value && value.length > 0){
      this.olaSlaFilters = value;
    }else{
      this.olaSlaFilters = []
    }
  }
  tnxFilter(value: string[]){
    if(value && value.length > 0){
      this.tnxFilters = value;
    }else{
      this.tnxFilters = []
    }
  }
  roleFilter(value: string[]){
    if(value && value.length > 0){
      this.roleFilters = value;
    }else{
      this.roleFilters = []
    }
  }
  /**
   * method to fetch inbox data
   */
  requestHandler(request: BPMRequest) {
    if (this.httpSubscriptionClaimed) {
      this.httpSubscriptionClaimed.unsubscribe();
    }
    const assignmentFilter = this.getAssignementFilter();
    if (assignmentFilter) {
      request.taskQuery.predicate.assignmentFilter = assignmentFilter;
    }
    // this.httpSubscription = this.workflowService
    this.httpSubscriptionClaimed = this.workflowService
      .fetchBPMTaskList(request, this.currentValidator, this.fromTeam)
      .subscribe((res: BPMResponse) => {
        this.bpmTaskResponse = res;
        // this.getClaimPoolTransactionReleaseExpiryDate(); 
      });
  }
  requestHandlerUnclaimed(request: BPMRequest) {
    if (this.httpSubscriptionUnClaimed) {
      this.httpSubscriptionUnClaimed.unsubscribe();
    }
    this.httpSubscriptionUnClaimed = this.workflowService
      .fetchBPMTaskListUnClaimed(request, this.currentValidator, this.fromTeam)
      .subscribe((res: BPMResponse) => {
        this.bpmTaskResponseUnclaimed = res;
      });
  }
  getClaimPoolTransactionReleaseExpiryDate(){
    if (this.httpSubscriptionClaimed) {
      this.httpSubscriptionClaimed.unsubscribe();
    }
    const bpmTaskRequest = new BpmTaskRequest();
    this.bpmTaskResponse.tasks.forEach(task=>{
      bpmTaskRequest.taskId = task.taskId;
      bpmTaskRequest.workflowUser = '';
      this.workflowService.getBPMTask(bpmTaskRequest).subscribe((res: BPMTask) => {
        var claimedTransactionPayloadAsJson = JSON.parse(res.payload); 
        if(claimedTransactionPayloadAsJson.claimTaskExpiry !== null ){
          this.getTimerData(task.taskId, claimedTransactionPayloadAsJson.claimTaskExpiry,claimedTransactionPayloadAsJson.currentDate);
        }
      });
    });
  }
  getTimerData(taskId:string,expDate:string,currentDate:Date){
    var updated =moment(moment.tz(new Date(currentDate), 'Asia/Riyadh').format() ,'DD-MM-YYYY HH:mm:ss') ; //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    var minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
    var secDiff = expiry.diff(updated, 'seconds');
    var seconds = (secDiff % 60).toString();
    this.bpmTaskResponse.tasks.forEach(task => {
        if(task.taskId===taskId){
          this.claimedTransactions.push({taskId:task.taskId,minDiff:minDiff,seconds:seconds,
            titleEnglish:task.titleEnglish,titleArabic:task.titleArabic
            ,descriptionEnglish:task.descriptionEnglish,descriptionArabic:task.descriptionArabic,expDate:expDate});
        }
      }); 
  }
  /**
   * method to get total count
   */
  getTotalCount(unclaimed: boolean = false) {
    const request = Object.assign({}, unclaimed ? this.bpmRequestUnclaimed : this.bpmRequest);
    const predicate = request.taskQuery.predicate;
    delete request.taskQuery;
    delete request.limit;
    request['predicate'] = predicate;
    let bpmReq: BPMRequest = new BPMRequest();
    bpmReq = unclaimed ? this.bpmRequestUnclaimed : this.bpmRequest;
    this.workflowService.getTransactionCount(request, this.currentValidator).subscribe((res: TaskCountResponse) => {
      this.unViewed = res.taskCountResponse;
      if (
        !this.isLoaded &&
        !this.fromTeam &&
        bpmReq.taskQuery.predicate.predicate.clause.filter(item => item.column.columnName !== TransactionState.STATE)
          .length === 0
      ) {
        this.transactionService.transactionCount.next(res.taskCountResponse);
        this.isLoaded = true;
      }
    });
    if (
      !this.isLoaded &&
      !this.fromTeam &&
      bpmReq.taskQuery.predicate.predicate.clause.filter(item => item.column.columnName !== TransactionState.STATE)
        .length > 0
    ) {
      const countRequest = BPMTaskConstants.COUNT_REQUEST;
      this.workflowService
        .getTransactionCount(countRequest, this.currentValidator)
        .subscribe((res: TaskCountResponse) => {
          this.transactionService.transactionCount.next(res.taskCountResponse);
          this.isLoaded = true;
        });
    }
  }
  /**
   * method for pagination
   * @param page
   */
  selectPage(page: number): void {
    this.currentPage = this.pageDetails.currentPage = page;
    this.getPageLimit(page);
    this.bpmRequest.limit = this.taskLimit;
    this.requestHandler(this.bpmRequest);
  }
  /**
   * method to get page limit
   * @param page
   */
  getPageLimit(page: number) {
    this.taskLimit.end = page * this.itemsPerPage;
    this.taskLimit.start = this.taskLimit.end - this.itemsPerPage + 1;
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    if (this.currentGoToPage) {
      this.pageDetails.currentPage = this.pageDetails.goToPage;
    } else {
      this.pageDetails.currentPage = 1;
      this.taskLimit.start = 1;
      this.taskLimit.end = 10;
    }
    this.bpmRequest.limit = this.taskLimit;
    if(this.bpmRequestUnclaimed?.limit){
      this.bpmRequestUnclaimed.limit = this.taskLimit;
    }
  }
  /**
   * method to get priority count
   */
  getPerformance(days: number) {
    this.selectedDay = days;
    const bpmPendingRequest = { ...BPMTaskConstants.PENDING_COUNT_REQUEST };
    bpmPendingRequest.predicate.predicate.clause[0].value = days.toString();
    if (this.fromTeam) {
      bpmPendingRequest.predicate.predicate.clause = bpmPendingRequest.predicate.predicate.clause.filter(
        item => item.column.columnName !== TransactionState.ASSIGNEDDATE
      );
      bpmPendingRequest.predicate.assignmentFilter = AssignmentFilter.REPORTEES;
      bpmPendingRequest.predicate.predicate.clause.push(BPMTaskConstants.ASSIGNEES_FILTER(this.currentValidator));
    }
    const assignmentFilter = this.getAssignementFilter();
    if (assignmentFilter) {
      bpmPendingRequest.predicate.assignmentFilter = assignmentFilter;
    }
    this.workflowService
      .getTransactionSummary(bpmPendingRequest, this.currentValidator)
      .subscribe((res: BPMPriorityResponse) => {
        this.priorityResponse = res;
        this.countResponse.pending = res.pending;
        this.countResponse.olaExceeded = res.olaExceeded;
      });
    if (!this.fromTeam) {
      const bpmCompletedRequest = { ...BPMTaskConstants.COMPLETED_COUNT_REQUEST };
      bpmCompletedRequest.predicate.predicate.clause[0].value = days.toString();
      this.workflowService.getTransactionCount(bpmCompletedRequest, this.currentValidator).subscribe(res => {
        this.countResponse.completed = res.taskCountResponse;
      });
    }
  }

  //**************************************************************** */
  /**
   * This method is used to navigate to the corresponding entity
   * @param task
   */
  navigateToView(task: BPMTask) {
    // TODO: KP remove below line on merging to master
    //this.currentValidator = 'Shabin';
    if (task.state === TransactionStatus.COMPLETED || task.state === TransactionStatus.WITHDRAWN) {
      return;
    }
    if (this.apiInProgress) return;
    this.apiInProgress = true;
    const bpmTaskRequest = new BpmTaskRequest();
    bpmTaskRequest.taskId = task.taskId;
    // bpmTaskRequest.workflowUser = this.currentValidator;
    this.workflowService
      .getBPMTask(bpmTaskRequest)
      .pipe(
        switchMap(res => this.workflowService.getDisplayName(res)),
        catchError(err => {
          this.apiInProgress = false;
          return throwError(err);
        })
      )
      .subscribe((responseTask: BPMTask) => {
        this.apiInProgress = false;
        const transformedTask = this.getTransformedTask(new BPMTask().mergeJsonToObject(task, responseTask));
        this.routerService.setRouterDataToken(transformedTask);
      });
  }
  /**
   * Method to transform task
   * @param task
   */
  getTransformedTask(task: BPMTask) {
    if (task.payload) {
      const payload = JSON.parse(task.payload);
      task.resourceId = payload.id;
      task.assignedRole = this.getAssignedRole(payload.assignedRole).replace(/\s/g, '');
      task.route = payload.route;
      task.comments = setCommentResponse(task);
      return task;
    } else return null;
  }
  private getAssignedRole(assignedRole) {
    if (assignedRole) {
      if (assignedRole?.TEXT) {
        return assignedRole?.TEXT;
      } else if (typeof assignedRole === 'string') {
        return assignedRole;
      }
    }
    return '';
  }

  /** Method to check if the validator is having governor role or not then return the assignment filter accordingly */
  getAssignementFilter() {
    const userRoles = this.authTokenService.getEntitlements()?.[0]?.role?.map(r => r?.toString());
    if (userRoles) {
      for (let userRoleIndex in userRoles) {
        const governorRole = '159';
        if (userRoles[userRoleIndex] === governorRole) {
          return AssignmentFilter.MY_AND_GROUP;
        }
      }
    }
    return null;
  }

  clearSearch(event){
    this.clearSearchView = event;
  }
}
