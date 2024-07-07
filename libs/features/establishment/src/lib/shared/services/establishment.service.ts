/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import {
  BorderNumber,
  CRNDetails,
  Establishment,
  EstablishmentProfile,
  EstablishmentQueryParams,
  Iqama,
  MenuService,
  NIN,
  NationalId,
  Passport,
  Person,
  PersonWrapperDto,
  RoleIdEnum,
  TransactionReferenceData,
  getIdentityByType,
  getPersonIdentifier,
  IdentityTypeEnum,
  BilingualText
} from '@gosi-ui/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EstablishmentQueryKeysEnum, SystemParamsEnum } from '../enums';
import {
  Admin,
  AdminBranchQueryParam,
  AdminWrapper,
  BranchList,
  BranchRequest,
  ControlPerson,
  DocumentUploadRequest,
  DocumentUploadResponse,
  EstablishmentBranchWrapper,
  EstablishmentOwnersWrapper,
  EstablishmentWorkFlowStatus,
  MciResponse,
  Owner,
  OwnerRequest,
  OwnerResponse,
  QueryParam,
  ReopenResponse,
  ViolationCount,
  MedicalInsuranceUpdateStatus
} from '../models';
import { AdminDtoWrapper } from '../models/admin-dto-wrapper';
import { AdminQueryParam } from '../models/admin-query-param';
import { AssignedRole } from '../models/assigned-role';

import {
  assembleAdminDtoToAdmin,
  getBranchRequest,
  getParams,
  getPersonSearchQueryParams,
  isInArray,
  mapAdminIdsToRole
} from '../utils';
import {
  EstablishmentIbanValidationRequest,
  EstablishmentIbanValidationResponse
} from '@gosi-ui/features/establishment/lib/shared/models/establishment-iban-validation';
import { RelationshipManager } from '../models/relationship-manager';
import { RelationshipManagerResponse } from '../models/relationship-manager-response';
import { Manager } from '../models/manager';
import { MedicalInsuranceEnrollResponse } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurance-enroll-response';
import { fetchContributorSub } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurnace-fatch-contributor-sub';
import { MedicalInsuranceSubscribersList } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurance-get-eligible-contributor';
import { ReopenEstablishment } from '../models/reopen-establishment';
import {InsuranceCompanyResponse} from "@gosi-ui/features/establishment/lib/shared/models/insurance-company-response";
import {
  HealthInsuranceRedirectionLinkRequest, HealthInsuranceRedirectionLinkResponse
} from "@gosi-ui/features/establishment/lib/shared/models/health-insurance-redierct-link";

