import { HttpClient, HttpErrorResponse, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import {
  BilingualText,
  ContactDetails,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  DocumentItem,
  bindToObject
} from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import {
  MbProfile,
  MemberData,
  ResponseModel,
  UnAvailabilityPeriod,
  UpdateDoctorResponse,
  TerminateData,
  Contracts,
  ContractsHistory,
  SessionInvitationWrapper,
  ContractData,
  SessionFilterRequest,
  ApproveSuccessResponse,
  PersonWrapper,
  ContractDoctorDetails,
  AssessmentDetail,
  ValidateDateDto,
  AssessmentResponseDateDto
} from '../models';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  hasAdminForMain = false;
  inProgress = false;
  responseMessage: BilingualText;
  professionalId: number;
  /** Local variables */
  member: MemberData = new MemberData();
  contractType: BilingualText;
  /** Creates an instance of BulkWageService. */
  constructor(private http: HttpClient, @Inject(ApplicationTypeToken) readonly appToken: string) {}
  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  setmbProfessionalId(Id: number) {
    this.professionalId = Id;
  }
  //get professional Id
  getmbProfessionalId() {
    return this.professionalId;
  }
  setContractType(contractType: BilingualText) {
    this.contractType = contractType;
  }
  getContractType() {
    return this.contractType;
  }
  /** Method to get person details. */
  getPersonDetails(identificationNo: number): Observable<MbProfile> {
    const url = `/api/v1/medical-professional/${identificationNo}`;
    return this.http.get<MbProfile>(url);
  }

  /** Method to get person details. */
  getContractDetails(identificationNo: number, contractId: number): Observable<Contracts> {
    const url = `/api/v1/medical-professional/${identificationNo}/contract/${contractId}/details`;
    return this.http.get<Contracts>(url);
  }

  /** Method to save doctor details. */
  saveDoctorDetail(UpdateDoctor): Observable<UpdateDoctorResponse> {
    const url = `/api/v1/medical-professional/${UpdateDoctor.contractId}/doctor`;
    return this.http.put<UpdateDoctorResponse>(url, UpdateDoctor);
  }

  /**Method to cancel a transaction */
  revertTransactionDetails(professionalId: number, contractId: number, referenceNo: number): Observable<boolean> {
    const url = `/api/v1/medical-professional/${professionalId}/contract/${contractId}/revert?referenceNo=${referenceNo}`;
    return this.http.put<boolean>(url, []);
  }

  /** Method to get person details. */
  saveContactDetails(memberperson: ContractData, professionalIds) {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    req = new HttpRequest(
      'PATCH',
      mbUrl + `/${professionalIds}/contact/${memberperson.personId}`,
      memberperson.contactDetail,
      {
        reportProgress: true
      }
    );
    return this.http.request<ResponseModel>(req).pipe(
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

  saveBankDetails(person: MbProfile, mbProfessionalId) {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    req = new HttpRequest('PATCH', mbUrl + `/${mbProfessionalId}/bank-account/${person.personId}`, person.bankAccount, {
      reportProgress: true
    });
    return this.http.request<ResponseModel>(req).pipe(
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

  saveAddressDetails(person: MbProfile, professionalId) {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    const payload = new ContactDetails();
    payload.addresses = person.contactDetail.addresses;
    payload.currentMailingAddress = person.contactDetail.currentMailingAddress;
    req = new HttpRequest('PATCH', mbUrl + `/${professionalId}/address/${person.personId}`, payload, {
      reportProgress: true
    });
    return this.http.request<ResponseModel>(req).pipe(
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
  /** Method to get unavailable period of a calendar id. */
  getMemberDetails(identificationNo: number, calendarId: number): Observable<UnAvailabilityPeriod> {
    const url = `/api/v1/medical-professional/${identificationNo}/unavailability-period/${calendarId}`;
    return this.http.get<UnAvailabilityPeriod>(url);
  }
  getMemberDetailsInApp(identificationNo: number, calendarId: number): Observable<UnAvailabilityPeriod> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/unavailability-period/${calendarId}`;
    return this.http.get<UnAvailabilityPeriod>(url);
  }
  /** Method to get the unavailable period data */
  getUnavailablePeriod(professionalId: number): Observable<UnAvailabilityPeriod[]> {
    const url = `/api/v1/medical-professional/${professionalId}/unavailability-period`;
    return this.http.get<UnAvailabilityPeriod[]>(url);
  }
  /** Method to get the Scheduled Contract Sessions details in app*/
  getContractUnavailableDetails(identificationNo: number): Observable<UnAvailabilityPeriod[]> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/unavailability-period`;
    return this.http.get<UnAvailabilityPeriod[]>(url);
  }
  /** Method to get the Scheduled Contract Sessions details in app*/
  getOTPForContact(identificationNo: number) {
    const url = `/api/v1/contracted-doctor/${identificationNo}/validate`;
    return this.http.get<BilingualText>(url);
  }
  /** Method to verify OTP for contract. */
  verifyOTP(identificationNo: number, xOtp: string) {
    const url = `/api/v1/contracted-doctor/${identificationNo}/validate`;
    return this.http.get(url, { headers: { 'x-otp': xOtp }, observe: 'response' });
  }
  /** Method to resend otp. */
  reSendOTP(uuid: string, authRequired = true) {
    const url = '/api/v1/otp/resend';
    const headers = authRequired ? undefined : { headers: { noAuth: 'true' } };
    return this.http.post(url, { uuid: uuid }, headers);
  }
  /** Method to get the invitation details */

  acceptInvitation(inviteId: number, sessionId: number): Observable<BilingualText> {
    const url = `/api/v1/mb-session/${sessionId}/accept-invite?inviteId=${inviteId}`;
    return this.http.put<BilingualText>(url, []);
  }

  /** Method to add  */
  addUnavailablePeriod(professionalId, periodData): Observable<UnAvailabilityPeriod> {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    req = new HttpRequest('POST', mbUrl + `/${professionalId}/unavailability-period`, periodData, {
      reportProgress: true
    });
    return this.http.request<UnAvailabilityPeriod>(req).pipe(
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
  /** Method to add unavailability-period  in contract app */
  addUnavailablePeriodInApp(
    identificationNo: number,
    periodData: UnAvailabilityPeriod
  ): Observable<UnAvailabilityPeriod> {
    let req;
    const cdUrl = `/api/v1/contracted-doctor`;
    req = new HttpRequest('POST', cdUrl + `/${identificationNo}/unavailability-period`, periodData, {
      reportProgress: true
    });
    return this.http.request<UnAvailabilityPeriod>(req).pipe(
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
  /** Method to add  */
  modifyUnavailablePeriod(professionalId, periodData, calendarId): Observable<UnAvailabilityPeriod> {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    req = new HttpRequest('PUT', mbUrl + `/${professionalId}/unavailability-period/${calendarId}`, periodData, {
      reportProgress: true
    });
    return this.http.request<UnAvailabilityPeriod>(req).pipe(
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
  /** Method to remove unavailable period. */
  removeUnavailablePeriod(periodData: UnAvailabilityPeriod): Observable<UnAvailabilityPeriod> {
    const url = `/api/v1/medical-professional/${periodData.professionalId}/unavailability-period/${periodData.calendarId}`;
    return this.http.delete<UnAvailabilityPeriod>(url);
  }
  /** Method to remove unavailable period. */

  removeUnavailableDoctorPeriod(periodData: UnAvailabilityPeriod): Observable<UnAvailabilityPeriod> {
    const url = `/api/v1/medical-professional/${periodData.professionalId}/unavailability-period/${periodData.calendarId}/remove`;
    return this.http.put<UnAvailabilityPeriod>(url, periodData);
  }

  getFees(data: MemberData): Observable<number> {
    const url = `/api/v1/medical-professional/fees`;
    let params = new HttpParams();
    params = params.set('contractType', data.contractType.english);
    params = params.set('medicalBoardType', data.medicalBoardType.english);
    return this.http.get<number>(url, { params }).pipe(
      tap(res => {}),
      catchError(err => this.handleError(err))
    );
  }
  /** Method to save modifieddoctor details. */
  modifyDoctorDetail(UpdateDoctor): Observable<UpdateDoctorResponse> {
    const url = `/api/v1/medical-professional/${UpdateDoctor.contractId}/contract`;
    return this.http.put<UpdateDoctorResponse>(url, UpdateDoctor);
  }
  withdrawAcceptance(sessionValue, identifier?): Observable<BilingualText> {
    let url;
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      url = `/api/v1/contracted-doctor/${identifier}/mb-sessions/${sessionValue?.sessionId}/withdraw-accept?inviteeId=${sessionValue?.inviteId}`;
    } else {
      url = `/api/v1/mb-session/${sessionValue?.sessionId}/withdraw-accept?inviteeId=${sessionValue?.inviteId}`;
    }
    return this.http.patch<BilingualText>(url, null);
  }
  /** Method to submit modified contract details. */
  submitModifyContractDetail(contractDetails): Observable<UpdateDoctorResponse> {
    const url = `/api/v1/medical-professional/${contractDetails.contractId}/contract`;
    let params = new HttpParams();
    params = params.set('transactionTraceId', contractDetails.transactionTraceId);
    return this.http.patch<UpdateDoctorResponse>(url, contractDetails.commentsDto, { params });
  }
  /** Method to submit terminate contract details. */
  submitTerminateContract(data): Observable<UpdateDoctorResponse> {
    const url = `/api/v1/medical-professional/${data.contractId}/terminate`;
    let params = new HttpParams();
    params = params.set('transactionTraceId', data.transactionTraceId);
    return this.http.patch<UpdateDoctorResponse>(url, data.commentsDto, { params });
  }
  /** Method to terminate a contract. */
  terminateContract(terminateData: TerminateData): Observable<UpdateDoctorResponse> {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    req = new HttpRequest('PUT', mbUrl + `/${terminateData.contractId}/terminate`, terminateData, {
      reportProgress: true
    });
    return this.http.request<UpdateDoctorResponse>(req).pipe(
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
  getContractDetail(identificationNo): Observable<ContractData> {
    const url = `/api/v1/medical-professional/${identificationNo}`;
    return this.http.get<ContractData>(url);
  }

  getContractProfileDetail(identificationNo): Observable<ContractDoctorDetails> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/profile`;
    return this.http.get<ContractDoctorDetails>(url);
  }

  /** Method to get contract details in contract app  */
  getContractMemberDetail(identificationNo: number): Observable<MbProfile> {
    const url = `/api/v1/contracted-doctor/${identificationNo}`;
    return this.http.get<MbProfile>(url);
  }

  /** Method to get contract details in contract app  */
  getContractDataDetail(identificationNo): Observable<ContractData> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/contract-details`;
    return this.http.get<ContractData>(url);
  }

  getPerson(personId: number): Observable<PersonWrapper> {
    const url = `/api/v1/person?globalSearch=true&searchParam=${personId}`;
    return this.http.get<PersonWrapper>(url);
  }
  getContractHistory(identificationNo: number, contractId: number): Observable<ContractsHistory> {
    const url = `/api/v1/medical-professional/${identificationNo}/contract-history/${contractId}`;
    return this.http.get<ContractsHistory>(url);
  }
  getSessionDetails(
    professionalId: number,
    sessionFilterRequest?: SessionFilterRequest
  ): Observable<SessionInvitationWrapper> {
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      const url = `/api/v1/contracted-doctor/${professionalId}/mb-sessions`;
      let params = new HttpParams();
      let startDate = null;
      let endDate = null;
      if (sessionFilterRequest?.sessionPeriodFrom && sessionFilterRequest?.sessionPeriodTo) {
        startDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodFrom.toString());
        endDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodTo.toString());
      }
      if (sessionFilterRequest?.searchkey)
        params = params.append('searchKey', sessionFilterRequest?.searchkey.toString());
      if (sessionFilterRequest?.fieldOffice) {
        sessionFilterRequest.fieldOffice.forEach(office => {
          params = params.append('location', office.english);
        });
      }
      if (sessionFilterRequest?.status) {
        sessionFilterRequest.status.forEach(status => {
          params = params.append('sessionStatus', status.english);
        });
      }
      if (startDate && endDate) {
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
      }
      return this.http.get<SessionInvitationWrapper>(url, { params });
    } else {
      const url = `/api/v1/mb-session/${professionalId}/mb-sessions`;
      let params = new HttpParams();
      let startDate = null;
      let endDate = null;
      if (sessionFilterRequest?.sessionPeriodFrom && sessionFilterRequest?.sessionPeriodTo) {
        startDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodFrom.toString());
        endDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodTo.toString());
      }
      if (sessionFilterRequest?.searchkey)
        params = params.append('searchKey', sessionFilterRequest?.searchkey.toString());
      if (sessionFilterRequest?.fieldOffice) {
        sessionFilterRequest.fieldOffice.forEach(office => {
          params = params.append('location', office.english);
        });
      }
      if (sessionFilterRequest?.status) {
        sessionFilterRequest.status.forEach(status => {
          params = params.append('sessionStatus', status.english);
        });
      }
      if (startDate && endDate) {
        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);
      }
      // if (SessionFilterRequest?.searchkey) params = params.set('searchkey', SessionFilterRequest?.searchkey.toString());
      return this.http.get<SessionInvitationWrapper>(url, { params });
    }
  }
  getInvitationDetails(professionalId: number): Observable<SessionInvitationWrapper> {
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      const url = `/api/v1/contracted-doctor/${professionalId}/mb-sessions/invitation-list`;
      return this.http.get<SessionInvitationWrapper>(url);
    } else {
      const url = `/api/v1/mb-session/${professionalId}/invitation-list`;
      return this.http.get<SessionInvitationWrapper>(url);
    }
  }
  modifyUnavailablePeriodInApp(identificationNo: number, periodData, calendarId): Observable<UnAvailabilityPeriod> {
    let req;
    const cdUrl = `/api/v1/contracted-doctor`;
    req = new HttpRequest('PUT', cdUrl + `/${identificationNo}/unavailability-period/${calendarId}`, periodData, {
      reportProgress: true
    });
    return this.http.request<UnAvailabilityPeriod>(req).pipe(
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
  removeUnavailablePeriodInApp(identificationNo: number, calendarId: number): Observable<UnAvailabilityPeriod> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/unavailability-period/${calendarId}`;
    return this.http.delete<UnAvailabilityPeriod>(url);
  }
  saveContactDetailsContrcat(memberperson: ContractData, identificationNo) {
    let req;
    const cdUrl = `/api/v1/contracted-doctor`;
    req = new HttpRequest('PATCH', cdUrl + `/${identificationNo}/contact-details`, memberperson.contactDetail, {
      reportProgress: true
    });
    return this.http.request<ResponseModel>(req).pipe(
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
  saveBankDetailsConract(person: MbProfile, identificationNo) {
    let req;
    const cdUrl = `/api/v1/contracted-doctor`;
    req = new HttpRequest('PATCH', cdUrl + `/${identificationNo}/bank-detail`, person.bankAccount, {
      reportProgress: true
    });
    return this.http.request<ResponseModel>(req).pipe(
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
  saveAddressDetailsContract(memberperson: ContractData, identificationNo) {
    let req;
    const payload = new ContactDetails();
    payload.addresses = memberperson.addresses;
    payload.currentMailingAddress = memberperson.currentMailingAddress;
    const cdUrl = `/api/v1/contracted-doctor`;
    // req = new HttpRequest('PATCH', mbUrl + `/${professionalId}/address/${memberperson.personId}`, payload, {
    req = new HttpRequest('PATCH', cdUrl + `/${identificationNo}/address-details`, payload, {
      reportProgress: true
    });
    return this.http.request<ResponseModel>(req).pipe(
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
  getContracDoctortHistory(identificationNo, contractId): Observable<ContractsHistory> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/contract-history?contractId=${contractId}`;
    return this.http.get<ContractsHistory>(url);
  }
  /** Method to get the Scheduled Sessions details Contract */
  getSessionDetailsContract(
    identificationNo,
    sessionFilterRequest?: SessionFilterRequest
  ): Observable<SessionInvitationWrapper> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/mb-sessions`;
    let params = new HttpParams();
    let startDate = null;
    let endDate = null;
    if (sessionFilterRequest?.sessionPeriodFrom && sessionFilterRequest?.sessionPeriodTo) {
      startDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodFrom.toString());
      endDate = this.convertToDDMMYYYY(sessionFilterRequest.sessionPeriodTo.toString());
    }
    if (sessionFilterRequest?.searchkey)
      params = params.append('searchKey', sessionFilterRequest?.searchkey.toString());
    if (sessionFilterRequest?.fieldOffice) {
      sessionFilterRequest.fieldOffice.forEach(office => {
        params = params.append('location', office.english);
      });
    }
    if (sessionFilterRequest?.status) {
      sessionFilterRequest.status.forEach(status => {
        params = params.append('sessionStatus', status.english);
      });
    }
    if (startDate && endDate) {
      params = params.append('startDate', startDate);
      params = params.append('endDate', endDate);
    }
    return this.http.get<SessionInvitationWrapper>(url, { params });
  }
  getInvitationDetailsContract(identificationNo): Observable<SessionInvitationWrapper> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/mb-sessions/invitation-list`;
    return this.http.get<SessionInvitationWrapper>(url);
  }
  /** Method to accept  invitation details  contractapp*/

  acceptInvitationContract(sessionId: number, identificationNo, inviteId: number): Observable<BilingualText> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/mb-sessions/${sessionId}/invitation-list/accept?inviteId=${inviteId}`;
    return this.http.put<BilingualText>(url, []);
  }
  /** Method to update the memberdetails contractapp*/
  saveContractDoctorDetail(UpdateDoctor, identificationNo): Observable<UpdateDoctorResponse> {
    const url = `/api/v1/contracted-doctor/${identificationNo}/member-details`;
    return this.http.put<UpdateDoctorResponse>(url, UpdateDoctor);
  }
  /** Method to get assessment details */
  getAssessmentDetails(
    identifier: number,
    disabilityAssessmentId: number,
    referenceNo?: number
  ): Observable<AssessmentDetail> {
    const url = `/api/v1/participant/${identifier}/disability-assessment/${disabilityAssessmentId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<AssessmentDetail>(url, { params });
  }
  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };
  submitDocuments(
    comments,
    identifier: number,
    disabilityAssessmentId: number,
    referenceNo: number
  ): Observable<ApproveSuccessResponse> {
    const url = `/api/v1/participant/${identifier}/disability-assessment/${disabilityAssessmentId}/submit-clarification?referenceNo=${referenceNo}`;
    return this.http.patch<ApproveSuccessResponse>(url, comments);
  }
  saveEsignWorkitem(mbProfessionalId: number, referenceNo?: number, sessionId?: number): Observable<BilingualText> {
    const url = `/api/v1/medical-professional/${mbProfessionalId}/esign?referenceNo=${referenceNo}&sessionId=${sessionId}`;
    return this.http.put<BilingualText>(url, null);
  }
  saveHoDoctorApprove(
    identifier: number,
    disabilityAssessmentId: number,
    approveSuccessResponse,
    referenceNo?: number
  ): Observable<ApproveSuccessResponse> {
    const url = `/api/v1/participant/${identifier}/disability-assessment/${disabilityAssessmentId}/approvebyho?referenceNo=${referenceNo}`;
    return this.http.put<ApproveSuccessResponse>(url, approveSuccessResponse);
  }
  getClarificationDocs(): Observable<DocumentItem[]> {
    const url = '/api/v1/document/req-doc?transactionId=REQUEST_CLARIFICATION_FROM_CONTRIBUTOR&type=MEDICAL_BOARD';
    return this.http.get<DocumentItem[]>(url);
  }
  getHelperDates(
    identifier: number,
    validateDateDto?: ValidateDateDto,
    assessmentResponse?,
    percentage?,
    injuryId?
  ): Observable<AssessmentResponseDateDto> {
    let params = new HttpParams();
    if (validateDateDto?.assessmentReqId) params = params.append('assessmentReqId', validateDateDto?.assessmentReqId);
    if (validateDateDto?.isHelperRequired)
      params = params.append('isHelperRequired', validateDateDto?.isHelperRequired);
    if (validateDateDto?.assessmentResult)
      params = params.append('assessmentResult', validateDateDto?.assessmentResult);
    if (injuryId) params = params.set('injuryId', injuryId);
    if (percentage) params = params.set('disabilityPercent', percentage);
    const url = `/api/v1/participant/${identifier}/validateDate`;
    return this.http.get<AssessmentResponseDateDto>(url, { params });
  }
}
