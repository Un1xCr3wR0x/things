import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  Benefits,
  BillDetails,
  BillDetailsWrapper,
  CoverageWrapper,
  OverallEngagementResponse,
  ProfileWrapper,
  SearchEngagementValues,
  VicContributionDetails,
  VicEngagementDetails
} from '../models';
import { OHResponse } from '../models/oh-response';
import { Observable } from 'rxjs';
import { IndividualSearchDetails } from '../../search/models';
import { PersonWrapperDto } from '@gosi-ui/core';
import { Pagination } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Injectable({
  providedIn: 'root'
})
export class IndividualDashboardService {
  constructor(readonly http: HttpClient) {}
  getEngagementDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE&ignorePagination=true`;
    return this.http.get<OverallEngagementResponse>(url).pipe(map(res => res.activeEngagements));
  }

  getOccupationalDetails(identifier: number, pagination?: Pagination) {
    let url = `/api/v1/contributor/${identifier}/injury?isTreatmentRequired=true&isIndividualDashboard=true`;
    if (pagination) url = url + `&pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}`;
    return this.http.get<OHResponse>(url);
  }

  getOccupationalDetailsForIndividual(identifier: number, pagination?: Pagination) {
    let url = `/api/v1/contributor/${identifier}/injury?isTreatmentRequired=true&isIndividualDashboard=false`;
    if (pagination) url = url + `&pageNo=${pagination.page.pageNo}&pageSize=${pagination.page.size}`;
    return this.http.get<OHResponse>(url);
  }
  /**
   * This method is used to fetch coverage details for an engagement
   */
  getContributoryCoverage(nin: number, engagementId: number): Observable<CoverageWrapper> {
    const coverageUrl = `/api/v1/contributor/${nin}/engagement/${engagementId}/contribution`;
    return this.http.get<CoverageWrapper>(coverageUrl);
  }
  getAnnuityBenefits(socialInsuranceNumber: number): Observable<Benefits[]> {
    const eligibleAnnuityListUrl = `/api/v1/contributor/${socialInsuranceNumber}/benefit/eligibility`;
    return this.http.get(eligibleAnnuityListUrl).pipe(
      map(res => {
        return <Benefits[]>res;
      })
    );
  }
  /**
   * method to get contributor details
   */
  getIndividualDetails(identifier: string): Observable<IndividualSearchDetails> {
    const contributorUrl = `/api/v1/contributor/${identifier}`;
    return this.http.get<IndividualSearchDetails>(contributorUrl);
  }
  /** Method to get vic contribution details */
  getVicContributionDetails(nin: number, engagementId: number): Observable<VicContributionDetails> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/contribution-details`;
    return this.http.get<VicContributionDetails>(url);
  }
  getContributorDetails(personId: number) {
    const url = `/api/v1/person?globalSearch=true&page.pageNo=0&page.size=10&searchParam=${personId}`;
    return this.http.get<PersonWrapperDto>(url);
  }
  getEngagementFullDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED&ignorePagination=true`;
    return this.http.get<SearchEngagementValues>(url);
  }
  getBillNumber(nin: number, startDate: string, pageLoad?: boolean): Observable<BillDetailsWrapper> {
    let billHistory = `/api/v1/contributor/${nin}/bill?includeBreakUp=false&startDate=${startDate}`;
    if (pageLoad) {
      billHistory = `/api/v1/contributor/${nin}/bill?includeBreakUp=false&startDate=${startDate}&pageLoad=${pageLoad}`;
    }
    return this.http.get<BillDetailsWrapper>(billHistory);
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
  getProfileDetails(personId: number) {
    if (personId) {
      const url = `/api/v1/profile/${personId}`;
      return this.http.get<ProfileWrapper>(url);
    }
  }
}
