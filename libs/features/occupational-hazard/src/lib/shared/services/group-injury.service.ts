/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeToken, BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { GroupInjuryFeedback, GroupInjuryPayload, InjuredContributorsResponse, Pagination, RejectedContributor } from '../models';
import { GroupInjury } from '../models/group-injury-details';
import { GroupInjuryWrapper } from '../models/group-injury-wrapper';
import { OhService } from './oh.service';

@Injectable({
  providedIn: 'root'
})
export class GroupInjuryService {
  navigationIndicator = 0;
  inProgress = false;
  cancelTransaction = false; 
  reportGroupInjuryDetails: any; 
  accidentType: BilingualText;
  groupInjuryId: number;
  bulkInjuryRequestItemId: number;
  groupInjuryEditId: string;
  private injuryDate: GosiCalendar;
  private workDisabilityDate: Date;
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    //TODO: remove oh service from here and pass values as params when calling methods
    readonly ohService: OhService
  ) {}


  /**
   *
   * @param indicator Setting Indicator for modify flow
   */
  setNavigationIndicator(indicator: number) {
    this.navigationIndicator = indicator;
  }

  /**
   *
   * @param reportGroupInjuryDetails 
   * @param injuryId
   * Submiting the injury reported
   * @
   */
  updateGroupInjuryService(reportGroupInjuryDetails: GroupInjury): Observable<number> {
    let req;
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury/${
      this.groupInjuryId
    }`;
    req = new HttpRequest('PUT', url, reportGroupInjuryDetails, {
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

  /**
   * This method is to get injury details
   * @param socialInsuranceNo 
   * @param injuryId
   */
  getGroupInjuryDetails(registrationNo: number,  groupInjuryId: number ) {
    if ( registrationNo && groupInjuryId) {
      const url = `/api/v1/establishment/${registrationNo}/groupinjury/${this.groupInjuryId}`;
      return this.http.get<GroupInjuryWrapper>(url);
    }
  }

  /**
   *
   * @param reportGroupInjuryDetails 
   * @param injuryId
   * Submiting the injury reported
   * @
   */
  updateContributorDetails(reportGroupInjuryDetailsList: GroupInjuryPayload[]): Observable<number> {
    let req;    
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury/${this.groupInjuryId}/contributor`;
    req = new HttpRequest('PATCH', url, reportGroupInjuryDetailsList, {  
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
   * @param reportGroupInjuryDetails Submiting the injury reported
   */
  reportGroupInjuryService(reportGroupInjuryDetails: GroupInjury): Observable<number> {
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury`;
    return this.http.post<number>(url, reportGroupInjuryDetails);
  }

 /**
   * This method is used to get the Injury History
   * @param socialInsuranceNumber
   */
 getInjuredContributorsList(
  socialInsuranceNumber: number,
  ohType?: string,
  pagination?: Pagination
): Observable<InjuredContributorsResponse> {
  let getInjuredContributorsUrl = '';
  if (this.ohService.getRegistrationNumber() > 0) {
    getInjuredContributorsUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/contributor/${socialInsuranceNumber}/injured-contributors`;
  } else {
    getInjuredContributorsUrl = `/api/v1/contributor/${socialInsuranceNumber}/injured-contributors`;
  }
  let injRequest = new Pagination();
  if (pagination) {
    injRequest = pagination;
  }
  const isOtherEngInjuryReq = true;
  if (injRequest) {
   
      getInjuredContributorsUrl = `${getInjuredContributorsUrl}?isOtherEngInjuryReq=${isOtherEngInjuryReq}&ohType=${ohType}&pageNo=${injRequest.page.pageNo}&pageSize=${injRequest.page.size}`;
    
  }
  return this.http.get<InjuredContributorsResponse>(getInjuredContributorsUrl);
}
/**
   *Final submit of groupInjury
   * @param groupInjuryNo
   */
   submitGroupInjury(
    groupInjuryId : number,
    actionFlag: boolean,
    comments,
    registrationNo: number,
    isAppPrivate?
  ): Observable<GroupInjuryFeedback> {
    const groupInjuryRequest = {
      comments: comments,
      navigationIndicator: this.navigationIndicator
    };
    let submitGroupInjuryUrl = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury/${this.groupInjuryId}/submit?isEdited=${actionFlag}`;
   
    return this.http.patch<GroupInjuryFeedback>(submitGroupInjuryUrl, groupInjuryRequest);
  }
     /**
   *
   * @param reportGroupInjuryDetails 
   * @param injuryId
   * Submiting the injury reported
   * @
   */
     injuryEligibility(reportGroupInjuryDetails: GroupInjury): Observable<number> {
      let req;
      const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury/${
        this.groupInjuryId
      }/contributor`;
      req = new HttpRequest('PUT', url, reportGroupInjuryDetails, {
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
   
     /**
   *
   * @param reportGroupInjuryDetails 
   * @param injuryId
   * rejected Contributor Details
   * @
   */
    rejectedContributorDetails(reportGroupInjuryDetailsList: GroupInjuryPayload[]): Observable<RejectedContributor[]> {
    let req;    
    const url = `/api/v1/establishment/${this.ohService.getRegistrationNumber()}/groupinjury/${this.groupInjuryId}/rejected-contributor`;
    req = new HttpRequest('PUT', url, reportGroupInjuryDetailsList, {  
      reportProgress: true
    });
    return this.http.request<RejectedContributor[]>(req).pipe(
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
  
  setGroupInjuryId(groupInjuryId: number) {
    this.groupInjuryId = groupInjuryId;
  }  
  getGroupInjuryId() {
    return this.groupInjuryId;
  }
  setBulkInjuryRequestItemId(bulkInjuryRequestItemId: number) {
    this.bulkInjuryRequestItemId = bulkInjuryRequestItemId;
  }  
  getBulkInjuryRequestItemId() {
    return this.bulkInjuryRequestItemId;
  }
  setGroupInjuryEditId(groupInjuryEditId: string) {
    this.groupInjuryEditId = groupInjuryEditId;
  }  
  getGroupInjuryEditId() {
    return this.groupInjuryEditId;
  }
  
  setAccidentType(accidentType: BilingualText) {
    this.accidentType = accidentType;
  }  
  getAccidentType() {
    return this.accidentType;
  }
  setInjuryDate(date: GosiCalendar) {
    this.injuryDate = date;
  }
  getInjuryDate() {
    return this.injuryDate;
  }
  setWorkDisabilityDate(date: Date) {
    this.workDisabilityDate = date;
  }
  getWorkDisabilityDate() {
    return this.workDisabilityDate;
  }
  putContributorDetails(
    groupInjuryId : Number,
    injury : GroupInjury,
    registrationNo :Number
  ){
      const url = `/api/v1/establishment/${registrationNo}/groupinjury/${groupInjuryId}`;
      return this.http.put<null>(url, []);
  }
  
}
