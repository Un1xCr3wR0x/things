/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Contributor,
  bindToObject,
  BilingualText,
  GosiCalendar,
  RouterConstants,
  Person,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  LookupService,
  LovList,
  Lov,
  DocumentItem,
  convertToYYYYMMDD,
  PersonWrapperDto,
  ItTicketRequest,
  Role,
  ItTicketV2Request, BPMMergeUpdateParamEnum, Channel, RouterData
} from '@gosi-ui/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import {
  BeneficiaryDetails,
  BenefitResponse,
  BenefitDetails,
  AnnuityBenefitRequest,
  Benefits,
  AnnuityResponseDto,
  PersonalInformation,
  DisabilityDetails,
  ContributorSearchResult,
  BenefitRecalculation,
  PaymentDetail,
  PaymentHistoryFilter,
  SearchPersonalInformation,
  CreditBalanceDetails,
  BeneficiaryBenefitDetails,
  SimisBenefit,
  MainframeBenefit,
  SimisSanedPaymentHistory
} from '../models';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AttorneyDetailsWrapper } from '../models/attorney-details-wrapper';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
import { AuthorizationDetailsDto } from '../models/authorization-details';
import { hasvalidValue } from '../utils';
import { ProfileWrapper } from '@gosi-ui/foundation-dashboard/lib/individual-app/models/profile-wrapper';
import { SubmitModifyPersonDetails } from '@gosi-ui/features/customer-information/lib/shared/models/add-modify-person-details';

@Injectable({
  providedIn: 'root'
})
export class ManageBenefitService {
  /**
   * Local Variables
   */

  registrationNo: number;
  socialInsuranceNo: number;
  requestId: number;
  authPersonId: number;
  requestDate: GosiCalendar;
  certificateExpiryDate?: GosiCalendar;
  private assessmentidentity = new BehaviorSubject<any>(null);
  assessmentidentity$ = this.assessmentidentity.asObservable();

  private _contributorSubject: BehaviorSubject<Contributor> = new BehaviorSubject(null);
  verifyPersonUrl: string;
  private baseUrl = `/api/v1/contributor`;
  private lovUrl = '/api/v1/lov';
  eligibleAnnuityListUrl: string;
  contributor$: Observable<Contributor>;
  payeeNationality: string;
  nin: number;
  personId: any;
  isValidator: boolean;
  constructor(
    private http: HttpClient,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly lookupService: LookupService
  ) {
    this.contributor$ = this._contributorSubject
      .asObservable()
      .pipe(map(contributor => bindToObject(new Contributor(), contributor)));
  }

  //Setter method for person id
  setPersonId(personId: number) {
    this.personId = personId;
  }
  //Getter method for personId
  getPersonId() {
    return this.personId;
  }

  /**
   * This method is used to get the engagement status of contributor
   * @param personId
   */
  getContributorDetails(personId: number, effectiveDate?: string): Observable<ContributorSearchResult> {
    const url = `/api/v1/contributor`;
    let params = new HttpParams();
    if (effectiveDate) {
      params = params.set('effectiveDate', effectiveDate);
    }
    params = params.set('personId', personId.toString());
    return this.http.get<ContributorSearchResult>(url, { params });
  }
  /**
   * fetching the Annuity Benefits list
   */
  public getAnnuityBenefits(socialInsuranceNumber: number): Observable<Benefits[]> {
    this.eligibleAnnuityListUrl = `${this.baseUrl}/${socialInsuranceNumber}/benefit/eligibility`;
    return this.http.get(this.eligibleAnnuityListUrl).pipe(
      map(res => {
        return <Benefits[]>res;
      })
    );
  }
  /**
   * fetching the Occ Benefits list
   */
  getOccBenefits(): Observable<Benefits> {
    const dummyOccEligibility = 'assets/data/occ-eligibility.json';
    return this.http.get(dummyOccEligibility).pipe(
      map(res => {
        return <Benefits>res;
      })
    );
  }

