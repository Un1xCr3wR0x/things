import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Benefits } from '../models/benefits';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {
  WizardItem,
  BilingualText,
  LovList,
  Lov,
  DocumentItem,
  WorkflowService,
  BPMUpdateRequest,
  convertToYYYYMMDD,
  GosiCalendar
} from '@gosi-ui/core';
import { BenefitConstants } from '../constants/benefit-constants';
import { DependentDetails, ValidateHeir } from '../models/dependent-details';
import { HeirDetailsRequest } from '../models/heir-details-request';
import moment from 'moment';
import { BenefitValues } from '../enum';
import { HeirVerifyRequest } from '../models/heir-verify-request';
import {
  HeirAccountProfile,
  HeirAccountDetails,
  ValidateRequest,
  HeirUnbornRequest,
  HeirBenefitFilter,
  PersonalInformation,
  BankAccountListDetails,
  AttorneyDetailsWrapper,
  AdjustmentRepayment,
  AdjustmentRepaySetvalues,
  HeirHistory,
  DependentTransaction,
  DependentHistoryFilter,
  DependentHistoryDetails,
  AddHeir,
  SurplusEligibilityResponse,
  ActiveBenefits
} from '../models';
import { HeirBenefitList } from '../models/heir-benefit-list';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BenefitWageDetail } from '../models/benefit-wage-detail';

@Injectable({
  providedIn: 'root'
})
export class HeirBenefitService {
  private baseUrl = `/api/v1/contributor`;
  private lovUrl = '/api/v1/lov';
  private heirUnbornRequest: HeirUnbornRequest;
  private heirUpdateWarningMsg: boolean;
  filterUrl: string;
  adjustmentRepayDetails: AdjustmentRepaySetvalues;
  private _personId: number;

  constructor(private http: HttpClient, readonly router: Router, readonly workflowService: WorkflowService) {}

  /**method to fetch eligibility by passing benefit type */
  // public getBenefitsByType(
  //   socialInsuranceNumber: number,
  //   benefitType: string,
  //   requestDate?: GosiCalendar
  // ): Observable<Benefits[]> {
  //   const url = `${this.baseUrl}/${socialInsuranceNumber}/benefit/eligibility?benefitType=${benefitType}`;
  //   let params = new HttpParams();
  //   if (requestDate) {
  //     const reqDate = moment(requestDate.gregorian).format('YYYY-MM-DD');
  //     params = params.set('requestDate', reqDate.toString());
  //   }
  //   return this.http.get(url, {params}).pipe(
  //     map(res => {
  //       const ret = <Benefits[]>res;
  //       return ret;
  //     })
  //   );
  // }

  /**method to fetch eligibility by passing benefit type */
  public getEligibleBenefitByType(socialInsuranceNumber: number, benefitType?: string): Observable<Benefits[]> {
    const url = `${this.baseUrl}/${socialInsuranceNumber}/benefit/eligibility`;
    let params = new HttpParams();
    if(benefitType){
      params = params.set('benefitType', benefitType);
    }
    return this.http.get(url, { params }).pipe(
      map(res => {
        const ret = <Benefits[]>res;
        return ret;
      })
    );
  }

