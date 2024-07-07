/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WorkflowService } from './workflow.service';
import { BilingualText, BPMUpdateRequest, BpmTaskRequest, BPMRequest, BPMReportRequest } from '../models';
import { commentsMockData, CryptoServiceStub } from 'testing';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum, WorkFlowActions } from '../enums';
import { CryptoService } from './crypto.service';
/** To test WorkflowService. */
describe('WorkflowService', () => {
  const response = new BilingualText();
  const data = new BPMUpdateRequest();
  let workflowService: WorkflowService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WorkflowService,
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: CryptoService, useClass: CryptoServiceStub }
      ]
    });
    workflowService = TestBed.inject(WorkflowService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  /** Test if workflow service is created properly. */
  it('Should create workflow service', () => {
    expect(workflowService).toBeTruthy();
  });

  describe('getBPMTask', () => {
    it('Should get the BPM Task', () => {
      const bpmTaskRequest = new BpmTaskRequest();
      bpmTaskRequest.taskId = '';
      workflowService.getBPMTask(bpmTaskRequest);
      expect(workflowService).toBeTruthy();
    });
  });
  /**
   * This method is to set the validator response.
   */
  describe('setValidatorResponse', () => {
    it('Should set the Validator Response', () => {
      workflowService.setValidatorResponse(response);
      expect(workflowService).toBeTruthy();
    });
  });
  describe('updateTaskPriority', () => {
    it('Should get the BPM Task', () => {
      workflowService.updateTaskPriority(data);
      expect(workflowService).toBeTruthy();
    });
  });
  /**
   * This method is to get the validator response.
   */
  describe('getValidatorResponse', () => {
    it('Should get the response', () => {
      workflowService.getValidatorResponse();
      expect(workflowService).toBeTruthy();
    });
  });

  describe('updateTaskPriority', () => {
    it('Should get the BPM Task', () => {
      workflowService.getWorkFlowDetails(1569955262);
      expect(workflowService).toBeTruthy();
    });
    it('should throw error', () => {
      const url = `/api/v1/transaction/1569955262/workflow`;
      const errMsg = 'expect 404 error';
      workflowService.getWorkFlowDetails(1569955262).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('updateTaskWorkflow', () => {
    it('Should updateTaskWorkflow', () => {
      workflowService.updateTaskWorkflow(data, WorkFlowActions.UPDATE);
      expect(workflowService).toBeTruthy();
    });
  });
  describe('mergeAndUpdateTask', () => {
    it('Should mergeAndUpdateTask', () => {
      workflowService.mergeAndUpdateTask(data);
      expect(data).toBeDefined();
      expect(workflowService).toBeTruthy();
    });
  });
  it('should get comments for the transaction from BPM', () => {
    const url = `/api/process-manager/v1/task/comment`;
    const bpmTaskRequest = new BpmTaskRequest();
    bpmTaskRequest.taskId = '';
    bpmTaskRequest.workflowUser = 'shabin';
    workflowService.getCommentsById(bpmTaskRequest).subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });

  it('should get update the BPM Workflow about the validator edit and save', () => {
    const url = `/api/process-manager/v1/taskservice/update`;
    const updateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    updateRequest.outcome = 'UPDATE';
    updateRequest.taskId = data.taskId;
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${data.user}`
      })
    };
    workflowService.updateTaskWorkflow(data).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(commentsMockData);
  });
  it('should get priority data for transaction priority INBOX', () => {
    const noOfDays = 3;
    const url = `/api/v1/worklist/performance?noOfDays=${noOfDays}`;
    workflowService.getTransactionPriorityStatus('sabin', noOfDays).subscribe(res => {
      expect(res).not.toEqual(null);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should throw error', () => {
    const noOfDays = 3;
    const url = `/api/v1/worklist/performance?noOfDays=${noOfDays}`;
    const errMsg = 'expect 404 error';
    workflowService.getTransactionPriorityStatus('sabin', noOfDays).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  it('Should get bpm tasks', () => {
    spyOn(workflowService.alertService, 'clearAllErrorAlerts').and.callThrough();
    const bpm = new BPMRequest();
    workflowService.fetchBPMTaskList(bpm, '1234');
    expect(workflowService).toBeTruthy();
  });

  describe('getTransactionSummary', () => {
    it('Should get BPMReport', () => {
      const bpmReportRequest = new BPMReportRequest();
      const id = '1234';
      workflowService.getTransactionSummary(bpmReportRequest, id);
      expect(workflowService.getTransactionSummary).not.toBe(null);
    });
  });
  describe('getTransactionCount', () => {
    it('Should get TransactionCount', () => {
      const bpmRequest = new BPMRequest();
      const id = '1234';
      workflowService.getTransactionCount(bpmRequest, id);
      expect(workflowService.getTransactionCount).not.toBe(null);
    });
  });
  describe('getTicketHistory', () => {
    it('Should  get TicketHistory', () => {
      const referenceNo = 1234;
      workflowService.getTicketHistory(referenceNo);
      expect(workflowService.getTicketHistory).not.toBe(null);
    });
  });
  describe('getTicketComments', () => {
    it('Should  get TicketComments', () => {
      const referenceNo = 1234;
      workflowService.getTicketComments(referenceNo);
      expect(workflowService.getTicketComments).not.toBe(null);
    });
  });
});
