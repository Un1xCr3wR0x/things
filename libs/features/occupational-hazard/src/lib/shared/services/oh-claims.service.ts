/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConstants, ApplicationTypeToken, BilingualText, StorageService, AuthTokenService, DocumentResponseItem, DocumentResponseWrapper } from '@gosi-ui/core';
import {
  AuditRequest,
  ClaimSummaryDetails,
  Pagination,
  PreviousClaims,
  AllowanceAuditSummary,
  AuditorFilterParams,
  AllowanceFilterParams,
  ReimbursementRequestDetails,
  ReceiveClarification,
  RejectedCount
} from '../models';
import { InvoiceDetails } from '../models/invoice-details';
import { RejectAuditService } from '../models/reject-audit-treatment';
import { TreatmentService } from '../models/treatment-service';
import { FilterKeyValue } from '../models/filier-key-value';
import { ClaimFilterParams } from '../models/claim-filter-params';
import { AllowanceList } from '../models/allowance-list';
import { AuditAllowance } from '../models/audit-allowance';
import { RejectAllowanceService } from '../models/reject-allowance';
import moment from 'moment';
import { AuditClaims } from '../models/audit-claims';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AllowanceOhList } from '../models/allowance-oh-list';
import { AllowanceAuditSummaryOh } from '../models/allowance-audit-summary-oh';
import { ClosedAllowanceDetails } from '../models/closed-allowance-details';

@Injectable({
  providedIn: 'root'
})
export class OhClaimsService {
  /**
   * Local Variables
   */
  private tpaCode: string;
  private invoiceId: number;
  registrationNo: number;
  referenceNo: number;
  invoiceDetails: InvoiceDetails;
  claimNo: number;
  caseId: number;
  alert: BilingualText;
  filter: AllowanceFilterParams;

  constructor(
    readonly http: HttpClient,
    readonly storageService: StorageService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly tokenService: AuthTokenService
  ) {
    const regNo = storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
    this.registrationNo = regNo != null ? parseInt(regNo, 10) : null;
  }
  private readonly getDocumentUrl = '/api/v2/get-file/filebyname';
  //set registration number
  setRegistrationNo(registrationNo: number) {
    this.registrationNo = registrationNo;
  }
  //Set TPACode
  setTPACode(tpa) {
    this.tpaCode = tpa;
  }
  //Get TPACode
  getTPACode() {
    return this.tpaCode;
  }
  //Set ReferenceNUmber
  setReferenceNo(referenceNo) {
    this.referenceNo = referenceNo;
  }

  //Get ReferenceNUmber
  getReferenceNo() {
    return this.referenceNo;
  }

  setFilterValues(filterParams: AllowanceFilterParams) {
    this.filter = new AllowanceFilterParams();
    this.filter = filterParams;
  }
  //Fetch Allowance Summary
  fetchAllowanceSummary(caseId: number, auditNo: number, registrationNo: number, socialInsuranceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/allowance-summary?isAuditAllowance=true&auditNo=${auditNo}`;
    return this.http.get<AllowanceAuditSummary>(url);
  }
  //Fetch Previous Allowance Summary
  fetchPreviousAllowanceSummary(caseId: number, auditNo: number, registrationNo: number, socialInsuranceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/allowance-summary?isAuditAllowance=false&auditNo=${auditNo}`;
    return this.http.get<AllowanceAuditSummary>(url);
  }
  //Fetch Allowance Details
  fetchAllowanceDetails(caseId: number, auditNo: number, registrationNo: number, socialInsuranceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/allowance-details?auditAllowance=true&auditNo=${auditNo}`;
    return this.http.get<AuditAllowance>(url);
  }
  getReimbClaim(registrationNo: number, socialInsuranceNo: number, bussinessId: number, reimbId: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${bussinessId}/reimbursement/${reimbId}`;
    return this.http.get<ReimbursementRequestDetails>(url);
  }
  //Fetch All Allowance Details
  fetchAllAllowanceDetails(
    caseId: number,
    auditNo: number,
    registrationNo: number,
    socialInsuranceNo: number,
    claimId: number
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/ohClaim/${claimId}/allowances?auditNo=${auditNo}`;
    return this.http.get<AuditAllowance>(url);
  }
  //Fetch Previous Allowance Summary
  fetchPreviousAllowance(caseId: number, auditNo: number, registrationNo: number, socialInsuranceNo: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/allowance-details?auditAllowance=false&auditNo=${auditNo}`;
    return this.http.get<AuditAllowance>(url);
  }

