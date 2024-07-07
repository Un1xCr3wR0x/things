import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { ParticipantSpeciality, ParticipantsDetails, SessionRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParticipantQueueService {
  baseUrl = '/api/v1';
  constructor(private http: HttpClient) {}
  /**
   * Method to get Assign Participant details
   */
  getAssignParticipantDetails(participantSpeciality: ParticipantSpeciality): Observable<ParticipantsDetails> {
    let url = `${this.baseUrl}/mb-session/sessions-filterBy-specialty`;
    if (
      participantSpeciality &&
      participantSpeciality?.specialitynumber &&
      participantSpeciality?.specialitynumber.length > 0
    ) {
      url += `?&listOfSpecialty=${participantSpeciality.specialitynumber.join(',')}`;
    } else {
      url += `?&listOfSpecialty=0`;
    }
    if (
      participantSpeciality &&
      participantSpeciality?.subSpecialitynumber &&
      participantSpeciality?.subSpecialitynumber.length > 0
    ) {
      url += `&listOfSubSpecialty=${participantSpeciality.subSpecialitynumber.join(',')}`;
    } else {
      url += `&listOfSubSpecialty=0`;
    }
    if (participantSpeciality?.fieloffice && participantSpeciality?.fieloffice.length > 0) {
      participantSpeciality?.fieloffice.map((value: BilingualText) => {
        url += `&listOfFieldOffice=${value.english || value}`;
      });
    }
    if (participantSpeciality?.location && participantSpeciality?.location?.length > 0) {
      participantSpeciality?.location.map((value: BilingualText) => {
        url += `&listOfLocation=${value.english || value}`;
      });
    }
    if (participantSpeciality && participantSpeciality.pageSize) {
      url += `&pageNo=${participantSpeciality?.pageNo}&pageSize=${participantSpeciality?.pageSize}`;
    }
    if (participantSpeciality.pageSize) {
      url += `&sortOrder=DESC`;
    }
    return this.http.get<ParticipantsDetails>(url);
  }

  /**
   * Method to get participant queue details
   */
  getParticipantQueueDetails(sessionRequest: SessionRequest, pageNo, pageSize, isPmb): Observable<ParticipantsDetails> {
    const url = `${this.baseUrl}/mb-session/participants`;
    let params = new HttpParams();
    params = params.append('sortOrder', 'DESC');
    if ((pageNo === 0 || pageNo) && pageSize) {
      params = params.append('pageNo', pageNo.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    if (sessionRequest && sessionRequest?.searchKey) {
      params = params.append('searchKey', sessionRequest?.searchKey);
      params = params.append('searchType', 'participantQueuePage');
    }
    if (sessionRequest?.filter?.fieldOffice && sessionRequest?.filter?.fieldOffice.length > 0) {
      sessionRequest?.filter?.fieldOffice.map((value: BilingualText) => {
        params = params.append('listOfFieldOffice', value.english);
      });
    }
    if (sessionRequest?.filterData?.location && sessionRequest?.filterData?.location.length > 0) {
      sessionRequest?.filterData.location.map((value: BilingualText) => {
        params = params.append('listOfLocation', value.english);
      });
    }
    // if (sessionRequest?.filter?.fieldOffice && sessionRequest?.filter?.fieldOffice.length > 0) {
    //   sessionRequest?.filter?.fieldOffice.map((value: BilingualText) => {
    //     url += `&listOfFieldOffice=${value.english}`;
    //   });
    // }
    if (sessionRequest?.filterData?.speciality && sessionRequest?.filterData?.speciality.length > 0) {
      sessionRequest?.filterData?.speciality.map((value: BilingualText) => {
        params = params.append('listOfSpecialty', value.english);
      });
    }
    if (sessionRequest?.filterData?.assessmentType && sessionRequest?.filterData?.assessmentType.length > 0) {
      sessionRequest?.filterData.assessmentType.map((value: BilingualText) => {
        params = params.append('listOfAssessmentType', value.english);
      });
    }
    if (sessionRequest?.filter?.initiatorLocation) {
      params = params.append('initiatorLocation', sessionRequest?.filter?.initiatorLocation);
    }

    params = params.append('isPmb', isPmb);

    return this.http.get<ParticipantsDetails>(url, { params });
  }
}
