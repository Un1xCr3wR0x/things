/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdminWrapperDto,
  AlertService,
  BilingualText,
  Establishment,
  EstablishmentQueryParams,
  LovList,
  Person,
  getPersonNameAsBilingual,
  Contributor
} from '@gosi-ui/core';
import { EstablishmentBranchWrapper, getParams } from '@gosi-ui/features/establishment';
import { EstablishmentSearchResponse } from '@gosi-ui/foundation-dashboard/lib/admin-dashboard/models';
import { ProfileWrapper } from '@gosi-ui/foundation-dashboard/lib/individual-app/models';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ComplaintRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  /**
   * local variables
   */
  url;
  baseUrl = '/api/v1';
  code: number;
  message: BilingualText;
  isComplaintSubmitted: boolean;

  /**
   * create an instance of Contact service
   * @param http
   * @param alertService
   */
  constructor(readonly http: HttpClient, readonly alertService: AlertService) {}
  /**
   * Method to submit complaints
   * @param complaintRequest
   */
  submitRequest(complaintRequest: ComplaintRequest, otp = null) {
    let httpOptions = {};
    if (otp) {
      const otpHeader = {
        'x-otp': otp
      };
      httpOptions = {
        headers: new HttpHeaders(otpHeader)
      };
    }
    return this.http.post(`${this.baseUrl}/complaint`, complaintRequest, httpOptions);
  }
  /**
   * method to get admin details
   * @param registrationNo
   */
  getAdminDetails(registrationNo: string): Observable<LovList> {
    const url = `${this.baseUrl}/establishment/${registrationNo}/admin`;
    return this.http.get(url).pipe(
      map((response: AdminWrapperDto) => {
        return new LovList(
          response.admins.map((item, index) => {
            return {
              code: item.personId,
              value: getPersonNameAsBilingual(item.name),
              sequence: index + 1
            };
          })
        );
      })
    );
  }
  /**
   * method to set success messages
   * @param message
   */
  setSuccessMessage(message) {
    this.message = message;
  }
  /**
   * method to  set params on complaint submit
   * @param isComplaintSubmitted
   */
  setIsComplaintSubmitted(isComplaintSubmitted) {
    this.isComplaintSubmitted = isComplaintSubmitted;
  }
  /**
   * method to get success message
   */
  getSuccessMessage() {
    return this.message;
  }
  /**
   * method to get params on submit complaint
   */
  getIsComplaintSubmitted() {
    return this.isComplaintSubmitted;
  }
  /**
   * method to get establishment admin details
   * @param registrationNo
   */
  getEstablishmentAdminDetails(registrationNo: string): Observable<AdminWrapperDto> {
    const url = `${this.baseUrl}/establishment/${registrationNo}/admin`;
    return this.http.get<AdminWrapperDto>(url).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }

  getEstablishmentProfile(identifier: any): Observable<ProfileWrapper> {
    const url = `${this.baseUrl}/profile/${identifier}`;
    return this.http.get<ProfileWrapper>(url).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  getEstablishmentProfileDetails(): Observable<ProfileWrapper> {
    const url = `${this.baseUrl}/admin-profile`;
    return this.http.get<ProfileWrapper>(url).pipe(
      catchError(error => {
        this.showAlerts(error);
        throw error;
      })
    );
  }
  getEstablishment(registrationNo: number, queryParams?: EstablishmentQueryParams): Observable<Establishment> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    if (queryParams) {
      return this.http.get<Establishment>(getEstablishmentUrl, {
        params: getParams(undefined, queryParams, new HttpParams())
      });
    } else {
      return this.http.get<Establishment>(getEstablishmentUrl);
    }
  }
  getEstablishmentDetails(registrationNo: number) {
    const getEstablishmentUrl = `/api/v1/admin/${registrationNo}/establishment?branchFilter.includeBranches=false&fetchForDashboard=true`;

    return this.http.get<EstablishmentBranchWrapper>(getEstablishmentUrl);
  }
  getDashboardEstablishmentList(registrationNo: number) {
    let pageNo = 0;
    let pageSize = 1000;
    let establishmentlistUrl = `${this.baseUrl}/admin/${registrationNo}/dashboard?page.pageNo=${pageNo}&page.size=${pageSize}`;

    return this.http.get<EstablishmentSearchResponse>(establishmentlistUrl);
  }
  /**
   * method to show alerts
   * @param error
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
  getContributorById(personId): Observable<Contributor> {
    if (personId) {
      const url = `/api/v1/contributor?personId=${personId}`;
      return this.http.get<Contributor>(url);
    }
  }
  getPersonById(personId): Observable<Person> {
    if (personId) {
      const url = `/api/v1/person/${personId}`;
      return this.http.get<Person>(url);
    }
  }
}
