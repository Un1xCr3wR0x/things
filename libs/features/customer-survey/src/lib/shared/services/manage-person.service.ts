/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AlertService,
  AppConstants,
  BilingualText,
  bindToObject,
  BPMUpdateRequest,
  Contributor,
  ContributorToken,
  ContributorTokenDto,
  CoreContributorService,
  EstablishmentProfile,
  getIdentityByType,
  IdentityTypeEnum,
  Person,
  RouterData,
  StorageService,
  WorkflowItem,
  SearchTypeEnum
} from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import {
  BilingualMessageWrapper,
  Engagement,
  Engagements,
  PatchRequest,
  PersonBankDetails,
  TerminatePayload,
  TransactionResponse,
  WorkflowWrapper,
  OverallEngagementResponse,
  EngagementDetails
} from '../models';
import { PatchPersonAddressDetails } from '../models/patch-person-address-details';
import { RevertTransaction } from '../models/revert-transaction';

const typeNIN = IdentityTypeEnum.NIN;
const typeNATIONALID = IdentityTypeEnum.NATIONALID;

@Injectable({
  providedIn: 'root'
})
export class ManagePersonService {
  private _contributorSubject: BehaviorSubject<Contributor> = new BehaviorSubject(null);
  contributor$: Observable<Contributor>;
  private _personSubject: BehaviorSubject<Person> = new BehaviorSubject(null);
  person$: Observable<Person>;
  private _establishmentProfileSubject: BehaviorSubject<EstablishmentProfile> = new BehaviorSubject(null);
  establishmentProfile$: Observable<EstablishmentProfile>;
  registrationNo = null;
  socialInsuranceNo: number;
  isEdit = false;

  constructor(
    readonly http: HttpClient,
    private storageService: StorageService,
    readonly contributorService: CoreContributorService,
    private alertService: AlertService,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto
  ) {
    this.contributor$ = this._contributorSubject
      .asObservable()
      .pipe(map(contributor => bindToObject(new Contributor(), contributor)));
    this.person$ = this._personSubject.asObservable().pipe(map(person => bindToObject(new Person(), person)));
    this.establishmentProfile$ = this._establishmentProfileSubject
      .asObservable()
      .pipe(map(estProfile => bindToObject(new EstablishmentProfile(), estProfile)));
  }

  /**
   * Method to search contributor with reg and sin
   * @param estIdentifier
   * @param cntIdentifier
   */
  searchContributor(estRegNo, cntSin, checkBeneficiaryStatus: boolean = false): Observable<Contributor> {
    let url = estRegNo ? `/api/v1/establishment/${estRegNo}/contributor/${cntSin}` : `/api/v1/contributor/${cntSin}`;
    if (checkBeneficiaryStatus) url += `?checkBeneficiaryStatus=true`;
    return this.http.get<Contributor>(url).pipe(
      switchMap(res => {
        if (res) {
          // TODO: the below lines commented out in feature 277986. This todo added to avoid merging the commented code
          //  from feature branch
          if (res.hasActiveTerminatedOrCancelled) {
            return of(res);
          } else {
            this.alertService.showErrorByKey('CUSTOMER-INFORMATION.ERROR.PERSON_BLOCK_MESSAGE');
            return of(null);
          }
        } else {
          return of(null);
        }
      }),
      filter(res => res !== null),
      tap(cnt => this._contributorSubject.next(cnt)),
      tap(cntPerson => this._personSubject.next(cntPerson.person)),
      tap(data => {
        this.contributorService.selectedSIN = cntSin;
        this.contributorToken.socialInsuranceNo = cntSin;
        this.contributorService.registartionNo = estRegNo;
        if (data?.person?.personType === 'Saudi_Person')
          this.contributorService.nin = getIdentityByType(data.person?.identity, data.person?.nationality?.english).id;
        if (data?.hasVICEngagement) {
          this.contributorToken.nin = data.person?.identity[0]?.newNin;
          this.contributorToken.setIsVic(true);
        } else this.contributorToken.setIsVic(false);
      })
    );
  }

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

