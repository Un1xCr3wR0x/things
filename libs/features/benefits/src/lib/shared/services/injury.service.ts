import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DisabilityTimeline, InjuryDetails, InjurySummary } from '../models';
import { InjuryWrapper } from '@gosi-ui/features/occupational-hazard/lib/shared/models/injury-wrapper';

@Injectable({
  providedIn: 'root'
})
export class InjuryService {
  baseUrl = '/api/v1';
  constructor(private http: HttpClient) {}

  getInjuryDetails() {
    const url = 'assets/data/injury-details.json';
    return this.http.get<InjuryDetails>(url);
  }
  /**
   * Method to get disability details
   * @param sin
   * @param benefitRequestId
   */
  getDisabilityDetails(sin: number, benefitRequestId: number) {
    const url = `${this.baseUrl}/contributor/${sin}/benefit/${benefitRequestId}/assessment-details`;
    return this.http.get<DisabilityTimeline>(url);
  }
  getInjurySummary(socialInsuranceNo: number, injuryId: number, isRequired = false) {
    // const url = 'assets/data/injury-summary.json';
    const url = `${this.baseUrl}/contributor/${socialInsuranceNo}/injury/${injuryId}?isChangeRequired=${isRequired}`;
    return this.http.get<InjuryWrapper>(url);
  }
}
