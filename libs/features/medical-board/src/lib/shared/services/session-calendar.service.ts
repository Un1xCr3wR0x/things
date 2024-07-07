/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken, BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IndividualSessionEvents, SessionCalendar, SessionFilterRequest, SessionRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionCalendarService {
  baseUrl = '/api/vi';
  sessionFilter: SessionFilterRequest = new SessionFilterRequest();
  isFiltered: boolean;
  constructor(private http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string) {}
  getRescheduleSessionDetails(currentMonth: number, currentYear: number, dataRequest: SessionRequest):  Observable<SessionCalendar> {
    let url = "";
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
       url = `/api/v1/mb-session/calendar-summary?month=${currentMonth}&year=${currentYear}&loginType=Reschedule,P`;
    } else {
       url = `/api/v1/mb-session/calendar-summary?month=${currentMonth}&year=${currentYear}`;
    }
    if (dataRequest?.filter?.channel && dataRequest.filter.channel.length > 0) {
      dataRequest.filter.channel.map((value: BilingualText) => {
        url += `&listOfChannel=${value.english}`;
      });
    }
    if (dataRequest?.filter?.fieldOffice && dataRequest.filter.fieldOffice.length > 0) {
      dataRequest.filter.fieldOffice.map((value: BilingualText) => {
        url += `&listOfFieldOffice=${value.english}`;
      });
    }
    if (dataRequest?.filter?.sessionType && dataRequest.filter.sessionType.length > 0) {
      dataRequest.filter.sessionType.map((value: BilingualText) => {
        url += `&listOfSessionType=${value.english}`;
      });
    }
    if (dataRequest?.filter?.slot && dataRequest.filter.slot.length > 0) {
      dataRequest.filter.slot.map((value: BilingualText) => {
        url += `&listOfSlotAvailability=${value.english}`;
      });
    }
    if (dataRequest?.filter?.status && dataRequest.filter.status.length > 0) {
      dataRequest.filter.status.map((value: BilingualText) => {
        url += `&listOfStatus=${value.english}`;
      });
    }
    if (dataRequest?.filter?.specialty && dataRequest.filter.specialty.length > 0) {
      dataRequest.filter.specialty.map((value: BilingualText) => {
        url += `&listOfSpecialty=${value.english}`;
      });
    }
    return this.http.get<SessionCalendar>(url).pipe(
      mergeMap((sessionCalendar: SessionCalendar ) => {
        
        if(sessionCalendar.totalCount > 0) {
          let urlWithSubspecialty = url;
          if (dataRequest?.filter?.subSpecialty && dataRequest.filter.subSpecialty.length > 0) {
            dataRequest.filter.subSpecialty.map((value: BilingualText) => {
              urlWithSubspecialty += `&listOfSubSpecialty=${value.english}`;
            });
          }
          return this.http.get<SessionCalendar>(urlWithSubspecialty);
        } else {
          const urlWithspecialty = url;
          return this.http.get<SessionCalendar>(urlWithspecialty);
        }
      })
    );
  }
  /**
   * Method to getSessionDetails
   * @param currentMonth
   * @param currentYear
   */
  getSessionDetails(currentMonth: number, currentYear: number, dataRequest: SessionRequest,vdScreen?) {
    let url = `/api/v1/mb-session/calendar-summary?month=${currentMonth}&year=${currentYear}`;
    if (dataRequest?.filter?.channel && dataRequest.filter.channel.length > 0) {
      dataRequest.filter.channel.map((value: BilingualText) => {
        url += `&listOfChannel=${value.english}`;
      });
    }
    if (dataRequest?.filter?.fieldOffice && dataRequest.filter.fieldOffice.length > 0) {
      dataRequest.filter.fieldOffice.map((value: BilingualText) => {
        url += `&listOfFieldOffice=${value.english}`;
      });
    }
    if (dataRequest?.filter?.sessionType && dataRequest.filter.sessionType.length > 0) {
      dataRequest.filter.sessionType.map((value: BilingualText) => {
        url += `&listOfSessionType=${value.english}`;
      });
    }
    if (dataRequest?.filter?.slot && dataRequest.filter.slot.length > 0) {
      dataRequest.filter.slot.map((value: BilingualText) => {
        url += `&listOfSlotAvailability=${value.english}`;
      });
    }
    if (dataRequest?.filter?.status && dataRequest.filter.status.length > 0) {
      dataRequest.filter.status.map((value: BilingualText) => {
        url += `&listOfStatus=${value.english}`;
      });
    }
    if (dataRequest?.filter?.specialty && dataRequest.filter.specialty.length > 0) {
      dataRequest.filter.specialty.map((value: BilingualText) => {
        url += `&listOfSpecialty=${value.english}`;
      });
    }
    if (dataRequest?.filter?.subSpecialty && dataRequest.filter.subSpecialty.length > 0) {
      dataRequest.filter.subSpecialty.map((value: BilingualText) => {
        url += `&listOfSubSpecialty=${value.english}`;
      });
    }
    if(dataRequest?.filter?.initiatorLocation) {
      url += `&initiatorLocation=${dataRequest?.filter?.initiatorLocation}`;
    }
    if (dataRequest?.filter?.listOfSecSpecialty && dataRequest.filter.listOfSecSpecialty.length > 0) {
      dataRequest.filter.listOfSecSpecialty.map((value: BilingualText) => {
        url += `&listOfSecSpecialty=${value.english}`;
      });
    }
    if(vdScreen){
      url +=`&combineSpecialty=${vdScreen}`
    }
    return this.http.get<SessionCalendar>(url);
  }
  getRescheduleDateSessionDetails(selectedDate: string, dataRequest?: SessionRequest) {
    let baseUrl = "";
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      baseUrl = `/api/v1/mb-session/calendar-day-details?date=${selectedDate}&loginType=individual`;
    } else {
      baseUrl = `/api/v1/mb-session/calendar-day-details?date=${selectedDate}`;
    }
    if (dataRequest?.filter?.sessionType && dataRequest.filter.sessionType.length > 0) {
      dataRequest.filter.sessionType.map((value: BilingualText) => {
        baseUrl += `&listOfSessionType=${value.english}`;
      });
    }
    if (dataRequest?.filter?.fieldOffice && dataRequest.filter.fieldOffice.length > 0) {
      dataRequest.filter.fieldOffice.map((value: BilingualText) => {
        baseUrl += `&listOfFieldOffice=${value.english}`;
      });
    }
    if (dataRequest?.filter?.channel && dataRequest.filter.channel.length > 0) {
      dataRequest.filter.channel.map((value: BilingualText) => {
        baseUrl += `&listOfChannel=${value.english}`;
      });
    }
    if (dataRequest?.filter?.slot && dataRequest.filter.slot.length > 0) {
      dataRequest.filter.slot.map((value: BilingualText) => {
        baseUrl += `&listOfSlotAvailability=${value.english}`;
      });
    }
    if (dataRequest?.filter?.status && dataRequest.filter.status.length > 0) {
      dataRequest.filter.status.map((value: BilingualText) => {
        baseUrl += `&listOfStatus=${value.english}`;
      });
    }
    if (dataRequest?.filter?.specialty && dataRequest.filter.specialty.length > 0) {
      dataRequest.filter.specialty.map((value: BilingualText) => {
        baseUrl += `&listOfSpecialty=${value.english}`;
      });
    }
    if (dataRequest?.filter?.subSpecialty && dataRequest.filter.subSpecialty.length > 0) {
      dataRequest.filter.subSpecialty.map((value: BilingualText) => {
        baseUrl += `&listOfSubSpecialty=${value.english}`;
      });
    }
    return this.http.get<IndividualSessionEvents[]>(baseUrl);
  }
  /**
   * Method to getIndividualSessionDetails
   * @param selectedDate
   */
  getDateSessionDetails(selectedDate: string, dataRequest?: SessionRequest,vdScreen?) {
     //vdScreen = true only for add visiting doctor sc workitem - Alex,Kiran
    let baseUrl = `/api/v1/mb-session/calendar-day-details?date=${selectedDate}`;
    if (dataRequest?.filter?.sessionType && dataRequest.filter.sessionType.length > 0) {
      dataRequest.filter.sessionType.map((value: BilingualText) => {
        baseUrl += `&listOfSessionType=${value.english}`;
      });
    }
    if (dataRequest?.filter?.fieldOffice && dataRequest.filter.fieldOffice.length > 0) {
      dataRequest.filter.fieldOffice.map((value: BilingualText) => {
        baseUrl += `&listOfFieldOffice=${value.english}`;
      });
    }
    if (dataRequest?.filter?.channel && dataRequest.filter.channel.length > 0) {
      dataRequest.filter.channel.map((value: BilingualText) => {
        baseUrl += `&listOfChannel=${value.english}`;
      });
    }
    if (dataRequest?.filter?.slot && dataRequest.filter.slot.length > 0) {
      dataRequest.filter.slot.map((value: BilingualText) => {
        baseUrl += `&listOfSlotAvailability=${value.english}`;
      });
    }
    if (dataRequest?.filter?.status && dataRequest.filter.status.length > 0) {
      dataRequest.filter.status.map((value: BilingualText) => {
        baseUrl += `&listOfStatus=${value.english}`;
      });
    }
    if (dataRequest?.filter?.specialty && dataRequest.filter.specialty.length > 0) {
      dataRequest.filter.specialty.map((value: BilingualText) => {
        baseUrl += `&listOfSpecialty=${value.english}`;
      });
    }
    if (dataRequest?.filter?.subSpecialty && dataRequest.filter.subSpecialty.length > 0) {
      dataRequest.filter.subSpecialty.map((value: BilingualText) => {
        baseUrl += `&listOfSubSpecialty=${value.english}`;
      });
    }
    if(dataRequest?.filter?.initiatorLocation) {
      baseUrl += `&initiatorLocation=${dataRequest?.filter?.initiatorLocation}`;
    }
    if (dataRequest?.filter?.listOfSecSpecialty && dataRequest.filter.listOfSecSpecialty.length > 0) {
      dataRequest.filter.listOfSecSpecialty.map((value: BilingualText) => {
        baseUrl += `&listOfSecSpecialty=${value.english}`;
      });
    }
    if(vdScreen){
      baseUrl +=`&combineSpecialty=${vdScreen}`
    }
    return this.http.get<IndividualSessionEvents[]>(baseUrl);
  }
  setCalendarfilter(sessionFilter: SessionFilterRequest, isFiltered: boolean) {
    this.sessionFilter = sessionFilter;
    this.isFiltered = isFiltered;
  }
  getCalendarfilter() {
    return this.sessionFilter;
  }
  getIsFiltered() {
    return this.isFiltered;
  }
}
