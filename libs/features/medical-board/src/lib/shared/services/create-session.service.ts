import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  AddMemberRequest,
  BulkParticipants,
  MBODetail,
  MBODetailList,
  MbDetails,
  RegisterMedicalSessionDetails,
  SessionMemberResponse
} from '../models';
import { DateMaskDirective } from '@gosi-ui/foundation-theme';

@Injectable({
  providedIn: 'root'
})
export class CreateSessionService {
  newDate: Date;
  templateId: number;
  selectedMembers$ = new BehaviorSubject([]);
  baseUrl = '/api/v1';
  constructor(readonly http: HttpClient) {}
  /**
   * Method to submit Medical Board Session details
   * @param registerMedicalSessionDetails
   */
  registerMedicalBoardSession(registerMedicalSessionDetails: RegisterMedicalSessionDetails) {
    const url = `${this.baseUrl}/mb-session-template`;
    return this.http.post<SessionMemberResponse>(url, registerMedicalSessionDetails);
  }
  registerAdhocSession(registerAdhocSessionDetails: RegisterMedicalSessionDetails) {
    const url = `${this.baseUrl}/mb-session`;
    return this.http.post<SessionMemberResponse>(url, registerAdhocSessionDetails);
  }
  /**
   * Method to getSessionDetails
   * @param templateId
   */
  getMbDetails() {
    const url = `${this.baseUrl}/mb-session-template/mb-detail`;
    return this.http.get<MbDetails>(url);
  }

  /**
   * Method to update SessionDetails
   * @param templateId
   */
  updateRegularMedicalBoardSession(registerMedicalSessionDetails: RegisterMedicalSessionDetails, templateId: number) {
    const url = `${this.baseUrl}/mb-session-template/${templateId}`;
    return this.http.put<BilingualText>(url, registerMedicalSessionDetails);
  }
  /**
   * Method to update SessionDetails
   * @param templateId
   */
  updateAdhocMedicalBoardSession(registerMedicalSessionDetails: RegisterMedicalSessionDetails, sessionId: number) {
    const url = `${this.baseUrl}/mb-session/${sessionId}`;
    return this.http.put<SessionMemberResponse>(url, registerMedicalSessionDetails);
  }

  checkAvailability(request: AddMemberRequest): Observable<BilingualText> {
    const url = `/api/v1/mb-session/${request.sessionId}/verify-member?contractId=${request.contractId}`;
    return this.http.patch<BilingualText>(url, null);
  }
  checkParticipantAvailabilty(request: BulkParticipants): Observable<BilingualText> {
    // let params = new HttpParams();
    const url = `/api/v1/mb-session/${request.sessionId}/verify-participant?participantId=${request.participantId}&assessmentType=${request.assessmentType.english}`;
    // if (request?.identityNumber) {
    //   params = params.set('participantId', request.identityNumber.toString());
    // }
    // if (request?.assessmentType) {
    //   params = params.set('assessmentType', request.assessmentType.english);
    // }
    return this.http.patch<BilingualText>(url, null);
  }
  setSelectedMembers(selectedMembers) {
    this.selectedMembers$.next(selectedMembers);
  }
  getSelectedMembers() {
    return this.selectedMembers$;
  }
  setNewDate(newDate) {
    this.newDate = newDate;
  }
  getNewDate() {
    return this.newDate;
  }
  setTemplateId(templateId) {
    this.templateId = templateId;
  }
  getTemplateId() {
    return this.templateId;
  }
  //Get MBO details form reguklar session
  getMBODetails(sessionId): Observable<MBODetail> {
    const Url = `${this.baseUrl}/mb-session/${sessionId}/mbo-detail`;
    return this.http.get<MBODetail>(Url);
  }
  // get mbo list
  getMBOList(sessionId, initiatorLocation, searchValue?, filterValue?): Observable<MBODetailList> {
    const url = `${this.baseUrl}/mb-session/${sessionId}/mbo-detail-list`;
    let params = new HttpParams();
    if (initiatorLocation) params = params.set('initiatorLocation', initiatorLocation);
    if (searchValue) params = params.set('searchKey', searchValue.toString());
    if (filterValue?.office) {
      filterValue.office?.english
        .map(eachLocation => {
          return { english: eachLocation?.english, arabic: eachLocation?.arabic };
        })
        .forEach(data => {
          params = params.append('location', data.english);
        });
    }
    if (filterValue?.availability) {
      filterValue?.availability?.english
        .map(res => {
          return { english: res?.english, arabic: res?.arabic };
        })
        .forEach(value => {
          params = params.append('availability', value?.english);
        });
    }
    return this.http.get<MBODetailList>(url, { params });
  }
  // put selected mbo
  updateChangeMBODetail(sessionId, userId?): Observable<BilingualText> {
    const url = `${this.baseUrl}/mb-session/${sessionId}/reassign-mbo`;
    let params = new HttpParams().set('userId', userId.toString());
    return this.http.put<BilingualText>(url, null, { params });
  }
}
