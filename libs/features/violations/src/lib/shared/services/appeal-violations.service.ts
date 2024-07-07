import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {
  AlertService,
  AppealDetailsResponse,
  AppealRequest,
  AppealResponse, BilingualText,
  DocumentItem,
  DocumentService,
  Person
} from "@gosi-ui/core";
import {HttpClient} from "@angular/common/http";
import {AppealViolation} from "../models/appeal-violation"
import {AppealOnViolation} from "@gosi-ui/features/violations/lib/shared/models/appeal-on-violation";
import {SubmitAppealViolation} from "@gosi-ui/features/violations/lib/shared/models/submit-appeal-violation";
import {IAppealOnViolation} from "@gosi-ui/features/violations";
import {AppealResourceTypeEnum} from "@gosi-ui/features/violations/lib/shared/enums/appeal-resource-type-enum";
import { TransactionType } from '@gosi-ui/core/lib/enums/transaction-type';

@Injectable({
  providedIn: 'root'
})
export class AppealViolationsService {
  baseUrl: string = '/api/v1';

  constructor(
    private http: HttpClient,
    private documentService: DocumentService,
    readonly alertService: AlertService
  ) {
  }


  getContributor(estRegNo: number, violationId: number): Observable<AppealViolation> {
    const url = `/api/v1/establishment/${estRegNo}/violation/${violationId}/contributors`;
    return this.http.get<AppealViolation>(url);
  }

  getRequiredDocs(transactionType: string, violationType: string): Observable<DocumentItem[]> {
    return this.documentService
      .getRequiredDocuments(transactionType, violationType);
  }

  postAppealViolation(violationId: number, establishmentId: number, body: SubmitAppealViolation): Observable<{
    message: BilingualText,
    referenceNumber: number
  }> {
    const url = `/api/v1/establishment/${establishmentId}/violation/${violationId}/appeal`;
    return this.http.post<{ message: BilingualText, referenceNumber: number }>(url, body);
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

  getAppealDetails(violationId: number, appealId: number): Observable<AppealOnViolation> {
    const url = `/api/v1/appeal/${appealId}/getAppealDetails`;
    return this.http.get<AppealOnViolation>(url);
  }

  postSubmitAppealsPerContributor(violationId: number, appealId: number, type: string, body: any) {
    const url = `/api/v1/violation/${violationId}/appeal/${appealId}/${type}`;
    return this.http.post(url, body);
  }

  submitAppealOnViolation(requestPaylod: AppealRequest) {
    let url = `${this.baseUrl}/appeal/aov`;
    return this.http.post<AppealResponse>(url, requestPaylod);
  }

  getAppealOnViolationDetail(transactionRefNo: number, appealId?: number) {
    // const paramAppealId = appealId ? `&appealId=${appealId}` : '';
    let url = `${this.baseUrl}/appeal/aov?transactionRefNumber=${transactionRefNo}${appealId ? '&appealId='+appealId : ''}`;
    return this.http.get<AppealDetailsResponse>(url);
  }

 get types_appeal_on_violation() {
    return {
      requestView: {
        documentTransactionId: 'REVIEW_REQUEST',
        documentType: 'SUPPORT_DOCUMENT_FOR_REVIEW_REQUEST',
        type: AppealResourceTypeEnum.REQUEST_VIEW,
        transactionId: TransactionType.REQUEST_VIEW.toString()
      },
      appeal: {
        documentTransactionId: 'GENERAL_APPEAL',
        documentType: 'SUPPORT_DOCUMENT_FOR_APPEAL',
        type: AppealResourceTypeEnum.APPEAL,
        transactionId: TransactionType.APPEAL.toString()
      }
    };
  }

  updateAppealDecisionAov(appealId: number, roleId: number, formData: any): Observable<any> {
    let url = `/api/v1/appeal/${appealId}/updateAppealDecision/${roleId}`;
    return this.http.put(url, formData);
  }
  getAppealDetailsAov(appealId: number, transactionRefNumber: number): Observable<IAppealOnViolation> {
    const url = `/api/v1/appeal/${appealId}/getAppealDetails/aov`;
    return this.http.get<IAppealOnViolation>(url);
  }
  updateAppealAov(appealId: number, requestPaylod: AppealRequest) {
    let url = `${this.baseUrl}/appeal/${appealId}/aov`;
    return this.http.patch<AppealResponse>(url, requestPaylod);
  }
}