type Identity = NIN | Iqama | NationalId | Passport | BorderNumber;
import {
  MedicalInsurancePolicyDetails
} from "@gosi-ui/features/establishment/lib/shared/models/MedicalInsurancePolicyDetails";
import {ComplianceDetails, HealthInsuranceInfoRequest} from "@gosi-ui/features/contributor";

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  loggedInAdminRole: string; // The role of the admin who has logged in or the role of the admin on whose behalf the transacion should take place
  selectedAdmin: Admin; // Admin Selected for transaction
  systemParamsSubject = new BehaviorSubject<{ name: string; value: string }[]>(null);
  gosiStartDates: Map<string, Date>;
  registrationNo: number;
  isPpaEstablishment: boolean;
  insuranceCompanyID: string;
  estGlobalSearchList = [];

  constructor(readonly http: HttpClient, @Optional() readonly menuService: MenuService) {
    this.getGosiStartDates().subscribe();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
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

  getCrnDetailsFromMci(crn: string, regNo: number, unn?: string): Observable<CRNDetails> {
    return this.verifyWithMciService(crn, regNo, unn).pipe(map(res => res?.crn));
  }
  getMciResponse(crn: string, regNo: number, unn?: string, skipCrOwnerCall?: boolean): Observable<MciResponse> {
    return this.verifyWithMciService(crn, regNo, unn, skipCrOwnerCall);
  }

  /**
   * Method to verify the CRN with MCI
   * @param crn
   * * @param unn
   * @param regNo
   */
  verifyWithMciService(
    crn: string,
    regNo: number,
    unn?: string,
    skipCrOwnerCall: boolean = true
  ): Observable<MciResponse> {
    //const params = new HttpParams().set('crNumber', crn);
    //const param = new HttpParams().set('unnNumber', unn);

    let params = getParams('crNumber', crn, new HttpParams());

    params = getParams('unnNumber', unn, params);
    if (skipCrOwnerCall) {
      params = getParams('skipCrOwnerCall', skipCrOwnerCall, params);
    }
    const url = `/api/v1/establishment/${regNo}/crn-details`;
    return this.http.get<MciResponse>(url, { params });
  }

  /**
   * Generic Method to get the establishment corresponding to params passed
   * @param params
   */
  getEstablishmentFromTransient(regNo: number, referenceNo: number): Observable<Establishment> {
    const params = getParams(EstablishmentQueryKeysEnum.REFERENCE_NUMBER, referenceNo, new HttpParams());
    const getEstablishmentUrl = `/api/v1/establishment/${regNo}/transient-details`;
    return this.http.get<Establishment>(getEstablishmentUrl, { params });
  }

  /**
   * This method is to fetch the Owners validating details
   * @param queryParams
   */
  searchOwnerWithQueryParams(registrationNo: number, params: HttpParams): Observable<Owner[]> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    return this.http
      .get<EstablishmentOwnersWrapper>(getEstablishmentUrl, { params })
      .pipe(map(owner => (owner.owners ? owner.owners : [])));
  }

  /**
   * Method to fetch the establishment groups under which the person is admin
   * @param adminId
   */
  getEstablishmentGroupsUnderAdmin(adminId: number): Observable<EstablishmentBranchWrapper> {
    const url = `/api/v1/admin/${adminId}/establishment`;
    const adminBranchQuery = new AdminBranchQueryParam();
    adminBranchQuery.branchFilter.includeBranches = false;
    const params = getParams(undefined, adminBranchQuery, new HttpParams());
    return this.http.get<EstablishmentBranchWrapper>(url, { params: params }).pipe(
      map(res => {
        if (res?.branchList) {
          res?.branchList.forEach(branch => {
            branch.roles = mapAdminIdsToRole(branch.adminRole?.map(role => role.role));
          });
        }
        return res;
      })
    );
  }

  /**
   * Method to fetch the establishment groups that are eligible for medical insurance extension under which the person is admin
   * @param adminId
   */
  getMedicalInsuranceEstablishmentGroupsUnderAdmin(adminId: number): Observable<EstablishmentBranchWrapper> {
    const url = `/api/v1/admin/${adminId}/establishment`;
    const adminBranchQuery = new AdminBranchQueryParam();
    adminBranchQuery.branchFilter.includeBranches = false;
    adminBranchQuery.fetchEligibleForMedicalInsuranceExtension = true;
    const params = getParams(undefined, adminBranchQuery, new HttpParams());
    return this.http.get<EstablishmentBranchWrapper>(url, { params: params }).pipe(
      map(res => {
        if (res?.branchList) {
          res?.branchList.forEach(branch => {
            branch.roles = mapAdminIdsToRole(branch.adminRole?.map(role => role.role));
          });
        }
        return res;
      })
    );
  }

  /**
   * Method to fetch the establishment groups that are eligible for medical insurance enrollment under which the person is admin
   * @param adminId
   */
  getMedicalInsuranceEstablishmentEnrollmentGroupsUnderAdmin(adminId: number): Observable<EstablishmentBranchWrapper> {
    const url = `/api/v1/admin/${adminId}/establishment`;
    const adminBranchQuery = new AdminBranchQueryParam();
    adminBranchQuery.branchFilter.includeBranches = false;
    adminBranchQuery.fetchEligibleForMedicalInsuranceExtension = true;
    adminBranchQuery.fetchEligibleForMedicalInsuranceExtensionEnrollment = true;
    const params = getParams(undefined, adminBranchQuery, new HttpParams());
    return this.http.get<EstablishmentBranchWrapper>(url, { params: params }).pipe(
      map(res => {
        if (res?.branchList) {
          res?.branchList.forEach(branch => {
            branch.roles = mapAdminIdsToRole(branch.adminRole?.map(role => role.role));
          });
        }
        return res;
      })
    );
  }

  /**
   * Method to fetch the branches in a group under which the person is admin
   * @param adminId
   * @param mainRegNo
   */
  getBranchesUnderAdmin(adminId: number, params: AdminBranchQueryParam): Observable<EstablishmentBranchWrapper> {
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/admin/${adminId}/establishment`;
    return this.http.get<EstablishmentBranchWrapper>(url, { params: httpParams }).pipe(
      map(res => {
        const branchWrapper = new EstablishmentBranchWrapper();
        branchWrapper.branchList = res.branchList;
        branchWrapper.branchStatus = res.branchStatus;
        if (res?.filter) {
          branchWrapper.filter = res.filter;
        }
        if (branchWrapper.branchList) {
          branchWrapper.branchList.forEach(branch => {
            const adminRolesIds = branch.adminRole?.map(role => role.role);
            branch.roles = mapAdminIdsToRole(adminRolesIds);
          });
        }
        return branchWrapper;
      })
    );
  }

  /**
   * This method is to get the super admin of the establishment
   * @param registrationNo
   */
  getSuperAdminDetails(registrationNo): Observable<Admin> {
    return this.getAdminsOfEstablishment(registrationNo).pipe(map(res => res.admins[0]));
  }

  /**
   * Method to get the admins with or without referenceNo
   * @param registrationNo
   * @param referenceNo
   */
  getAdminsOfEstablishment(
    registrationNo: number,
    referenceNo?: number,
    getValueType?: string,
    isAdminMissingDetailsPage?: boolean
  ): Observable<AdminWrapper> {
    let params = getParams(EstablishmentQueryKeysEnum.REFERENCE_NUMBER, referenceNo, new HttpParams());
    if (getValueType) {
      params = getParams(EstablishmentQueryKeysEnum.GET_VALUE, getValueType, params);
    }
    if (isAdminMissingDetailsPage) {
      params = getParams(EstablishmentQueryKeysEnum.IS_ADMIN_MISSING_DETAILS, isAdminMissingDetailsPage, params);
    }
    const url = `/api/v1/establishment/${registrationNo}/admin`;
    return this.http.get<AdminDtoWrapper>(url, { params }).pipe(
      map(res => {
        const adminWrapper = new AdminWrapper();
        adminWrapper.admins = assembleAdminDtoToAdmin(res?.admins);
        adminWrapper.adminFilterResponseDto = res.adminFilterResponseDto;
        return adminWrapper;
      })
    );
  }

  /**
   * Method to get all the admins under a admin
   * Admins within a group
   * @param adminId - Supervisor admin id
   * @param params - required filters and pagination
   */
  getAdminsUnderSupervisor(adminId: number, params: AdminQueryParam): Observable<AdminWrapper> {
    const httpParams = getParams(undefined, params, new HttpParams());
    const url = `/api/v1/admin/${adminId}/admin`;
    return this.http.get<AdminDtoWrapper>(url, { params: httpParams }).pipe(
      map(res => {
        const adminWrapper = new AdminWrapper();
        adminWrapper.admins = assembleAdminDtoToAdmin(res?.admins);
        adminWrapper.adminFilterResponseDto = res.adminFilterResponseDto;
        return adminWrapper;
      })
    );
  }

  /**
   * Method to get the admins under a establishment group
   * @param mainRegNo
   */
  getAdminsUnderGroup(mainRegNo: number): Observable<AdminWrapper> {
    const params = getParams(undefined, { registrationNo: mainRegNo }, new HttpParams());
    const url = `/api/v1/admin`;
    return this.http.get<AdminDtoWrapper>(url, { params: params }).pipe(
      map(res => {
        const adminWrapper = new AdminWrapper();
        adminWrapper.admins = assembleAdminDtoToAdmin(res?.admins);
        adminWrapper.adminFilterResponseDto = res.adminFilterResponseDto;
        return adminWrapper;
      })
    );
  }

  /**
   * This method is to check the owner details of the establishment
   * @param registrationNo
   */
  getPersonDetailsOfOwners(registrationNo: number, queryParams?: QueryParam[]): Observable<Owner[]> {
    if (queryParams) {
      return this.getOwnerDetails(registrationNo, queryParams).pipe(map(ownerWrapper => ownerWrapper.owners));
    } else {
      return this.getOwnerDetails(registrationNo).pipe(map(ownerWrapper => ownerWrapper.owners));
    }
  }

  /**
   * This method is to check the owner details of the establishment
   * @param registrationNo
   */
  getOwnerDetails(
    registrationNo: number,
    queryParams?: QueryParam[],
    excludeInactiveOwners?: boolean
  ): Observable<EstablishmentOwnersWrapper> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    let params = getParams('excludeInactiveOwners', excludeInactiveOwners, new HttpParams());
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
      return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl, { params });
    } else {
      return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl);
    }
  }

  /**
   * This method is used to delete and owner
   * @param registrationNo
   * @param personId
   */
  deleteOwner(registrationNo, personId): Observable<null> {
    const deleteOwnerUrl = `/api/v1/establishment/${registrationNo}/owner/${personId}`;
    return this.http.delete<null>(deleteOwnerUrl);
  }

  /**
   * Method to get the validate the person and get the details
   * corresponding to role
   */
  verifyPersonDetails(person: Person): Observable<Person> {
    const url = '/api/v1/person';
    return this.http
      .get<PersonWrapperDto>(url, {
        params: getParams(undefined, getPersonSearchQueryParams(person), new HttpParams())
      })
      .pipe(
        map(response => {
          const res = response?.listOfPersons?.[0];
          let personResponse: Person;
          if (res) {
            personResponse = new Person().fromJsonToObject(res);
            personResponse.nationality = res?.nationality || person.nationality;
            personResponse.birthDate = res?.birthDate || person.birthDate;
            personResponse.identity = [...personResponse.identity, ...person.identity];
            personResponse.identity = getPersonIdentifier(personResponse);
          }
          return personResponse;
        })
      );
  }

  /**
   * This method is to fetch the comments
   * @param queryParams
   */
  getComments(queryParams: QueryParam[]) {
    let params = new HttpParams();
    queryParams.forEach(queryParam => {
      params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
    });
    const getCommentsUrl = `/api/v1/transaction/trace`;
    return this.http.get<TransactionReferenceData[]>(getCommentsUrl, { params });
  }

  /**
   * Method to get all establishments - main and corresponding branches
   * @param registrationNo
   */
  getBranchEstablishments(registrationNo: number, size?: number, pageNo?: number): Observable<BranchList[]> {
    return this.getBranchEstablishmentsWithStatus(registrationNo, getBranchRequest(size, pageNo)).pipe(
      map(item => item.branchList)
    );
  }

  /**
   * Method to get all establishments - main and corresponding branches with count and status
   * @param registrationNo
   */
  getBranchEstablishmentsWithStatus(
    registrationNo: number,
    payload: BranchRequest,
    queryParams?: QueryParam[],
    excludePPA = false
  ): Observable<EstablishmentBranchWrapper> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams?.forEach(queryParam => {
        params = params.append(queryParam?.queryKey, queryParam?.queryValue.toString());
      });
    }
    params = params.append(EstablishmentQueryKeysEnum.EXCLUDE_PPA_ESTABLISHMENT, excludePPA.toString());
    const url = `/api/v1/establishment/${registrationNo}/branches`;
    return this.http.post<EstablishmentBranchWrapper>(url, payload, { params });
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getEstablishmentProfileDetails(registrationNo: number, activeBranches = false) {
    let getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/profile`;
    if (activeBranches) {
      getEstablishmentUrl += `?onlyActiveEst=true`;
    }
    return this.http.get<EstablishmentProfile>(getEstablishmentUrl);
  }

  /**
   * Method to get work flow status of a establishment
   * @param registrationNo
   */
  getWorkflowsInProgress(
    registrationNo: number,
    getInterEpicDependency: boolean = false
  ): Observable<EstablishmentWorkFlowStatus[]> {
    const httpParams = getParams('getInterEpicDependency', getInterEpicDependency, new HttpParams());
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/workflow-status`;
    return this.http.get<EstablishmentWorkFlowStatus[]>(getEstablishmentUrl, { params: httpParams });
  }

  /**
   * Method to assemble the persons to required model
   * @param persons
   */
  mapPeopleToControlPeople(persons: Person[]): ControlPerson[] {
    return persons.map(person => {
      const controlPerson: ControlPerson = new ControlPerson();
      controlPerson.name = person.name;
      controlPerson.sex = person.sex;
      controlPerson.commonId = getIdentityByType(person.identity, person.nationality.english);
      controlPerson.commonId.idType = 'ESTABLISHMENT.' + controlPerson.commonId.idType;
      return controlPerson;
    });
  }
  /**
   * Admin check whether contributor or owner
   * FIXME Can be removed
   * @param admin
   * @param registrationNo
   */
  getAdminRoles(admin: Admin, registrationNo: number): Observable<AssignedRole> {
    const identifier = getIdentityByType(admin.person.identity, admin.person.nationality.english);
    const getAdminRolesUrl = `/api/v1/person/${identifier.id}/role?registrationNo=${registrationNo}`;
    return this.http.get<AssignedRole>(getAdminRolesUrl);
  }

  /**
   * This method is to cancel a transaction
   * @param queryParams   *
   */
  revertTransaction(registrationNo: number, referenceNo: number): Observable<null> {
    const revertTransactionUrl = `/api/v1/establishment/${registrationNo}/revert?referenceNo=${referenceNo}`;
    return this.http.put<null>(revertTransactionUrl, []);
  }

  /**
   * Method to save owner
   * @param person
   * @param registrationNo
   */
  saveAllOwners(
    owners: Owner[],
    registrationNo: number,
    navInd: number,
    comments?: string,
    referenceNo?: number
  ): Observable<OwnerResponse> {
    const requestBody = new OwnerRequest();
    requestBody.owners = owners?.map(owner => new Owner().bindToNewInstance(owner));
    requestBody?.owners?.forEach(owner => {
      if (owner.person.personId) {
        owner.person.personId = undefined;
      }
    });
    if (comments) {
      requestBody.comments = comments;
    }
    if (referenceNo) {
      requestBody.referenceNo = referenceNo;
    }
    requestBody.navigationIndicator = navInd;
    const url = `/api/v1/establishment/${registrationNo}/owner`;
    return this.http.post<OwnerResponse>(url, requestBody);
  }

  /**
   * Method to get the gosi start dates from system parameters
   */
  getGosiStartDates(): Observable<Map<string, Date>> {
    if (this.gosiStartDates) {
      return of(this.gosiStartDates);
    } else {
      return this.getSystemParams().pipe(
        map(res => {
          if (res?.length > 0) {
            const params = new Map<string, Date>();
            res
              .filter(val => isInArray(Object.values(SystemParamsEnum), val.name))
              .forEach(values => {
                params.set(values.name, new Date(values.value));
              });
            this.gosiStartDates = params;
            return params;
          }
        })
      );
    }
  }

  // Method to get System parameters
  getSystemParams(): Observable<{ name: string; value: string }[]> {
    if (this.systemParamsSubject?.getValue()) {
      return this.systemParamsSubject.asObservable();
    } else {
      const url = `/api/v1/lov/system-parameters`;
      return this.http.get<{ name: string; value: string }[]>(url).pipe(tap(res => this.systemParamsSubject.next(res)));
    }
  }

  isLicensePresent(regNo: number, licenseNo: number, issuingAuthority: string): Observable<boolean> {
    const paramBody = {
      licenseIssuingAuthority: issuingAuthority,
      licenseNumber: licenseNo
    };
    const params = getParams(undefined, paramBody, new HttpParams());
    const url = `/api/v1/establishment/${regNo}/eligibility`; // true means license is not there
    return this.http.get<boolean>(url, { params: params }).pipe(map(noLicenseExists => !noLicenseExists));
  }

  isUserEligible(eligibleRoles: RoleIdEnum[] = [], regNo?: number) {
    return this.menuService.isUserEntitled(eligibleRoles, regNo);
  }

  getViolationsCount(regNo: number): Observable<ViolationCount> {
    const url = `/api/v1/establishment/${regNo}/violation-count`;
    return this.http.get<ViolationCount>(url);
  }
  uploadEstDoc(estRegNo: number, docUploadRequest: DocumentUploadRequest): Observable<DocumentUploadResponse> {
    const url = `/api/v1/establishment/${estRegNo}/documents`;
    return this.http.post<DocumentUploadResponse>(url, docUploadRequest);
  }

  /**
   * Method to assemble the partyData to required model
   * @param persons
   */
  mapPartyAndPeopleToControlPeople(owners: Owner[]): ControlPerson[] {
    return owners.map(owner => {
      const controlPerson: ControlPerson = new ControlPerson();
      if (owner?.estOwner) {
        controlPerson.partyName = owner.estOwner.name;
        controlPerson.isParty = true;
        controlPerson.partyId = owner.estOwner.partyId;
      } else {
        controlPerson.name = owner.person.name;
        controlPerson.sex = owner.person.sex;
        controlPerson.commonId = getIdentityByType(owner.person.identity, owner.person.nationality.english);
        controlPerson.commonId.idType = 'ESTABLISHMENT.' + controlPerson.commonId.idType;
        controlPerson.isParty = false;
      }
      return controlPerson;
    });
  }

  verifyEstablishmentIban(
    estRegNo: number,
    request: EstablishmentIbanValidationRequest
  ): Observable<EstablishmentIbanValidationResponse> {
    const url = `/api/v2/establishment/${estRegNo}/samavalidate`;
    return this.http.post<EstablishmentIbanValidationResponse>(url, request);
  }

  getMciOwners(registrationNo) {
    const url = `/api/v1/establishment/${registrationNo}/mci-owner`;
    return this.http.get<Array<NIN | Iqama | NationalId | Passport | BorderNumber>>(url);
  }
  /**
   * Method to save relationship manager
   *
   * @param registrationNo
   */
  saveRelationshipManager(
    registrationNo: number,
    canModify: boolean,
    request: RelationshipManager
  ): Observable<RelationshipManagerResponse> {
    const url = `/api/v1/establishment/${registrationNo}/relationship-manager`;
    if (canModify) {
      return this.http.put<RelationshipManagerResponse>(url, request);
    } else {
      return this.http.post<RelationshipManagerResponse>(url, request);
    }
  }
  getRelationshipManagerInfo(registrationNo: number, userId: string): Observable<Manager> {
    const url = `/api/v1/establishment/${registrationNo}/manager-details?userId=e00${userId}`;
    return this.http.get<Manager>(url);
  }
  getRelationshipManager(registrationNo: number): Observable<RelationshipManager> {
    const url = `/api/v1/establishment/${registrationNo}/relationship-manager`;
    return this.http.get<RelationshipManager>(url);
  }

  enrollEstablishmentMedicalInsuranceExtension(registrationNo: string): Observable<MedicalInsuranceEnrollResponse> {
    const url = `/api/v1/establishment/${registrationNo}/medical-insurance`;
    return this.http.post<MedicalInsuranceEnrollResponse>(url, null);
  }

  //fetch-contributor-sub
  //first page
  getMedicalInsuranceContributorSub(registrationNo: number): Observable<fetchContributorSub> {
    const url = `/api/v1/medical-insurance/${registrationNo}/fetch-contributors-sub`;
    return this.http.get<fetchContributorSub>(url);
  }
  // get-eligible-contributors
  // using on click add contributor button
  getMedicalInsuranceEligibleContributor(
    registrationNo: number,
    pageSize: number = 10,
    pageNo: number = 0
  ): Observable<MedicalInsuranceSubscribersList> {
    const url = `/api/v1/medical-insurance/${registrationNo}/get-eligible-contributors?status=ACTIVE&medicalInsurance=true&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<MedicalInsuranceSubscribersList>(url);
  }
  //get contributor
  // to check with CHI
  postMedicalInsuranceContributorWithChi(registrationNo: number, payload: any): Observable<any> {
    const url = `/api/v1/medical-insurance/${registrationNo}/check-contributor-with-chi`;
    return this.http.post<any>(url, payload);
  }
  // Save-details
  postMedicalInsuranceContributorSave(registrationNo: number, payload: any): Observable<any> {
    const url = `/api/v1/medical-insurance/${registrationNo}/save-details`;
    return this.http.post<any>(url, payload);
  }

  saveReopenEstablishment(registrationNo: number, reopenEstablishment?: ReopenEstablishment) {
    const url = `/api/v1/establishment/${registrationNo}/re-open`;
    return this.http.post<ReopenResponse>(url, reopenEstablishment);
  }