  //Fetch Audit Details
  getAuditDetails(auditNo: number) {
    const url = `/api/v1/injury-audit/${auditNo}`;
    return this.http.get<AllowanceList>(url);
  }
  getComments(ohId, sin, regNo, transactionId) {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/injury/${ohId}/resolve-clarification?referenceNo=${transactionId}`;
    return this.http.get<ReceiveClarification[]>(url);
  }
  //Fetch Rejected AllowanceAudit Details
  getRejectedAllowanceDetails(registrationNo: number, socialInsuranceNo: number, id: number) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${id}/claim/audit-reject`;
    return this.http.get<AuditClaims>(url);
  }
  //Fetch Audit Details
  filterAuditDetails(auditNo: number, filterValues: AuditorFilterParams) {
    let url = `/api/v1/injury-audit/${auditNo}`;
    if (filterValues) {
      if (filterValues?.maxAllowances) {
        url = url.concat(`?maxAllowances=${filterValues.maxAllowances}`);
      }
      if (filterValues?.maxNewAllowances) {
        url = url.concat(`&maxNewAllowances=${filterValues.maxNewAllowances}`);
      }
      if ((filterValues?.minAllowances || filterValues?.minAllowances === 0) && filterValues?.maxAllowances) {
        url = url.concat(`&minAllowances=${filterValues.minAllowances}`);
      }
      if ((filterValues?.minNewAllowances || filterValues?.minNewAllowances === 0) && filterValues?.maxNewAllowances) {
        url = url.concat(`&minNewAllowances=${filterValues.minNewAllowances}`);
      }
      if (filterValues?.ohType?.length > 0) {
        filterValues.ohType.forEach(element => {
          url = url.concat(`&ohType=${element}`);
        });
      }
    }

    return this.http.get<AllowanceList>(url);
  }

  //Fetch Audit Details
  filterAllowanceDetails(
    auditNo: number,
    injuryId: number,
    filterValues?: AllowanceFilterParams,
    pagination?: Pagination,
    registrationNo?: number,
    socialInsuranceNo?: number
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance-details?auditAllowance=true&auditNo=${auditNo}`;
    const allowanceURl = this.filterAllowance(url, filterValues, pagination);
    return this.http.get<AuditAllowance>(allowanceURl);
  }

  //Fetch Audit Details
  filterPrevAllowanc(
    auditNo: number,
    injuryId: number,
    filterValues?: AllowanceFilterParams,
    pagination?: Pagination,
    registrationNo?: number,
    socialInsuranceNo?: number
  ) {
    let url = '';
    if (pagination) {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance-details?auditAllowance=false&pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}&auditNo=${auditNo}`;
    } else {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/allowance-details?auditAllowance=false&auditNo=${auditNo}`;
    }
    const allowanceUrl = this.filterAllowance(url, filterValues, pagination);
    return this.http.get<AuditAllowance>(allowanceUrl);
  }
  //Set ClaimNo
  setClaimNo(claimNo) {
    this.claimNo = claimNo;
  }
  //Set CaseId
  setCaseId(caseId) {
    this.caseId = caseId;
  }
  //Get ClaimNo
  getClaimNo() {
    return this.claimNo;
  }
  //Get CaseId
  getCaseId() {
    return this.caseId;
  }
  //Set Invoice Id
  setInvoiceId(id) {
    this.invoiceId = id;
  }
  //Get Invoice Id
  getInvoiceId() {
    return this.invoiceId;
  }
  /* Method to Get Claims Details for Invoice */

  getInvoiceDetails(tpaCode: string, invoiceId: number, filterValues?: ClaimFilterParams) {
    let url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}`;

    if (filterValues) {
      url = url.concat(`?isMaxLimitExcluded=${filterValues.isMaxLimitExcluded}`);
      if (filterValues.isMaxLimitExcluded) {
        url = url.concat(`&minNoOfDays=30`);
      }
      if (filterValues?.endDate) {
        url = url.concat(`&endDate=${filterValues.endDate}`);
      }
      if (filterValues?.maxAmount) {
        url = url.concat(`&maxAmount=${filterValues.maxAmount}&minAmount=${filterValues.minAmount}`);
      }
      if (filterValues?.startDate) {
        url = url.concat(`&startDate=${filterValues.startDate}`);
      }
      if (filterValues?.treatmentDays?.length > 0) {
        filterValues.treatmentDays.forEach(element => {
          url = url.concat(`&noOfDays=${element}`);
        });
      }
    }
    return this.http.get<InvoiceDetails>(url);
  }
  /* Method to Get Batch Details for Auditor */

