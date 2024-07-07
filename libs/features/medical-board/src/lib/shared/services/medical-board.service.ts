/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DisabiliyDtoList, MemberRequest, MemberResponse, MbAssessmentsubmitRequestDto, AssessmentResponse, ParticipantSpeciality, MedicalReportDetails, ComplicationDetails } from '../models';
import { BilingualText, DisabilityDetails } from '@gosi-ui/core';

//TODO Try to use member service itself and no need to append mb in file name
@Injectable({
  providedIn: 'root'
})
export class MedicalBoardService {
  feedBackMessage: BilingualText;
  previousUrl: string;
  medicalProfessionalId: number;
  contractId: number;
  identifier: number;
  transactionRefNo: number;
  mbProfessionalId: number;
  newIBAN: string;
  specialtyArray;
  cancelError: BilingualText;
  participantSpeciality: ParticipantSpeciality;
  isVdRequired = false;
  private participantInQueueSource = new BehaviorSubject(null);
  private participant = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}
  participantInQueue$ = this.participantInQueueSource.asObservable();
  participant$ = this.participant.asObservable();
  updateParticipant(data){
    this.participantInQueueSource.next(data);
  }
  Participant(data){
    this.participant.next(data);
  }

  /**Method to get Transactions */
  getTransactions(memberRequest?: MemberRequest): Observable<MemberResponse> {
    let url = `/api/v1/medical-professional?`;

    if (memberRequest.listOfDoctorType)
      memberRequest.listOfDoctorType.forEach((value: BilingualText) => {
        url += `listOfDoctorType=${value.english}&`;
      });
    if (memberRequest.listOfStatus)
      memberRequest.listOfStatus.forEach((value: BilingualText) => {
        url += `listOfStatus=${value.english}&`;
      });
    if (memberRequest.listOfSpecialty)
      memberRequest.listOfSpecialty.forEach((value: BilingualText) => {
        url += `listOfSpecialty=${value.english}&`;
      });
    if (memberRequest.listOfRegion)
      memberRequest.listOfRegion.forEach((value: BilingualText) => {
        url += `listOfRegion=${value.english}&`;
      });
    if (memberRequest.searchKey) url += `searchKey=${memberRequest.searchKey}&`;
    memberRequest.pageNo ? (url += `pageNo=${memberRequest.pageNo - 1}&`) : (url += `pageNo=0&`);
    memberRequest.pageSize ? (url += `pageSize=${memberRequest.pageSize}&`) : (url += `pageSize=10&`);
    memberRequest.sortOrder ? (url += `sortOrder=${memberRequest.sortOrder}`) : (url += `sortOrder=Desc`);
    return this.http.get<MemberResponse>(url);
  }
  setPreviousUrl(previousUrl: string) {
    this.previousUrl = previousUrl;
  }
  getPreviousUrl() {
    return this.previousUrl;
  }
  getServiceRegion(identifier:number, locationRequest: BilingualText[]): Observable<BilingualText[]> {
    let url = `/api/v1/participant/${identifier}/location?`;
    if (locationRequest) {
      locationRequest.forEach((value: BilingualText, index) => {
        if (index === 0) {
          url += `location=${value.english}`;
        } else {
          url += `&location=${value.english}`;
        }
      });
    }
    return this.http.get<BilingualText[]>(url);
  }

  //To get changed iBAN in draft status

  setNewIBAN(newIBAN: string) {
    this.newIBAN = newIBAN;
  }
  getNewIBAN() {
    return this.newIBAN;
  }
  setCancelError(error: BilingualText) {
    this.cancelError = error;
  }
  getDisabilityDetails(identifier, assessmentRequestid: number): Observable<DisabilityDetails> {
    const url = `/api/v1/participant/${identifier}/assessment-request/${assessmentRequestid}`;
    return this.http.get<DisabilityDetails>(url);
  }
  getCancelError() {
    return this.cancelError;
  }
  getDisabilityDetail(mbAssessmentRequestId: number): Observable<DisabiliyDtoList> {
    const url = `/api/v1/mb-assessment/${mbAssessmentRequestId}/disability-assessment`;
    return this.http.get<DisabiliyDtoList>(url);
  }
  submitAssessment(
    identifier: number,
    disabilityAssessmentId: number,
    request: MbAssessmentsubmitRequestDto,
    referenceNo?:number
  ): Observable<AssessmentResponse> {
    let params = new HttpParams();
    const url = `/api/v1/participant/${identifier}/assessment-request/${disabilityAssessmentId}/approve`;
    if(referenceNo){
      params = params.set('referenceNo',referenceNo.toString())
    }
    return this.http.put<AssessmentResponse>(url, request, {params});
  }
  getClarificationDocuments(
    resourceType,
    injuryNo?,
    transactionId?,
    identifier?,
    assessmentReqId?
  ) {
    let url = '';
    resourceType === 'Close Complication TPA' || resourceType === 'Close Injury TPA'
      ? (url = `/api/v1/contributor/${identifier}/injury/${injuryNo}/transaction/${transactionId}`)
      : (url = `/api/v1/participant/${identifier}/assessment-request/${assessmentReqId}/req-docs-contributor/${transactionId}`);
    return this.http.get<BilingualText[]>(url);
  }
  setSpecialityArray(specialtyArray) {
    this.specialtyArray = specialtyArray;
  }
  getSpecialtyArray() {
    return this.specialtyArray;
  }
  getMedicalReportDetails() {
    return of(new MedicalReportDetails());
  }
}
