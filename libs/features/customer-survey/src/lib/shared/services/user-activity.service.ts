import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordRequest, ChangePasswordResponse } from '../models';
import { tap, catchError } from 'rxjs/operators';
import {
  AlertService,
  TransactionFeedback,
  UserPreferenceResponse,
  UserPreferenceRequest,
  UserPreference
} from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  baseUrl = '/api/v1';
  constructor(private http: HttpClient, private alertService: AlertService) {}
  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    const url = `${this.baseUrl}/useractivity/change-password`;
    return this.http.put<ChangePasswordResponse>(url, changePasswordRequest).pipe(
      tap(() => {
        this.alertService.showSuccessByKey('CUSTOMER-INFORMATION.PASSWORD-SUCCESS');
      }),
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  /**
   * This method is to get admin details
   * @param registrationNo
   * @param iqamaNo
   */
  getAdminDetails(personIdentifier: number) {
    const preferenceUrl = `${this.baseUrl}/person/${personIdentifier}/preference`;
    return this.http.get<UserPreference>(preferenceUrl).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  /**
   * This method is to get preferred language details
   * @param iqamaNo
   */
  getPreferredLanguage() {
    const url = `${this.baseUrl}/useractivity/user-preference`;
    return this.http.get<UserPreferenceResponse>(url).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  getSurveyDetails(uuid: any): Observable<any> {
    const url = `${this.baseUrl}/survey/${uuid}`;
    return this.http.get<any>(url);
  }
  /**
   * Method is to save the preferences
   * @param registrationNo
   * @param person
   */
  savePreferences(admin: UserPreference, personIdentifier: number) {
    const preferenceUrl = `${this.baseUrl}/person/${personIdentifier}/preference`;
    return this.http.patch<TransactionFeedback>(preferenceUrl, admin);
  }
  /**
   * Method is to save the application language preference
   * @param iqamaNo
   * @param applicationLanguage
   */
  saveApplicationLanguage(userPreferenceRequest: UserPreferenceRequest) {
    const url = `${this.baseUrl}/useractivity/user-preference`;
    return this.http.put<ChangePasswordResponse>(url, userPreferenceRequest);
  }
}
