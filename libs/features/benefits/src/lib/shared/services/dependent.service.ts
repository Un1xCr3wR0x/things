import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DependentDetails, ValidateDependent } from '../models/dependent-details';
import { ImprisonmentDetails } from '../models/imprisonment-details';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import moment from 'moment';
import { HeirDetailsRequest } from '../models/heir-details-request';
import { ReasonBenefit } from '../models/reason-benefit';
import { ValidateRequest } from '../models/validate';
import {
  BenefitDetails,
  DependentHistory,
  DependentTransaction,
  DependentHistoryFilter,
  DependentStatusHistory,
  BenefitStartDate,
  DependentHistoryDetails,
  AnnualNotificationCertificate
} from '../models';
import { GosiCalendar, BilingualText, Lov, LovList, convertToYYYYMMDD } from '@gosi-ui/core';
import { Observable } from 'rxjs/internal/Observable';
// import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class DependentService {
  dependents: DependentDetails[];
  imprisonmentDetails: ImprisonmentDetails;
  reasonForbenefits: ReasonBenefit;
  private lovUrl = '/api/v1/lov';
  constructor(private http: HttpClient, readonly router: Router) {}

  /**
   * This method is used to get the dependent details
   * @param sin
   */
  getDependentDetails(
    sin: Number,
    benefitType: string,
    requestDate: GosiCalendar,
    imprisonmentDetails?: ImprisonmentDetails,
    benefitRequestId?: number,
    referenceNo?: number,
    status?: string[],
    isBackdated?: boolean
  ) {
    const url = `/api/v1/contributor/${sin}/dependent`;
    let params = new HttpParams();

    if (imprisonmentDetails) {
      const enteringDate = imprisonmentDetails.enteringDate
        ? moment(imprisonmentDetails.enteringDate.gregorian).format('YYYY-MM-DD')
        : null;
      const releaseDate = imprisonmentDetails.releaseDate
        ? moment(imprisonmentDetails.releaseDate.gregorian).format('YYYY-MM-DD')
        : null;
      const hasCertificate = imprisonmentDetails.hasCertificate ? 'true' : 'false';

      if (hasCertificate != null) {
        params = params.set('hasCertificate', hasCertificate);
      }
      if (enteringDate != null) {
        params = params.set('enteringDate', enteringDate);
      }
      if (releaseDate != null) {
        params = params.set('releaseDate', releaseDate);
      }
    }
    if (requestDate) {
      const requestDateFormatted = moment(requestDate.gregorian).format('YYYY-MM-DD');
      params = params.set('requestDate', requestDateFormatted);
    }
    if (isBackdated === true) {
      params = params.set('backdated', 'true');
    }
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (status) {
      status.forEach(action => {
        params = params.append('status', action);
      });
    }
    if (benefitType) {
      params = params.set('benefitType', benefitType);
    }
    return this.http.get<DependentDetails[]>(url, { params });
  }

  /**
   * This method is used to get the dependent details
   * @param sin
   */
  getDependentDetailsById(sin: Number, benefitRequestId: string, referenceNo: number, status?: string[]) {
    const url = `/api/v1/contributor/${sin}/dependent`;
    let params = new HttpParams();
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId);
    }
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (status) {
      status.forEach(action => {
        params = params.append('status', action);
      });
    }
    return this.http.get<DependentDetails[]>(url, { params });
  }

