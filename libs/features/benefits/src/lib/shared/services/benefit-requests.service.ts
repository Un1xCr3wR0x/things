import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { MyBenefitRequestsResponse } from '../models/my-benefit-requests-response';
import {
  BenefitOverviewDetails,
  BenefitRequestFilter,
  Benefits,
  ValidateHeirBenefit,
  ValidateHeirBenefitResponse
} from '../models';
import { LovList, Lov, GosiCalendar } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BenefitRequestsService {
  private lovUrl = '/api/v1/lov';
  constructor(private http: HttpClient) {}

  getAllBenefitTranscations(
    pageNo?: number,
    pageSize?: number,
    status?: string,
    benefitGroup?: string,
    benefitRequestFilter?: BenefitRequestFilter
  ) {
    const url = `/api/v1/benefit`;
    let params = new HttpParams();
    let startDate = null;
    let endDate = null;
    const benefitTypes = benefitRequestFilter?.benefitTypes;
    if (pageNo && pageSize) {
      params = params.set('pageNo', pageNo.toString()).set('pageSize', pageSize.toString());
    }
    if (status) {
      params = params.set('status', status);
    }
    if (benefitGroup) {
      params = params.set('benefitGroup', benefitGroup);
    }
    if (benefitRequestFilter?.searchKey) {
      params = params.set('searchKey', benefitRequestFilter.searchKey);
    }
    if (benefitRequestFilter?.requestPeriodFrom && benefitRequestFilter?.requestPeriodTo) {
      startDate = this.convertToDDMMYYYY(benefitRequestFilter?.requestPeriodFrom?.toString());
      endDate = this.convertToDDMMYYYY(benefitRequestFilter?.requestPeriodTo?.toString());
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    if (benefitTypes && this.hasvalidValue(benefitTypes)) {
      benefitTypes.forEach(benefitType => {
        params = params.append('benefitType', benefitType.english);
      });
    }
    if (benefitRequestFilter?.sortType) {
      params = params.set('sortOrder', benefitRequestFilter.sortType);
    }
    if (benefitRequestFilter?.requestSortParam) {
      params = params.set('sortBy', benefitRequestFilter.requestSortParam);
    }
    //params = params.set('benefitGroup',	'Occupational Disability') ;
    return this.http.get<MyBenefitRequestsResponse>(url, { params });
  }

  getEachNoOfBenefits() {
    const url = `/api/v1/benefit/overview`;
    return this.http.get<BenefitOverviewDetails>(url);
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

  /**
   * This method is to fetch benefit request filter benefit type values.
   */
  getbenefitFilterType(): Observable<LovList> {
    return this.http
      .get<Lov[]>(this.lovUrl, {
        params: {
          category: 'ANNUITIES',
          domainName: 'AnnuityBenefitType'
        }
      })
      .pipe(map((response: Lov[]) => new LovList(response)));
  }

  /**
   * fetching the Annuity Benefits list
   */
  getEligibleBenefitByBenefitType(
    sin: number,
    benefitType: string,
    requestDate?: GosiCalendar,
    deathDate?: GosiCalendar,
    missingDate?: GosiCalendar,
    benefitRequestId?: number,
    isPpaOhDeath?: boolean
  ): Observable<Benefits> {
    const url = `/api/v1/contributor/${sin}/benefit/eligibility`;
    let params = new HttpParams();
    params = params.set('benefitType', benefitType.toString());
    if (requestDate) {
      const reqDate = moment(requestDate.gregorian).format('YYYY-MM-DD');
      params = params.set('requestDate', reqDate.toString());
    }
    if (deathDate) {
      const death = moment(deathDate?.gregorian)?.format('YYYY-MM-DD');
      params = params.set('deathDate', death.toString());
    }
    if (missingDate) {
      const missing = moment(missingDate?.gregorian)?.format('YYYY-MM-DD');
      params = params.set('missingDate', missing.toString());
    }
    if (benefitRequestId) {
      params = params.set('benefitRequestId', benefitRequestId.toString());
    }
    if (isPpaOhDeath !== null && isPpaOhDeath !== undefined) {
      params = params.set('isPpaOhDeath', isPpaOhDeath?.toString());
    }
    // if() {
    params = params.set('eligibilityOnRequestDate', 'true');
    // }
    return this.http.get<Benefits[]>(url, { params }).pipe(
      map(res => {
        const eligibleBenefit = res.find(val => val.benefitType.english === benefitType);
        return eligibleBenefit ? eligibleBenefit : res[0];
      })
    );
  }

  validateBenefit(
    sin: number,
    benefitType: string,
    data: ValidateHeirBenefit
  ): Observable<ValidateHeirBenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/_validate`;
    let params = new HttpParams();
    params = params.set('benefitType', benefitType.toString());
    return this.http.post<ValidateHeirBenefitResponse>(url, data, { params });
  }
}