  /**
   * This method is to get icons for form wizard
   */
  getHeirPensionItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.REASON_FOR_BENEFIT, 'BenefitReason'));
    wizardItems.push(new WizardItem(BenefitConstants.HEIR_DETAILS, 'users'));
    wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
    return wizardItems;
  }

  /**:
   * method to fetch heir details
   */
  getHeirDetailsOldApi(
    sin: number,
    heirDetailsData: HeirDetailsRequest,
    benefitType: string,
    isBackdated?: string,
    benefitRequestId?: number,
    referenceNo?: number
  ): Observable<DependentDetails[]> {
    const url = `/api/v1/contributor/${sin}/heir`;
    let params = new HttpParams();
    params = params.set('benefitType', benefitType);
    if (heirDetailsData.requestDate) {
      const requestDate = moment(heirDetailsData.requestDate.gregorian).format('YYYY-MM-DD');
      params = params.set('requestDate', requestDate);
    }
    if (isBackdated === 'true') {
      params = params.set('isBackdated', isBackdated);
    }
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (heirDetailsData.reason && heirDetailsData.eventDate) {
      const eventDate = moment(heirDetailsData.eventDate.gregorian).format('YYYY-MM-DD');
      if (
        heirDetailsData.reason?.english === BenefitValues.deathOfTheContributor ||
        heirDetailsData.reason?.english === BenefitValues.ohDeathOfTheContributor
      ) {
        // No death date needed
        params = params.set('reasonForBenefit', heirDetailsData.reason.english);
        params = params.set('deathDate', eventDate);
      } else {
        params = params.set('reasonForBenefit', heirDetailsData.reason.english);
        params = params.set('missingDate', eventDate);
      }
    }

    return this.http.get<DependentDetails[]>(url, { params });
  }

  /**:
   * method to fetch heir details
   */
  getAllHeirDetails(
    sin: number,
    heirDetailsData: HeirDetailsRequest,
    benefitType: string,
    isBackdated?: string,
    benefitRequestId?: number,
    referenceNo?: number
  ): Observable<DependentDetails[]> {
    // const url = `/api/v1/contributor/${sin}/heir`;
    const url = `/api/v1/contributor/${sin}/heir/details`;
    let params = new HttpParams();
    // params = params.set('benefitType', benefitType);
    // if (heirDetailsData.requestDate) {
    //   const requestDate = moment(heirDetailsData.requestDate.gregorian).format('YYYY-MM-DD');
    //   params = params.set('requestDate', requestDate);
    // }
    // if (isBackdated === 'true') {
    //   params = params.set('isBackdated', isBackdated);
    // }
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    // if (heirDetailsData.reason && heirDetailsData.eventDate) {
    //   const eventDate = moment(heirDetailsData.eventDate.gregorian).format('YYYY-MM-DD');
    //   if (
    //     heirDetailsData.reason?.english === BenefitValues.deathOfTheContributor ||
    //     heirDetailsData.reason?.english === BenefitValues.ohDeathOfTheContributor
    //   ) {
    //     // No death date needed
    //     params = params.set('reasonForBenefit', heirDetailsData.reason.english);
    //     params = params.set('deathDate', eventDate);
    //   } else {
    //     params = params.set('reasonForBenefit', heirDetailsData.reason.english);
    //     params = params.set('missingDate', eventDate);
    //   }
    // }

    return this.http.get<DependentDetails[]>(url, { params });
  }

  getDemoHeirDetails(): Observable<DependentDetails[]> {
    const url = `../../../assets/data/heir-details.json`;
    return this.http.get<DependentDetails[]>(url);
  }

  getBankDetailsList(): Observable<BankAccountListDetails[]> {
    const url = `../../../assets/data/bank-accList.json`;
    return this.http.get<BankAccountListDetails[]>(url);
  }

  getAttorneyList(): Observable<AttorneyDetailsWrapper[]> {
    const url = `../../../assets/data/attorney-details.json`;
    return this.http.get<AttorneyDetailsWrapper[]>(url);
  }

  // /**
  //  * This method is used to get the heir details in active screens
  //  * @param sin
  //  */
  getHeirBenefit(
    sin: Number,
    benefitRequestId: string,
    referenceNo: any,
    status: string[],
    includeInactive = false,
    modifyPayment = false
  ) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir`; //438668 heir api change ,only for active/stopped benefits
    let params = new HttpParams();
    if (status) {
      status.forEach(action => {
        params = params.append('status', action);
      });
    }
    if (includeInactive) {
      params = params.append('includeInactive', 'true');
    }
    if (modifyPayment) {
      params = params.append('modifyPayment', 'true');
    }
    if (referenceNo) {
      params = params.append('referenceNo', referenceNo.toString());
    }
    return this.http.get<DependentDetails[]>(url, { params });
  }

  /**
   * This method is used to get the heir details
   * @param sin
   */
  getHeirById(
    sin: Number,
    benefitRequestId: string,
    referenceNo: number,
    benefitType: string,
    status: string[],
    isBackdated = false
  ) {
    const url = `/api/v1/contributor/${sin}/heir`;
    let params = new HttpParams();
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId);
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (benefitType) {
      params = params.set('benefitType', benefitType);
    }
    if (status) {
      status.forEach(action => {
        params = params.append('status', action);
      });
    }
    if (isBackdated) {
      params = params.set('isBackdated', 'true');
    }
    return this.http.get<DependentDetails[]>(url, { params });
  }

  /**
   *
   * @param sin
   * @param benefitRequestId
   * @param referenceNo
   * @param benefitType
   * @param status
   */
  getHeirForValidatorScreen(
    sin: Number,
    benefitRequestId: string,
    referenceNo: number,
    benefitType: string,
    status: string[],
    requestScreen = false
  ) {
    let url;
    if (requestScreen) {
      url = `/api/v1/contributor/${sin}/heir/details`;
    } else {
      url = `/api/v1/contributor/${sin}/heir`;
    }
    let params = new HttpParams();
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId);
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (benefitType) {
      params = params.set('benefitType', benefitType);
    }
    if (status) {
      status.forEach(action => {
        params = params.append('status', action);
      });
    }
    return this.http.get<DependentDetails[]>(url, { params });
  }

  /** fetch heir history details */
  getHeirHistoryDetails(sin: number, benefitRequestId: number, referenceNo: number, oldHistory?: boolean) {
    const url = `${this.baseUrl}/${sin}/benefit/${benefitRequestId}/heir-history`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (oldHistory) {
      params = params.append('oldHistory', oldHistory.toString());
    }
    return this.http.get<HeirHistory[]>(url, { params });
  }

  /** update heir details  */
  validateHeir(sin: number, data: ValidateHeir, page: string, benefitRequestId: number, benefitType: string) {
    const url = `/api/v1/contributor/${sin}/heir/_validate`;
    let params = new HttpParams();
    // if (page && page === 'modify' && benefitRequestId) {
    //   params = params.set('benefitRequestId', benefitRequestId.toString());
    // }
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    if (benefitType) {
      params = params.set('benefitType', benefitType.toString());
    }
    return this.http.post<ValidateRequest[]>(url, data, { params });
  }

  validateSurplusEligibility(
    sin: number,
    benefitRequestId: number,
    personId: number,
    firstEventModificationDate: GosiCalendar,
    relationship: BilingualText
  ) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir/${personId}/validate-surplus-eligibility`;
    let params = new HttpParams().set('relationship', relationship.english);
    if (firstEventModificationDate) {
      params = params.set(
        'firstEventModificationDate',
        moment(firstEventModificationDate.gregorian).format('YYYY-MM-DD')
      );
    }
    return this.http.get<SurplusEligibilityResponse>(url, { params });
  }

  /** register heir   */
  registerHeir(id: number, data: HeirVerifyRequest) {
    const url = `/api/v1/heir/${id}/account`;
    return this.http.post<BilingualText>(url, data);
  }

  /** register heir   */
  verifyHeir(id: number, data: HeirVerifyRequest) {
    const url = `/api/v1/heir/${id}/account/_verify`;
    return this.http.post<DocumentItem[]>(url, data);
  }

  /** method to fetch Other Benefits and Wage Details */
  // getBenefitsAndWageDetails(
  //   sin: number,
  //   benefitRequestId: number,
  //   heirPersonId: number,
  //   startDate?: string,
  //   // endDate?: string
  // ): Observable<BenefitWageDetail> {
  //   const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir-details`;
  //   let params = new HttpParams();
  //   if (heirPersonId) {
  //     params = params.set('heirPersonId', heirPersonId.toString());
  //   }
  //   if (startDate) {
  //     params = params.set('startDate', startDate);
  //   }
  //   // if (endDate) {
  //   //   params = params.set('endDate', endDate);
  //   // }
  //   return this.http.get<BenefitWageDetail>(url, { params });
  // }

  /**
   * This method is to fetch saned rejection reason values.
   */
  getBenefitReasonList(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'HeirBenefitRequestReason'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }

  /** Check if person is a Custodian  */
  checkCustodian(guardianNin: Number, heirNin: Number) {
    const url = `/api/v1/person/${guardianNin}/custody`;
    let params = new HttpParams();
    params = params.set('custodianId', guardianNin.toString());
    params = params.set('minorId', heirNin.toString());
    return this.http.get<Boolean>(url, { params });
  }

  /** Update BPM Task.  */
  updateTaskWorkflow(data: BPMUpdateRequest) {
    return this.workflowService.updateTaskWorkflow(data);
  }

  /**:
   * method to fetch linked contributors  for heir account
   */
  getHeirLinkedContributors(id: number): Observable<HeirAccountProfile> {
    const url = `/api/v1/heir/${id}/account`;
    return this.http.get<HeirAccountProfile>(url);
  }

  /**:
   * method to fetch heir account details
   */
  getAccountRequestDetails(id: number, accountId: number): Observable<HeirAccountDetails> {
    const url = `/api/v1/heir/${id}/account/${accountId}`;
    return this.http.get<HeirAccountDetails>(url);
  }

  //Setter method for person id
  setUnbornRequest(heirUnbornRequest: HeirUnbornRequest) {
    this.heirUnbornRequest = heirUnbornRequest;
  }

  //Getter method for personId
  getUnbornRequest() {
    return this.heirUnbornRequest;
  }

  //Setter method for person id
  setHeirUpdateWarningMsg(heirUpdateWarningMsg: boolean) {
    this.heirUpdateWarningMsg = heirUpdateWarningMsg;
  }

  //Getter method for personId
  getHeirUpdateWarningMsg() {
    return this.heirUpdateWarningMsg;
  }

  getHeirBenefitHistory(socialInsuranceNumber: number, benefitRequestId: number): Observable<DependentTransaction[]> {
    if (socialInsuranceNumber && benefitRequestId) {
      const url = `${this.baseUrl}/${socialInsuranceNumber}/benefit/${benefitRequestId}/benefit-heir-history`;
      return this.http.get<DependentHistoryDetails>(url).pipe(
        map(val => val.dependentsDetails),
        catchError(err => this.handleError(err))
      );
    }
  }

  filterHeirHistory(socialInsuranceNumber, benefitRequestId, heirHistoryFilter: DependentHistoryFilter) {
    let url = `${this.baseUrl}/${socialInsuranceNumber}/benefit/${benefitRequestId}/benefit-heir-history`;
    let params = new HttpParams();
    const heirEvent = heirHistoryFilter.dependentEvents;
    const heirIds = heirHistoryFilter.dependentNames;
    let startDate = null;
    let endDate = null;
    if (heirHistoryFilter.benefitPeriodFrom && heirHistoryFilter.benefitPeriodTo) {
      startDate = this.convertToDDMMYYYY(heirHistoryFilter.benefitPeriodFrom.toString());
      endDate = this.convertToDDMMYYYY(heirHistoryFilter.benefitPeriodTo.toString());
    }
    if (this.hasvalidValue(heirEvent)) {
      heirEvent.forEach(event => {
        params = params.append('dependentEventTypes', event.english);
      });
    }
    if (heirIds?.length > 0) {
      heirIds.forEach(id => {
        params = params.append('dependents', id.toString());
      });
    }
    if (startDate && endDate) {
      params = params.append('startDate', startDate);
      params = params.append('endDate', endDate);
    }
    return this.http.get<DependentHistoryDetails>(url, { params }).pipe(
      map(val => val.dependentsDetails),
      catchError(err => this.handleError(err))
    );
  }

  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };

  /**method to fetch eligibility by passing benefit type */
  public getBenefitLists(socialInsuranceNumber: number, benefitRequestId: number): Observable<HeirBenefitList[]> {
    const url = `${this.baseUrl}/${socialInsuranceNumber}/benefit/${benefitRequestId}/heir-hist`;
    let params = new HttpParams();
    const status = ['Active', 'On Hold', 'Repay Lumpsum', 'Initiated', 'Rejected'];
    status.forEach(val => {
      params = params.append('benefitStatus', val);
    });
    return this.http.get(url, { params }).pipe(
      map(res => {
        const ret = <HeirBenefitList[]>res;
        return ret;
      })
    );
  }

  /**
   * This method is used to get the adjutment details
   */
  filterHeirBenefitByDetail(
    socialInsuranceNumber: number,
    benefitRequestId: number,
    heirFilter?: HeirBenefitFilter
  ): Observable<HeirBenefitList[]> {
    this.filterUrl = `${this.baseUrl}/${socialInsuranceNumber}/benefit/${benefitRequestId}/heir-hist?`;
    const benefitStatusArry = heirFilter.benefitStatus;
    const informationTypeArry = heirFilter.informationType;
    const personids = heirFilter.personIds;
    let startDate = null;
    let endDate = null;
    if (heirFilter.benefitPeriodFrom && heirFilter.benefitPeriodTo) {
      startDate = convertToYYYYMMDD(heirFilter.benefitPeriodFrom.toString());
      endDate = convertToYYYYMMDD(heirFilter.benefitPeriodTo.toString());
    }
    let paramExists = false;
    if (this.hasvalidValue(benefitStatusArry)) {
      for (let i = 0; i < benefitStatusArry.length; i++) {
        if (paramExists) {
          const statusParam = `&benefitStatus=${benefitStatusArry[i].english}`;
          this.filterUrl = this.filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `benefitStatus=${benefitStatusArry[i].english}`;
            this.filterUrl = this.filterUrl.concat(statusParam);
          } else {
            const statusParam = `&benefitStatus=${benefitStatusArry[i].english}`;
            this.filterUrl = this.filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (this.hasvalidValue(informationTypeArry)) {
      for (let i = 0; i < informationTypeArry.length; i++) {
        if (paramExists) {
          const typeParam = `&informationTypes=${informationTypeArry[i].english}`;
          this.filterUrl = this.filterUrl.concat(typeParam);
        } else {
          if (i === 0) {
            const typeParam = `informationTypes=${informationTypeArry[i].english}`;
            this.filterUrl = this.filterUrl.concat(typeParam);
          } else {
            const typeParam = `&informationTypes=${informationTypeArry[i].english}`;
            this.filterUrl = this.filterUrl.concat(typeParam);
          }
          paramExists = true;
        }
      }
    }
    if (this.hasvalidValue(personids)) {
      for (let i = 0; i < personids.length; i++) {
        if (paramExists) {
          const typeParam = `&personIds=${personids[i]}`;
          this.filterUrl = this.filterUrl.concat(typeParam);
        } else {
          if (i === 0) {
            const typeParam = `personIds=${personids[i]}`;
            this.filterUrl = this.filterUrl.concat(typeParam);
          } else {
            const typeParam = `&personIds=${personids[i]}`;
            this.filterUrl = this.filterUrl.concat(typeParam);
          }
          paramExists = true;
        }
      }
    }
    if (startDate && endDate) {
      if (paramExists) {
        const dateParam = `&startDate=${startDate}&endDate=${endDate}`;
        this.filterUrl = this.filterUrl.concat(dateParam);
      } else {
        const dateParam = `startDate=${startDate}&endDate=${endDate}`;
        this.filterUrl = this.filterUrl.concat(dateParam);
        paramExists = true;
      }
    }
    return this.http.get<HeirBenefitList[]>(this.filterUrl);
  }

  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }

  /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(url).pipe(
      tap(res => (this._personId = res.id)),
      catchError(err => this.handleError(err))
    );
  }

  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  public get personId() {
    return this._personId;
  }

  public set personId(personId: number) {
    this._personId = personId;
  }

  /**
   * This method is to fetch Adjustment Repayment Validator screen details
   */
  fetchAdjustmentRepayment(adjustmentRepayId: number, personId: number, referenceNo: number, sin: number) {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${sin}/adjustment/${adjustmentRepayId}`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.get<AdjustmentRepayment>(url, { params });
  }

  /** This method is to get Dependent details */
  getAdjustmentRepaymentDetails() {
    return this.adjustmentRepayDetails;
  }

  /** This method is to set Dependent details */
  setAdjustmentRepaymentDetails(data: AdjustmentRepaySetvalues) {
    this.adjustmentRepayDetails = data;
  }

  addHeir(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    data: DependentDetails,
    update = false
  ): Observable<AddHeir> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo?.toString());
    }
    if (update) {
      return this.http.put<AddHeir>(url, data, { params });
    } else {
      return this.http.post<AddHeir>(url, data, { params });
    }
  }

  deleteHeir(sin: number, benefitRequestId: number, data: DependentDetails, referenceNo: number) {
    //TODO: Change the api
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/heir`;
    let params = new HttpParams();
    params = params.set('referenceNo', referenceNo.toString());
    params = params.set('personId', data.personId.toString());
    return this.http.delete<BilingualText>(url, { params });
  }

  getHeirActiveBenefits(identifier: number): Observable<ActiveBenefits[]> {
    const url = `/api/v1/heir/${identifier}/account/heir-benefit-details`;
    return this.http.get<ActiveBenefits[]>(url);
  }
}
