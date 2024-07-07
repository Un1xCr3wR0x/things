import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  BilingualText,
  bindToObject,
  CRNDetails,
  Establishment,
  EstablishmentProfile,
  Person,
  RoleIdEnum
} from '@gosi-ui/core';
import {
  Admin,
  AdminBranchQueryParam,
  AdminWrapper,
  BranchList,
  BranchRequest,
  EstablishmentBranchWrapper,
  EstablishmentOwnersWrapper,
  EstablishmentService,
  EstablishmentWorkFlowStatus,
  GosiStartDateEnum,
  LegalEntityEnum,
  MciResponse,
  Owner,
  OwnerResponse,
  QueryParam,
  SystemParamsEnum,
  TerminateBPMRequest,
  TerminateRequest,
  TerminateResponse
} from '@gosi-ui/features/establishment';
import { AdminQueryParam } from '@gosi-ui/features/establishment/lib/shared/models/admin-query-param';
import { BranchStatus } from '@gosi-ui/features/establishment/lib/shared/models/branch-status';
import { Observable, of, throwError } from 'rxjs';
import { pluck } from 'rxjs/operators';
import {
  documentListItemArray,
  establishmentDetailsTestData,
  establishmentProfileResponse,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericCrnReponse,
  genericError,
  genericEstablishmentGroups,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  genericViolationCountTestData,
  personResponse
} from '../../test-data';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentStubService extends EstablishmentService {
  selectedRegNo = 123456;
  /**
   * Mock Method for getEstablishment
   *
   * @param registrationNumber
   */
  getEstablishment(registrationNumber) {
    if (registrationNumber) {
      return of(bindToObject(new Establishment(), establishmentDetailsTestData));
    } else {
      return of(bindToObject(new Establishment(), establishmentDetailsTestData));
    }
  }

  /**
   * Method to verify the CRN with MCI
   * @param crn
   */
  getCrnDetailsFromMci(crn: string, regNo: number): Observable<CRNDetails> {
    if (crn || regNo) {
      return this.getEstablishmentFromTransient(regNo, undefined).pipe(pluck('crn'));
    } else {
      const err = genericError;
      err.error.message.english = 'MCI Verification Failed';
      return throwError(err);
    }
  }

  /**
   * Generic Method to get the establishment corresponding to params passed
   * @param params
   */
  getEstablishmentFromTransient(regNo: number, referenceNo: number) {
    if (regNo || referenceNo) {
      return of(genericEstablishmentResponse);
    } else {
      return throwError(genericError);
    }
  }

  getEstablishmentGroupsUnderAdmin(adminId: number): Observable<EstablishmentBranchWrapper> {
    if (adminId) {
      const groups = {
        branchList: genericEstablishmentGroups,
        branchStatus: new BranchStatus(),
        filter: undefined
      };
      return of(groups);
    } else {
      return throwError(genericError);
    }
  }

  getBranchesUnderAdmin(adminId: number, params: AdminBranchQueryParam): Observable<EstablishmentBranchWrapper> {
    if (adminId || params) {
      const groups: EstablishmentBranchWrapper = {
        branchList: [new BranchList()],
        branchStatus: new BranchStatus(),
        filter: undefined
      };
      return of(groups);
    } else {
      return throwError(genericError);
    }
  }

  getSuperAdminDetails(registrationNo): Observable<Admin> {
    if (registrationNo) {
      const admin: Admin = new Admin();
      admin.person = { ...genericPersonResponse };
      admin.roles = [new BilingualText()];
      return of(admin);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Mock method for getAdminsOfEstablishment
   * @param registrationNo
   */
  getAdminsOfEstablishment(registrationNo, referenceNo?: number): Observable<AdminWrapper> {
    if (registrationNo) {
      const adminWrapper: AdminWrapper = new AdminWrapper();
      const admin: Admin = new Admin();
      admin.person = { ...genericPersonResponse };
      admin.roles = [new BilingualText()];
      adminWrapper.admins.push(admin);
      return of(adminWrapper);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Mock method for getAdminsOfEstablishment
   * @param registrationNo
   */
  getAdminsUnderSupervisor(adminId: number, params: AdminQueryParam): Observable<AdminWrapper> {
    if (params || adminId) {
      return this.getAdminWrapper();
    } else {
      return throwError(genericError);
    }
  }

  getAdminWrapper() {
    const adminWrapper: AdminWrapper = new AdminWrapper();
    const admin: Admin = new Admin();
    admin.person = { ...genericPersonResponse };
    admin.roles = [new BilingualText()];
    adminWrapper.admins.push(admin);
    return of(adminWrapper);
  }

  getAdminsUnderGroup(mainRegNo: number): Observable<AdminWrapper> {
    if (mainRegNo) {
      return this.getAdminWrapper();
    } else {
      return throwError(genericError);
    }
  }
  /**
   * Method to revert transaction
   * @param mainRegNo
   * @param referenceNo
   */
  revertTransaction(mainRegNo: number, referenceNo: number): Observable<null> {
    if (mainRegNo || referenceNo) {
      return of(null);
    } else {
      throwError('No Inputs');
    }
  }

  /**
   * Mock method for getOwnerDetials
   * @param registrationNo
   */
  getPersonDetailsOfOwners(registrationNo): Observable<Owner[]> {
    if (registrationNo) {
      return of([bindToObject(new Owner(), personResponse)]);
    } else {
      return of([bindToObject(new Owner(), personResponse)]);
    }
  }

  /**
   * Mock method to getOwnerDetails
   * @param registrationNumber
   */
  getOwnerDetails(registrationNumber): Observable<EstablishmentOwnersWrapper> {
    if (registrationNumber) {
      const estOwner = new EstablishmentOwnersWrapper();
      estOwner.owners.push(new Owner());
      estOwner.owners[0].person = genericPersonResponse;
      return of(estOwner);
    }
    return throwError(genericError);
  }

  /**
   * Mock method for verifyOwnerDetails
   * @param registrationNo
   */
  verifyPersonDetails(person: Person): Observable<Person> {
    if (person) {
      return of(bindToObject(new Person(), personResponse));
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Mock for getting comments
   */
  getComments(queryParams: QueryParam[]) {
    if (queryParams) {
      return of([]);
    } else {
      return of([]);
    }
  }

  /**
   * Method to get all establishments - main and corresponding branches
   * @param registrationNo
   */
  getBranchEstablishments(registrationNo: number, size?: number, pageNo?: number): Observable<BranchList[]> {
    if (registrationNo || size || pageNo) {
      return of(genericBranchListResponse);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to get all establishments   - main and corresponding branches with  count and status
   * @param registrationNo
   */
  getBranchEstablishmentsWithStatus(
    registrationNo: number,
    payload: BranchRequest,
    queryParams: QueryParam[]
  ): Observable<EstablishmentBranchWrapper> {
    if (registrationNo || payload || queryParams) {
      return of(genericBranchListWithStatusResponse);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getEstablishmentProfileDetails(registrationNo: number) {
    if (registrationNo) {
      return of(bindToObject(new EstablishmentProfile(), establishmentProfileResponse));
    } else {
      return throwError(genericError);
    }
  }

  /**
   * Method to get work flow status of a establishment
   * @param registrationNo
   */
  getWorkflowsInProgress(registrationNo: number): Observable<EstablishmentWorkFlowStatus[]> {
    if (registrationNo) {
      return of([
        {
          type: 'Establishment Details',
          message: { english: '', arabic: '' },
          referenceNo: 728234
        },
        {
          type: 'Identifier Details',
          message: { english: '', arabic: '' },
          referenceNo: 728234
        }
      ]);
    } else {
      return throwError(genericError);
    }
  }

  /**
   * This method is to fetch the establishment closure details
   * @param registrationNo
   * @param terminateRequest
   * @param queryParams
   * @memberof TerminateEstablishmentService
   */
  terminateEstablishment(
    registrationNo: number,
    terminateRequest: TerminateRequest,
    queryParams: QueryParam[]
  ): Observable<TerminateResponse> {
    if (registrationNo || terminateRequest || queryParams) {
      return of(new TerminateResponse());
    } else {
      return throwError(genericError);
    }
  }

  getDocuments(key, type, identifier: any) {
    if (key || type || identifier) {
      return of(documentListItemArray);
    } else {
      return throwError(genericError);
    }
  }

  confirmReturnTermination(form: FormGroup) {
    if (form) {
      return of(new BilingualText());
    } else {
      return throwError(genericError);
    }
  }

  approveTerminateTransaction(data: TerminateBPMRequest, assignedRole) {
    if (data || assignedRole) {
      return of(new BilingualText());
    } else {
      return throwError(genericError);
    }
  }

  rejectOrReturnTerminateTransaction(data: TerminateBPMRequest, isReject: boolean, assignedRole) {
    if (data || assignedRole || isReject) {
      return of(new BilingualText());
    } else {
      return throwError(genericError);
    }
  }

  searchOwnerWithQueryParams(registrationNo: number, params: HttpParams): Observable<Owner[]> {
    if (registrationNo || params) {
      return of([genericOwnerReponse]);
    } else {
      return throwError(genericError);
    }
  }

  verifyWithMciService(crn: string, regNo: number): Observable<MciResponse> {
    if (crn || regNo) {
      return of({
        crn: genericCrnReponse,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' }
      });
    } else {
      const err = genericError;
      err.error.message.english = 'MCI Verification Failed';
      return throwError(err);
    }
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
    if (owners || registrationNo || navInd || comments || referenceNo) {
      return of(new OwnerResponse());
    } else {
      return throwError('no inputs');
    }
  }

  getGosiStartDates(): Observable<Map<string, Date>> {
    const map = new Map<string, Date>();
    Object.keys(GosiStartDateEnum).forEach(key => {
      map.set(key, GosiStartDateEnum[key]);
    });
    return of(map);
  }

  getSystemParams(): Observable<{ name: string; value: string }[]> {
    return of([{ name: SystemParamsEnum.government, value: GosiStartDateEnum.GOVERNMENT }]);
  }

  isLicensePresent(regNo: number, licenseNo: number, issuingAuthority: string): Observable<boolean> {
    if (regNo || licenseNo || issuingAuthority) {
      return of(false);
    } else {
      return throwError(genericError);
    }
  }

  isUserEligible(eligibleRoles: RoleIdEnum[] = [], regNo: number = undefined): boolean {
    if (eligibleRoles?.length > 0 || regNo) {
      return true;
    } else {
      return false;
    }
  }

  getViolationsCount(regNo: number) {
    if (regNo) {
      return of(genericViolationCountTestData);
    } else {
      return throwError(genericError);
    }
  }
}
