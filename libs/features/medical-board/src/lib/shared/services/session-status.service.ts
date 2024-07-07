import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddMemberRequest, RescheduleSessionData, SessionRequest } from '..';
import { BilingualText } from '@gosi-ui/core';
import { GeneralEnum } from '../enums';
import { ContractedMemberWrapper,
  BulkParticipants,
  ParticipantsDetails,
  UnAvailableMemberListRequest,
  UnAvailableMemberListResponse,
  AddParticipantResponse, ParticipantDetails, AddMembersResponse, SessionStatusDetails, RescheduleSessionRequest, SessionRequestActions } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionStatusService {
  selectedMembers = new BehaviorSubject<AddMembersResponse[]>([]);
  selectedMembers$ = this.selectedMembers.asObservable();
  baseUrl = '/api/v1';
  constructor(private http: HttpClient) {}
  /**
   * Method to getSessionDetails
   * @param currentMonth
   * @param currentYear
   */
  getSessionStatusDetails(sessionId: number) {
    const url = `${this.baseUrl}/mb-session/${sessionId}`;
    return this.http.get<SessionStatusDetails>(url);
  }
  getRescheduleSessionData(sessionId: number): Observable<RescheduleSessionData> {
    const url = `${this.baseUrl}/mb-session/${sessionId}`;
    return this.http.get<RescheduleSessionData>(url);
  }
  getContractedMembers(sessionDate: string, sessionRequest: SessionRequest): Observable<ContractedMemberWrapper> {
    let url = `${this.baseUrl}/mb-session/mb-members?doctorType=${sessionRequest?.doctorType}`;
    if (sessionRequest && sessionRequest.limit) {
      url += `&pageNo=${sessionRequest?.limit?.pageNo}&pageSize=${sessionRequest?.limit?.size}&sessionDate=${sessionDate}`;
    }
    if (sessionRequest && sessionRequest?.startTime) {
      url += `&startTime=${sessionRequest?.startTime}`;
    }
    if (sessionRequest && sessionRequest?.endTime) {
      url += `&endTime=${sessionRequest?.endTime}`;
    }
    if (sessionRequest && sessionRequest?.searchKey) {
      url += `&searchKey=${sessionRequest?.searchKey}`;
    }

    // filter values adding
    if (sessionRequest?.filterData?.speciality && sessionRequest?.filterData?.speciality.length > 0) {
      sessionRequest?.filterData?.speciality.map((value: BilingualText) => {
        url += `&specialities=${value.english}`;
      });
    }
    if (sessionRequest?.filterData?.subSpeciality && sessionRequest?.filterData?.subSpeciality.length > 0) {
      sessionRequest?.filterData.subSpeciality.map((value: BilingualText) => {
        url += `&subSpecialities=${value.english}`;
      });
    }
    if (sessionRequest?.filterData?.location && sessionRequest?.filterData?.location.length > 0) {
      sessionRequest?.filterData.location.map((value: BilingualText) => {
        url += `&location=${value.english}`;
      });
    }
    if (sessionRequest?.filterData?.availability && sessionRequest?.filterData?.availability.length > 0) {
      sessionRequest?.filterData.availability.map((value: BilingualText) => {
        if (value.english === GeneralEnum.AVAILABLE) url += `&isAvailable=true`;
        else if (value.english === GeneralEnum.NOT_AVAILABLE) url += `&isAvailable=false`;
      });
    }
    if (sessionRequest?.filterData?.medicalBoardType && sessionRequest?.filterData?.medicalBoardType.length > 0) {
      sessionRequest?.filterData.medicalBoardType.map((value: BilingualText) => {
        url += `&medicalBoardType=${value.english}`;
      });
    }

    return this.http.get<ContractedMemberWrapper>(url);
  }
  getAddParticipants(
    sessionParticipantRequest: SessionRequest,
    sessionId: number,
    isPmb?: boolean
  ): Observable<ParticipantsDetails> {
    let url = `${this.baseUrl}/mb-session/participants?sortOrder=DESC&sessionId=${sessionId}`;
    if (sessionParticipantRequest && sessionParticipantRequest.limit) {
      url += `&pageNo=${sessionParticipantRequest?.limit?.pageNo}&pageSize=${sessionParticipantRequest?.limit?.size}`;
    }
    if (sessionParticipantRequest && sessionParticipantRequest?.searchKey) {
      url += `&searchKey=${sessionParticipantRequest?.searchKey}`;
    }
    if (
      sessionParticipantRequest?.filterData?.speciality &&
      sessionParticipantRequest?.filterData?.speciality.length > 0
    ) {
      sessionParticipantRequest?.filterData?.speciality.map((value: BilingualText) => {
        url += `&listOfSpecialty=${value.english}`;
      });
    }
    if (
      sessionParticipantRequest?.filterData?.assessmentType &&
      sessionParticipantRequest?.filterData?.assessmentType.length > 0
    ) {
      sessionParticipantRequest?.filterData.assessmentType.map((value: BilingualText) => {
        url += `&listOfAssessmentType=${value.english}`;
      });
    }
    if (sessionParticipantRequest?.filterData?.location && sessionParticipantRequest?.filterData?.location.length > 0) {
      sessionParticipantRequest?.filterData.location.map((value: BilingualText) => {
        url += `&listOfLocation=${value.english}`;
      });
    }
    if(sessionParticipantRequest?.filter?.initiatorLocation) {
      url += `&initiatorLocation=${sessionParticipantRequest?.filter?.initiatorLocation}`;
    }
    url += `&isPmb=${isPmb}`;
    // }
    return this.http.get<ParticipantsDetails>(url);
  }
  getNinParticipants(sessionParticipantRequest: SessionRequest, sessionId: number): Observable<ParticipantsDetails> {
    let params = new HttpParams();
    const url = `${this.baseUrl}/mb-session/participants?sortOrder=DESC&sessionId=${sessionId}`;
    const allSessionParticipants = sessionParticipantRequest?.filterData?.speciality;
    if (allSessionParticipants && this.hasvalidValue(allSessionParticipants)) {
      allSessionParticipants.forEach(sessionParticipants => {
        params = params.set('listOfSpecialty', sessionParticipants.english);
      });
    }
    if(sessionParticipantRequest?.filter?.initiatorLocation) {
      params = params.set('initiatorLocation', sessionParticipantRequest?.filter?.initiatorLocation);
    }
    return this.http.get<ParticipantsDetails>(url, { params });
  }
  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }

  rescheduleSesssion(requestData: RescheduleSessionRequest, sessionId: number): Observable<BilingualText> {
    const url = `${this.baseUrl}/mb-session/${sessionId}/reschedule`;
    return this.http.put<BilingualText>(url, requestData);
  }
  getUnavailableMemberList(requestData: UnAvailableMemberListRequest): Observable<UnAvailableMemberListResponse[]> {
    let url = `${this.baseUrl}/mb-session/${requestData?.sessionId}/unavailable-doctors`;
    if (requestData?.startDate) {
      url += `?startDate=${requestData?.startDate}`;
    }
    if (requestData?.startTime) {
      url += `&startTime=${requestData?.startTime}`;
    }
    if (requestData?.endTime) {
      url += `&endTime=${requestData?.endTime}`;
    }
    if (requestData?.mbList && requestData?.mbList.length > 0) {
      requestData?.mbList.map((value: number) => {
        url += `&mbProfessionIds=${value}`;
      });
    }
    return this.http.get<UnAvailableMemberListResponse[]>(url);
  }
  cancelSesssion(sessionId: number, request: SessionRequestActions): Observable<BilingualText> {
    return this.http.put<BilingualText>(`${this.baseUrl}/mb-session/${sessionId}/cancel`, request);
  }
  addContractedMemberSesssion(sessionId: number, request: AddMemberRequest[]): Observable<BilingualText> {
    return this.http.post<BilingualText>(`${this.baseUrl}/mb-session/${sessionId}/add-member`, request);
  }
  /**
   * Method to Hold MB Session
   * @param sessionId
   */
  holdMedicalBoardSession(sessionId: number, request: SessionRequestActions): Observable<BilingualText> {
    const url = `${this.baseUrl}/mb-session/${sessionId}/hold`;
    return this.http.put<BilingualText>(url, request);
  }

  removeMembers(sessionId: number, inviteeId: number, isReplaced = false) {
    const url = `${this.baseUrl}/mb-session/${sessionId}/session-invitee/${inviteeId}/remove?isReplaced=${isReplaced}`;
    return this.http.put<BilingualText>(url, null);
  }
  /**
   * Method to UnHold MB Session
   * @param sessionId
   */
  unholdMedicalBoardSession(sessionId: number, request: SessionRequestActions): Observable<BilingualText> {
    const url = `${this.baseUrl}/mb-session/${sessionId}/remove-hold`;
    return this.http.put<BilingualText>(url, request);
  }
  addBulkParticipants(
    sessionId: number,
    request: BulkParticipants[],
    isReplaced = false
  ): Observable<AddParticipantResponse[]> {
    return this.http.post<AddParticipantResponse[]>(
      `${this.baseUrl}/mb-session/${sessionId}/add-participant?isReplaced=${isReplaced}&loginType=MBO`,
      request
    );
  }
  getParticipantsBySessionId(sessionId): Observable<ParticipantDetails> {
    return this.http.get<ParticipantDetails>(`${this.baseUrl}/mb-session/${sessionId}/participant-details`);
  }
  addBulkParticipantsbyMB(
    sessionId: number,
    slotSequence:number,
    request: BulkParticipants[],
    isReplaced = false
  ): Observable<AddParticipantResponse[]> {
    return this.http.post<AddParticipantResponse[]>(
      `${this.baseUrl}/mb-session/${sessionId}/add-participant?isReplaced=${isReplaced}&loginType=MBO&sessionSlot=${slotSequence}`,
      request
    );
  }
  cancelParticipantQueue(
    request: BulkParticipants[],
    isReplaced = false
  ){
    const url = `${this.baseUrl}/mb-session/cancel-assessment?isReplaced=${isReplaced}&loginType=MBO`;
    return this.http.put<BilingualText>(url, request);
  }
}