// •	http://10.4.197.101:8040/getHealthInsurance/getHealthImnsuranceCompanies?totalEmployees=10
  getHealthInsuranceOffers(totalEmp: number):Observable<InsuranceCompanyResponse> {
    const url = `/api/v1/Medical/getHealthInsuranceCompanies?totalEmployees=${totalEmp}`;
    return this.http.get<InsuranceCompanyResponse>(url);
  }

  // postRedirectionLink( request : HealthInsuranceRedirectionLinkRequest )
  //   :Observable<HealthInsuranceRedirectionLinkResponse> { const
  //   url = /api/v1/Medical/getHealthInsuranceRedirectionLink/;
  //   return this.http.post<HealthInsuranceRedirectionLinkResponse>(url,request ); }



  postRedirectionLink(request : HealthInsuranceRedirectionLinkRequest):Observable<HealthInsuranceRedirectionLinkResponse> {
    const url = `/api/v1/Medical/getHealthInsuranceRedirectionLink`;
    return this.http.post<HealthInsuranceRedirectionLinkResponse>(url,request);
  }

  healthInsuranceCompliance(request: HealthInsuranceInfoRequest):Observable<ComplianceDetails>{
    const apiUrl = '/api/v1/insurance-platform/CHI-Compliance-Details/Medical/Compliance';
    return this.http.post<ComplianceDetails>(apiUrl,request);
  }

  existInMci(identity: Identity | Identity[], mciOwnerIds: Identity[]) {
    let exists = false;
    if (Array.isArray(identity)) {
      exists = identity.some(i => this.existInMci(i, mciOwnerIds));
    } else {
      exists = mciOwnerIds.some(mciId => {
        switch (identity.idType) {
          case IdentityTypeEnum.IQAMA:
            if (Number((mciId as Iqama).iqamaNo) === Number((identity as Iqama).iqamaNo)) {
              return true;
            }
            break;
          case IdentityTypeEnum.NIN:
            if (Number((mciId as NIN).newNin) === Number((identity as NIN).newNin)) {
              return true;
            }
            break;
          case IdentityTypeEnum.NATIONALID:
            if (Number((mciId as NationalId).id) === Number((identity as NationalId).id)) {
              return true;
            }
            break;
          default:
            return false;
        }
      });
    }

    return exists;
  }
  /**
   * update medical insurance status
   * @param sin
   * @param payload
   * @returns {Observable<MedicalInsuranceUpdateStatus>}
   */
  updateMedicalInsuranceStatus(sin: number, payload: MedicalInsuranceUpdateStatus): Observable<MedicalInsuranceUpdateStatus> {
    const url = `/api/v1/medical-insurance/${sin}/update-status`
    return this.http.put<MedicalInsuranceUpdateStatus>(url, payload);
  }

  /**
   * modify medical insurance policy details
   * @param nin
   * @param payload
   * @returns {Observable<BilingualText>}
   */
  modifyMedicalInsurancePolicyDetails(nin: number, payload: MedicalInsurancePolicyDetails): Observable<BilingualText> {
    const url = `/api/v1/medical-insurance/${nin}/endurance-ratio`
    return this.http.put<BilingualText>(url, payload);
  }
}
