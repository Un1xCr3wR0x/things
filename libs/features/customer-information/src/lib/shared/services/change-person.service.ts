/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contributor, Person, PersonWrapperDto, FamilyAddressWrapperDto, FamilyDetails } from '@gosi-ui/core';
import { SearchEngagementResponse } from '@gosi-ui/features/contributor/lib/shared/models/search-engagement-response';
import { EstablishmentListDto } from '@gosi-ui/features/contributor/lib/shared/models/establishment-list';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonConstants } from '../constants/person-constants';
import {
  BeneficiaryDetails,
  BilingualMessageWrapper,
  FinancialDetails,
  ModifyContactRequest,
  PatchPersonBankDetails,
  PatchPersonEducationDetails,
  PersonBankDetails,
  ProfileWrapper,
  RequestLimit,
  RolesWrapper
} from '../models';
import { PatchPersonContactDetails } from '../models/patch-person-contact-details';
import { AddModifyPersonDetails, SubmitModifyPersonDetails } from '../models/add-modify-person-details';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/src';
import { VerifyBankDetails } from '../models/benefits/verify-bank-details';
import { modifyDetailsResponse } from '../models/modify-nationality-details-info';

@Injectable({
  providedIn: 'root'
})
export class ChangePersonService {
  verifyPersonUrl: string;
  person: Person;
  index: number;
  fromIndividualSearch: boolean;
  family: FamilyDetails;
  sin: number;
  searchRequest: SearchRequest;
  personId: number;
  _personId = new BehaviorSubject<number>(null);
  _personId$ = this._personId.asObservable();
  _personInfo = new BehaviorSubject<Person>(null);
  _personInfo$ = this._personInfo.asObservable();
  _socialInsuranceNo = new BehaviorSubject<number>(null);
  _socialInsuranceNo$ = this._socialInsuranceNo.asObservable();
  _personIdentifierArr = new BehaviorSubject<Array<any>>([]);
  _personIdentifierArr$ = this._personIdentifierArr.asObservable();
  urlPersonId: number;

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
  getContributorDetails(personId: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${personId}`;
    return this.http.get<PersonWrapperDto>(url);
  }
  getFamilyAddressDetails(identifier: number) {
    const url = `/api/v1/person/${identifier}/family`;
    return this.http.get<FamilyAddressWrapperDto>(url);
  }
  submitFamilyAddressDetails(identifier: number, requestData): Observable<{ message: string; referenceNo: number }> {
    const url = `/api/v1/person/${identifier}/family`;
    return this.http.post<{ message: string; referenceNo: number }>(url, requestData);
  }
  modifyFamilyAddressDetails(
    identifier: number,
    acqId: number,
    requestData
  ): Observable<{ message: string; referenceNo: number }> {
    const url = `/api/v1/person/${identifier}/family/${acqId}`;
    return this.http.put<{ message: string; referenceNo: number }>(url, requestData);
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
  getProfileDetails(personId: number) {
    if (personId) {
      const url = `/api/v1/profile/${personId}`;
      return this.http.get<ProfileWrapper>(url);
    }
  }
  getPersonDetails(personId: number) {
    if (personId) {
      const url = `/api/v1/person/${personId}`;
      return this.http.get<Person>(url);
    }
  }
  getEstablishmentProfileDetails(): Observable<ProfileWrapper> {
    const url = `/api/v1/admin-profile`;
    return this.http.get<ProfileWrapper>(url).pipe();
  }
  getPersonRoles(personId: number) {
    if (personId) {
      const url = `/api/v1/person/${personId}/role?inactiveRoleReq=true`;
      return this.http.get<RolesWrapper>(url);
    }
  }
  getFinancialDetails(personId: number, request: RequestLimit) {
    if (personId) {
      let url = `/api/v1/profile/${personId}/financial-details`;
      if (request?.pageNo && request?.pageSize) {
        url += `?pageNo=${request.pageNo}&size=${request.pageSize}`;
      } else {
        url += `?pageNo=0&size=4`;
      }
      return this.http.get<FinancialDetails>(url);
    }
  }

  verifyBankDetails(personId: number, bankDetails: VerifyBankDetails) {
    const url = `/api/v1/profile/${personId}/financial-details`;
    return this.http.patch<any>(url, bankDetails);
  }

  getSinValue(personId: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${personId}`;
    return this.http.get<PersonWrapperDto>(url);
  }
  updatePersonDetails(personId: number, requestData: Person): Observable<{ message: string; referenceNo: number }> {
    const url = `/api/v1/person/${personId}?isTransaction=true`;
    return this.http.put<{ message: string; referenceNo: number }>(url, requestData);
  }

