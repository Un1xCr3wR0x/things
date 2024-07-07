import { Injectable } from '@angular/core';
import {
  AlertService,
  BPMUpdateRequest,
  BpmTaskRequest,
  DocumentService,
  Person,
  buildMergePayload,
  removeTaskNullValues
} from '@gosi-ui/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
import { AppealDetail } from '../models/employees/appeal-detail';
@Injectable({
  providedIn: 'root'
})
export class AppealService {
  APPEAL_ON_VIOLATION_TRANSACTION_ID: string = 'APPEAL_ON_VIOLATION';
  APPEAL_ON_VIOLATION_TRANSACTION_TYPE: string = 'UPLOAD_DOCUMENTS';

  constructor(
    private http: HttpClient,
    private documentService: DocumentService,
    readonly alertService: AlertService
  ) {}

  /*
  getContributor(estRegNo: number, violationId: number): Observable<AppealViolation> {
    const url = `/api/v1/establishment/${estRegNo}/violation/${violationId}/contributors`;
    return this.http.get<AppealViolation>(url);
  }

  getRequiredDocs(violationType: string): Observable<DocumentItem[]> {
    return this.documentService
      .getRequiredDocuments(this.APPEAL_ON_VIOLATION_TRANSACTION_ID, violationType);
  }

  postAppealViolation(violationId: number, establishmentId: number, body: SubmitAppealViolation): Observable<{message: BilingualText, referenceNumber: number}> {
    const url = `/api/v1/establishment/${establishmentId}/violation/${violationId}/appeal`;
    return this.http.post<{message: BilingualText, referenceNumber: number}>(url, body);
  }

  getAppealViolationTransaction(regNo: number, violationId: number, appealId: number): Observable<any> {
    const url = `/api/v1/establishment/${regNo}/violation/${violationId}/appeal/${appealId}`;
    return this.http.get<AppealOnViolation>(url);
  }

  updateAppealViolationDocument(regNo: number, violationId: number, appealId: number, body: SubmitAppealViolation) {
    const url = `/api/v1/establishment/${regNo}/violation/${violationId}/appeal/${appealId}`;
    return this.http.patch<AppealOnViolation>(url, body);
  }

     /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<Person>(url);
  }
   /** Method to get person by nin. */
  getPersonByNIN(nin: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${nin}`;
    return this.http.get<Person>(url);
  }
  /*
  getAppealDetails(violationId: number, appealId: number): Observable<AppealOnViolation> {
  const url = `/api/v1/violation/${violationId}/appeal/${appealId}`;
  return this.http.get<AppealOnViolation>(url);
  }
  
  postSubmitAppealsPerContributor(violationId: number, appealId: number,type:string, body: any) {
  const url = `/api/v1/violation/${violationId}/appeal/${appealId}/${type}`;
  return this.http.post(url, body);
  }*/

  mergeAndUpdateTask(request: BPMUpdateRequest, headers?: HttpHeaders) {
    const url = `/api/process-manager/v1/taskservice/mergeandupdate`;
    let bpmUpdateRequest: BPMUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.payload = request.payload;
    if (bpmUpdateRequest.payload) {
      [...request?.updateMap?.keys()]?.forEach(item => {
        const keys = item.split('.');
        bpmUpdateRequest.payload = buildMergePayload(bpmUpdateRequest?.payload, keys, 0, request?.updateMap?.get(item));
      });
      bpmUpdateRequest.payload = removeTaskNullValues(bpmUpdateRequest?.payload);
    }
    // bpmUpdateRequest.isGccEstablishment = request?.isGccEstablishment;
    // bpmUpdateRequest.outcome = request.outcome;
    // bpmUpdateRequest.isExternalComment = request.isExternalComment;
    // if (request.rejectionReason) bpmUpdateRequest.rejectionReason = request.rejectionReason;
    // if (request.organizationUser) bpmUpdateRequest.organizationUser = request.organizationUser;
    // bpmUpdateRequest = setCommentRequest(bpmUpdateRequest, request);
    const bpmTaskRequest = new BpmTaskRequest();
    bpmTaskRequest.taskId = request.taskId;
    bpmTaskRequest.workflowUser = request.user;
    const httpOptions = this.setRequestHeaders(bpmTaskRequest, headers);
    delete bpmUpdateRequest.updateMap;
    return this.http.post(url, bpmUpdateRequest, httpOptions);
  }

  /**
   * Method to set headers for BPM request
   * @param request
   * @param headers
   */
  setRequestHeaders(request: BpmTaskRequest, headers: HttpHeaders) {
    const requestHeader = Object.assign(
      {
        workflowUser: `${request.workflowUser}`,
        bpmTaskId: `${request.taskId}`
      },
      headers
    );
    const httpOptions = {
      headers: new HttpHeaders({ ...requestHeader })
    };
    return httpOptions;
  }

  updateAppealDecision(appealId: number, roleId: number, formData: any): Observable<any> {
    let url = `/api/v1/appeal/${appealId}/updateAppealDecision/${roleId}`;
    return this.http.put(url, formData);
  }
  // Method to get Appeal Detail using Service Worker
  retrieveAppealDetails(transactionId: number) {
    let url = `/api/v1/appeal/${transactionId}/getAppealDetails`;
    return this.http.get<any>(url);
  }
}
