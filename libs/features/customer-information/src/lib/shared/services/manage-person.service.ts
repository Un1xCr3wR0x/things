/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  SearchTypeEnum,
  GosiCalendar
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
  EngagementDetails,
  IndividualBankAccountList,
  IndividualBankDetails,
  AuthorizationDetailsDto,
  IBANRESULT,
  NotificationRequest,
  NotificationResponse,
  RequestLimit,
  FinancialDetails
} from '../models';
import { ActiveBenefits, VerifyBankDetails } from '../models/benefits';
import { PatchPersonAddressDetails } from '../models/patch-person-address-details';
import { RevertTransaction } from '../models/revert-transaction';
import { ResponseDTO } from '../models/response-dto';
import { PersonDetailsDTO, SimisDocDetails } from '../models/person-details-dto';
import { PPABankAccount } from '@gosi-ui/features/contributor';

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
  _establishmentRegNo: BehaviorSubject<number> = new BehaviorSubject(null);
  establishmentRegNo$: Observable<number>;
  registrationNo = null;
  socialInsuranceNo: number;
  isEdit = false;
  bankDetail: IndividualBankDetails;
  ibanList = [];
  notificationListUrl: string;
  _notificationRequest: NotificationRequest = undefined;
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
    this.establishmentRegNo$ = this._establishmentRegNo.asObservable().pipe(map(estRegNo => estRegNo));
  }

  /**
   * Method to search contributor with reg and sin
   * @param estIdentifier
   * @param cntIdentifier
   */
  searchContributor(estRegNo, cntSin, checkBeneficiaryStatus: boolean = false): Observable<Contributor> {
    let url =
      estRegNo && estRegNo !== '0'
        ? `/api/v1/establishment/${estRegNo}/contributor/${cntSin}`
        : `/api/v1/contributor/${cntSin}`;
    if (checkBeneficiaryStatus) url += `?checkBeneficiaryStatus=true`;
    return this.http.get<Contributor>(url).pipe(
      switchMap(res => {
        if (res) {
          // TODO: KP remove below line on merging to master
          //if (res.hasActiveTerminatedOrCancelled) {
          return of(res);
          //} else {
          //this.alertService.showErrorByKey('CUSTOMER-INFORMATION.ERROR.PERSON_BLOCK_MESSAGE');
          //return of(null);
          //}
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
        this.contributorService.personId = data.person.personId;
        // if (data?.person?.personType === 'Saudi_Person')
        // Identity not getting set for NOn-Saudi person, Direct payment link issue
        if (data?.person) {
          this.contributorService.nin = getIdentityByType(data.person?.identity, data.person?.nationality?.english).id;
        }
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

  patchPersonIdentity(type: string, requestData, sin: number): Observable<BilingualMessageWrapper> {
    const patchRequest: PatchRequest = new PatchRequest();
    patchRequest.type = type;
    if (requestData) {
      Object.keys(requestData).forEach(name => {
        patchRequest[name] = requestData[name];
      });
      const url = `/api/v1/person/${sin}/identity`;
      return this.http.patch<BilingualMessageWrapper>(url, patchRequest);
    }
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

  saveBankDetails(nin: any, data: PersonBankDetails) {
    const apiURL = `/api/v1/profile/${nin}/financial-details`;

    return this.http.post<any>(apiURL, data);
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

  setPersonId(personId: number) {
    this.storageService.setLocalValue('personId', personId);
  }

  getPersonId() {
    this.storageService.getLocalValue('personId');
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

  getBankAccountList(
    personId: number,
    referenceNo?: number,
    serviceType?: string
  ): Observable<IndividualBankAccountList> {
    const url = `/api/v1/person/${personId}/bank-account`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (serviceType) params = params.set('serviceType', serviceType.toString());
    return this.http.get<IndividualBankAccountList>(url, { params });
  }

  setBankDetails(bankDetails) {
    this.bankDetail = bankDetails;
  }

  getBankDetail() {
    return this.bankDetail;
  }

  setIbanList(list) {
    this.ibanList = list;
  }

  getIbanList() {
    return this.ibanList;
  }

  /**
   * This method is used to get the authorization details(new API)
   * @param id
   */
  getAuthorizationDetails(id: number) {
    const url = `/api/v1/person/${id}/authorization`; //new API
    return this.http.get<AuthorizationDetailsDto>(url);
  }

  //used to fetch active annuity benefits
  getBenefitsWithStatus(socialInsuranceNo: number, status: string[]): Observable<ActiveBenefits[]> {
    let params = new HttpParams();
    const uri = `/api/v1/contributor/${socialInsuranceNo}/benefit`;
    if (status.length) {
      status.forEach(eachStatus => {
        params = params.append('status', eachStatus);
      });
    }
    params = params.set('includeSaned', 'true');
    // params = params.append('status', status.join(', '));
    return this.http.get(uri, { params }).pipe(
      map(res => {
        const ret = <ActiveBenefits[]>res;
        return ret;
      })
    );
  }

  saveInidividualBankDetails(personId: number, bankDetails: IndividualBankDetails) {
    const url = `/api/v1/person/${personId}/bank-account`;
    return this.http.post<any>(url, bankDetails);
  }
  verifyBankDetails(personId: number, bankDetails: VerifyBankDetails) {
    const url = `/api/v2/person/${personId}/bank-account`;
    return this.http.patch<any>(url, bankDetails);
  }
  checkBankValidation(nin, iban, firstname, lastname): Observable<IBANRESULT> {
    if (!firstname || firstname?.length < 3) firstname = 'علي';
    if (!lastname || lastname?.length < 3) lastname = 'علي';
    const url = `/api/v2/samaiban?id=${nin}&iban=${iban}&firstName=${firstname}&lastName=${lastname}`;
    return this.http.get<IBANRESULT>(url);
  }

  /**
   * This method is used to get the boolean of add nin
   * @param personId
   */
  getShowParamAddNin(personId): Observable<ResponseDTO> {
    if (personId) {
      const url = `/api/v1/person/${personId}/add-nin-eligibility`;
      return this.http.get<ResponseDTO>(url);
    }
  }

  getPersonDetailsAddNin(personId: any, newNin: any, dob: GosiCalendar): Observable<PersonDetailsDTO> {
    let dobstring: any;
    if (personId) {
      dobstring = moment(dob?.gregorian).format('YYYY-MM-DD');
    }
    const url = `/api/v1/person/${personId}/person-details?birthDate=${dobstring}&newNin=${newNin}`;
    return this.http.get<PersonDetailsDTO>(url);
  }

  submitDetailsAddNin(details: any, personId: any): Observable<null> {
    const url = `/api/v1/person/${personId}/add-nin`;
    return this.http.put<null>(url, details);
  }
  /**
   * This method is used to get the boolean of edit nin
   * @param personId
   */
  getEditNinEligibility(personId): Observable<ResponseDTO> {
    if (personId) {
      const url = `/api/v1/person/${personId}/edit-nin-eligibility`;
      return this.http.get<ResponseDTO>(url);
    }
  }
  submitEditNin(details: any, personId: any): Observable<null> {
    const url = `/api/v1/person/${personId}/edit-nin`;
    return this.http.put<null>(url, details);
  }
  getsimisDocDetails(personId:number,pageNo: number = 0): Observable<SimisDocDetails>{
    const url = `/api/v1/person/${personId}/microficheinfo?page.pageNo=${pageNo}&page.size=5`;
    return this.http.get<SimisDocDetails>(url);
  }
  getValidatorAddNin(personId: any): Observable<PersonDetailsDTO> {
    if (personId) {
      const url = `/api/v1/person/${personId}/person-details-change`;
      return this.http.get<PersonDetailsDTO>(url);
    }
  }
  getInprogressNinTransactions(personId: any, referenceNo: number) {
    const url = `/api/v1/person/${personId}/transaction-inprogress-check/${referenceNo}`;
    return this.http.get(url);
  }

  /**
   *
   * @param notificationRequest
   *  sorting the list based on the sort parameter
   */
  getNotification(notificationRequest: NotificationRequest): Observable<NotificationResponse> {
    this._notificationRequest = notificationRequest;
    this.notificationListUrl = `/api/v1/denodosmsapiproxy/server/customer360/bv_sms_notifications/views/bv_sms_notifications?`;
    this.notificationListUrl += `page=${notificationRequest.page.pageNo}&recipient=${notificationRequest.personIdentifier}&records=${notificationRequest.page.size}`;

    return this.http.get<any>(this.notificationListUrl).pipe(
      map((resp: any) => {
        const mappedResponse: NotificationResponse = {
          list: resp.elements?.map(item => ({
            transactionname: item.transactionname,
            type: item.type,
            lastsent: item.lastsent,
            sms: item.sms,
            status: item.status
          })),
          totalRecords: resp.elements[0]?.totalcount
        };
        return mappedResponse;
      })
    );
  }
  getPPABankAccounts(personId: number) {
    if (personId) {
      let url = `/api/v1/ppa-services/${personId}/guest/bank-accounts`;
      return this.http.get<any>(url);
    }
  }
  getDigitalDocumentDetails(personId: any,
    pageNo: number = 0, 
    ninIqama: any, 
    sin?: any,){
      let url = `/api/v1/document/${personId}/personal-docs?page.pageNo=${pageNo}&page.size=10&personIdentifier=${ninIqama}`;
    if (sin && sin !== null) {
    url += `&socialInsuranceNumber=${sin}`
    }
    return this.http.get(url);
    }
  getDocumentDetails(personId: any,
    ninIqama: any, 
    sin?: any,
    searchKey?: string,
    documentTypes?: string[],
    system?: string,
    endDate?: string,
    startDate?: string,
    addedBy?: string[],
    transactionIds?: string[]
    ){
    let url = `/api/v1/document/${personId}/personal-docs?personIdentifier=${ninIqama}`;
    if (sin && sin !== null) {
    url += `&socialInsuranceNumber=${sin}`
    }
    if (startDate && startDate !== null) {
      url += `&startDate=${startDate}`;
    }
    if (endDate && endDate !== null) {
      url += `&endDate=${endDate}`;
    }
    if (searchKey && searchKey !== null) {
      url += `&searchKey=${searchKey}`;
    }
    if (documentTypes && documentTypes.length > 0) {
      documentTypes.forEach(value => {
        url += `&documentTypes=${value}`;
      });
    }
    if (addedBy && addedBy.length > 0) {
      addedBy.forEach(value => {
        url += `&addedBy=${value}`;
      });
    }
     if (system && system.length > 0) {
        url += `&parameter=${system}`;
    }
    if (transactionIds && transactionIds.length > 0) {
      transactionIds.forEach(value => {
      url += `&transactionIds=${value}`;
    });
  }
      return this.http.get(url);
  }
}
