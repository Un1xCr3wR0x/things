/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  Lov,
  LovList,
  MobileDetails,
  DocumentItem,
  bindToObject,
  InjuredPerson,
  NewReportDetails
} from '@gosi-ui/core';

import {
  DisabilityDetailsDto,
  DisabiliyDtoList,
  NewReportRequest,
  NonOCCResponse
} from '@gosi-ui/features/medical-board';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators';
import { OhConstants } from '../constants';
import { WorkFlowType } from '../enums';
import {
  Injury,
  InjuryFeedback,
  InjuryHistoryResponse,
  InjuryStatistics,
  InjuryWrapper,
  Pagination,
  GroupInjury,
  InjuredContributorsDTO,
  RejectFeedback,
  RasedDoc,
  DocumentByte,
  disabilityWrapperDto,
  DisabilityDetails,
  Complication,
  ComplicationWrapper
} from '../models';
import { RejectionDetails } from '../models/rejection-details';
import { OhService } from './oh.service';

@Injectable({
  providedIn: 'root'
})
export class InjuryService {
  navigationIndicator = 0;
  inProgress = false;
  private injuryRejectReasonUrl = '/api/v1/lov';
  status: BilingualText[] = [];
  statusEng: string[];
  injurySelected = false;
  reportDetails: NewReportDetails;
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    //TODO: remove oh service from here and pass values as params when calling methods
    readonly ohService: OhService
  ) {}

  /**
   * This method is to fetch injury rejection reason values.
   */
  getInjuryRejectReasonList(workflowType, resourceType?): Observable<LovList> {
    let domainName = 'TransactionRejectReason';
    if (workflowType === WorkFlowType.REJECT_COMPLICATION || workflowType === WorkFlowType.COMPLICATION) {
      domainName = 'ComplicationRejectionCode';
    } else if (workflowType === WorkFlowType.REJECT_INJURY || workflowType === WorkFlowType.INJURY) {
      domainName = 'InjuryRejectionCode';
    } else if (workflowType === WorkFlowType.REJECT_DISEASE || workflowType === WorkFlowType.DISEASE) {
      domainName = 'DiseaseRejectionReason';
    }

    return this.http
      .get<Lov[]>(this.injuryRejectReasonUrl, {
        params: {
          category: 'registration',
          domainName: domainName
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  getReimbRejectReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.injuryRejectReasonUrl, {
        params: {
          category: 'Collection',
          domainName: 'ReimbursementRejectionReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch injury rejection reason values.
   */
  getInspectionList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.injuryRejectReasonUrl, {
        params: {
          category: 'registration',
          domainName: 'InspectionType'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   *
   * @param indicator Setting Indicator for modify flow
   */
  setNavigationIndicator(indicator: number) {
    this.navigationIndicator = indicator;
  }

  /* @param indicator Setting Status for filter
   */
  setStatus(statusFilter: BilingualText[]) {
    if (statusFilter) {
      this.statusEng = statusFilter.map(items => items.english);
      if (this.statusEng.find(status => status === 'Closed')) {
        this.statusEng.push(
          'Cured With Disability',
          'Cured Without Disability',
          'Closed without continuing treatment',
          'Resulted in Death'
        );
      }
    } else {
      this.statusEng = null;
    }
  }
  /**
   * This method is to fetch injury rejection reason values for validator.
   */
  getRejectReasonValidator(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.injuryRejectReasonUrl, {
        params: {
          category: 'registration',
          domainName: 'TransactionRejectReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is used to generate filterparameters
   * @param socialInsuranceNumber
   */
  arrayToParams(paramKey, filterArray, finalParam, resultArr) {
    if (filterArray) {
      filterArray.forEach(element => {
        finalParam = paramKey + '=' + element;
        resultArr.push(finalParam);
      });
    } else {
      finalParam = paramKey + '=';
      resultArr.push(finalParam);
    }
    return resultArr;
  }
  /**
   * This method is used to get the Injury History
   * @param socialInsuranceNumber
   */

  getInjuryHistory(
    socialInsuranceNumber: number,
    ohType?: string,
    pagination?: Pagination,
    isAppPublic?: boolean
  ): Observable<InjuryHistoryResponse> {
    let getInjuryHistoryUrl = '';
    if (this.appToken === ApplicationTypeEnum.PUBLIC && this.ohService.getRegistrationNumber() && this.ohService.getRegistrationNumber() !== 0
    && socialInsuranceNumber && socialInsuranceNumber !== 0) {
      getInjuryHistoryUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${socialInsuranceNumber}/injury`;
    } else if (socialInsuranceNumber && socialInsuranceNumber !== 0) {
      getInjuryHistoryUrl = `/api/v1/contributor/${socialInsuranceNumber}/injury`;
    }
    let injRequest = new Pagination();
    if (pagination) {
      injRequest = pagination;
    }
    const isOtherEngInjuryReq = true;
    if (injRequest) {
      if (this.statusEng) {
        const resultArr = [];
        this.arrayToParams('status', this.statusEng, null, resultArr);
        getInjuryHistoryUrl = `${getInjuryHistoryUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${
          injRequest.page.pageNo
        }&pageSize=${injRequest.page.size}&${resultArr.join('&')}`;
      } else {
        getInjuryHistoryUrl = `${getInjuryHistoryUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${injRequest.page.pageNo}&pageSize=${injRequest.page.size}`;
      }
    }
    return this.http.get<InjuryHistoryResponse>(getInjuryHistoryUrl);
  }

  /**
   *
   * @param reportInjuryDetails Submiting the injury reported
   */
  updateInjuryService(reportInjuryDetails: Injury): Observable<number> {
    let req;
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${
      reportInjuryDetails.injuryId
    }`;
    req = new HttpRequest('PUT', url, reportInjuryDetails, {
      reportProgress: true
    });
    return this.http.request<number>(req).pipe(
      map(event => {
        if (event && event.type === HttpEventType.Response) {
          this.inProgress = false;
          return event.body;
        } else {
          this.inProgress = true;
          return null;
        }
      }),
      filter(res => res !== null),
      catchError(err => this.handleError(err))
    );
  }
  private handleError(error: HttpErrorResponse) {
    this.inProgress = false;
    return throwError(error);
  }
  /**
   *
   * @param reportInjuryDetails Submiting the injury reported
   */
  reportInjuryService(reportInjuryDetails: Injury): Observable<number> {
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury`;
    return this.http.post<number>(url, reportInjuryDetails);
  }

  /**
   * This method is to save emergency contact number for Injury
   * @param contributor
   */

  saveEmergencyContactInjury(emergencyContact: MobileDetails): Observable<number> {
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/emergency-contact`;
    return this.http.patch<number>(url, emergencyContact);
  }
  /**
   * This method is to save emergency contact number for Injury
   * @param contributor
   */

  saveAllowancePayee(
    allowancePayeeType: number,
    navigationIndicator: number,
    uuid?: string
  ): Observable<BilingualText> {
    const allowancePaye = {
      allowancePayee: allowancePayeeType,
      navigationIndicator: navigationIndicator,
      uuid: uuid,
      ohDate: null,
      ohType: null
    };
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${this.ohService.getInjuryId()}/allowance-payee`;
    return this.http.patch<BilingualText>(url, allowancePaye);
  }

  /**
   *Final submit of injury
   * @param injuryNo
   */
  submitInjury(injuryNo, actionFlag: boolean, comments, injury?, isAppPrivate?): Observable<InjuryFeedback> {
    if (injury) {
      const injuryNumber = {
        comments: comments,
        navigationIndicator: this.navigationIndicator,
        allowancePayee: injury.allowancePayee,
        delayByEmployer: injury.delayByEmployer
      };
      const submitInjuryUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${injuryNo}/submit?isEdited=${actionFlag}`;
      return this.http.patch<InjuryFeedback>(submitInjuryUrl, injuryNumber);
    } else {
      const injuryNumber = {
        comments: comments,
        navigationIndicator: this.navigationIndicator
      };
      const submitInjuryUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${injuryNo}/submit?isEdited=${actionFlag}`;
      return this.http.patch<InjuryFeedback>(submitInjuryUrl, injuryNumber);
    }
  }

  rejectInjury(result, injuryNo): Observable<InjuryFeedback> {
    const injuryNumber = {
      rejectionCode: result
    }
    const rejectionInjuryUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury/${injuryNo}/rejectInjury`;
    return this.http.patch<InjuryFeedback>(rejectionInjuryUrl, injuryNumber);
  }
  /**
   *
   * @param socialInsuranceNo Getting the previous injury details
   */
  getInjuryStatistics(injuryId?) {
    if(this.ohService.getRegistrationNumber() && this.ohService.getSocialInsuranceNo()){
      let url = `/api/v1`;
      if (this.appToken === ApplicationTypeEnum.PUBLIC) {
        url += `/establishment/${this.ohService.getRegistrationNumber()}/contributor/${this.ohService.getSocialInsuranceNo()}/injury-statistics`;
      } else {
        url += `/contributor/${this.ohService.getSocialInsuranceNo()}/injury-statistics`;
      }
      if (injuryId !== null && injuryId !== undefined) {
        url += `?injuryId=${injuryId}`;
      }
      return this.http.get<InjuryStatistics>(url);
    }   
  }

  /**
   *
   * @param injuryType fetching the injury reason corosponding to injury type
   */
  getInjuryReason(injuryType: string): Observable<LovList> {
    const url = `/api/v1/establishment/injuryReason?typeName=${injuryType}`;
    return this.http.get<LovList>(url);
  }

  /**
   * Reject injury
   */
  updateInjuryRejection(
    rejectionDetails: RejectionDetails,
    registrationNo,
    socialInsuranceNo,
    injuryId,
    canAddComments
  ): Observable<RejectFeedback> {
    let action = '';
    if (canAddComments) {
      action = 'V1EDITREJECTION';
    } else {
      action = 'V1REJECTION';
    }
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/injuryRejection?action=${action}`;
    return this.http.put<RejectFeedback>(url, rejectionDetails);
  }

  /**
   * This method is to get injury details
   * @param socialInsuranceNo
   * @param injuryId
   */
  getInjuryDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    injuryId: number,
    isAppIndividual: boolean,
    isChangeRequired = false
  ) {
    let url = '';
    if (isAppIndividual) {
      url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isChangeRequired}`;
    } else if (socialInsuranceNo && registrationNo && injuryId) {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isChangeRequired}`;
    }
    return this.http.get<InjuryWrapper>(url);
  }
  /**
   *
   * @param registrationNo Get Modified Injury Details
   * @param socialInsuranceNo
   * @param injuryId
   * @param isChangeRequired
   */
  getModifiedInjuryDetails(registrationNo: number, socialInsuranceNo: number, injuryId: number, refNo: number) {
    if (socialInsuranceNo && registrationNo && injuryId) {
      const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/change-request/${refNo}`;
      return this.http.get<Injury>(url);
    }
  }
  getInjuredContributorsList(
    groupInjuryId: number  ,
    registrationNo: number
  ): Observable<InjuredContributorsDTO[]> {
    let url = '';
    url = `/api/v1/establishment/${registrationNo}/groupinjury/${groupInjuryId}/injured-contributors`;
    return this.http.get<InjuredContributorsDTO[]>(url);
  }
  /**
   *
   * This method is to get Disability details of closed injury
   * @param registrationNo
   * @param socialInsuranceNo
   * @param injuryId
   * @param transactionTraceId
   */
  getDisabilityDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    injuryId: number,
    transactionTraceId: number
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/close-request/${transactionTraceId}`;
    return this.http.get<InjuredPerson[]>(url);
  }
  getDisabilityDetailsDisease(
    registrationNo: number,
    socialInsuranceNo: number,
    injuryId: number,
    transactionTraceId: number
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/close-request/${transactionTraceId}`;
    return this.http.get<InjuredPerson>(url);
  }
  /**
   * This method is to put Disability  details
   * @param registrationNo
   * @param socialInsuranceNo
   * @param injuryId
   */
  putDisabilityDetails(
    disabilityDetails: DisabilityDetailsDto,
    injuryId: number,
    registrationNo: number,
    socialInsuranceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/update-cwd-details`;
    return this.http.put<BilingualText>(url, disabilityDetails);
  }
  /**
   * This method is to put Medical Report details
   *
   */
  putReportDetails(newReportRequest: NewReportRequest): Observable<null> {
    const url = `/api/v1/`;
    return this.http.put<null>(url, newReportRequest);
  }
  /**
   * This method is to get complication   details
   * @param registrationNo
   * @param socialInsuranceNo
   * @param injuryId
   */
  getComplication(
    registrationNo: number,
    socialInsuranceNo: number,
    injuryId: number
  ): Observable<InjuryHistoryResponse> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/complication`;
    return this.http.get<InjuryHistoryResponse>(url);
  }
  /**
   * This method is to get complication   details
   * @param registrationNo
   * @param socialInsuranceNo
   * @param injuryId
   */
  putNonOccDisabilityDetails(
    disabilityDetails: DisabilityDetailsDto,
    injuryId: number,
    registrationNo: number,
    socialInsuranceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/non-occ-disability-assessment`;
    return this.http.put<BilingualText>(url, disabilityDetails);
  }
  getDisabilityDetail(mbAssessmentRequestId: number, socialInsuranceNo: number): Observable<DisabiliyDtoList> {
    const url = `/api/v1/mb-assessment/${socialInsuranceNo}/${mbAssessmentRequestId}/disability-assessment`;
    return this.http.get<DisabiliyDtoList>(url);
  }
  putParamTransactionDetails(
    identifier: number,
    disabilityDetails: DisabilityDetailsDto,
    assessmentRequestId: number,
    isReturn?: boolean,
    isEarlyReassessment?: boolean,
    referenceNo?:number
  ): Observable<NonOCCResponse> {
    let params = new HttpParams();
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestId}/submit`;
    if(referenceNo){
      params =params.set('referenceNo', referenceNo.toString());
    }
    if (isReturn === true) {
      params = params.set('isReturn', 'true');
    }
    if (isEarlyReassessment === true) {
      params = params.set('isEarlyReassessment', 'true');
    }
    return this.http.put<NonOCCResponse>(url, disabilityDetails, { params });
  }
  setMedicalReportDetails(newReportDetails) {
    this.reportDetails = newReportDetails;
  }
  getMedicalReportDetails() {
    return this.reportDetails;
  }

  getRepatriationRejectReasonList(): Observable<LovList> {
    let domainName = 'DeadBodyRejectionReason';
    return this.http
      .get<Lov[]>(this.injuryRejectReasonUrl, {
        params: {
          category: 'registration',
          domainName: domainName
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
}