  revertUpdatePersonDetails(personId: number, referenceNo: number): Observable<BilingualMessageWrapper> {
    const url = `/api/v1/person/${personId}/change-request/${referenceNo}/revert`;
    return this.http.put<BilingualMessageWrapper>(url, {});
  }

  revertUpdateBankDetails(personId: number, referenceNo: number): Observable<BilingualMessageWrapper> {
    const url = `/api/v1/person/${personId}/change-request/${referenceNo}/revert`;
    return this.http.put<BilingualMessageWrapper>(url, {});
  }

  finalSubmitPersonDetails(personId: number, referenceNo: number): Observable<AddModifyPersonDetails> {
    const url = `/api/v1/person/${personId}/change-request/${referenceNo}/submit`;
    return this.http.patch<AddModifyPersonDetails>(url, {});
  }
  submitPersonalDetails(personId: number, request): Observable<SubmitModifyPersonDetails> {
    const url = `/api/v1/profile/${personId}`;
    return this.http.put<SubmitModifyPersonDetails>(url, request);
  }
  finalSubmitBankDetails(personId: number, referenceNo: number): Observable<AddModifyPersonDetails> {
    const url = `/api/v1/person/${personId}/change-request/${referenceNo}/submit`;
    return this.http.patch<AddModifyPersonDetails>(url, {});
  }

  submitContactDetails(personId: number, modifyRequest: ModifyContactRequest): Observable<BilingualMessageWrapper> {
    const url = `/api/v1/profile/${personId}/contact`;
    return this.http.patch<BilingualMessageWrapper>(url, modifyRequest);
  }
  getEngagementFullDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED&ignorePagination=true`;
    return this.http.get<SearchEngagementResponse>(url);
  }
  getModifyNationalityRevision(personId: number, referenceNo: number, businessTransaction: string) {
    const url = `/api/v1/person/${personId}/modify-nationality-revision/${referenceNo}?businessTransaction=${businessTransaction}`;
    return this.http.get<modifyDetailsResponse>(url);
  }
  public setPersonInformation(person: Person) {
    this.person = person;
    if (this.person) {
      this.setSIN(person);
      this.setPersonId(this.person.personId);
    }
  }
  public getPersonInformation() {
    return this.person;
  }
  public setSIN(person: Person) {
    this.sin = person.socialInsuranceNumber[0];
  }
  public getSIN() {
    return this.sin;
  }
  public setPersonId(personId: number) {
    this.personId = personId;
  }
  public getPersonId() {
    return this.personId;
  }
  public setURLId(personId: number) {
    this.urlPersonId = personId;
  }
  public getURLId() {
    return this.urlPersonId;
  }
  public setSearchRequest(searchRequest: SearchRequest) {
    this.searchRequest = searchRequest;
  }
  public getSearchRequest() {
    return this.searchRequest;
  }
  public setFamilyInfo(person: FamilyDetails) {
    this.family = person;
  }
  public getFamilyInfo() {
    return this.family;
  }
  getEstablishmentList(personId: number) {
    const url = `/api/v1/person/${personId}/establishment`;
    return this.http.get<EstablishmentListDto[]>(url);
  }
  public setMenuIndex(index) {
    this.index = index;
  }
  public getMenuIndex() {
    return this.index;
  }
  public getPersonID(): Observable<number> {
    return this._personId$;
  }
  public getPersonInfo(): Observable<Person> {
    return this._personInfo$;
  }
  public getSocialInsuranceNo(): Observable<number> {
    return this._socialInsuranceNo$;
  }
  public getPersonIdentifierArr(): Observable<Array<any>> {
    return this._personIdentifierArr$;
  }
  getChangeRequestDetails(personId, queryParamRequired = true): Observable<any> {
    let url = `/api/v1/person/${personId}/change-request`;
    if (queryParamRequired) {
      url += '?type=Modify%20Nationality';
    }
    return this.http.get<any>(url);
  }
  getNewChangeRequestDetails(personId: number, referenceNo: number): Observable<any> {
    let url = `/api/v1/profile/${personId}/change-request/${referenceNo}/modify-person`;
   
    return this.http.get<any>(url);
  }
}