  getBatchDetails(tpaCode: string, invoiceId: number) {
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/batch-summary`;
    return this.http.get<InvoiceDetails>(url);
  }
  /* Method to Get Batch Details for Auditor */

  getServiceDetails(regNo: number, sin: number, id, claimId, isRecoveryRequest) {
    let url = `/api/v1/establishment/${regNo}/contributor/${sin}/injury/${id}/claim/${claimId}/service-details`;
    if (isRecoveryRequest) {
      url = url + '?isRecoveryRequest=true';
    }
    return this.http.get<TreatmentService>(url);
  }

  /* Get Treatment Service Details for a Invoice item */

  getTreatmentServiceDetails(
    tpaCode: string,
    invoiceId: number,
    invoiceItemId: number,
    pagination?: Pagination,
    filterparams?: Array<FilterKeyValue>
  ) {
    let url = '';
    if (pagination) {
      url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/invoice-item/${invoiceItemId}/service-details?pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}`;
    } else {
      url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/invoice-item/${invoiceItemId}/service-details`;
    }
    if (filterparams) {
      const englishType = [];
      const resultArr = [];
      if (filterparams.filter) {
        if (filterparams.filter['type']) {
          filterparams.filter['type'].forEach(element => {
            englishType.push(element.english);
          });
        }
        Object.keys(filterparams.filter).forEach(key => {
          if (key === 'type') {
            this.arrayToParams(key, englishType, null, resultArr);
          } else {
            this.arrayToParams(key, filterparams.filter, null, resultArr);
          }
        });
        url = url.concat(`&${resultArr.join('&')}`);
      }
    }
    if (pagination?.sort?.column) {
      url += `&sort.column=${pagination.sort.column}`;
      if (pagination.sort.direction === 'DESC') {
        url += `&sort.direction=DESC`;
      } else {
        url += `&sort.direction=ASC`;
      }
    }
    return this.http.get<TreatmentService>(url);
  }
  getRecoveryDetails(tpaCode: string, invoiceId: number, invoiceItemId: number) {
    let url = '';
    url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/invoice-item/${invoiceItemId}/recovery-details`;
    return this.http.get<TreatmentService>(url);
  }
  /**
   * This method is used to generate filterparameters
   * @param socialInsuranceNumber
   */
  arrayToParams(paramKey, filterArray, finalParam, resultArr) {
    if (paramKey === 'type') {
      filterArray.forEach(element => {
        finalParam = paramKey + '=' + element;
        resultArr.push(finalParam);
      });
    } else if (filterArray[paramKey]) {
      finalParam = paramKey + '=' + filterArray[paramKey];
      resultArr.push(finalParam);
    }
    return resultArr;
  }
  /* Method to Get Rejected Claims Details for Invoice */

