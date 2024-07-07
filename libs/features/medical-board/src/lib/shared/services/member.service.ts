/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, bindToObject, BPMUpdateRequest } from '@gosi-ui/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { NationalityCategoryEnum } from '../enums';
import { MbProfile, MemberData, MemberDataList, MemberDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  /** Local variables */
  hasAdminForMain = false;
  inProgress = false;
  member: MemberData = new MemberData();
  responseMessage: BilingualText;
  isError = false;
  /** Creates an instance of MemberService. */
  constructor(private http: HttpClient) {}

  /**Method to verify member */
  verifyMember(
    id: string,
    birthDate: string,
    nationality: string,
    personType: string,
    role?: string
  ): Observable<MemberDataList> {
    const url = `/api/v1/person`;
    let params = new HttpParams();
    if (id) {
      switch (personType) {
        case NationalityCategoryEnum.SAUDI_PERSON: {
          params = params.set('NIN', id);
          break;
        }
        case NationalityCategoryEnum.GCC_PERSON: {
          params = params.set('gccId', id);
          break;
        }
        case NationalityCategoryEnum.NON_SAUDI: {
          params = params.set('iqamaNo', id);
          break;
        }
      }
    }
    if (birthDate) params = params.set('birthDate', birthDate);
    if (nationality) params = params.set('nationality', nationality);
    params = params.set('role', 'MEDICALPROFESSIONAL');
    if (personType) params = params.set('personType', personType);
    return this.http
      .get<MemberDataList>(url, { params })
      .pipe(
        tap(res => {
          if (res?.recordCount > 0) {
            this.member = res.listOfPersons[0];
          } else {
            this.member = null;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  //Method to get Member Transaction Api 
  
  getMemberTransactionApi(id: number): Observable<MemberDataList> {
    const url = `/api/v1/person?globalSearch=true`;
    let params = new HttpParams();
    if (id) {
      params = params.set('searchParam', id.toString());
    }
    return this.http
      .get<MemberDataList>(url, { params })
      .pipe(
        tap(res => {
          if (res?.recordCount > 0) {
            this.member = res.listOfPersons[0];
          } else {
            this.member = null;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    this.isError = true;
    return throwError(error);
  }
  /** Method to get person details. */
  getPersonDetails(identificationNo: number): Observable<MbProfile> {
    const url = `/api/v1/medical-professional/${identificationNo}`;
    return this.http.get<MbProfile>(url);
  }

  /**Method to save contract details */
  saveContractDetails(personDetails): Observable<MemberData> {
    let req;
    const mbUrl = `/api/v1/medical-professional`;
    const con = `/contract`; //TODO Do we need a variables try string literals for building apis
    req = new HttpRequest('POST', mbUrl + `/${personDetails.personId}` + con, personDetails, {
      reportProgress: true
    });
    return this.http.request<MemberData>(req).pipe(
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

  saveMemberDetails(personDetails, status): Observable<MemberData> {
    if (this.isError === true) this.inProgress = false;
    //TODO Use this.inProgress carefully else when triggering multiple api calls only the first one will happen
    if (this.inProgress === false) {
      let req;
      const con = `/contract`; //TODO provide proper name
      const mbUrl = `/api/v1/medical-professional`;
      //TODO Use enum values for status with proper names like Enum.UPDATE or ENUM.CREATE rather than passing numbers as status
      //TODO Status 3 and 2 have same logic inside if only request method changes
      if (status === 3) {
        req = new HttpRequest(
          'PATCH',
          mbUrl + `/${personDetails.mbProfessionalId}` + con + `/${personDetails.contractId}`,
          personDetails,
          {
            reportProgress: true
          }
        );
      } else if (status === 2) {
        req = new HttpRequest('POST', mbUrl + `/${personDetails.mbProfessionalId}` + con, personDetails, {
          reportProgress: true
        });
      } else {
        req = new HttpRequest('POST', mbUrl, personDetails, {
          reportProgress: true
        });
      }
      return this.http.request<MemberData>(req).pipe(
        map(event => {
          if (event && event.type === HttpEventType.Response) {
            this.inProgress = false;
            return event.body;
          } else {
            this.inProgress = true;
            return null;
          }
        }),
        catchError(err => this.handleError(err)),
        filter(res => res !== null)
      );
    }
  }

  getFees(data: MemberData): Observable<number> {
    const url = `/api/v1/medical-professional/fees`;
    let params = new HttpParams();
    params = params.set('contractType', data.contractType.english);
    params = params.set('medicalBoardType', data.medicalBoardType.english);
    return this.http
      .get<number>(url, { params })
      .pipe(
        tap(res => {}),
        catchError(err => this.handleError(err))
      );
  }

  //TODO Provide type for adminData
  updateAdminDetails(person: MemberData, adminData) {
    Object.keys(adminData).forEach(name => {
      if (name in person && adminData[name]) {
        if (name !== 'id') {
          person[name] = adminData[name];
        }
      }
    });

    return bindToObject(new MemberData(), person);
  }
  /**
   * This method is used to update the BPM Workflow about the validator edit and save
   */
  updateTaskWorkflow(data) {
    //TODO Provide type for data
    //
    if (data) {
      const approveUrl = `/api/process-manager/v1/taskservice/update`;
      const updateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      updateRequest.outcome = 'UPDATE'; //TODO Use Enum values
      updateRequest.taskId = data.taskId;
      const httpOptions = {
        headers: new HttpHeaders({
          workflowUser: `${data.user}`
        })
      };
      return this.http.post<BilingualText>(approveUrl, updateRequest, httpOptions);
    }
  }

  /**Method to get member details */
  getMemberDetails(identificationNo: number, contractId: number): Observable<MemberDetails> {
    const url = `/api/v1/medical-professional/${identificationNo}/contract/${contractId}`;
    return this.http.get<MemberDetails>(url);
  }
  /**Method to cancel a transaction */
  revertTransactionDetails(professionalId: number, contractId: number, referenceNo: number): Observable<boolean> {
    const url = `/api/v1/medical-professional/${professionalId}/contract/${contractId}/revert?referenceNo=${referenceNo}`;
    return this.http.put<boolean>(url, []);
  }

  /**
   *
   * verifyExistMember This api is used to check whether the member is already registerd or not
   *  and the response shows error or success message
   */

  verifyExistMember(identificationNo: number): Observable<boolean> {
    const url = `/api/v1/medical-professional/${identificationNo}/verify-mb-member`;
    return this.http.get<boolean>(url);
  }
}
