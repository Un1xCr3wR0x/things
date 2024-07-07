/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BankAccount, BilingualText, Person, PersonWrapperDto, bindToObject } from '@gosi-ui/core';
import { EstablishmentDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';
import { IPensionReformEligibility } from '@gosi-ui/features/customer-information/lib/shared';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/lib/shared/models';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import {
  BankAccounts,
  BillDetails,
  BillPeriods,
  BillSummaryWrapper,
  ClausesWrapper,
  ContractWrapper,
  Contributor,
  ContributorDetailsWrapper,
  ContributorSinResponse,
  Coverage,
  CoveragePeriodWrapper,
  Employer,
  EmployerList,
  EngagementDetails,
  EngagementFilter,
  ModifyCoverage,
  ModifyRequestList,
  PersonChangeRequest,
  PersonWrapper,
  PersonalInformation,
  ReactivateEngagementRequest,
  SaveContributorPayload,
  SaveContributorResponse,
  SearchEngagementResponse,
  SubmitEngagementResponse,
  SystemParameterWrapper,
  TransactionResponse,
  ValidateContractResponse,
  VicContributionDetails,
  VicEngagementDetails,
  pensionReformEligibility
} from '../models';
import { CoverageDetails } from '../models/coverage-details';
import { EEngagement } from '../models/e-engagement';
import { SaveEngagementPayload } from '../models/e-inspection-saveEngagement';
import { classDetails } from '../models/jobClassDetails';
import { gradeDetails } from '../models/jobGradeDetails';
import { rankDetails } from '../models/jobRankDetails';
import { PersonDetailsDTO } from '../models/person-details-dto';
import { NonSaudiEligibilityResponse } from '../models/non-saudi-eligibility-response';

