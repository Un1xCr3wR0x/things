/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, GosiCalendar, TransactionFeedback } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject, Observable, forkJoin, iif, of, throwError } from 'rxjs';
import { catchError, filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { EngagementType, SearchTypeEnum } from '../enums';
import {
  ChangeEngagementResponse,
  ContractWrapper,
  Coverage,
  CoveragePeriod,
  CoveragePeriodWrapper,
  EngagementBasicDetails,
  EngagementDetails,
  EngagementPeriod,
  EngagementResponse,
  Establishment,
  ReactivateEngagementDetails,
  SearchEngagementResponse,
  TransactionResponse,
  UpdatedWageDetails,
  UpdatedWageListResponse,
  VicContributionDetails
} from '../models';
import { ReactivateEligibilityDetails } from '../models/reactivate-eligibility';
@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to handle services realted to manage wage
 */
export class ManageWageService {
  /**Local variable */
  private _registrationNo: number;
  private _socialInsuranceNo: number;
  private _engagementId: number;
  private _unifiedProfileIndicator = false;
  private _ppaIndicator = false;
  private currentEngagment: EngagementDetails;
  private _referenceNo: number;
  private _draftNeeded = false;
  private _contractId: number;
  private establishment: Establishment;

  /**
   * This method is to create a service
   * @param http
   */
  constructor(private http: HttpClient) {}

  /**
   * Method to set establishment reg no to local variable
   * @param registrationNo
   */
  set registrationNo(registrationNo) {
    this._registrationNo = registrationNo;
  }

  /**
   * Get registration number
   */
  get registrationNo(): number {
    return this._registrationNo;
  }

  get socialInsuranceNo(): number {
    return this._socialInsuranceNo;
  }

  get engagementId(): number {
    return this._engagementId;
  }

  set socialInsuranceNo(sin: number) {
    this._socialInsuranceNo = sin;
  }

  set engagementId(id: number) {
    this._engagementId = id;
  }

  get unifiedProfileIndicator(): boolean {
    return this._unifiedProfileIndicator;
  }

  set unifiedProfileIndicator(flag: boolean) {
    this._unifiedProfileIndicator = flag;
  }

  get isPpa(): boolean {
    return this._ppaIndicator;
  }

  set isPpa(flag: boolean) {
    this._ppaIndicator = flag;
  }
  set referenceNo(referenceNo: number) {
    this._referenceNo = referenceNo;
  }

  get referenceNo(): number {
    return this._referenceNo;
  }

  set contractId(contractId: number) {
    this._contractId = contractId;
  }

  get contractId(): number {
    return this._contractId;
  }

  get draftNeeded(): boolean {
    return this._draftNeeded;
  }

  set draftNeeded(flag: boolean) {
    this._draftNeeded = flag;
  }
  /**
   * THis setter method for current engagement
   * @param engagement
   */
  set setCurrentEngagment(engagement: EngagementDetails) {
    this.currentEngagment = engagement;
  }

  /**
   * This getter method to fetch current engagement details
   */
  get getCurrentEngagment(): EngagementDetails {
    return this.currentEngagment;
  }
  set setEstablishment(establishment: Establishment) {
    this.establishment = establishment;
  }
  get getEstablishment(): Establishment {
    return this.establishment;
  }
  getContractDetails(regNo: number, sin: number, engagementId: number) {
    const getEngagementUrl = `/api/v1/establishment/${regNo}/contributor/${sin}/contract?engagementId=${engagementId}&pageSize=4&pageNo=0`;
    return this.http.get<ContractWrapper>(getEngagementUrl);
  }
  /**
   * This method is used to fetch current engagement list
   * @param sin
   * @param registrationNo
   * @param param
   */
  getEngagements(sin: number, registrationNo: number, param: string): Observable<EngagementDetails[]> {
    const getEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement?searchType=${param}`;
    return this.http.get<EngagementResponse>(getEngagementUrl).pipe(
      pluck('engagements'),
      tap(engagements => {
        if (param === SearchTypeEnum.ACTIVE) {
          this.currentEngagment = engagements[0];
        }
      })
    );
  }
  getEngagementsreactivate(
    registrationNo: number,
    sin: number,
    engagementId: number
  ): Observable<ReactivateEngagementDetails> {
    const getEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/reactivate`;
    return this.http.get<ReactivateEngagementDetails>(getEngagementUrl);
  }

  getEngagementsreactivatevic(sin: number, engagementId: number): Observable<ReactivateEngagementDetails> {
    const getEngagementUrl = `/api/v1/vic/${sin}/engagement/${engagementId}/reactivate`;
    return this.http.get<ReactivateEngagementDetails>(getEngagementUrl);
  }

  getEngagementsreactivatevicmyTxn(
    sin: number,
    engagementId: number,
    referenceNo: number
  ): Observable<ReactivateEngagementDetails> {
    const getEngagementUrl = `/api/v1/vic/${sin}/engagement/${engagementId}/reactivate?transactionId=${referenceNo}`;
    return this.http.get<ReactivateEngagementDetails>(getEngagementUrl);
  }

  /**
   * This method is to fetch gregorian date
   * @param date
   */
  fetchDate(date: GosiCalendar): Date | null {
    return date?.gregorian ? date.gregorian : null;
  }

  /**
   * This method is to update wage details of the list of contributors and return filtered obervable
   * @param data
   * @param regNo
   */
  getOccupationAndWageDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<EngagementDetails> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/wage-update-request/${referenceNo}`;
    return this.http.get<UpdatedWageListResponse>(url).pipe(
      map((updatedWageListResponse: UpdatedWageListResponse) => {
        const currentEngagment = new EngagementDetails();
        currentEngagment.engagementPeriod[0] = updatedWageListResponse.updateWageList[0].updatedWage;
        currentEngagment.joiningDate = updatedWageListResponse.joiningDate;
        currentEngagment.proactive = updatedWageListResponse.proactive;
        currentEngagment.ppaIndicator = updatedWageListResponse?.ppaIndicator;
        return currentEngagment;
      })
    );
  }

  /**
   * This method is to set response from coverage api into engagement
   * @param eng
   * @param periods
   */
  setResponsePeriodToEngagement(eng: EngagementDetails, periods: CoveragePeriod[]): EngagementDetails {
    if (periods && periods.length > 0) {
      periods.forEach(period => {
        if (period) {
          eng.engagementPeriod.forEach(engPeriod => {
            if (
              this.fetchDate(period.startDate) === this.fetchDate(engPeriod.startDate) &&
              this.fetchDate(period.endDate) === this.fetchDate(engPeriod.endDate)
            ) {
              engPeriod.coverages.forEach(engCov => {
                period.coverages.forEach(perCov => {
                  if (engCov.coverageType.english === perCov.coverageType.english) {
                    engCov.fromJsonToObject(perCov);
                  }
                });
              });
            }
          });
        }
      });
    }
    return eng;
  }

  /**
   * This method is fetch coverage details for engagement period
   * @param sin
   * @param registrationNo
   * @param param
   */
  getEngagementWithCoverage(sin: number, registrationNo: number, param: string): Observable<EngagementDetails[]> {
    return this.getEngagements(sin, registrationNo, param).pipe(
      switchMap((res: EngagementDetails[]) => {
        return forkJoin(
          res.map(eng => {
            this.setCoverage(eng);
            return this.getContributoryCoverage(sin, eng.engagementId, registrationNo).pipe(
              catchError(err => {
                this.handleError(err);
                return of(new CoveragePeriodWrapper());
              }),
              map((response: CoveragePeriodWrapper) =>
                this.setResponsePeriodToEngagement(
                  eng,
                  param === SearchTypeEnum.ACTIVE ? [response.currentPeriod] : response.periods
                )
              )
            );
          })
        );
      })
    );
  }
  /**Method to create a coverage depending on the coverageType */
  setCoverage(engagement: EngagementDetails): void {
    engagement.engagementPeriod.forEach(engPeriod => {
      engPeriod.coverages = [];
      engPeriod.coverageType.forEach(covType => {
        const cov = new Coverage();
        cov.coverageType = covType;
        engPeriod.coverages.push(cov);
      });
    });
  }

  /**
   * This method is used to fetch coverage details for an engagement
   */
  getContributoryCoverage(
    sin: number,
    engagementId: number,
    registrationNo: number
  ): Observable<CoveragePeriodWrapper> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagementId}/contribution`;
    return this.http.get<CoveragePeriodWrapper>(url);
  }

  /** Method to get vic contribution details */
  getVicContributionDetails(nin: number, engagementId: number): Observable<VicContributionDetails> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/contribution-details`;
    return this.http.get<VicContributionDetails>(url);
  }

  /**
   * This method is used to update current engagement details
   * @param wageDetails
   * @param registrationNo
   * @param sin
   */
  updateWageDetails(
    wageDetails: EngagementPeriod,
    registrationNo: number,
    sin: number,
    engagmentId: number,
    isEditValidator: boolean
  ): Observable<TransactionFeedback> {
    if (isEditValidator) wageDetails.editFlow = true;
    const updateEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${sin}/engagement/${engagmentId}/wage`;
    return this.http.patch<TransactionFeedback>(updateEngagementUrl, wageDetails);
  }

  /**
   * Method to verify the change in wage for a period of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  verifyWageChange(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    engagementDetails: EngagementDetails
  ): Observable<boolean> {
    const verifyUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/verifyMinimumWage`;

    return this.http.post<boolean>(verifyUrl, engagementDetails);
  }

  /**
   * Method to modify the change in wage for the periods of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  modifyEnagagementPeriodWage(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    engagementDetails: EngagementDetails
  ): Observable<ChangeEngagementResponse> {
    const modifyUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}`;

    return this.http.put<ChangeEngagementResponse>(modifyUrl, engagementDetails);
  }

  /**
   * Method to submit the transaction after chnaging wage for the periods of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  submitEngagementAfterChange(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    action: string,
    comments: string
  ): Observable<BilingualText> {
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/change-request/status?action=${action}`;
    return this.http.put<BilingualText>(submitUrl, { comments: comments });
  }

  /**
   * Method to get engagement details in work flow
   * @param registrationNo registration number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  getEngagementInWorkflow(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number,
    isDraftRequired?: boolean
  ): Observable<UpdatedWageDetails> {
    let engagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/change-request/${referenceNo}`;
    if (isDraftRequired) engagementUrl += `?isDraftRequired=true`;
    return this.http.get<UpdatedWageDetails>(engagementUrl);
  }

  /** Method to get VIC wage categories. */
  searchEngagement(socialInsuranceNo: number, nin: number): Observable<SearchEngagementResponse> {
    const searchObservable = new BehaviorSubject<SearchEngagementResponse>(null);
    const url = `/api/v1/contributor/${socialInsuranceNo}/search-engagements?searchType=${SearchTypeEnum.ACTIVE_AND_TERMINATED_AND_CANCELLED}&ignorePagination=true`;
    this.http.get<SearchEngagementResponse>(url).subscribe(res => searchObservable.next(res));
    const searchENgResp = new BehaviorSubject<SearchEngagementResponse>(null);
    searchObservable
      .pipe(
        filter(res => res !== null),
        pluck('overallEngagements'),
        switchMap((res: EngagementDetails[]) => {
          return forkJoin(
            res.map(eng => {
              this.setCoverage(eng);
              if (eng.engagementType === EngagementType.VIC)
                eng.engagementPeriod = eng.engagementPeriod.filter(engPeriod =>
                  moment(engPeriod.startDate.gregorian).isSameOrBefore(new Date())
                );
              return this.getCoverageBasedOnEngagementType(socialInsuranceNo, nin, eng, false);
            })
          );
        })
      )
      .subscribe(res => searchENgResp.next({ activeEngagements: null, overallEngagements: res }));
    searchObservable
      .pipe(
        filter(res => res !== null),
        pluck('activeEngagements'),
        switchMap((res: EngagementDetails[]) => {
          return forkJoin(
            res.map(eng => {
              this.setCoverage(eng);
              return this.getCoverageBasedOnEngagementType(socialInsuranceNo, nin, eng, true);
            })
          );
        })
      )
      .subscribe(res => searchENgResp.next({ activeEngagements: res, overallEngagements: null }));
    return searchENgResp.asObservable();
  }

  /** Method  to get coverages based on engagement type. */
  getCoverageBasedOnEngagementType(sin: number, nin: number, engagement: EngagementDetails, isCurrent: boolean) {
    return iif(
      () => engagement.engagementType === EngagementType.VIC,
      this.getVicContributionDetails(nin, engagement.engagementId).pipe(
        tap(resp => {
          engagement.vicNoOfPaidMonths = resp.contributionMonths;
          engagement.vicNoOfPaidDays = resp.contributionDays;
          engagement.vicNoOfUnpaidMonths = resp.numberOfUnPaidMonths;
        }),
        pluck('contributionDetails')
      ),
      this.getContributoryCoverage(sin, engagement.engagementId, engagement.registrationNo)
    ).pipe(
      catchError(err => {
        this.handleError(err);
        return of(new CoveragePeriodWrapper());
      }),
      map((response: CoveragePeriodWrapper) =>
        this.setResponsePeriodToEngagement(engagement, isCurrent ? [response.currentPeriod] : response.periods)
      )
    );
  }

  /* =====================
   Error methods section
   ======================= */

  /**
   * Method to handle error while service call fails
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /** Method to submit engagement */
  submitEngagementDate(
    ninOrIqama: number,
    engagementId: number,
    otp,
    uuid: string,
    modifyEngagement: EngagementBasicDetails
  ) {
    let httpOptions = {};
    if (otp) {
      const otpHeader = {
        'x-otp': uuid + ':' + otp
      };
      httpOptions = {
        headers: new HttpHeaders(otpHeader)
      };
    }
    return this.http.post(
      `/api/v1/contributor/${ninOrIqama}/engagement/${engagementId}/violation-request`,
      modifyEngagement,
      httpOptions
    );
  }

  /** Method to submit engagement */
  saveandnextEngagementDate(
    registrationNo: number,
    ninOrIqama: number,
    engagementId: number,
    modifyEngagement?: EngagementBasicDetails
  ) {
    let httpOptions = {};
    return this.http.post(
      `/api/v1/establishment/${registrationNo}/contributor/${ninOrIqama}/engagement/${engagementId}/violation-request-eligibility`,
      modifyEngagement,
      httpOptions
    );
  }

  /**
   * Method to verify the change in wage for a period of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  EverifyWageChange(
    socialInsuranceNo: number,
    engagementId: number,
    engagementDetails: EngagementDetails
  ): Observable<boolean> {
    const verifyUrl = `/api/v1/contributor/${socialInsuranceNo}/engagement/${engagementId}/verify-minimum-wage`;

    return this.http.post<boolean>(verifyUrl, engagementDetails);
  }

  /** Method to open engagement date type page */
  openEngagementDate(ninOrIqama: number, engagementId: number, modifyEngagement: EngagementBasicDetails) {
    let httpOptions = {};

    return this.http.post(
      `/api/v1/contributor/${ninOrIqama}/engagement/${engagementId}/violation-request-eligibility`,
      modifyEngagement,
      httpOptions
    );
  }

  /** Method to open engagement date type page */
  openEngagementDateEinsp(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    requestId: number,
    modifyEngagement: EngagementBasicDetails
  ) {
    let httpOptions = {};

    return this.http.put(
      `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/violation-request/${requestId}`,
      modifyEngagement,
      httpOptions
    );
  }

  reactivateEligibility(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number
  ): Observable<ReactivateEligibilityDetails> {
    const engagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/reactivate-eligibility`;
    return this.http.get<ReactivateEligibilityDetails>(engagementUrl);
  }

  reactivateVicEligibility(socialInsuranceNo: number, engagementId: number): Observable<ReactivateEligibilityDetails> {
    const engagementUrl = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/reactivate-eligibility`;
    return this.http.get<ReactivateEligibilityDetails>(engagementUrl);
  }

  /**
   * Method to submit the transaction after chnaging wage for the periods of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  submitModifyCoverage(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    transactionTraceId: number,
    comments: string,
    editFlow: boolean
  ): Observable<TransactionResponse> {
    const submitUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/modify-coverage/${transactionTraceId}/submit`;
    return this.http.patch<TransactionResponse>(submitUrl, { comments: comments, editFlow: editFlow });
  }
  /**
   * Method to get engagement details in work flow
   * @param registrationNo registration number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   */
  getModifyCoverageDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<UpdatedWageDetails> {
    const engagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/modify-coverage/${referenceNo}`;
    return this.http.get<UpdatedWageDetails>(engagementUrl);
  }
  /**
   * Method to submit the transaction after chnaging wage for the periods of an engagement.
   * @param registrationNo registartion number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementDetails engagement details
   */
  adminApproveTransaction(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    referenceNo: number
  ): Observable<BilingualText> {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/change-request/${referenceNo}/validate`;
    return this.http.get<BilingualText>(url);
  }
}
