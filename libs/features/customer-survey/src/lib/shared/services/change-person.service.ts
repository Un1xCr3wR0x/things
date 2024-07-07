/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contributor } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { PersonConstants } from '../constants/person-constants';
import {
  BeneficiaryDetails,
  BilingualMessageWrapper,
  PatchPersonBankDetails,
  PatchPersonEducationDetails,
  PersonBankDetails
} from '../models';
import { PatchPersonContactDetails } from '../models/patch-person-contact-details';

@Injectable({
  providedIn: 'root'
})
export class ChangePersonService {
  verifyPersonUrl: string;
  constructor(private http: HttpClient) {}

  /**
   * This method is used to get the engagement status of contributor
   * @param personId
   */
  getActiveStatus(personId): Observable<Contributor> {
    if (personId) {
      const url = `/api/v1/contributor?personId=${personId}`;
      return this.http.get<Contributor>(url);
    }
  }

  /**
   * This method is used to patch the section of the person details
   * @param personId
   * @param type
   * @param requestData
   */
  // patchPersonDetails(personId, type, requestData): Observable<BilingualMessageWrapper> {
  //   const patchRequest: PatchDataRequest = new PatchDataRequest();
  //   patchRequest.patchData.type = type;
  //   if (personId && requestData) {
  //     Object.keys(requestData).forEach(name => {
  //       patchRequest.patchData[name] = requestData[name];
  //     });

  //     const url = `/api/v1/person/${personId}`;
  //     return this.http.patch<BilingualMessageWrapper>(url, patchRequest);
  //   }
  // }

  /**
   * This method is used to patch the person bank details
   * @param personId
   * @param requestData
   */
  patchPersonBankDetails(personId, requestData: PatchPersonBankDetails): Observable<BilingualMessageWrapper> {
    requestData.type = PersonConstants.PATCH_BANK_ID;
    const url = `/api/v1/person/${personId}/bank`;
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

  /**
   * This method is used to patch the person education details
   * @param personId
   * @param requestData
   */
  patchPersonEducationDetails(personId, requestData: PatchPersonEducationDetails): Observable<BilingualMessageWrapper> {
    requestData.type = PersonConstants.PATCH_EDUCATION_ID;
    const url = `/api/v1/person/${personId}/education`;
    return this.http.patch<BilingualMessageWrapper>(url, requestData);
  }

  /**
   * This method is used to get the person bank details
   * @param personId
   */
  getBankDetails(personId: number): Observable<PersonBankDetails> {
    if (personId) {
      const url = `/api/v1/person/${personId}/bank`;
      return this.http.get<PersonBankDetails>(url);
    }
  }

  /**
   * This method is used to get the beneficiary details
   * @param personId
   */
  getBeneficiaryDetails(personId: number) {
    if (personId) {
      const url = `/api/v1/common/benefitciaryDetail/${personId}`;
      return this.http.get<BeneficiaryDetails>(url);
    }
  }
}
