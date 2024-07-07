import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AlertService,
  InternalUserNotificationPreference,
  TransactionFeedback,
  UserPreference,
  UserPreferenceRequest,
  UserPreferenceResponse
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChangePasswordRequest, ChangePasswordResponse } from '../models';
import { NationalityModifyDetails } from '../models/benefits/nationality';

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
  getInternalUserNotificationPreferences(internalUserIdentifier: string) {
    const url = `${this.baseUrl}/private-user/${internalUserIdentifier}/preferences`;
    return this.http.get<InternalUserNotificationPreference>(url).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  saveInternalUserNotificationPreferences(userDetails, internalUserIdentifier: string) {
    const url = `${this.baseUrl}/private-user/${internalUserIdentifier}/preferences`;
    return this.http.put<InternalUserNotificationPreference>(url, userDetails).pipe(
      catchError(error => {
        // this.alertService.showError(error.error.message);
        throw error;
      })
    );
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
  saveModifyNationalityDetails(personID,params) {
    const preferenceUrl = `${this.baseUrl}/person/${personID}/modify-nationality`;
    return this.http.post<NationalityModifyDetails>(preferenceUrl,params).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
 updateModifyNationalityDetails(personID,params) {
    const preferenceUrl = `${this.baseUrl}/person/${personID}/modify-nationality`;
    return this.http.patch<NationalityModifyDetails>(preferenceUrl,params).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  submitModifyNationalityDetails(personID,params) {
    const preferenceUrl = `${this.baseUrl}/person/${personID}/modify-nationality`;
    return this.http.put<NationalityModifyDetails>(preferenceUrl,params).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

 /**
   * api to cancel change nationality
   */
 cancelChangeNationality(personID, referenceNo) {
  const url = `${this.baseUrl}/person/${personID}/modify-nationality/${referenceNo}/cancel`;
  return this.http.put<any>(url, null);
}
submitValidatorEditNationality(personID ,referenceNo : number, params){
  const preferenceUrl = `${this.baseUrl}/person/${personID}/modify-nationality/${referenceNo}/validator-edit`;
  return this.http.patch<NationalityModifyDetails>(preferenceUrl,params).pipe(
    catchError(error => {
      this.alertService.showError(error.error.message);
      throw error;
    })
  );
}
}
