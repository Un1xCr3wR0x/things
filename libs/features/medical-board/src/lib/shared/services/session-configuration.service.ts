import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService, BilingualText, LovList } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ConfigurationWrapper,
  IndividualSessionDetails,
  SessionRequest,
  StopSessionDetails,
  HoldSessionDetails,
  SortQueryParam
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SessionConfigurationService {
  baseUrl = '/api/v1';
  constructor(readonly http: HttpClient, readonly datePipe: DatePipe, readonly alertService: AlertService) {}
  getConfigurationList(listRequest: SessionRequest, sortQueryParam: SortQueryParam): Observable<ConfigurationWrapper> {  
    let url = `${this.baseUrl}/mb-session-template?pageNo=${listRequest.limit.pageNo}&pageSize=${listRequest.limit.size}`;
    if (listRequest?.filter?.status && listRequest.filter.status.length > 0) {
      listRequest.filter.status.map((value: BilingualText) => {
        url += `&status=${value.english}`;
      });
    }
    if (listRequest?.filter?.medicalBoardType && listRequest.filter.medicalBoardType.length > 0) {
      listRequest.filter.medicalBoardType.map((value: BilingualText) => {
        url += `&medicalBoardType=${value.english}`;
      });
    }
    if (listRequest?.filter?.sessionType && listRequest.filter.sessionType.length > 0) {
      listRequest.filter.sessionType.map((value: BilingualText) => {
        url += `&sessionType=${value.english}`;
      });
    }
    if (listRequest?.filter?.fieldOffice && listRequest.filter.fieldOffice.length > 0) {
      listRequest.filter.fieldOffice.map((value: BilingualText) => {
        url += `&fieldOfficeCode=${value.english}`;
      });
    }
    if (listRequest?.filter?.channel && listRequest.filter.channel.length > 0) {
      listRequest.filter.channel.map((value: BilingualText) => {
        url += `&sessionChannel=${value.english}`;
      });
    }
    if (listRequest?.filter?.sessionPeriodFrom && listRequest?.filter?.sessionPeriodTo) {
      url += `&sessionStartDate=${this.datePipe.transform(
        listRequest.filter.sessionPeriodFrom,
        'yyyy-MM-dd'
      )}&sessionEndDate=${this.datePipe.transform(listRequest.filter.sessionPeriodTo, 'yyyy-MM-dd')}`;
    }
    if(sortQueryParam?.sortBy) {
      url += `&sortBy=${sortQueryParam.sortBy}`;
    }
    if(sortQueryParam?.sortOrder) {
      url += `&sortOrder=${sortQueryParam.sortOrder}`
    }
    return this.http.get<ConfigurationWrapper>(url);
  }
  /**
   * Method to get individual session details
   */
  getIndividualSessionDetails(configurationId: number, sessionType?: string): Observable<IndividualSessionDetails> {
    const url = `${this.baseUrl}/mb-session-template/${configurationId}?sessionType=${sessionType}`;
    return this.http.get<IndividualSessionDetails>(url);
  }

  onStopMbSession(templateId: number, stopSessionDetails: StopSessionDetails): Observable<BilingualText> {
    return this.http
      .put<BilingualText>(`${this.baseUrl}/mb-session-template/${templateId}/stop`, stopSessionDetails)
      .pipe(
        catchError(error => {
          this.showAlerts(error);
          throw error;
        })
      );
  }
  /**
   * method to show alerts
   * @param error
   */
  showAlerts(error) {
    this.alertService.showError(error?.error?.message);
  }

  /**
   * Method to hold session
   * @param templateId
   * @param holdSessionDetails
   */
  onHoldMbSession(templateId: number, holdSessionDetails: HoldSessionDetails): Observable<BilingualText> {
    return this.http
      .put<BilingualText>(`${this.baseUrl}/mb-session-template/${templateId}/hold`, holdSessionDetails)
      .pipe(
        catchError(error => {
          this.showAlerts(error);
          throw error;
        })
      );
  }
  /**
   * Method to remove hold
   * @param templateId
   * @param holdSessionDetails
   */
  removeHoldSession(templateId: number, holdSessionDetails: HoldSessionDetails): Observable<BilingualText> {
    return this.http
      .put<BilingualText>(`${this.baseUrl}/mb-session-template/${templateId}/remove-hold`, holdSessionDetails)
      .pipe(
        catchError(error => {
          this.showAlerts(error);
          throw error;
        })
      );
  }
}
export const SORT_SESSION_SORT_VALUE_DATE_CREATED: BilingualText = {
  english: 'Session Date',
  arabic: 'Session Date'
};
