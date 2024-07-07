import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssessmentResponseDto, BilingualText, InjuredPerson, Lov, LovList } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { HelperReasons, nonOccDisabilityReasons, occDisabilityReasons } from '../constants';
import {
  DisabilityDetails,
  InjuryWrapper,
  Contributor,
  MbList,
  AssessmentDetailsResponse,
  AssessmentSuccessResponse,
  SessionAssessments,
  VisitingDoctorList,
  ComplicationWrapper,
  MedicalBoardAssessmentRequest,
  MBPaymentHistory,
  PaymentHistoryRequest
} from '../models';
import moment from 'moment';
import { AssessedBy } from '../models/appeal-reason';

@Injectable({
  providedIn: 'root'
})
export class DisabilityAssessmentService {
  disabilityType: BilingualText;
  _sessionId: number;
  _disabilityAssessmentId: number;
  _isGosiDr = false;
  _isCompleted = false;
  _transactionTraceId: number;
  personId: number;
  contractDoctor = false;
  _socialInsuranceNo: number;
  _isWithdraw: boolean;
  nationalId: string;
  personIdentifier: number;
  isAmb;
  regNo : number;
  isModified;
  prevDisbAssmntId: number;
  assessmentStatus: BilingualText;
  documentReferenceNo: number;
  participantPresence: BilingualText;
  assessmentTypes: BilingualText;
  isSaudi = false;
  benefitReqId: number;
  referenceNumber: number;
  modifyAssessmentDetails = false;
  _isHoReturn = false;
  sessionIdMb:number;
  mbassessmentId:number;
  constructor(private http: HttpClient) {}