  /** This method is to get personId
   * @param identifier
   */
  getPersonIdentifier(identifier: number) {
    const url = `/api/v1/person`;
    let params = new HttpParams();
    if (identifier) {
      const firstDigit = Number(String(identifier).charAt(0));
      if (firstDigit === 1) {
        params = params.set('NIN', identifier.toString());
      } else if (firstDigit === 2) {
        params = params.set('iqamaNo', identifier.toString());
      } else if (firstDigit === 3 || firstDigit === 4 || firstDigit === 5 || firstDigit === 6 || firstDigit === 7) {
        params = params.set('borderNo', identifier.toString());
      }
    }
    return this.http.get<PersonWrapperDto>(url, { params });
  }
  getProfileDetails(identifier: number) {
    if (identifier) {
      const url = `/api/v1/profile/${identifier}`;
      return this.http.get<ProfileWrapper>(url);
    }
  }
  /**
   * This method is used to get the attorney details
   * @param id
   */
  getAttorneyDetailsForId(id: number, status: string) {
    //Chance to remove this api
    const url = `/api/v1/person/${id}/attorney?status=${status}`;
    return this.http.get<AttorneyDetailsWrapper[]>(url);
  }
  /**
   * This method is used to get the attorney details(new API)
   * @param id
   */
  getAttorneyDetails(id: number) {
    const url = `/api/v1/person/${id}/authorization`; //new API
    return this.http.get<AuthorizationDetailsDto>(url);
  }
  //getIdentity 
  assessmentidentityvalue(data : any){
    this.assessmentidentity.next(data);
  }
  /**
   * To get saved attorney details in edit flow
   * @param sin
   * @param benefitRequestId
   */
  getSelectedAuthPerson(sin: number, benefitRequestId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/attorney`;
    return this.http.get<AttorneyDetailsWrapper[]>(url);
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
  /**
   * This method is used to apply for benefit
   * @param sin
   * @param appType
   * @param benefitType
   * @param requestData
   */
  applyForBenefit(sin: number, appType: boolean, benefitType?: string, requestData?: AnnuityBenefitRequest) {
    if (sin) {
      const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {
        headers: httpHeaders
      };
      const url = `/api/v1/contributor/${sin}/benefit?benefitType=${benefitType}`;

      return this.http.post<BenefitResponse>(url, requestData, options);
    }
  }
  /**
   * This method is used to apply for benefit
   * @param sin
   * @param benefitRequestId
   * @param benefitType
   * @param requestData
   */
  updateForAnnuityBenefit(
    sin: number,
    benefitRequestId: number,
    benefitType?: string,
    requestData?: AnnuityBenefitRequest
  ) {
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    return this.http.put<BenefitResponse>(url, requestData, options);
  }
  updateWithAnnualNotif(
    sin: number,
    benefitRequestId: number,
    benefitType?: string,
    requestData?: AnnuityBenefitRequest
  ) {
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers: httpHeaders
    };
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/annual-notification`;
    return this.http.put<BenefitResponse>(url, requestData, options);
  }
  /* Method to get benefit details */
  getBenefitDetails(sin, benefitRequestId): Observable<AnnuityResponseDto> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    return this.http.get<AnnuityResponseDto>(url);
  }
  deleteTransaction(sin, benefitRequestId, referenceNo?) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/delete`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.put<any>(url, null, { params });
  }
  /* Method to get benefit recalculation */
  getBenefitRecalculation(
    sin: number,
    benefitRequestId: number,
    referenceNo?: number,
    reason?: string
  ): Observable<BenefitRecalculation> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/recalculation`;
    let params = new HttpParams();
    if (reason) {
      params = params.append('reason', reason);
    }
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<BenefitRecalculation>(url, { params });
  }
  /* Method to get Contributor Person details */
  getContributorPersonDetails(personId: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${personId}`;
    return this.http.get<PersonWrapperDto>(url);
  }
  /**
   *
   * @param addressDetails  Saving the address details
   * @param personId
   */
  updateAddress(personId, personDetails: PersonalInformation) {
    const addPersonUrl = `/api/v1/person/${personId}`;
    return this.http.put<Person>(addPersonUrl, personDetails);
  }
  submitPersonalDetails(identifier: number, request): Observable<SubmitModifyPersonDetails> {
    const url = `/api/v1/profile/${identifier}`;
    return this.http.put<SubmitModifyPersonDetails>(url, request);
  }
  /**
   * This method is used to revert benefit
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   */
  revertAnnuityBenefit(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId) {
      let payload;
      if (referenceNo) {
        payload = {
          referenceNo: referenceNo
        };
      }
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/revert`;
      return this.http.put<null>(url, payload);
    }
  }
  /** Method to filter payment history */
  filterPaymentHistory(socialInsuranceNo, benefitRequestId, paymentHistoryFilter: PaymentHistoryFilter) {
    let filterUrl = `/api/v1/contributor/${socialInsuranceNo}/benefit/${benefitRequestId}/payment-detail?`;
    const paymentEvents = paymentHistoryFilter.paymentEvents;
    const paymentStatus = paymentHistoryFilter.paymentStatus;
    let startDate = null;
    let endDate = null;
    let paramExists = false;
    if (paymentHistoryFilter.benefitPeriodFrom && paymentHistoryFilter.benefitPeriodTo) {
      startDate = convertToYYYYMMDD(paymentHistoryFilter.benefitPeriodFrom.toString());
      endDate = convertToYYYYMMDD(paymentHistoryFilter.benefitPeriodTo.toString());
    }
    if (hasvalidValue(paymentEvents)) {
      for (let i = 0; i < paymentEvents.length; i++) {
        if (paramExists) {
          const statusParam = `&paymentEventTypes=${paymentEvents[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `paymentEventTypes=${paymentEvents[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&paymentEventTypes=${paymentEvents[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (hasvalidValue(paymentStatus)) {
      for (let i = 0; i < paymentStatus.length; i++) {
        if (paramExists) {
          const statusParam = `&status=${paymentStatus[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `status=${paymentStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&status=${paymentStatus[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (startDate && endDate) {
      if (paramExists) {
        const dateParam = `&startDate=${startDate}&endDate=${endDate}`;
        filterUrl = filterUrl.concat(dateParam);
      } else {
        const dateParam = `startDate=${startDate}&endDate=${endDate}`;
        filterUrl = filterUrl.concat(dateParam);
        paramExists = true;
      }
    }
    return this.http.get<PaymentDetail>(filterUrl);
  }
  /**method to fetch stop reason Lov list */
  getStopReasonLovList(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=ANNUITIES&domainName=StopBenefitReason`;
    return this.http.get<Lov[]>(url);
  }
  /**method to fetch hold reason Lov list */
  getHoldReasonLovList(): Observable<Lov[]> {
    const url = `/api/v1/lov?category=ANNUITIES&domainName=HoldBenefitReason`;
    return this.http.get<Lov[]>(url);
  }
  /**
   * This method is to fetch payment filter event types values.
   */
  getPaymentFilterEventType(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'AnnuityPaymentFilterEventType'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  /**
   * This method is to fetch payment filter status types values.
   */
  getPaymentFilterStatusType(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'AnnuityPaymentFilterStatus'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  getPaymentFilterStatusTypes(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'REGISTRATION',
          domainName: 'Payable Payment Status'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  getPaymentFilterBenefitType(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'AnnuityBenefitType'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }
  patchAnnuityBenefit(sin: number, benefitRequestId: number, comment: { comments: string }, referenceNo: number) {
    if (sin) {
      const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {
        headers: httpHeaders
      };
      let payload;
      if (comment) {
        payload = { comments: comment.comments || '', referenceNo: referenceNo, backdated: true };
      } else {
        payload = { referenceNo: referenceNo, backdated: true };
      }
      const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
      return this.http.patch<BenefitResponse>(url, payload, options);
    }
  }
  /**
   * This method is used to get the benefit calculation details by passing  benefitRequestId
   * @param sin
   * @param benefitRequestId
   *
   */
  getBenefitCalculationDetailsByRequestId(sin: number, benefitRequestId: number, referenceNo?: number) {
    let url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/calculate`;
    if (referenceNo > 0) {
      url = url + `?referenceNo=${referenceNo}`;
    }
    return this.http.get<BenefitDetails>(url);
  }
  /**
   * This method is used to get the benefit calculation details by passing  benefitRequestId
   * @param sin
   * @param benefitRequestId
   *
   */
  getUiCalculationDetailsByRequestId(sin: number, benefitRequestId: number) {
    const url = `/api/v1/contributor/${sin}/ui/calculate?benefitRequestId=${benefitRequestId}`;
    return this.http.get<BenefitDetails>(url);
  }
  /**
   * This method is to get contibutor details
   * @param registrationNo
   * @param socialInsuranceNo
   */
  getContributor(registrationNo, socialInsuranceNo): Observable<Contributor> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    return this.http.get<Contributor>(url);
  }
  /**
   * @param requestId
   * @param registrationNumber
   * @param socialInsuranceNo  set values for personId and socialInsuranceNo
   */
  setValues(registrationNumber: number, socialInsuranceNo: number, requestId: number) {
    this.socialInsuranceNo = socialInsuranceNo;
    this.registrationNo = registrationNumber;
    this.requestId = requestId;
  }
  /**
   * Method to handle workflow actions of annuity request.
   * @param data workflow data
   */
  updateAnnuityWorkflow(
    data: BPMUpdateRequest,
    reasonForLateRequest?: boolean,
    nonOccSectionManagerApproval?: boolean,
    routerData = new RouterData()
  ) {
    if (
      data.outcome === WorkFlowActions.SEND_FOR_INSPECTION ||
      (
        data?.assignedRole !== Role.FC_APPROVER_ANNUITY &&
        data?.assignedRole !== Role.CNT_FC_APPROVER &&
        data?.assignedRole !== 'FC Approver' &&
        data.outcome === WorkFlowActions.REJECT
      ) ||
      data.outcome === WorkFlowActions.REQUEST_ITSM ||
      (
        data?.assignedRole !== Role.FC_APPROVER_ANNUITY &&
        data?.assignedRole !== Role.CNT_FC_APPROVER &&
        data?.assignedRole !== 'FC Approver' &&
        data.outcome === WorkFlowActions.RETURN
      ) ||
      // reasonForLateRequest ||
      nonOccSectionManagerApproval ||
      (
        routerData.channel?.toLowerCase() === Channel.TAMINATY.toLowerCase() &&
        routerData.assignedRole === Role.VALIDATOR_1
      )
    ) {
      // To show comments in Taminaty app
      data.isExternalComment =
        (
          routerData.channel?.toLowerCase() === Channel.TAMINATY.toLowerCase() &&
          routerData.assignedRole === Role.VALIDATOR_1 &&
          data.updateMap.get(BPMMergeUpdateParamEnum.RETURN_ROLE) !== Role.VC
        ) ? true : false;
      return this.workflowService.mergeAndUpdateTask(data);
    } else {
      data.isExternalComment= false;
      return this.workflowService.updateTaskWorkflow(data);
    }
  }
  /** Method to send request inspection in recalculation */
  sendRequestInspection(data: BPMUpdateRequest) {
    return this.workflowService.updateTaskWorkflow(data, WorkFlowActions.SEND_FOR_INSPECTION);
  }
  /*
   * Getter method for  requestDate
   */
  getRequestDate() {
    return this.requestDate;
  }
  /**
   * Setter method for requestDate
   */
  setRequestDate(reqDate) {
    this.requestDate = reqDate;
  }
  /**
   * api to get payment details and payment history
   * @param socialInsuranceNo
   * @param benefitRequestId
   */
  getPaymentDetails(socialInsuranceNo, benefitRequestId) {
    const url = `/api/v1/contributor/${socialInsuranceNo}/benefit/${benefitRequestId}/payment-detail`;
    // let url = '../../../assets/data/payment-history-details.json';
    return this.http.get<PaymentDetail>(url);
  }
  getReqDocs() {
    const url = `../../../assets/data/req-documents.json`;
    return this.http.get<DocumentItem[]>(url);
  }
  /**
   * This method is used to get the benefit details
   * @param sin
   */
  getAnnuityBenefitCalculations(
    sin: number,
    benefitType: string,
    requestDate?: GosiCalendar
  ): Observable<BenefitDetails> {
    const url = `/api/v1/contributor/${sin}/benefit/calculate?benefitType=${benefitType}`;
    let params = new HttpParams();
    if (requestDate) {
      const reqDate = moment(requestDate.gregorian).format('YYYY-MM-DD');
      params = params.set('requestDate', reqDate.toString());
    }
    return this.http.get<BenefitDetails>(url, { params });
  }
  /**
   * This method is used to get the lumpsum benefit request details
   * @param sin
   * @param benefitRequestId
   */
  getAnnuityBenefitRequestDetail(sin: number, benefitRequestId: number, referenceNo: number) {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}`;
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<AnnuityResponseDto>(url, { params });
  }
  /**
   * This method is to navigate to the inbox
   */
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**Method to call api to verify and fetch contributor details
   * @param queryParam
   */
  getPersonDetailsApi(queryParam: string): Observable<SearchPersonalInformation> {
    const url = `/api/v1/person?${queryParam}`;
    return this.http.get<SearchPersonalInformation>(url).pipe(catchError(err => this.handleError(err)));
  }
  /** getting personal details by person Id  */
  getPersonDetailsWithPersonId(personId: string): Observable<PersonalInformation> {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(url).pipe(catchError(err => this.handleError(err)));
  }
  /** getting system run date  */
  getSystemRunDate(): Observable<GosiCalendar> {
    return this.http.get<GosiCalendar>(`/api/v1/calendar/run-date`).pipe(catchError(err => this.handleError(err)));
  }
  /**
   * Method to handle error while service call fails
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  /** method to fetch benefit history */
  getAllBenefitHistory(sin: number, annuityType?: string[]) {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit`;
    if (annuityType.length) {
      annuityType.forEach(eachType => {
        params = params.append('benefitTypeList', eachType);
      });
    }
    return this.http.get<null>(url, { params });
  }
  /** method to fetch occ benefit history */
  getAllOccBenefitHistory(sin: number, occType?: string[]) {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit`;
    if (occType.length) {
      occType.forEach(eachType => {
        params = params.append('benefitTypeList', eachType);
      });
    }
    return this.http.get<null>(url, { params });
  }
  /** method to fetch ui benefit history */
  getAllUiHistory(sin: number) {
    const url = `/api/v1/contributor/${sin}/ui`;
    return this.http.get<null>(url);
  }
  /** method to update disability details */
  updateDisabilityDetails(sin: number, requestId: number, disabilityDetails: DisabilityDetails) {
    const url = `/api/v1/contributor/${sin}/benefit/${requestId}/disability-details`;
    if (sin) {
      const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
      const options = {
        headers: httpHeaders
      };
      let payload;
      payload = {
        disabilityDate: { gregorian: disabilityDetails?.disabilityDate?.gregorian },
        helperNeeded: disabilityDetails?.isHelpRequired,
        disabilityPercentage: disabilityDetails?.disabilityPct,
        disabled: disabilityDetails.disabledB
      };
      return this.http.put<null>(url, payload, options);
    }
  }
  /**
   * This method is to get system parameters.
   */
  getSystemParams(): Observable<SystemParameterWrapper[]> {
    const url = `/api/v1/lov/system-parameters`;
    return this.http.get<SystemParameterWrapper[]>(url).pipe(catchError(err => this.handleError(err)));
  }

  searchContributor(regNo, sin): Observable<Contributor> {
    const url = `/api/v1/establishment/${regNo}/contributor/${sin}`;
    return this.http.get<Contributor>(url);
  }
  /**
   *
   * @param sin
   * @param benefitRequestId
   * @param personId
   */
  getModificationReason(sin: number, benefitRequestId: number, personId: number, actionType?: string) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/modification-reason`;
    let params = new HttpParams();
    params = params.set('personId', personId.toString());
    if (actionType) {
      params = params.set('actionType', actionType);
    }
    return this.http.get<BilingualText[]>(url, { params });
  }
  updateLateRequest(sin: number, benefitRequestId: number, bypassLateRequest = false, referenceNo: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/late-request?bypass=${bypassLateRequest}`;
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let params = new HttpParams();
    const options = {
      headers: httpHeaders
    };
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.put<null>(url, options, { params });
  }

  //Method to get contributor Refund details
  getContirbutorRefundDetails(sin: number, status: boolean, startDate?: Date) {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', convertToYYYYMMDD(startDate.toDateString()));
    }
    return this.http.get<CreditBalanceDetails>(`/api/v1/vic/${sin}/account?cancel=${status}`, { params });
  }
  getContributorCreditBalance(nin: number) {
    return this.http.get<CreditBalanceDetails>(`/api/v1/contributor/${nin}/bill?includeBreakUp=true`);
  }
  /**
   * This method is used to get the lumpsum benefit request details
   * @param sin
   * @param benefitRequestId
   */
  getAnnuityBenefitBeneficiaryRequestDetail(sin: number, benefitRequestId: number, referenceNo: number) {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/beneficiary`;
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<BeneficiaryBenefitDetails>(url, { params });
  }

  /*
   * Getter method for  PayeeNationality
   */
  getPayeeNationality() {
    return this.payeeNationality;
  }

  getNin() {
    return this.nin;
  }
  /**
   * Setter method for nin
   */
  setNin(nin) {
    this.nin = nin;
  }
  getCertificateExpiryDate() {
    return this.certificateExpiryDate;
  }
  setCertificateExpiryDate(expiryDate) {
    this.certificateExpiryDate = expiryDate;
  }

  getSimisPaymentHistory(sin: number, benefitRequestId: number, personId: number): Observable<Array<SimisBenefit>> {
    return this.http.get<Array<SimisBenefit>>(
      `${this.baseUrl}/${sin}/benefit/${benefitRequestId}/simis-payment?personId=${personId}`
    );
  }

  getMainframePaymentHistory(sin: number, benefitRequestId: number): Observable<Array<MainframeBenefit>> {
    return this.http.get<Array<MainframeBenefit>>(`${this.baseUrl}/${sin}/benefit/${benefitRequestId}/mf-payment`);
  }

  raiseItTicket(request: ItTicketV2Request) {
    return this.workflowService.raiseItTicketV2(request);
  }
  setIsValidator(isValidator: boolean) {
    this.isValidator = isValidator;
  }
  getIsValidator() {
    return this.isValidator;
  }
}