  getRejectedInvoice(tpaCode: string, invoiceId: number) {
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/reject`;
    return this.http.get<InvoiceDetails>(url);
  }
  /* Assign For Auditing */
  assignAuditing(tpaCode: string, invoiceId: number, data) {
    const auditRequest: AuditRequest = new AuditRequest();
    auditRequest.comments = data.auditForm.auditComments;
    auditRequest.reason = data.auditForm.auditReason;
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/audit`;
    return this.http.put<BilingualText>(url, auditRequest);
  }
  /* Assign For Auditing */
  rejectAuditing(tpaCode: string, invoiceId: number, invoiceItemId: number, rejectedServiceList, rejectedService) {
    const rejectRequest: RejectAuditService = new RejectAuditService();
    rejectRequest.comments = rejectedServiceList[0].comments;
    let serviceDetails;
    rejectedServiceList.forEach(element => {
      rejectRequest.serviceDetails[0] = element.serviceDetails;
      serviceDetails = element.serviceDetails.serviceRejectionDetails;
    });
    rejectRequest.serviceDetails.forEach((item, index) => {
      item.invoiceItemId = invoiceItemId;
      item.serviceRejectionDetails = rejectedService;
      item.serviceRejectionDetails[index].rejectionReason = serviceDetails.rejectionReason;
    });
    rejectRequest.serviceDetails[0].serviceRejectionDetails.forEach(item => {
      item.rejectionReason = serviceDetails.rejectionReason;
    });
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/reject`;
    return this.http.put<BilingualText>(url, rejectRequest);
  }
  /* Method to Get Rejected Claims Details for Invoice */

  rejectAllowance(auditNo: number, caseId: number, rejectRequest, registrationNo: number, socialInsuranceNo: number) {
    const rejectRequests: RejectAllowanceService = new RejectAllowanceService();
    rejectRequests.comments = rejectRequest.comments;
    rejectRequests.rejectionReason = rejectRequest.rejectionReason;
    rejectRequest.allowanceRejection.forEach(allowance => {
      if (allowance.rejectedPeriod?.startDate) {
        allowance.rejectedPeriod.startDate.gregorian = moment(allowance.rejectedPeriod?.startDate?.gregorian).format(
          'YYYY-MM-DD'
        );
      }
      if (allowance.rejectedPeriod?.endDate) {
        allowance.rejectedPeriod.endDate.gregorian = moment(allowance.rejectedPeriod?.endDate?.gregorian).format(
          'YYYY-MM-DD'
        );
      }
      rejectRequests.allowanceRejection.push(allowance);
    });

    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${caseId}/claim/reject?auditNo=${auditNo}`;
    return this.http.put<BilingualText>(url, rejectRequests);
  }
  /* Assign For Auditing */
  assignForAuditing(registrationNo, socialInsuranceNo, id, data) {
    const auditRequest: AuditRequest = new AuditRequest();
    auditRequest.comments = data.auditForm.auditComments;
    auditRequest.reason = data.auditForm.auditReason;
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${id}/audit-allowance `;
    return this.http.put<BilingualText>(url, auditRequest);
  }
  /**
   * Fetch claims details
   */
  fetchClaimSummary(tpaCode: string, invoiceId: number, invoiceItemId: number) {
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/invoice-item/${invoiceItemId}`;
    return this.http.get<ClaimSummaryDetails>(url);
  }
  /**
   * Fetch previous Claims
   */
  fetchPrevioucClaims(regNo: number, sin: number, id: number) {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/injury/${id}/previous-claims`;
    return this.http.get<PreviousClaims>(url);
  }
  /**
   * Set Invoice Details
   */
  setInvoiceDetails(invoiceData) {
    this.invoiceDetails = invoiceData;
  }
  /**
   * Set Invoice Details
   */
  getInvoiceData() {
    return this.invoiceDetails;
  }
  /**
   * Submit Reiumbursement Claim
   */
  submitReimbursement(registrationNo, socialInsuranceNo, id, reimbursementId, comments?) {
    const comment = {
      comments: comments
    };
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${id}/reimbursement/${reimbursementId}/submit`;
    return this.http.patch<BilingualText>(url, comment);
  }