import { ReactivateEngagementPayload } from '../models/reactivate-saveEngagement';
import { saveEngagementEinspection } from '../models/saveEngagementEinspection';
import { saveEngagementReactivate } from '../models/saveEngagementReactivate';
import { SubmitEEngagementPayload } from '../models/submitEEngagementPayload';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {
  /* Variable declarations and initialization */
  private contributorType: string;
  private person = new PersonalInformation();
  private personEinspection: Person;
  private socialInsuranceNo: number;
  private penaltyIndicator: number;
  private _personId: number;
  searchRequest: SearchRequest = new SearchRequest();
  NINDetails = [];
  IqamaDetails = [];
  GCCIdDetails = [];
  BordeNoDetails = [];
  PassportDetails = [];
  EmployerList = [];
  private CurrentCoverage: Coverage[];
  personIdentifier: number;
  isIndividualProfile: boolean;
  authorization: string;

  constructor(readonly http: HttpClient) {}

  /** Setter method for person. */
  public set setPerson(person) {
    this.person = person;
  }

  /** Setter method for person */
  public setPersonalInformation(person) {
    this.person = person;
  }

  /** Getter method for person */
  public get getPerson() {
    return this.person;
  }

  /** Getter method for registration number */
  public get getSocialInsuranceNumber() {
    return this.socialInsuranceNo;
  }

  /** Setter method for penalty indicator */
  public set setPenaltyIndicator(indicator) {
    this.penaltyIndicator = indicator;
  }

  /** Getter method for  penalty indicator */
  public get getPenaltyIndicator() {
    return this.penaltyIndicator;
  }

  /** Setter method for contributor type */
  public set setContributorType(contType) {
    this.contributorType = contType;
  }

  /** Getter method for  contributor type */
  public get getContributorType() {
    return this.contributorType;
  }

  public get personId() {
    return this._personId;
  }

  public set personId(personId: number) {
    this._personId = personId;
  }
  /**
   * THis setter method for current coverage
   * @param engagement
   */
  set setCurrentEngagmentCoverage(coverage: Coverage[]) {
    this.CurrentCoverage = coverage;
  }

  /**
   * This getter method to fetch current engagement details
   */
  get getCurrentEngagmentCoverage(): Coverage[] {
    return this.CurrentCoverage;
  }

  /** Method to call api to verify and fetch contributor details */
  getPersonDetails(queryParam: string, options: Map<string, boolean>): Observable<PersonalInformation> {
    let url = `/api/v1/person?${queryParam}`;
    if (options.has('fetchAddressFromWasel')) url += `&fetchAddressFromWasel=${options.get('fetchAddressFromWasel')}`;
    if (options.has('absherVerificationRequired'))
      url += `&absherVerificationRequired=${options.get('absherVerificationRequired')}`;
    return this.http.get<PersonWrapper>(url).pipe(
      pluck('listOfPersons'),
      map(person => (person && person.length > 0 ? person[0] : null)),
      tap(res => {
        if (res?.personId) this._personId = res.personId;
      }),
      catchError(err => this.handleError(err))
    );
  }

  getPersonalDetailsIndApp(nin: number, queryParam: string) {
    const url = `/api/v1/profile/${nin}/verify?${queryParam}`;
    return this.http.get<PersonalInformation>(url).pipe(
      tap(res => {
        if (res?.personId) this._personId = res.personId;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(url).pipe(
      tap(res => (this._personId = res.id)),
      catchError(err => this.handleError(err))
    );
  }
  getPersonEligibility(personId: number) {
    const url = `/api/v1/person/${personId}/modify-nationality-eligibility`;
    return this.http.get<any>(url).pipe(
      tap(res => (this._personId = res.id)),
      catchError(err => this.handleError(err))
    );
  }
  /** Method to save/update details of the contributor */
  saveContributorDetails(
    personDetails: ContributorDetailsWrapper,
    registrationNo: number
  ): Observable<SaveContributorResponse> {
    const contPayload: SaveContributorPayload = bindToObject(new SaveContributorPayload(), personDetails.person);
    const addContributorUrl = `/api/v1/establishment/${registrationNo}/contributor?contributorType=${personDetails.contributorType}`;
    return this.http.post<SaveContributorResponse>(addContributorUrl, contPayload).pipe(
      tap(res => {
        this.socialInsuranceNo = res.socialInsuranceNo;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to save personal details in einspection */
  onSavePersonalDetails(personalDetails: Person, nin: number): Observable<SaveContributorResponse> {
    const contPayload: SaveContributorPayload = bindToObject(new SaveContributorPayload(), personalDetails);
    const addContributorUrl = `/api/v1/contributor/${nin}/register-contributor-inspection-request`;
    return this.http.post<SaveContributorResponse>(addContributorUrl, contPayload).pipe(
      tap(res => {
        this.socialInsuranceNo = res.socialInsuranceNo;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to save request details in einspection */
  onSaveRequestDetails(engagementDetails: EEngagement, nin: number): Observable<saveEngagementEinspection> {
    const contPayload: SaveEngagementPayload = bindToObject(new SaveEngagementPayload(), engagementDetails);
    const url = `/api/v1/contributor/${nin}/violation-request`;
    return this.http.post<saveEngagementEinspection>(url, contPayload).pipe(
      tap(res => {
        //console.log(res)
      }),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to save request details in einspection */
  onSaveReactivateDetails(
    engagementDetails: ReactivateEngagementRequest,
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number
  ): Observable<saveEngagementReactivate> {
    const contPayload: ReactivateEngagementPayload = bindToObject(new ReactivateEngagementPayload(), engagementDetails);
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/reactivate`;
    return this.http
      .post<saveEngagementReactivate>(url, contPayload)
      .pipe
      // tap(res => {
      //  console.log(res)

      // }),
      // catchError(err => this.handleError(err))
      ();
  }

  onSaveReactivateVicDetails(
    engagementDetails: ReactivateEngagementRequest,
    socialInsuranceNo: number,
    engagementId: number
  ): Observable<saveEngagementReactivate> {
    const contPayload: ReactivateEngagementPayload = bindToObject(new ReactivateEngagementPayload(), engagementDetails);
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/reactivate`;
    return this.http
      .post<saveEngagementReactivate>(url, contPayload)
      .pipe
      // tap(res => {
      //  console.log(res)

      // }),
      // catchError(err => this.handleError(err))
      ();
  }

  onUpdateReactivateDetails(
    engagementDetails: ReactivateEngagementRequest,
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    transactionTraceId: number
  ): Observable<saveEngagementReactivate> {
    const contPayload: ReactivateEngagementPayload = bindToObject(new ReactivateEngagementPayload(), engagementDetails);
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/reactivate/${transactionTraceId}`;
    return this.http.put<saveEngagementReactivate>(url, contPayload).pipe(
      tap(res => {}),
      catchError(err => this.handleError(err))
    );
  }

  onUpdateReactivateVicDetails(
    engagementDetails: ReactivateEngagementRequest,
    socialInsuranceNo: number,
    engagementId: number,
    transactionTraceId: number
  ): Observable<saveEngagementReactivate> {
    const contPayload: ReactivateEngagementPayload = bindToObject(new ReactivateEngagementPayload(), engagementDetails);
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/reactivate/${transactionTraceId}`;
    return this.http.put<saveEngagementReactivate>(url, contPayload).pipe(
      tap(res => {}),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to update penalty indicator. */
  updatePenaltyIndicator(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    penaltyIndicator: number,
    txnTraceId: number
  ): Observable<void> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/update-penalty?transactionTraceId=${txnTraceId}`;
    return this.http.patch<void>(url, { penaltyIndicator: penaltyIndicator });
  }

  onUpdateRequestDetails(
    engagementDetails: EEngagement,
    nin: number,
    requestId: number
  ): Observable<saveEngagementEinspection> {
    const contPayload: SaveEngagementPayload = bindToObject(new SaveEngagementPayload(), engagementDetails);
    const url = `/api/v1/contributor/${nin}/violation-request/${requestId}`;
    return this.http.put<saveEngagementEinspection>(url, contPayload).pipe(
      tap(res => {
        //console.log(res)
      }),
      catchError(err => this.handleError(err))
    );
  }

  getEinspectionEngagementDetails(nin: number, requestId: number): Observable<SaveEngagementPayload> {
    const url = `/api/v1/contributor/${nin}/violation-request/${requestId}`;
    return this.http.get<SaveEngagementPayload>(url);
  }
  getAddMissingEngagementDetails(
    registrationNo: number,
    nin: number,
    requestId: number
  ): Observable<SaveEngagementPayload> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${nin}/violation-request/${requestId}`;
    return this.http.get<SaveEngagementPayload>(url);
  }

  einspectionCsrApprove(nin: number, requestId: number, regNo: number): Observable<TransactionResponse> {
    const url = `/api/v1/contributor/${nin}/violation-request/${requestId}/validate/${regNo}`;
    return this.http.put<TransactionResponse>(url, null).pipe(catchError(err => this.handleError(err)));
  }

  sendOtp(identifier: number, requestId: number) {
    const url = `/api/v1/contributor/${identifier}/violation-request/${requestId}/validate`;
    return this.http.get<ValidateContractResponse>(url);
  }

  /** Method to verify OTP for contract. */
  verifyOTP(identifier: number, requestId: number, xOtp: string) {
    const url = `/api/v1/contributor/${identifier}/violation-request/${requestId}/validate`;
    return this.http.get(url, { headers: { 'x-otp': xOtp }, observe: 'response' });
  }

  getESearch(registrationNo: number): Observable<EstablishmentDetails> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    return this.http.get<EstablishmentDetails>(getEstablishmentUrl);
  }

  /**Method to save document in einspection */
  submitEinspection(
    request: SubmitEEngagementPayload,
    nin: number,
    requestId: number
  ): Observable<SubmitEngagementResponse> {
    const payload: SubmitEEngagementPayload = bindToObject(new SubmitEEngagementPayload(), request);
    const url = `/api/v1/contributor/${nin}/violation-request/${requestId}/submit`;
    return this.http.patch<SubmitEngagementResponse>(url, payload);
  }

  /**Method to save document in reactivate */
  submitReactivate(
    request: SubmitEEngagementPayload,
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    transactionTraceId: number
  ): Observable<SubmitEngagementResponse> {
    const payload: SubmitEEngagementPayload = bindToObject(new SubmitEEngagementPayload(), request);
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/reactivate/${transactionTraceId}/submit`;
    return this.http.patch<SubmitEngagementResponse>(url, payload);
  }

  /**Method to save document & submit in reactivate vic */
  submitReactivateVic(
    request: SubmitEEngagementPayload,
    socialInsuranceNo: number,
    engagementId: number,
    transactionTraceId: number
  ): Observable<SubmitEngagementResponse> {
    const payload: SubmitEEngagementPayload = bindToObject(new SubmitEEngagementPayload(), request);
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/reactivate/${transactionTraceId}/submit`;
    return this.http.patch<SubmitEngagementResponse>(url, payload);
  }

  setNinEinspection(personEinspection: Person) {
    this.personEinspection = personEinspection;
  }
  getNinEinspection() {
    return this.personEinspection;
  }
  /** This method is to update the basic (personal,contact address) contributor details */
  updateContributor(
    contributorDetails: ContributorDetailsWrapper,
    registrationNo: number,
    socialInsuranceNo: number,
    personId: number,
    navigationInd?: string
  ) {
    const contPayload: SaveContributorPayload = bindToObject(new SaveContributorPayload(), contributorDetails.person); //removing un neccessary payload
    contPayload.personId = personId;
    let addContributorUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}?contributorType=${contributorDetails.contributorType}`;
    if (navigationInd) {
      addContributorUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}?contributorType=${contributorDetails.contributorType}&navigationIndicator=${navigationInd}`;
    }
    return this.http.put<null>(addContributorUrl, contPayload).pipe(catchError(err => this.handleError(err)));
  }
  /**
   * This method is to fetch the social insurance number from NIC using NIN and date of birth.
   * This method is to verify the Contributor
   */
  setSin(
    personId: number,
    registrationNo?: number,
    checkBeneficiaryStatus: boolean = false
  ): Observable<ContributorSinResponse> {
    if (personId) {
      let getContributorUrl;
      if (registrationNo && registrationNo != null && registrationNo > 0) {
        getContributorUrl = `/api/v1/establishment/${registrationNo}/contributor?personId=${personId}`;
      } else {
        getContributorUrl = `/api/v1/contributor?personId=${personId}`;
      }
      if (checkBeneficiaryStatus) getContributorUrl += `&checkBeneficiaryStatus=true`;
      return this.http.get<ContributorSinResponse>(getContributorUrl).pipe(
        tap(res => {
          if (res) this.socialInsuranceNo = res.socialInsuranceNo;
        }),
        catchError(err => this.handleError(err))
      );
    }
  }
  /** Get contributor api */
  getContributor(
    registerationNo: number,
    socialInsuranceNumber: number,
    queryMap?: Map<string, boolean>
  ): Observable<Contributor> {
    if (socialInsuranceNumber) {
      const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}`;
      let params = new HttpParams();
      if (queryMap) {
        if (queryMap.get('checkBeneficiaryStatus')) params = params.set('checkBeneficiaryStatus', 'true');
        if (queryMap.get('fetchAddressFromWasel')) params = params.set('fetchAddressFromWasel', 'true');
        if (queryMap.get('absherVerificationRequired')) params = params.set('absherVerificationRequired', 'true');
        if (queryMap.get('includeBankAccountInfo')) params = params.set('includeBankAccountInfo', 'true');
      }
      return this.http.get<Contributor>(contributorUrl, { params }).pipe(
        tap(res => {
          this.person = res.person;
          this.contributorType = res.contributorType;
        }),
        catchError(err => this.handleError(err))
      );
    }
  }

  /** Method to submit upload documents */
  submitUploadedDocuments(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    action: string,
    comments = '',
    skipContract?: boolean
  ): Observable<SubmitEngagementResponse> {
    const data = {
      comments: comments,
      skipContract: skipContract
    };
    const submitUploadedDocuments = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}?action=${action}`;
    return this.http.put<SubmitEngagementResponse>(submitUploadedDocuments, data);
  }

  /** Method to call system params api to limit joining date of an engagement */
  getSystemParams(): Observable<SystemParameterWrapper[]> {
    const url = `/api/v1/lov/system-parameters`;
    return this.http.get<SystemParameterWrapper[]>(url).pipe(catchError(err => this.handleError(err)));
  }

  /** This method is to cancel the newly added contributor if the transaction is cancelled */
  cancelAddedContributor(
    socialInsuranceNo: number,
    registrationNo: number,
    engagementId?: number,
    traceId?: number,
    isDraftRequired?: boolean
  ) {
    let params = new HttpParams();
    if (isDraftRequired) params = params.set('isDraftRequired', 'true');
    else if ((isDraftRequired == false && isDraftRequired != undefined) || isDraftRequired != null)
      params = params.set('isDraftRequired', 'false');
    const cancelContributorUrl = engagementId
      ? `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/transaction/${traceId}/cancel`
      : `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/cancel`;
    return this.http.put<null>(cancelContributorUrl, null, { params }).pipe(catchError(err => this.handleError(err)));
  }

  /** This method is to cancel the transaction for validator edit */
  revertTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo?: number,
    isDraftRequired?: boolean
  ) {
    let cancelContributorUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/revert`;
    if (referenceNo) {
      cancelContributorUrl += `?referenceNo=${referenceNo}`;
      if (isDraftRequired) cancelContributorUrl += `&isDraftRequired=true`;
      else if (isDraftRequired == false && isDraftRequired != undefined && isDraftRequired != null)
        cancelContributorUrl += `&isDraftRequired=false`;
    } else {
      if (isDraftRequired) cancelContributorUrl += `?isDraftRequired=true`;
      if (isDraftRequired == false && isDraftRequired != undefined && isDraftRequired != null)
        cancelContributorUrl += `?isDraftRequired=false`;
    }
    return this.http.put<null>(cancelContributorUrl, []).pipe(catchError(err => this.handleError(err)));
  }

  /** This method is used to get the person bank details */
  getBankDetails(regNo: number, sin: number): Observable<BankAccounts> {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/bank-account`;
    return this.http.get<BankAccounts>(url);
  }

  /** This method is used to get the person bank details */
  getViolationRequest(nin: number, referenceNo: number, transactionId: number): Observable<any> {
    const url = `/api/v1/contributor/${nin}/violation-request`;
    let params = new HttpParams();
    params = params.set('referenceNo', referenceNo.toString());
    params = params.set('transactionId', transactionId.toString());
    return this.http.get<any>(url, { params });
  }

  // this method is used to get volation details in public only
  getViolationRequestPublic(regNo: number, sin: number): Observable<any> {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}/violation-request`;
    return this.http.get<any>(url);
  }

  /** This method is used to get contributor details using social insurance number */
  getContributorBySin(socialinsuranceNo: number, options?: Map<string, boolean>): Observable<Contributor> {
    if (socialinsuranceNo) {
      const url = `/api/v1/contributor/${socialinsuranceNo}`;
      let params = new HttpParams();
      if (options) {
        if (options.get('includeBankAccountInfo')) params = params.set('includeBankAccountInfo', 'true');
        if (options.get('checkBeneficiaryStatus')) params = params.set('checkBeneficiaryStatus', 'true');
        if (options.get('fetchAddressFromWasel')) params = params.set('fetchAddressFromWasel', 'true');
        if (options.get('absherVerificationRequired')) params = params.set('absherVerificationRequired', 'true');
      }
      return this.http.get<Contributor>(url, { params }).pipe(
        tap(res => {
          this.person = res.person;
          this.contributorType = res.contributorType;
        }),
        catchError(err => this.handleError(err))
      );
    }
  }

  /** Method to get bank details workflow status of a contributor. */
  getBankDetailsWorkflowStatus(keys: Map<string, number>): Observable<BankAccount> {
    const url = keys.get('personId')
      ? `/api/v1/person/${keys.get('personId')}/change-request?type=Bank Details`
      : `/api/v1/establishment/${keys.get('regNo')}/contributor/${keys.get('sin')}/bank-update-request`;
    return this.http.get<PersonChangeRequest>(url).pipe(
      map(res => {
        if (res.changeRequestList.length > 0) {
          const bankDetails = new BankAccount();
          bankDetails.ibanAccountNo = res.changeRequestList[0].newValue;
          bankDetails.bankName = res.changeRequestList[0].bankName;
          return bankDetails;
        } else return null;
      })
    );
  }

  /**
   * This method is used to get the person bank details
   * @param personId
   */
  getBankDetailsByPersonId(personId: number): Observable<BankAccounts> {
    return this.http.get<BankAccounts>(`/api/v1/person/${personId}/bank-account`);
  }

  /** Method to verify register contributor documents. */
  verifyRegisterContributorDocuments(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/verifyDocs`;
    return this.http.post<BilingualText>(url, null);
  }

  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /** This method download and print active and inactive contributor list. */
  generateContributorReport(registrationNo: number, status: string, type: string, lan: string) {
    const generateReport = `/api/v1/establishment/${registrationNo}/contributor/report?status=${status}&exportType=${type}&language=${lan}`;
    return this.http.get(generateReport, { responseType: 'blob' });
  }
  /** This method download excel document. */
  generateContributorExcelReport(registrationNo: number, status: string, lan: string) {
    const generateReport = `/api/v1/establishment/${registrationNo}/contributor/xl-report?status=${status}&language=${lan}`;
    return this.http.get(generateReport, { responseType: 'blob' });
  }
  getContributorDetails(personId: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${personId}`;
    return this.http.get<PersonWrapperDto>(url);
  }

  getEngagementFullDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED&ignorePagination=true`;
    return this.http.get<SearchEngagementResponse>(url);
  }

  getContributorEmployersList(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/establishment-name?unique=true`;
    const employerList = new BehaviorSubject<EmployerList>(null);
    const employerList$ = employerList.asObservable();
    this.http
      .get(url)
      .pipe(catchError(err => this.handleError(err)))
      .subscribe((response: Employer[]) => {
        if (response !== undefined) {
          employerList.next(new EmployerList(response));
        } else {
          console.error('Employer list fetch failed');
        }
      });
    return employerList$;
  }
  /**

   /**
   * This method is used to fetch coverage details for an engagement
   */
  getContributoryCoverage(
    nin: number,
    engagementId: number,
    registrationNo: number
  ): Observable<CoveragePeriodWrapper> {
    const coverageUrl = `/api/v1/establishment/${registrationNo}/contributor/${nin}/engagement/${engagementId}/contribution`;
    return this.http.get<CoveragePeriodWrapper>(coverageUrl);
  }
  /**
   * This method is used to fetch coverage details for an engagement
   */
  getContributorybyEngagementIdCoverage(nin: number, engagementId: number): Observable<CoveragePeriodWrapper> {
    const coverageUrl = `/api/v1/contributor/${nin}/engagement/${engagementId}/contribution`;
    return this.http.get<CoveragePeriodWrapper>(coverageUrl);
  }

  getUserInfo(identifier: number): Observable<Contributor> {
    const url = `/api/v1/contributor/${identifier}?checkBeneficiaryStatus=true&includeBankAccountInfo=true`;
    return this.http.get<Contributor>(url);
  }

  getUserStatus(identifier: number): Observable<Contributor> {
    const url = `/api/v1/contributor/${identifier}?checkBeneficiaryStatus=true`;
    return this.http.get<Contributor>(url);
  }

  getContributionCertificate(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/last-wage-certificate`;
    return this.http.get(url);
  }

  getWagesCertificate(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/monthly-wage-certificate`;
    return this.http.get(url);
  }

  getArabicAnnuityValueCertificate(identifier: number, lang = 'ar') {
    const langHeader = new HttpHeaders({ 'Accept-Language': lang });
    const url = `/api/v1/beneficiary/${identifier}/certificate`;
    return this.http.get(url, { headers: langHeader });
  }
  getEnglishAnnuityValueCertificate(identifier: number, lang = 'ar') {
    const langHeader = new HttpHeaders({ 'Accept-Language': lang });
    const url = `/api/v1/beneficiary/${identifier}/certificate?lang=en`;
    return this.http.get(url, { headers: langHeader });
  }
  getAnnuityDetailedValueCertificate(identifier: number, lang = 'en') {
    const langHeader = new HttpHeaders({ 'Accept-Language': lang });
    const url = `/api/v1/beneficiary/${identifier}/detailed-certificate`;
    return this.http.get(url, { headers: langHeader });
  }
  getObligationOfTransferringBenefitsCertificate(identifier: number) {
    const url = `/api/v1/beneficiary/${identifier}/bank-hold-certificate`;
    return this.http.get(url);
  }

  getObligationOfTransferringBenefitsCertificateBySin(sin: number) {
    const url = `/api/v1/beneficiary/${sin}/bank-account/add-commitment/certificate/individual`;
    return this.http.get(url);
  }

  getContractDetails(nin: number, registrationNo: number, engagementId: number) {
    const contractUrl = `/api/v1/contributor/${nin}/contract?registrationNo=${registrationNo}&engagementId=${engagementId}`;
    return this.http.get<ContractWrapper>(contractUrl);
  }
  getViewContractDetails(socialInsuranceNo: number, registrationNo: number, engagementId: number) {
    const contractViewUrl = `/api/v1/contributor/${socialInsuranceNo}/contract?registrationNo=${registrationNo}&engagementId=${engagementId}`;
    return this.http.get<ContractWrapper>(contractViewUrl);
  }
  getPreviewContractDetails(socialInsuranceNo: number, registrationNo: number, contractId: number) {
    const contractViewUrl = `/api/v1/contributor/${socialInsuranceNo}/contract?registrationNo=${registrationNo}&contractId=${contractId}`;
    return this.http.get<ContractWrapper>(contractViewUrl);
  }
  fetchContratClause(socialInsuranceNo: number, engagementId: number, contractId: number, registrationNo: number) {
    const contractClauseUrl = `/api/v1/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/clauses?registrationNo=${registrationNo}`;
    return this.http.get<ClausesWrapper>(contractClauseUrl);
  }
  getIndividualContDetails(socialInsuranceNo: number) {
    const contributorUrl = `/api/v1/contributor/${socialInsuranceNo}`;
    return this.http.get<Contributor>(contributorUrl);
  }
  downloadContracts(socialInsuranceNo: number, engagementId: number, contractId: number, registrationNo: number) {
    const url = `/api/v1/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/report?registrationNo=${registrationNo}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getEngagementDetails(socialInsuranceNumber: number, engagementId: number): Observable<EngagementDetails> {
    const contributorUrl = `/api/v1/contributor/${socialInsuranceNumber}/engagement/${engagementId}`;
    return this.http.get<EngagementDetails>(contributorUrl);
  }

  getBillNumber(nin: number, startDate: string, pageLoad?: boolean): Observable<BillSummaryWrapper> {
    let billHistory = `/api/v1/contributor/${nin}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/contributor/${nin}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillSummaryWrapper>(billHistory);
  }
  getBillYearAndMonths(nin: number): Observable<BillPeriods> {
    let url = `/api/v1/contributor/${nin}/bill/bill-periods`;
    return this.http.get<BillPeriods>(url);
  }

  // This method is used to get vic bill breakup details *
  getVicBillBreakup(nin: number, billNo: number): Observable<BillDetails> {
    return this.http.get<BillDetails>(`/api/v1/contributor/${nin}/bill/${billNo}/bill-summary`);
  }

  /** Method to get VIC engagement by id. */
  getVicEngagementById(socialInsuranceNo: number, engagementId: number): Observable<VicEngagementDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}`;
    return this.http.get<VicEngagementDetails>(url);
  }

  /** Method to get vic contribution details */
  getVicContributionDetails(nin: number, engagementId: number): Observable<VicContributionDetails> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/contribution-details`;
    return this.http.get<VicContributionDetails>(url);
  }

  getEngagementFilterDetails(identifier: number, filterParam: EngagementFilter) {
    let url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED&ignorePagination=true`;

    if (filterParam?.occupation?.length > 0) {
      filterParam?.occupation?.forEach(key => {
        url = url + `&filterCriteria.occupation=${key.code}`;
      });
    }
    if (filterParam?.startDate) {
      url = url + `&filterCriteria.startDate=${filterParam.startDate}`;
    }
    if (filterParam?.endDate) {
      url = url + `&filterCriteria.endDate=${filterParam.endDate}`;
    }
    if (filterParam?.estName) {
      url = url + `&filterCriteria.establishmentName=${filterParam.estName}`;
    }
    if (filterParam?.engagementType) {
      filterParam.engagementType.map((value: BilingualText) => {
        url += `&filterCriteria.engagementTypes=${value.english.toUpperCase()}`;
      });
    }
    if (filterParam?.engagementStatus) {
      filterParam.engagementStatus.map((value: BilingualText) => {
        url += `&filterCriteria.engagementStatuses=${value.english.toUpperCase()}`;
      });
    }
    if (filterParam?.employer?.length > 0) {
      // filterParam?.employer?.forEach(key => {
      //   url = url + `&filterCriteria.establishmentsList=${key?.value?.english}`;
      // });
      filterParam?.employer?.map((value: BilingualText) => {
        url = url + `&filterCriteria.establishmentsList=${value.english}`;
      });
    }
    return this.http.get<SearchEngagementResponse>(url);
  }
  /** This method download excel document for all contributor engagement. */
  generateContributorEngagementExcelReport(socialInsuranceNo: number, lan: string) {
    const generateReport = `/api/v1/contributor/${socialInsuranceNo}/all-engagement-detail-report?language=${lan}`;
    return this.http.get(generateReport, { responseType: 'blob' });
  }
  /**This method is to get coverage values */
  getModifyCoverage(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    periodStartDate: string,
    periodEndDate: string
  ): Observable<CoverageDetails> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/wage-coverage-eligibility`;
    //peroidStartDate and peroidEndDate
    let params = new HttpParams();
    // Check if the 'periodStartDate' option is set in the map and add it to the query parameters
    if (periodStartDate) {
      params = params.set('periodStartDate', periodStartDate);
    }
    // Check if the 'periodEndDate' option is set in the map and add it to the query parameters

    if (periodEndDate) {
      params = params.set('periodEndDate', periodEndDate);
    } else {
      params = params.set('periodEndDate', null);
    }
    // Send the HTTP GET request with the URL and the query parameters
    return this.http.get<CoverageDetails>(url, { params });
  }

  /**This method is to get coverage values */
  updateModifyCoverage(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    modifyCoverage: ModifyCoverage
  ): Observable<TransactionResponse> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/update-wage-coverage`;
    return this.http.put<TransactionResponse>(url, modifyCoverage);
  }

  setPersonIdentifier(identifier: number) {
    this.personIdentifier = identifier;
  }

  getPersonIdentifier() {
    return this.personIdentifier;
  }
  /** api to get modify person details for transaction tracking */
  getNewChangeRequestDetails(identifier: number, referenceNo: number): Observable<ModifyRequestList> {
    let url = `/api/v1/profile/${identifier}/modify-person/${referenceNo}/change-details`;

    return this.http.get<ModifyRequestList>(url);
  }

  /** This method is to cancel E-inspection registration if the transaction is cancelled */
  cancelTransaction(ninNumber: number, requestId: number) {
    const url = `/api/v1/contributor/${ninNumber}/violation-request/${requestId}/cancel`;
    return this.http.put<null>(url, null);
  }

  getEngagementSummary(ninNumber: number): Observable<any> {
    const url = `/api/v1/ppa-contributor/${ninNumber}/engagement-summary`;
    return this.http.get<any>(url);
  }
  checkEligibility(ninNumber: number): Observable<IPensionReformEligibility> {
    const url = `/api/v1/ppa-contributor/${ninNumber}/pension-reform-eligibility`;
    return this.http.get<IPensionReformEligibility>(url);
  }
  /**
   * JobClassList For PPA
   * @param jobScaleType
   * @returns
   */
  getJobClass(jobScaleCode: number): Observable<classDetails[]> {
    let url = `/api/v1/contributor-job-scale/${jobScaleCode}/job-class`;
    return this.http.get<classDetails[]>(url);
  }

  /**
   * JobRankList for PPA
   * @param jobScaleType
   * @param jobClassCode
   * @returns
   */
  getRank(jobScaleCode: number, jobClassCode: number): Observable<rankDetails[]> {
    let url = `/api/v1//contributor-job-scale/${jobScaleCode}/job-class/${jobClassCode}/job-rank`;
    return this.http.get<rankDetails[]>(url);
  }

  /**
   * JobGradeList For PPA
   * @param jobScaleCode
   * @param jobClassCode
   * @param jobRankCode
   * @returns
   */
  getGrade(jobScaleCode: number, jobClassCode: number, jobRankCode: number): Observable<gradeDetails[]> {
    let url = `/api/v1/contributor-job-scale/${jobScaleCode}/job-class/${jobClassCode}/job-rank/${jobRankCode}/job-grade`;
    return this.http.get<gradeDetails[]>(url);
  }

  // exportEngagementPeriods(socialInsuranceNo: number, engagementId: number, lan: string, registrationNo: number,) {
  //   const url = `/api/v1/contributor/${socialInsuranceNo}/engagement-detail-report?engagements=${engagementId}&exportType=xlsx&language=${lan}&registrationNumbers=${registrationNo}`;
  //   return this.http.get(url, { responseType: 'blob' });
  // }
  // exportEngagementPeriods(socialInsuranceNo: number, engagementId: number[], lan: string, registrationNo: number,) {
  //   const url = `/api/v1/contributor/${socialInsuranceNo}/engagement-detail-report?engagements=108653700&engagements=108653600&exportType=xlsx&language=${lan}&registrationNumbers=${registrationNo}`;
  //   return this.http.get(url, { responseType: 'blob' });
  // }
  exportEngagementPeriods(socialInsuranceNo: number, engagementId: number[], lan: string, registrationNo: number) {
    let url = `/api/v1/contributor/${socialInsuranceNo}/engagement-detail-report?exportType=xlsx&language=${lan}`;
    if (engagementId?.length > 0) {
      engagementId?.forEach(key => {
        url = url + `&engagements=${key}`;
      });
    }
    if (registrationNo) {
      url = url + `&registrationNumbers=${registrationNo}`;
    }

    return this.http.get(url, { responseType: 'blob' });
  }
  exportAllEngagementPeriods(socialInsuranceNo: number, lan: string, registrationNo: number) {
    const url = `/api/v1/contributor/${socialInsuranceNo}/engagement-detail-report?exportType=xlsx&language=${lan}&registrationNumbers=${registrationNo}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getPersonCompareDetails(personId): Observable<PersonDetailsDTO> {
    const url = `/api/v1/person/${personId}/person-details-change`;
    return this.http.get<PersonDetailsDTO>(url);
  }
  getEligibleNonSaudi(regNo:number,identifier:number): Observable<NonSaudiEligibilityResponse> {
    let url = `/api/v1/establishment/${regNo}/contributor/${identifier}/eligibility`;
    return this.http.get<NonSaudiEligibilityResponse>(url)
  }

  getRpaDetails(sin, id): Observable<SearchEngagementResponse> {
    const url = `/api/v1/contributor/${sin}/rpa-request?transactionTraceId=${id}`;
    return this.http.get<SearchEngagementResponse>(url);
  }

  checkEligibilityNin(ninNumber: number): Observable<pensionReformEligibility> {
    const url = `/api/v1/contributor/${ninNumber}/pension-reform-eligibility`;
    return this.http.get<pensionReformEligibility>(url);
  }

  /** Method to reject reg cont ind for ppa*/
  submitAdminReject(
    estRegisterNo: number,
    identifier: number,
    requestId: number
  ): Observable<ValidateContractResponse> {
    const url = `/api/v1/establishment/${estRegisterNo}/contributor/${identifier}/violation-request/${requestId}/validate`;
    return this.http.get<ValidateContractResponse>(url);
  }
  /** Method to reject reg cont ind for ppa*/
  submitAdminApprove(
    estRegisterNo: number,
    identifier: number,
    requestId: number
  ): Observable<ValidateContractResponse> {
    const url = `/api/v1/establishment/${estRegisterNo}/contributor/${identifier}/violation-request/${requestId}/validate`;
    return this.http.get<ValidateContractResponse>(url);
  }
}