saveDetails(sin: Number, benefitRequestId: string, referenceno:number,payload: any) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/saveDetails`;
    // return this.http.get<HeirHistory[]>(url, { params });
    return this.http.post<any>(url,payload);
  }

  
  // getDependentDetailsById(sin: Number, benefitRequestId: string, referenceNo: number, status: string[]): Observable<DependentDetails[]> {
  //   const url = `../../../assets/data/dependent-details.json`;
  //   return this.http.get<DependentDetails[]>(url);
  // }
  getBenefitHistory(sin: number, benefitRequestId: number) {
    const url = `/api/v1/contributor/${sin}/benefit`;
    let params = new HttpParams();
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    return this.http.get<BenefitDetails[]>(url, { params });
  }

  getDependentHistory(sin: number, benefitRequestId: number, personId?: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/dependent-hist`;
    let params = new HttpParams();
    if (personId) {
      params = params.set('personId', personId.toString());
    }
    return this.http.get<DependentHistory>(url, { params });
  }

  /** update dependent details  */
  updateDependent(
    sin: number,
    data: ValidateDependent,
    eligibilityStartDate?: GosiCalendar,
    requestDate?: GosiCalendar
  ) {
    const url = `/api/v1/contributor/${sin}/dependent/_validate`;
    if (eligibilityStartDate) {
      data['benefitEligibilityDate'] = eligibilityStartDate;
    }
    if (requestDate) {
      data['requestDate'] = requestDate;
    }
    return this.http.post<ValidateRequest>(url, data);
  }
  /** method to fetch dependent status hostory details */
  getStatusHistoryDetails(sin: number, benefitRequestId: number, personId: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/dependent-history/${personId}`;
    if (sin && benefitRequestId && personId) {
      return this.http.get<DependentStatusHistory>(url).pipe(catchError(err => this.handleError(err)));
    }
  }
  /** method to fetch imprisonment details */
  getImprisonmentDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/imprisonment`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNumber', referenceNo.toString());
    }
    return this.http.get<ImprisonmentDetails>(url, { params }).pipe(catchError(err => this.handleError(err)));
  }
  /** method to fetch Dependent History details */
  getDependentHistoryDetails(
    sin: number,
    benefitRequestId: number,
    referenceNo?: number,
    isPreviousHistory = false
  ): Observable<DependentTransaction[]> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/dependent-history`;
    let params = new HttpParams();
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    if (isPreviousHistory) {
      params = params.append('isPreviousHistory', isPreviousHistory.toString());
    }
    return this.http.get<DependentHistoryDetails>(url, { params }).pipe(
      map(val => val.dependentsDetails),
      catchError(err => this.handleError(err))
    );
  }
  getDepHistoryWithoutREqId(
    sin: number,
    benefitType: string,
    reqDate: GosiCalendar
  ): Observable<DependentTransaction[]> {
    const url = `/api/v1/contributor/${sin}/benefit/benefit-history`;
    let params = new HttpParams();
    if (benefitType) {
      params = params.set('benefitType', benefitType);
    }
    if (reqDate) {
      params = params.append('requestDate', moment(reqDate.gregorian).format('YYYY-MM-DD'));
    }
    return this.http.get<DependentHistoryDetails>(url, { params }).pipe(
      map(val => val.dependentsDetails),
      catchError(err => this.handleError(err))
    );
  }
  public setReasonForBenefit(
    deathDate: GosiCalendar,
    missingDate: GosiCalendar,
    heirBenefitRequestReason: BilingualText
  ) {
    this.reasonForbenefits = new ReasonBenefit(deathDate, missingDate, heirBenefitRequestReason);
  }

  public getReasonForBenefit() {
    return this.reasonForbenefits;
  }

  /**
   * Getting dependents
   */
  public getDependents() {
    return this.dependents || null;
  }
  /**
   *
   * @param dependents Setting dependents
   */
  setDependents(dependents: DependentDetails[]) {
    this.dependents = dependents;
  }
  /**
   * Getting imprisonment
   */
  public getImprisonment() {
    return this.imprisonmentDetails;
  }
  /**
   *
   * @param imprisonmentDetails Setting imprisonmentDetails
   */
  setImprisonment(imprisonmentDetails: ImprisonmentDetails) {
    this.imprisonmentDetails = imprisonmentDetails;
  }
  /**
   * Method to handle error while service call fails
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getBenefitStartAndEligibilityDate(
    sin: number,
    benefitType: string,
    imprisonmentDetails?: ImprisonmentDetails,
    heirDetails?: HeirDetailsRequest,
    requestDate?: GosiCalendar,
    benefitRequestId?: number
  ): Observable<BenefitStartDate> {
    const url = `/api/v1/contributor/${sin}/benefit/start-date`;
    let params = new HttpParams();
    params = params.set('benefitType', benefitType);

    if (imprisonmentDetails) {
      const enteringDate = imprisonmentDetails.enteringDate
        ? moment(imprisonmentDetails.enteringDate.gregorian).format('YYYY-MM-DD')
        : null;
      const releaseDate = imprisonmentDetails.releaseDate
        ? moment(imprisonmentDetails.releaseDate.gregorian).format('YYYY-MM-DD')
        : null;
      const hasCertificate = imprisonmentDetails.hasCertificate ? 'true' : 'false';
      params = params.set('hasCertificate', hasCertificate);
      if (enteringDate != null) {
        params = params.set('enteringDate', enteringDate);
      }
      if (releaseDate != null) {
        params = params.set('releaseDate', releaseDate);
      }
    }
    if (requestDate) {
      const requestDateFormatted = moment(requestDate.gregorian).format('YYYY-MM-DD');
      params = params.set('requestDate', requestDateFormatted);
    }
    if (heirDetails && heirDetails?.eventDate && heirDetails?.eventDate?.gregorian) {
      const eventDate = moment(heirDetails?.eventDate?.gregorian).format('YYYY-MM-DD');
      params = params.set('missingDate', eventDate);
    }
    if (benefitRequestId) {
      params = params.append('benefitRequestId', benefitRequestId.toString());
    }
    return this.http.get<BenefitStartDate>(url, { params });
  }

  getDependentHistoryLOV(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'AnnuityDependentFilterEventType'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }

  hasvalidValue(val) {
    if (val !== null && val.length > 0) {
      return true;
    }
    return false;
  }
  convertToDDMMYYYY = function (date: string) {
    if (date) {
      return moment(date).format('DD-MM-YYYY');
    }
    return null;
  };

  filterDependentHistory(socialInsuranceNo, benefitRequestId, dependentHistoryFilter: DependentHistoryFilter) {
    let filterUrl = `/api/v1/contributor/${socialInsuranceNo}/benefit/${benefitRequestId}/dependent-history?`;
    const dependentEvent = dependentHistoryFilter.dependentEvents;
    const dependentName = dependentHistoryFilter.dependentNames;
    let startDate = null;
    let endDate = null;
    let paramExists = false;
    if (dependentHistoryFilter.benefitPeriodFrom && dependentHistoryFilter.benefitPeriodTo) {
      startDate = this.convertToDDMMYYYY(dependentHistoryFilter.benefitPeriodFrom.toString());
      endDate = this.convertToDDMMYYYY(dependentHistoryFilter.benefitPeriodTo.toString());
    }
    if (this.hasvalidValue(dependentEvent)) {
      for (let i = 0; i < dependentEvent.length; i++) {
        if (paramExists) {
          const statusParam = `&dependentEventTypes=${dependentEvent[i].english}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `dependentEventTypes=${dependentEvent[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&dependentEventTypes=${dependentEvent[i].english}`;
            filterUrl = filterUrl.concat(statusParam);
          }
          paramExists = true;
        }
      }
    }
    if (this.hasvalidValue(dependentName)) {
      for (let i = 0; i < dependentName.length; i++) {
        if (paramExists) {
          const statusParam = `&dependents=${dependentName[i]}`;
          filterUrl = filterUrl.concat(statusParam);
        } else {
          if (i === 0) {
            const statusParam = `dependents=${dependentName[i]}`;
            filterUrl = filterUrl.concat(statusParam);
          } else {
            const statusParam = `&dependents=${dependentName[i]}`;
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
    return this.http.get<DependentHistoryDetails>(filterUrl).pipe(
      map(val => val.dependentsDetails),
      catchError(err => this.handleError(err))
    );
  }
  // This method is to cancel benefit request
  cancelBenefitRequest(sin: number, benefitRequestId: number, referenceNo: number): Observable<BilingualText> {
    let params = new HttpParams();
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/revert/_status`;
    if (referenceNo) {
      params = params.set('referenceNo', referenceNo.toString());
    }
    return this.http.put<BilingualText>(url, params);
  }

  getBankCommitmentCertificate(sin: number, benefitRequestId: number, data: AnnualNotificationCertificate) {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/annual-notification/certificate`;
    return this.http
      .post<ValidateRequest>(url, data, { responseType: 'blob' as 'json' })
      .pipe(catchError(this.parseErrorBlob));
  }

  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();

    const obs = new Observable((observer: any) => {
      reader.onloadend = e => {
        observer.error(reader.result);
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }
}