  //filterAllowance
  filterAllowance(url, filterValues, pagination) {
    if (filterValues) {
      if (filterValues?.claimType?.length > 0) {
        filterValues.claimType.forEach(element => {
          url = url.concat(`&claimType=${element}`);
        });
      }
      if (filterValues?.noOfDaysMax) {
        url = url.concat(`&noOfDaysMax=${filterValues.noOfDaysMax}`);
      }
      if (filterValues?.noOfDaysMin >= 0) {
        url = url.concat(`&noOfDaysMin=${filterValues.noOfDaysMin}`);
      }
      if (filterValues?.visitsMax >= 0 && filterValues?.visitsMax !== null) {
        url = url.concat(`&visitsMax=${filterValues.visitsMax}`);
      }
      if (filterValues?.visitsMin >= 0 && filterValues?.visitsMin !== null) {
        url = url.concat(`&visitsMin=${filterValues.visitsMin}`);
      }
    } else if (this.filter) {
      if (this.filter?.claimType?.length > 0) {
        this.filter.claimType.forEach(element => {
          url = url.concat(`&claimType=${element}`);
        });
      }
      if (this.filter?.noOfDaysMax) {
        url = url.concat(`&noOfDaysMax=${this.filter.noOfDaysMax}`);
      }
      if (this.filter?.noOfDaysMin >= 0) {
        url = url.concat(`&noOfDaysMin=${this.filter.noOfDaysMin}`);
      }
      if (this.filter?.visitsMax >= 0 && this.filter?.visitsMax !== null) {
        url = url.concat(`&visitsMax=${this.filter.visitsMax}`);
      }
      if (this.filter?.visitsMin >= 0 && this.filter?.visitsMin !== null) {
        url = url.concat(`&visitsMin=${this.filter.visitsMin}`);
      }
    }
    if (pagination?.sort?.column) {
      url += `&sort.column=${pagination.sort.column}`;
      if (pagination.sort.direction === 'DESC') {
        url += `&sort.direction=DESC`;
      } else {
        url += `&sort.direction=ASC`;
      }
    }
    return url;
  }
  updateReadStatus(ohId, transactionId) {
    const url = `/api/v1/injury/${ohId}/clarification-request/${transactionId}/read-notification`;
    return this.http.post<BilingualText>(url, null);
  }
  updateStatus(tpaCode, invoiceId, invoiceItemId) {
    const url = `/api/v1/tpa/${tpaCode}/oh-invoice/${invoiceId}/invoice-item/${invoiceItemId}/read-notification`;
    return this.http.put<BilingualText>(url, null);
  }
  updateAllowanceStatus(auditNo, injuryId) {
    const url = `/api/v1/injury-audit/${auditNo}/read-notification?injuryId=${injuryId}`;
    return this.http.put<BilingualText>(url, null);
  }
  getRejectedCount() {
    const url = `/api/v1/injury/rejected-oh-count`;
    return this.http.get<RejectedCount>(url);
  }
  generateReport(endDate, lang, startDate) {
    const url = `/api/v1/injury/rejected-oh-report?endDate=${endDate}&language=${lang}&startDate=${startDate}`;
    const token = this.tokenService.getAuthToken();
    return this.http.get(url, {
      responseType: 'blob',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }
    });
  }
  generatedReport(uuId: string) {    
    const url = `/api/v1/injury-reports/generated-report?uuid=`+uuId;    
    const token = this.tokenService.getAuthToken();
    return this.http
    .get(url, {
      responseType: 'text',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` }      
    });
  }
  getDocumentContent(contentId: string): Observable<DocumentResponseItem> {
    const formData = { dDocName: contentId };
    return this.http.post<DocumentResponseWrapper>(this.getDocumentUrl, formData).pipe(
      map((res: DocumentResponseWrapper) => {
        const documentResponseItem = new DocumentResponseItem();
        documentResponseItem.fileName = res?.file?.name;
        documentResponseItem.content = res?.file?.content;
        documentResponseItem.id = contentId;
        return documentResponseItem;
      })
    );
  }
  generateDailyAllowanceReport(
    isSinSelected: boolean,
    lang: string,
    sin?,
    identifier?,
    injuryId?,
    injuryNumber?
  ) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/allowance-report?language=${lang}`;
    if (isSinSelected) {
      params = params.append('sin', sin);
    } else {
      params = params.append('identifier', identifier);
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId);
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber);
    }

    const token = this.tokenService.getAuthToken();
    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }

  generateClosedReport(lang: string, reportType: string, batchDateRange?: number, startDate?, endDate?, status?, statusEng?) {
    // const payloadStatus = JSON.stringify(status);
    // const resultArr = [];
    // this.arrayToParams('status', statusEng, null, resultArr);
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/status-report?language=${lang}`;
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (startDate) {
        params = params.append('startDate', startDate);
      }
      if (endDate) {
        params = params.append('endDate', endDate);
      }
    }
    if (reportType){
      params = params.append('reportType', reportType);
    }
    const token = this.tokenService.getAuthToken();
    if (statusEng.length) {
      statusEng.forEach(eachType => {
        params = params.append('status', eachType);
      });
    }
    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }
  generateInjuryStatusReportBI(lang: string, reportType: string, batchDateRange?: number, startDate?, endDate?, statusEng?,
        injuryStatus?) {
    // const payloadStatus = JSON.stringify(status);
    // const resultArr = [];
    // this.arrayToParams('status', statusEng, null, resultArr);
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/injury-status/BI?language=${lang}`;
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (startDate) {
        params = params.append('startDate', startDate);
      }
      if (endDate) {
        params = params.append('endDate', endDate);
      }
    }
    if (reportType){
      params = params.append('reportType', reportType);
    }
   
    if (statusEng) {
      params = params.append('injurystatus', statusEng);
    }
    const token = this.tokenService.getAuthToken();
   
    return this.http
      .get(url, {
        responseType: 'text',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      });
  }
  generateClosedReportBI(lang: string, reportType: string, batchDateRange?: number, startDate?, endDate?, establishmentRegNo?, 
    status?, statusEng?, injuryNumber?, sin?, identifier?, injuryStatus?) { 
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/injury-closed-status/BI?language=${lang}&injurystatus=${statusEng}`;
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (startDate) {
        params = params.append('startDate', startDate);
      }
      if (endDate) {
        params = params.append('endDate', endDate);
      }
    }
    if (reportType){
      params = params.append('reportType', reportType);
    }
    if (establishmentRegNo) {
      params = params.append('establishmentRegNo', establishmentRegNo);
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber);
    }
    if (sin) {
      params = params.append('sin', sin);
    }
    if (identifier) {
      params = params.append('identifier', identifier);
    }
    if (injuryStatus) {
      params = params.append('status', injuryStatus);
    }
  /*   if (injuryStatus) {
      params = params.append('injuryStatus', injuryStatus);
    } */
    const token = this.tokenService.getAuthToken();
   /*  if (statusEng && statusEng.length) {
      statusEng.forEach(eachType => {
        params = params.append('status', eachType);
      });
    } */
    return this.http
      .get(url, {
        responseType: 'text',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      });
     
  }
  getInjuryPeriodReportBI(
    lang: string,
    batchDateRange?: number,
    endDate?,
    establishmentRegNo?,
    injuryNumber?,
    sin?,
    identifier?,
    startDate?
  ) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/injury-certain-period/BI?language=${lang}`;
    const token = this.tokenService.getAuthToken();
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (endDate) {
        params = params.append('endDate', endDate);
      }
      if (startDate) {
        params = params.append('startDate', startDate);
      }
    }
    if (establishmentRegNo) {
      params = params.append('establishmentRegNo', establishmentRegNo);
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber);
    }
    if (sin) {
      params = params.append('sin', sin);
    }
    if (identifier) {
      params = params.append('identifier', identifier);
    }
    return this.http
      .get(url, {
        responseType: 'text',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      });
  }

  getInjuryPeriodReport(
    lang: string,
    batchDateRange?: number,
    endDate?,
    establishmentRegNo?,
    injuryNumber?,
    sin?,
    identifier?,
    startDate?,
    injuryStatus? 
  ) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/injury-certain-period?language=${lang}`;
    const token = this.tokenService.getAuthToken();
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (endDate) {
        params = params.append('endDate', endDate);
      }
      if (startDate) {
        params = params.append('startDate', startDate);
      }
    }
    if (establishmentRegNo) {
      params = params.append('establishmentRegNo', establishmentRegNo);
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber);
    }
    if (sin) {
      params = params.append('sin', sin);
    }
    if (identifier) {
      params = params.append('identifier', identifier);
    }
    if (injuryStatus) {
      params = params.append('injuryStatus', injuryStatus);
    }
    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }

  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();

    const obs = Observable.create((observer: any) => {
      reader.onloadend = e => {
        observer.error(JSON.parse(reader.result.toString()));
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
  showAlerts(error: any) {
    throw new Error('Method not implemented.');
  }
  getClaimsAmount(lang: string, batchDateRange?: number, cchiNo?, endDate?, hospitalCode?, invoiceNumber?, startDate?) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/claims-amount-report?language=${lang}`;
    const token = this.tokenService.getAuthToken();
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (endDate) {
        params = params.append('endDate', endDate);
      }
      if (startDate) {
        params = params.append('startDate', startDate);
      }
    }
    if (cchiNo) {
      params = params.append('cchiNo', cchiNo);
    }
    if (hospitalCode) {
      params = params.append('hospitalCode', hospitalCode);
    }
    if (invoiceNumber) {
      params = params.append('invoiceNumber', invoiceNumber);
    }
    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }
  getClaimsAmountReportBI(lang: string, batchDateRange?: number, cchiNo?, endDate?, hospitalCode?, invoiceNumber?, startDate?, recoverdFrom?,
    sin?, amount?, identifier?, injuryId?, injuryNumber?, establishmentRegNo?) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/claim-amount-tpa/BI?language=${lang}`;
    const token = this.tokenService.getAuthToken();
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (endDate) {
        params = params.append('endDate', endDate);
      }
      if (startDate) {
        params = params.append('startDate', startDate);
      }
    }
    if (cchiNo) {
      params = params.append('cchiNo', cchiNo);
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId.toString());
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber.toString());
    }
    if (recoverdFrom) {
      params = params.append('recoverdFrom', recoverdFrom);
    }
    if (establishmentRegNo) {
      params = params.append('establishmentRegNo', establishmentRegNo.toString());
    } 
    if (amount) {
      params = params.append('amount', amount.toString());
    }
    if (hospitalCode) {
      params = params.append('hospitalCode', hospitalCode);
    }
    if (invoiceNumber) {
      params = params.append('invoiceNumber', invoiceNumber);
    }
    if (identifier) {
      params = params.append('identifier', identifier);
    }
    if (sin) {
      params = params.append('sin', sin.toString());
    }
    return this.http
    .get(url, {
      responseType: 'text',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
      params
    });
  }

  getRecoveryReport(lang: string, batchDateRange?: number, endDate?, startDate?, establishmentRegNo?, recoverdFrom?) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/recovered-amount?language=${lang}`;
    const token = this.tokenService.getAuthToken();

    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (endDate) {
        params = params.append('endDate', endDate);
      }
      if (startDate) {
        params = params.append('startDate', startDate);
      }
    }
    if (recoverdFrom) {
      params = params.append('recoverdFrom', recoverdFrom);
    }
    if (establishmentRegNo) {
      params = params.append('establishmentRegNo', establishmentRegNo);
    }
    return this.http
      .get(url, {
        responseType: 'blob',
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }

  generateInjuriesMoreReport(
    lang: string,
    batchDateRange?: number,
    startDate?,
    endDate?,
    treatmentType?: string[],
    treatmentDuration?: Number,
    sin?: Number,
    identifier?: Number,
    injuryNumber?: Number,
    injuryId?: Number
  ) {
    // const payloadStatus = JSON.stringify(status);
    // const resultArr = [];
    // this.arrayToParams('status', statusEng, null, resultArr);
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/treatment-period-report?treatmentType=${treatmentType}&treatmentDuration=${treatmentDuration}&language=${lang}`;
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (startDate) {
        params = params.append('startDate', startDate);
      }
      if (endDate) {
        params = params.append('endDate', endDate);
      }
    }
    if (sin) {
      params = params.append('sin', sin.toString());
    }
    if (identifier) {
      params = params.append('identifier', identifier.toString());
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber.toString());
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId.toString());
    }
    const token = this.tokenService.getAuthToken();

    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }
    generateInjuriesMoreReportBI(
    lang: string,
    batchDateRange?: number,
    startDate?,
    endDate?,
    treatmentType?: string[],
    treatmentDuration?: Number,
    sin?: Number,
    identifier?: Number,
    injuryNumber?: Number,
    injuryId?: Number
  ) {
    // const payloadStatus = JSON.stringify(status);
    // const resultArr = [];
    // this.arrayToParams('status', statusEng, null, resultArr);
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/treatment-period-report/BI?treatmentType=${treatmentType}&treatmentDuration=${treatmentDuration}&language=${lang}`;
    if (batchDateRange) {
      params = params.append('batchDateRange', batchDateRange.toString());
    } else {
      if (startDate) {
        params = params.append('startDate', startDate);
      }
      if (endDate) {
        params = params.append('endDate', endDate);
      }
    }
    if (sin) {
      params = params.append('sin', sin.toString());
    }
    if (identifier) {
      params = params.append('identifier', identifier.toString());
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber.toString());
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId.toString());
    }
    const token = this.tokenService.getAuthToken();

    return this.http
      .get(url, {
        responseType: 'text',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      });
  }
  generateCasesExceedsReportBI(lang: string, amount?, endDate?, identifier?, injuryNumber?, injuryId?, sin?, startDate?) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/claim-amount-report/BI?language=${lang}`;
    // ?startDate=${startDate}&endDate=${endDate}&amount=${amount}&sin=${sin}&identifier=${identifier}&injuryNumber=${injuryNumber}&injuryId=${injuryId}
    // if (batchDateRange) {
    //   params = params.append('batchDateRange', batchDateRange.toString());
    // }
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }

    if (amount) {
      params = params.append('amount', amount);
    }
    // if (cchiNo) {
    //   params = params.append(`cchiNo`, cchiNo);
    // }
    // if (establishmentRegNo) {
    //   params = params.append(`establishmentRegNo`, establishmentRegNo);
    // }
    // if (hospitalCode) {
    //   params = params.append(`hospitalCode`, hospitalCode);
    // }
    // if (recoverdFrom) {
    //   params = params.append(`recoverdFrom`, recoverdFrom);
    // }
    if (sin) {
      params = params.append('sin', sin.toString());
    }
    if (identifier) {
      params = params.append('identifier', identifier.toString());
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber.toString());
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId.toString());
    }
    // if (invoiceNumber) {
    //   params = params.append(`invoiceNumber`, invoiceNumber);
    // }
    const token = this.tokenService.getAuthToken();

    return this.http
    .get(url, {
      responseType: 'text',
      headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
      params
    });
  }
  generateCasesExceedsReport(lang: string, amount?, endDate?, identifier?, injuryNumber?, injuryId?, sin?, startDate?) {
    let params = new HttpParams();
    const url = `/api/v1/injury-reports/claim-expenses?language=${lang}`;
    // ?startDate=${startDate}&endDate=${endDate}&amount=${amount}&sin=${sin}&identifier=${identifier}&injuryNumber=${injuryNumber}&injuryId=${injuryId}
    // if (batchDateRange) {
    //   params = params.append('batchDateRange', batchDateRange.toString());
    // }
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }

    if (amount) {
      params = params.append('amount', amount);
    }
    // if (cchiNo) {
    //   params = params.append(`cchiNo`, cchiNo);
    // }
    // if (establishmentRegNo) {
    //   params = params.append(`establishmentRegNo`, establishmentRegNo);
    // }
    // if (hospitalCode) {
    //   params = params.append(`hospitalCode`, hospitalCode);
    // }
    // if (recoverdFrom) {
    //   params = params.append(`recoverdFrom`, recoverdFrom);
    // }
    if (sin) {
      params = params.append('sin', sin.toString());
    }
    if (identifier) {
      params = params.append('identifier', identifier.toString());
    }
    if (injuryNumber) {
      params = params.append('injuryNumber', injuryNumber.toString());
    }
    if (injuryId) {
      params = params.append('injuryId', injuryId.toString());
    }
    // if (invoiceNumber) {
    //   params = params.append(`invoiceNumber`, invoiceNumber);
    // }
    const token = this.tokenService.getAuthToken();

    return this.http
      .get(url, {
        responseType: 'blob',
        headers: { noAuth: 'true', Authorization: `Bearer ${token}` },
        params
      })
      .pipe(catchError(this.parseErrorBlob));
  }
  
  setAlert(message: BilingualText) {
    this.alert = message;
  }
  getAlert() {
    return this.alert;
  }

  // audit apis

  fetchAllowanceSummaryOh(caseId: number, referenceNo: number) {
    const url = `/api/v1/allowance-audit/${referenceNo}/injury/${caseId}`;
    return this.http.get<AllowanceAuditSummaryOh>(url);
  }
  getAuditOhDetails(referenceNo: number) {
    const url = `/api/v1/allowance-audit/${referenceNo}`;
    return this.http.get<AllowanceOhList>(url);
  }
  closeAllowance(comments, ohClaimIds, injuryId, referenceNo) {
    const closedDetails: ClosedAllowanceDetails = new ClosedAllowanceDetails();
    // closedDetails.comments = comments;
    closedDetails.ohClaimIds = ohClaimIds;
    const url = `/api/v1/allowance-audit/${referenceNo}/injury/${injuryId}/close`;
    return this.http.put<ClosedAllowanceDetails>(url, closedDetails);
  }
  requestTpaAllowance(workflowData: ClosedAllowanceDetails, injuryId, referenceNo) {
    const url = `/api/v1/allowance-audit/${referenceNo}/injury/${injuryId}/request-clarification`;
    return this.http.put<ClosedAllowanceDetails>(url, workflowData);
  }
}