  getInjuryDetailsById(regNo, socialInsuranceNo, injuryId): Observable<InjuryWrapper> {
    const url = `/api/v1/establishment/${regNo}/contributor/${socialInsuranceNo}/injury/${injuryId}`;
    return this.http.get<InjuryWrapper>(url);
  }
  getInjuryDetailsSinById(socialInsuranceNo, injuryId): Observable<InjuryWrapper> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}`;
    return this.http.get<InjuryWrapper>(url);
  }
  /**
   * Getting the complication Details
   */
  getComplicationDetailsById(
    socialInsuranceNo,
    injuryId,
    complicationId,
    isChangeRequired
  ): Observable<ComplicationWrapper> {
    if (socialInsuranceNo && injuryId && complicationId) {
      let getComplicationUrl = '';
      getComplicationUrl = `/api/v1/contributor/${socialInsuranceNo}/injury/${injuryId}/complication/${complicationId}?isChangeRequired=${isChangeRequired}`;
      return this.http.get<ComplicationWrapper>(getComplicationUrl);
    }
  }
  setRegNo(regNo){
    this.regNo = regNo
  }
  getRegistrationNo(){
    return this.regNo
  }
  getPreviousDisability(
    identifier: number|string,
    nationalId?: number,
    assessmentType?: string,
    assessmentsRequest?: MedicalBoardAssessmentRequest,
    assessedByDto?: AssessedBy,
    injuryCompBenReqid?: number,
    benefitReqId?: number,
    isAssessment?:boolean
  ): Observable<DisabilityDetails> {
    const url = `/api/v1/participant/${identifier}/previous-disability-assessments`;
    let startDate = null;
    let endDate = null;

    let params = new HttpParams();
    if (assessmentsRequest?.pageSize) {
      params = params
        .set('pageNo', assessmentsRequest.pageNo.toString())
        .set('pageSize', assessmentsRequest.pageSize.toString());
    }
    if (nationalId && assessmentType) {
      // params = params.set('reqIdentifier', nationalId.toString());
      params = params.set('assessmentType', assessmentType);
    }
    if (assessmentsRequest?.searchKey) params = params.append('searchKey', assessmentsRequest?.searchKey.toString());
    // if (assessmentsRequest?.identifier) {
    //   params = params.set('reqIdentifier', nationalId.toString());
    // }
    if (assessmentsRequest?.assessmentType) {
      assessmentsRequest.assessmentType.forEach(data => {
        params = params.append('assessmentType', data.english);
      });
    }

    if (assessmentsRequest?.status) {
      assessmentsRequest.status.forEach(data => {
        params = params.append('status', data.english);
      });
    }
    if (assessmentsRequest?.medicalBoardType) {
      assessmentsRequest.medicalBoardType.forEach(data => {
        params = params.append('medicalBoardType', data.english);
      });
    }

    if (assessmentsRequest?.sessionPeriodFrom && assessmentsRequest?.sessionPeriodTo) {
      startDate = this.convertToDDMMYYYY(assessmentsRequest?.sessionPeriodFrom?.toString());
      endDate = this.convertToDDMMYYYY(assessmentsRequest?.sessionPeriodTo?.toString());
    }
    if (startDate && endDate) {
      params = params.append('startDate', startDate);
      params = params.append('endDate', endDate);
    }
    if (assessmentsRequest?.sortOrder) {
      params = params.set('sortOrder', assessmentsRequest.sortOrder);
    }
    if (assessedByDto?.isMbo) {
      params = params.set('isMbo', assessedByDto?.isMbo?.toString());
    }
    if (assessedByDto?.isContributor) {
      params = params.set('isParticipant', assessedByDto?.isContributor?.toString());
    }
    if (assessedByDto?.isHoDoctor) {
      params = params.set('isHoDoctor', assessedByDto?.isHoDoctor?.toString());
    }
    if (assessedByDto?.isMbManager) {
      params = params.set('isMbManager', assessedByDto?.isMbManager?.toString());
    }
    if (injuryCompBenReqid) {
      params = params.set('injuryId', injuryCompBenReqid.toString());
    }
    if (benefitReqId) {
      params = params.set('benefitReqId', benefitReqId.toString());
    }
    if(isAssessment){
      params = params.set('isAssessment', isAssessment.toString());
    }
    // if (disabilityAssessmentId) {
    //   params = params.set('searchKey', disabilityAssessmentId.toString());
    // }
    return this.http.get<DisabilityDetails>(url, { params });
  }
  getVisitingDoctorDetails(identifier, assessmentRequestId): Observable<MbList> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestId}/visiting-doctor-details`;
    return this.http.get<MbList>(url);
  }
  getDisabilityDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    injuryId: number,
    transactionTraceId: number
  ) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/injury/${injuryId}/close-request/${transactionTraceId}`;
    return this.http.get<InjuredPerson[]>(url);
  }
  getContributorByPersonId(personId: number): Observable<Contributor> {
    const url = `/api/v1/contributor`;
    let params = new HttpParams();
    params = params.set('personId', personId?.toString());
    return this.http.get<Contributor>(url, { params });
  }
  getContributorBySin(sin): Observable<Contributor> {
    const url = `/api/v1/contributor/${sin}`;
    return this.http.get<Contributor>(url);
  }
  getAssessmentDetails(identifier): Observable<AssessmentDetailsResponse[]> {
    const url = `/api/v1/participant/${identifier}/participant-invitation-details`;
    return this.http.get<AssessmentDetailsResponse[]>(url);
  }
  getCityList(): Observable<Lov[]> {
    const url = `/api/v1/lov/village`;
    return this.http.get<Lov[]>(url);
  }
  createAssessment(assessmentRequest, identifier): Observable<AssessmentSuccessResponse> {
    const url = `/api/v1/participant/${identifier}/disability-assessment`;
    return this.http.post<AssessmentSuccessResponse>(url, assessmentRequest);
  }
  editAssessment(assessmentRequest, identifier, assessmentResponse,isReturn?): Observable<AssessmentSuccessResponse> {
    let url = `/api/v1/participant/${identifier}/disability-assessment/${assessmentResponse.disabilityAssessmentId}`;
    let params = new HttpParams();
    if (assessmentResponse.transactionTraceId) {
      params = params.set('referenceNo', assessmentResponse.transactionTraceId);
    }
    if (isReturn) {
      params = params.set('isReturn', isReturn);
    }
    params = params.set('isGosiDr', assessmentRequest?.isGosiDoctor);
    // url += `&isGosiDr=${assessmentRequest?.isGosiDoctor}`;
    return this.http.put<AssessmentSuccessResponse>(url, assessmentRequest, { params });
  }

  getHelperReason(): Observable<LovList> {
    return of(new LovList(HelperReasons));
  }
  submitAssessmentDetails(
    comments,
    identifier,
    referenceNo,
    disabilityAssessmentId,
    isGosiDoctor?,
    isReturn?
  ): Observable<AssessmentSuccessResponse> {
    const url = `/api/v1/participant/${identifier}/disability-assessment/${disabilityAssessmentId}/submit?referenceNo=${referenceNo}`;
    let params = new HttpParams();
    if (isGosiDoctor) {
      params = params.set('isGosiDr', isGosiDoctor);
    }
    if (isReturn) {
      params = params.set('isReturn', isReturn);
    }
    return this.http.patch<AssessmentSuccessResponse>(url, comments, { params });
  }
  submitAppealDetails(
    sin: number,
    disabilityAssessmentId: number,
    assessmentRequestDto,
    assessedByDto: boolean
  ): Observable<AssessmentResponseDto> {
    const url = `/api/v1/participant/${sin}/disability-assessment/${disabilityAssessmentId}/appeal`;
    let params = new HttpParams();
    // if (assessedByDto?.isContributor) {
    //   params = params.set('isParticipant', assessedByDto?.isContributor);
    // }
    // if (assessedByDto?.isMbo) {
    //   params = params.set('isMbo', assessedByDto?.isMbo);
    // }

    params = params.set('isHoDoctor', assessedByDto.toString());
    return this.http.post<AssessmentResponseDto>(url, assessmentRequestDto, { params });
  }
  withdrawAppeal(sin: number, disabilityAssessmentId: number, assessmentRequestDto): Observable<AssessmentResponseDto> {
    const url = `/api/v1/participant/${sin}/disability-assessment/${disabilityAssessmentId}/withdraw-appeal`;
    return this.http.post<AssessmentResponseDto>(url, assessmentRequestDto);
  }
  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };
  public get assessmentType() {
    return this.disabilityType;
  }
  public set assessmentType(type) {
    this.disabilityType = type;
  }
  public get sessionId() {
    return this._sessionId;
  }
  public set sessionId(id) {
    this._sessionId = id;
  }
  getOccDisabilityReasons(): Observable<LovList> {
    return of(new LovList(occDisabilityReasons));
  }
  getNonOccDisabilityReasons(): Observable<LovList> {
    return of(new LovList(nonOccDisabilityReasons));
  }
  getSpecialities(): Observable<Lov[]> {
    return this.http.get<Lov[]>(`/api/v1/lov/specialty`);
  }
  getDisabledPartsById(identifier: number, injuryId: number) {
    return this.http.get(`/api/v1/participant/${identifier}/injured-parts/${injuryId}`);
  }
  getVisitingDoctors(sessionId): Observable<VisitingDoctorList[]> {
    return this.http.get<VisitingDoctorList[]>(`/api/v1/mb-session/${sessionId}/visiting-doctor`);
  }
  getSessionAssessments(sessionId, mbProfessionalId?): Observable<SessionAssessments> {
    const url = `/api/v1/mb-session/${sessionId}/session-assessments`;
    let params = new HttpParams();
    if (mbProfessionalId) {
      params = params.set('mbProfessionalId', mbProfessionalId);
    }

    return this.http.get<SessionAssessments>(url, { params });
  }
  public get disabilityAssessmentId() {
    return this._disabilityAssessmentId;
  }
  public set disabilityAssessmentId(disabilityAssessmentId) {
    this._disabilityAssessmentId = disabilityAssessmentId;
  }
  public get socialInsuranceNo() {
    return this._socialInsuranceNo;
  }
  public set socialInsuranceNo(socialInsuranceNo) {
    this._socialInsuranceNo = socialInsuranceNo;
  }
  public get isGosiDr() {
    return this._isGosiDr;
  }
  public set isGosiDr(isGosiDr) {
    this._isGosiDr = isGosiDr;
  }
  public set isContractDoctor(isContractDoctor) {
    this.contractDoctor = isContractDoctor;
  }
  public get isContractDoctor() {
    return this.contractDoctor;
  }
  public get isCompleted() {
    return this._isCompleted;
  }

  public set isCompleted(isCompleted) {
    this._isCompleted = isCompleted;
  }
  public get transactionTraceId() {
    return this._transactionTraceId;
  }
  public set transactionTraceId(transactionTraceId) {
    this._transactionTraceId = transactionTraceId;
  }
  public set personid(personid) {
    this.personId = personid;
  }
  public get personid() {
    return this.personId;
  }
  public get isWithdraw() {
    return this._isWithdraw;
  }
  public set isWithdraw(isWithdraw) {
    this._isWithdraw = isWithdraw;
  }
  public set nationalID(nationalID) {
    this.nationalId = nationalID;
  }
  public get nationalID() {
    return this.nationalId;
  }
  public set identifier(identifier) {
    this.personIdentifier = identifier;
  }
  public get identifier() {
    return this.personIdentifier;
  }
  public get isAmbType() {
    return this.isAmb;
  }
  public set isAmbType(isAmb) {
    this.isAmb = isAmb;
  }
  public set isEdited(isModified) {
    this.isModified = isModified;
  }
  public get isEdited() {
    return this.isModified;
  }
  public get prevDisabilityAssmntId() {
    return this.prevDisbAssmntId;
  }
  public set prevDisabilityAssmntId(prevDisbAssmntId) {
    this.prevDisbAssmntId = prevDisbAssmntId;
  }
  public set assmntStatus(assessmentStatus) {
    this.assessmentStatus = assessmentStatus;
  }
  public get assmntStatus() {
    return this.assessmentStatus;
  }
  public get isHoReturn() {
    return this._isHoReturn;
  }
  public set isHoReturn(isHoReturn) {
    this._isHoReturn = isHoReturn;
  }
  getPaymentHistory(
    paymentRequest?: PaymentHistoryRequest,
    statusArray?,
    fieldOfficeArray?
  ): Observable<MBPaymentHistory> {
    const baseUrl = `/api/v1/payment/history`;
    let params = new HttpParams();
    params = this.getQueryParamDetails(paymentRequest, fieldOfficeArray, statusArray, params);
    return this.http.get<MBPaymentHistory>(baseUrl, { params });
  }
  getPaymentHistoryReport(
    language?: string,
    paymentRequest?: PaymentHistoryRequest,
    statusArray?,
    fieldOfficeArray?
  ): Observable<Blob> {
    let baseUrl = `/api/v1/payment/payment-report`;
    let params = new HttpParams();
    params = params.set('language', language);
    params = this.getQueryParamDetails(paymentRequest, fieldOfficeArray, statusArray, params);
    return this.http.get(baseUrl, { params, responseType: 'blob' });
  }

  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();
    const obs = new Observable((observer: any) => {
      reader.onloadend = e => {
        observer.error(reader.result);
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
  getQueryParamDetails(paymentRequest, fieldOfficeArray, statusArray, params) {
    if (paymentRequest?.pageSize) {
      params = params
        .set('pageNo', paymentRequest.pageNo.toString())
        .set('pageSize', paymentRequest.pageSize.toString());
    }
    if (paymentRequest?.startDate && paymentRequest?.endDate) {
      params = params
        .set('startDate', this.convertToDDMMYYYY(paymentRequest?.startDate.toString()))
        .set('endDate', this.convertToDDMMYYYY(paymentRequest?.endDate.toString()));
    }
    if (paymentRequest?.searchKey) {
      params = params.set('searchKey', paymentRequest.searchKey.toString());
    }
    if (paymentRequest?.sessionType) {
      params = params.set('sessionType', paymentRequest.sessionType.toString());
    }
    if (statusArray) {
      statusArray.forEach(val => {
        params = params.append('paymentStatus', val.english.toString());
      });
    }
    if (fieldOfficeArray) {
      fieldOfficeArray.forEach(val => {
        params = params.append('fieldOffice', val.english.toString());
      });
    }
    if (paymentRequest?.memberType) {
      params = params.set('memberType', paymentRequest.memberType);
    }
    return params;
  }
  public set docReferenceNo(documentReferenceNo) {
    this.documentReferenceNo = documentReferenceNo;
  }
  public get docReferenceNo() {
    return this.documentReferenceNo;
  }
  public set participantAttendence(participantPresence) {
    this.participantPresence = participantPresence;
  }
  public get participantAttendence() {
    return this.participantPresence;
  }
  public set assessmentTypeText(assessmentType) {
    this.assessmentTypes = assessmentType;
  }
  public get assessmentTypeText() {
    return this.assessmentTypes;
  }
  public set nationality(isSaudi) {
    this.isSaudi = isSaudi;
  }
  public get nationality() {
    return this.isSaudi;
  }
  public set benefitRequestId(benefitReqId) {
    this.benefitReqId = benefitReqId;
  }
  public get benefitRequestId() {
    return this.benefitReqId;
  }
  public set referenceNo(referenceNumber) {
    this.referenceNumber = referenceNumber;
  }
  public get referenceNo() {
    return this.referenceNumber;
  }
  public get mbSessionId() {
    return this.sessionIdMb;
  }
  public set mbSessionId(id) {
    this.sessionIdMb = id;
  }
  public get mbAssessmentId() {
    return this.mbassessmentId;
  }
  public set mbAssessmentId(id) {
    this.mbassessmentId = id;
  }
}
