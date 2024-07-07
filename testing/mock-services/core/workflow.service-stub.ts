import { HttpHeaders } from '@angular/common/http';
import {
  BilingualText,
  BPMTask,
  BpmTaskRequest,
  BPMUpdateRequest,
  Task,
  TransactionWorkflowItem,
  TaskCountResponse,
  BPMRequest,
  BPMResponse,
  BPMReportRequest,
  BpmPendingCount,
  ItTicketHistory
} from '@gosi-ui/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { commentsMockData, genericError, transactionWorkflowList } from 'testing/test-data';

export class WorkflowServiceStub {
  task: Task;
  responseMessage: BilingualText;
  private ticketHistory: BehaviorSubject<ItTicketHistory[]> = new BehaviorSubject<ItTicketHistory[]>([]);
  ticketHistory$: Observable<ItTicketHistory[]> = this.ticketHistory.asObservable();
  constructor() {}

  getBPMTask(bpmTaskRequest: BpmTaskRequest, headers?: HttpHeaders) {
    if (bpmTaskRequest || headers) {
      return of(new BPMTask());
    }
  }
  getWorkFlowDetails(traceId): Observable<TransactionWorkflowItem[]> {
    if (traceId) {
      return of(transactionWorkflowList);
    } else {
      return throwError(genericError);
    }
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
   * This method is used to update the BPM Workflow about the validator edit and save
   */
  updateTaskWorkflow(data: BPMUpdateRequest): Observable<BilingualText> {
    if (data) {
      return of({
        english: 'updated',
        arabic: 'updated'
      });
    } else {
      return throwError('update task workflow failed');
    }
  }
  mergeAndUpdateTask(data: BPMUpdateRequest): Observable<BilingualText> {
    if (data) {
      return of({
        english: 'updated',
        arabic: 'updated'
      });
    } else {
      return throwError('update task workflow failed');
    }
  }
  getComments() {
    return of(commentsMockData);
  }

  getTransactionCount(bpmRequest, userId: string) {
    if (bpmRequest || userId) {
      return of(TaskCountResponse);
    }
  }

  fetchBPMTaskList(bpmRequest: BPMRequest, userId: string) {
    return of(BPMResponse);
  }
  getTransactionSummary(bpmReportRequest: BPMReportRequest, userId: string) {
    if (bpmReportRequest || userId) {
      return of(BpmPendingCount);
    }
  }
  getTicketComments() {
    return of([]);
  }
  getTicketHistory() {
    return of([]);
  }
}