  /** Method to get engagements of contributor. */
  getEngagements(registrationNo: number, socialInsuranceNo: number): Observable<Engagement[]> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement?searchType=ACTIVE_AND_TERMINATED`;
    return this.http.get<Engagements>(url).pipe(pluck('engagements'));
  }
  /** Method to get engagements of contributor. */
  getOverAllEngagements(socialInsuranceNo: number): Observable<EngagementDetails[]> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/search-engagements?searchType=ACTIVE_AND_TERMINATED`;
    return this.http.get<OverallEngagementResponse>(url).pipe(pluck('overallEngagements'));
  }
  /**
   * Method to get the registration no
   */
  getEstablishmentRegistrationNo(): number {
    if (!this.registrationNo) {
      this.registrationNo =
        Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY)) ||
        this.contributorService.unifiedRegNo;
    }
    return this.registrationNo;
  }

  /**
   * Method to fetch the establishment profile
   * @param registrationNo
   */
  getEstablishmentProfile(registrationNo): Observable<EstablishmentProfile> {
    if (registrationNo) {
      const url = `/api/v1/establishment/${registrationNo}/profile`;
      return this.http.get<EstablishmentProfile>(url).pipe(tap(res => this._establishmentProfileSubject.next(res)));
    }
  }

  /**
   * Method to get workflow details
   * @param estRegistrationNo
   * @param socialInsuranceNo
   */
  getWorkFlowDetails(estRegistrationNo, socialInsuranceNo): Observable<WorkflowItem[]> {
    const url = `/api/v1/establishment/${estRegistrationNo}/contributor/${socialInsuranceNo}/workflow`;
    return this.http.get<WorkflowItem[]>(url);
  }

  /**
   * This method is used to verify the person identifiers applicable for User
   * @param formData
   */
  getPersonDetails(formData): Observable<Person> {
    const url = this.getPersonUrl(formData);
    return this.http.get<Person>(url);
  }
  /**
   * This method is used to get person identifiers urls
   * @param formData
   */
  getPersonUrl(formData): string {
    let birthDate;
    birthDate = moment(formData.birthDate.gregorian).format('YYYY-MM-DD');
    let verifyPersonUrl = `/api/v1/person?birthDate=${birthDate}`;
    if (formData.type === typeNIN) {
      verifyPersonUrl = verifyPersonUrl + `&NIN=${formData.newNin}`;
    } else if (formData.type === typeNATIONALID) {
      verifyPersonUrl = verifyPersonUrl + `&nationality=${formData.nationality.english}`;
      if (formData.id) {
        verifyPersonUrl = verifyPersonUrl + `&gccId=${formData.id}`;
      }
      if (formData.passport) {
        verifyPersonUrl = verifyPersonUrl + `&passportNo=${formData.passport}`;
      }
      if (formData.iqama) {
        verifyPersonUrl = verifyPersonUrl + `&iqamaNo=${formData.iqama}`;
      }
      if (formData.borderNo) {
        verifyPersonUrl = verifyPersonUrl + `&borderNo=${formData.borderNo}`;
      }
    } else {
      if (formData.iqama) {
        verifyPersonUrl = `${verifyPersonUrl}&iqamaNo=${formData.iqama}`;
      }
      if (formData.borderNo) {
        verifyPersonUrl = verifyPersonUrl + `&borderNo=${formData.borderNo}`;
      }
    }
    return verifyPersonUrl;
  }

  /**
   * This method is used to patch the section of the person identifier details
   * @param personId
   * @param type
   * @param requestData
   */
  patchIdentityDetails(type: string, requestData, sin: number): Observable<BilingualMessageWrapper> {
    const patchRequest: PatchRequest = new PatchRequest();
    patchRequest.type = type;
    if (requestData) {
      Object.keys(requestData).forEach(name => {
        patchRequest[name] = requestData[name];
      });
      const url = `/api/v1/establishment/${this.getEstablishmentRegistrationNo()}/contributor/${sin}/identity`;
      return this.http.patch<BilingualMessageWrapper>(url, patchRequest);
    }
  }

  /**
   * This method is used to patch the section of person details
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
   * This method is used to patch the person address details
   * @param personId
   * @param requestData
   */
  patchPersonAddressDetails(personId, requestData: PatchPersonAddressDetails): Observable<BilingualMessageWrapper> {
    const url = `/api/v1/person/${personId}/address`;
    return this.http.patch<BilingualMessageWrapper>(url, requestData);
  }

  /**
   * This method is to revert the previously completed actions during cancelling
   * @param revertTransaction
   */
  revertTransaction(revertTransaction: RevertTransaction, sin: number): Observable<null> {
    const url = `/api/v1/establishment/${this.getEstablishmentRegistrationNo()}/contributor/${sin}/revert`;
    return this.http.put<null>(url, revertTransaction);
  }

  /**
   * This method is used to update the BPM Workflow about the validator edit and save
   */
  updateTaskWorkflow(data: RouterData): Observable<BilingualText> {
    if (data) {
      const approveUrl = `/api/process-manager/v1/taskservice/update`;
      const updateRequest: BPMUpdateRequest = new BPMUpdateRequest();
      updateRequest.outcome = 'SUBMIT';
      updateRequest.taskId = data.taskId;
      const httpOptions = {
        headers: new HttpHeaders({
          workflowUser: `${data.assigneeId}`
        })
      };
      return this.http.post<BilingualText>(approveUrl, updateRequest, httpOptions);
    }
  }

  /**
   * This method is to get the task details related to the current transaction under workflow
   * @param role
   */
  getTaskDetails(role: string, isContributor: boolean, sin?: number, personId?: string): Observable<WorkflowWrapper> {
    const url = `/api/v1/inbox/view?assigneeId=${role}&resourceId=${isContributor === true ? sin : personId}`;
    return this.http.get<WorkflowWrapper>(url);
  }

  //Validator

  /**
   * This method is used to get the person details
   * @param personId
   */
  getPerson(personId): Observable<Person> {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<Person>(url);
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
   * Method to get the contributor
   * @param registrationNo
   * @param socialInsuranceNo
   */
  fetchContributor(registrationNo, socialInsuranceNo): Observable<Contributor> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}?fetchType=EstAdminPerson`;
    return this.http.get<Contributor>(url).pipe(
      filter(res => res !== null),
      tap(cnt => this._contributorSubject.next(cnt)),
      tap(cntPerson => this._personSubject.next(cntPerson.person))
    );
  }

  /**
   * Method to approve contributor workflow
   * @param estRegistrationNo
   * @param contributorId
   * @param formData
   */
  approveContributorTransaction(
    estRegistrationNo: number,
    contributorId: number,
    formData: BPMUpdateRequest
  ): Observable<TransactionResponse> {
    const url = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
    formData.action = 'VAPPROVE';
    formData.status = 'APPROVE';
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`,
        bpmTaskId: `${formData.taskId}`
      })
    };
    return this.http.patch<TransactionResponse>(url, formData, httpOptions);
  }

  /**
   * Method to reject contributor workflow
   * @param estRegistrationNo
   * @param contributorId
   * @param formData
   */
  rejectContributorTransaction(
    estRegistrationNo,
    contributorId,
    formData: BPMUpdateRequest
  ): Observable<TransactionResponse> {
    const url = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
    formData.action = 'VREJECT';
    formData.status = 'REJECT';
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`,
        bpmTaskId: `${formData.taskId}`
      })
    };
    return this.http.patch<TransactionResponse>(url, formData, httpOptions);
  }

  /**
   * Method to return contributor workflow
   * @param estRegistrationNo
   * @param contributorId
   * @param formData
   */
  returnContributorTransaction(
    estRegistrationNo,
    contributorId,
    formData: BPMUpdateRequest
  ): Observable<TransactionResponse> {
    const url = `/api/v1/establishment/${estRegistrationNo}/contributor/${contributorId}/identity-workflow`;
    formData.action = 'VRETURN';
    formData.status = 'RETURN';
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`,
        bpmTaskId: `${formData.taskId}`
      })
    };
    return this.http.patch<TransactionResponse>(url, formData, httpOptions);
  }

  /** Method to terminate all active engagements of the contributor. */
  terminateAllActiveEngagements(
    registrationNo: number,
    socialInsuranceNo: number,
    payload: TerminatePayload
  ): Observable<boolean> {
    const url = registrationNo
      ? `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/terminate`
      : `/api/v1/vic/${socialInsuranceNo}/terminate`;
    return this.http.put(url, payload).pipe(pluck('cancelled'));
  }

  /** Method to clear establishment profile subject in the case of unified profile. */
  clearEstablishmentProfileSubject() {
    this._establishmentProfileSubject.next(null);
  }
}
