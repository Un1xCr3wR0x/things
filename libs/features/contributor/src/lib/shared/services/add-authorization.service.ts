/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonConstants } from '../constants';
import {
  AttorneyDetails,
  CustodyDetails,
  AttorneySaveResponse,
  BilingualMessageWrapper,
  PatchPersonAddressDetails,
  CustodySaveResponse,
  PatchPersonContactDetails,
  CustodyTextContent,
  RegisterAuthorizationPerson,
  PersonalInformation,
  NonMOJSaveResponse,
  BankAccounts
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AddAuthorizationService {
  constructor(private http: HttpClient) {}

  getCustodyDetails(id, custodyNumber): Observable<CustodyDetails> {
    return this.http
      .get<CustodyDetails>(`/api/v1/person/${id}/custodyInfo?custodyNumber=${custodyNumber}`)
      .pipe(catchError(err => throwError(err)));
  }

  getAttorneyDetails(id, attorneyNumber): Observable<AttorneyDetails> {
    return this.http
      .get<AttorneyDetails>(`/api/v1/person/${id}/attorneyInfo?attorneyNumber=${attorneyNumber}`)
      .pipe(catchError(err => throwError(err)));
  }

  saveAttorneyDetails(attorneyDetails: AttorneyDetails): Observable<AttorneySaveResponse> {
    return this.http.post<AttorneySaveResponse>(`/api/v1/person/attorney`, attorneyDetails);
  }

  saveCustodyDetails(custodyDetails: CustodyDetails): Observable<CustodySaveResponse> {
    return this.http.post<CustodySaveResponse>(`/api/v1/person/custody`, custodyDetails);
  }

  patchMOJAttorneyDetails(attorneyDetails, authId): Observable<AttorneySaveResponse> {
    return this.http.patch<AttorneySaveResponse>(`/api/v1/person/${authId}/attorney`, attorneyDetails);
  }

  patchMOJCustodyDetails(custodyDetails, authId): Observable<CustodySaveResponse> {
    return this.http.patch<CustodySaveResponse>(`/api/v1/person/${authId}/custody`, custodyDetails);
  }

  updateMOJAttorneyDetails(attorneyDetails, authId): Observable<AttorneySaveResponse> {
    return this.http.put<AttorneySaveResponse>(`/api/v1/person/${authId}/attorney`, attorneyDetails);
  }

  updateMOJCustodyDetails(custodyDetails, authId): Observable<CustodySaveResponse> {
    return this.http.put<CustodySaveResponse>(`/api/v1/person/${authId}/custody`, custodyDetails);
  }

  saveNonMOJAttorneyDetails(attorneyDetails): Observable<NonMOJSaveResponse> {
    return this.http.post<NonMOJSaveResponse>(`/api/v1/person/attorney`, attorneyDetails);
  }

  saveNonMOJCustodyDetails(custodyDetails): Observable<NonMOJSaveResponse> {
    return this.http.post<NonMOJSaveResponse>(`/api/v1/person/custody`, custodyDetails);
  }

  patchNonMOJAttorneyDetails(attorneyDetails, authId): Observable<AttorneySaveResponse> {
    return this.http.patch<AttorneySaveResponse>(`/api/v1/person/${authId}/attorney`, attorneyDetails);
  }

  patchNonMOJCustodyDetails(custodyDetails, authId): Observable<CustodySaveResponse> {
    return this.http.patch<CustodySaveResponse>(`/api/v1/person/${authId}/custody`, custodyDetails);
  }

  updateNonMOJAttorneyDetails(attorneyDetails, authId): Observable<AttorneySaveResponse> {
    return this.http.put<AttorneySaveResponse>(`/api/v1/person/${authId}/attorney`, attorneyDetails);
  }

  updateNonMOJCustodyDetails(custodyDetails, authId): Observable<CustodySaveResponse> {
    return this.http.put<CustodySaveResponse>(`/api/v1/person/${authId}/custody`, custodyDetails);
  }

  getNonMOJAttorneyDetails(authId): Observable<AttorneyDetails> {
    return this.http.get<AttorneyDetails>(`/api/v1/person/${authId}/attorney`);
  }

  getNonMOJCustodyDetails(authId): Observable<CustodyDetails> {
    return this.http.get<CustodyDetails>(`/api/v1/person/${authId}/custody`);
  }

  /**
   * This method is used to patch the person address details
   * @param personId
   * @param requestData
   */
  patchPersonAddressDetails(personId, requestData: PatchPersonAddressDetails): Observable<BilingualMessageWrapper> {
    const url = `/api/v1/person/${personId}/address`;
    return this.http.patch<BilingualMessageWrapper>(url, requestData);
  }

  /**
   * This method is used to patch the person contact details
   * @param personId
   * @param requestData
   */
  patchPersonContactDetails(personId, requestData: PatchPersonContactDetails): Observable<BilingualMessageWrapper> {
    requestData.type = PersonConstants.PATCH_CONTACT_ID;
    const url = `/api/v1/person/${personId}/contact`;
    return this.http.patch<BilingualMessageWrapper>(url, requestData);
  }

  getCustodyTextContent(id, custodyNumber): Observable<CustodyTextContent> {
    return this.http
      .get<CustodyTextContent>(`/api/v1/person/${id}/deedtext?custodyNumber=${custodyNumber}`)
      .pipe(catchError(err => throwError(err)));
  }

  registerAuthorizationPerson(person: RegisterAuthorizationPerson): Observable<any> {
    const url = `/api/v1/person/authorization-register-person`;
    return this.http.post<any>(url, person);
  }

  /**
   *
   * @param addressDetails  Saving the address details
   * @param personId
   */
  updateAddress(personDetails: PersonalInformation, personId): Observable<BilingualMessageWrapper> {
    const addPersonUrl = `/api/v1/person/${personId}`;
    return this.http.put<BilingualMessageWrapper>(addPersonUrl, personDetails);
  }

  getBankForTransaction(personId: number, referenceNo: number, serviceType: string): Observable<BankAccounts> {
    return this.http.get<BankAccounts>(
      `/api/v1/person/${personId}/bank-account?referenceNo=${referenceNo}&serviceType=${serviceType}`
    );
  }

  getBankAccountsForPerson(personId: number): Observable<BankAccounts> {
    return this.http.get<BankAccounts>(`/api/v1/person/${personId}/bank-account`);
  }
}
