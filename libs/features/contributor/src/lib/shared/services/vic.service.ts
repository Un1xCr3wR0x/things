/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, Lov } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  HealthRecordWrapper,
  RegistrationPurpose, RegistrationPurposeResponse,
  VicContributionDetails,
  VicEngagementDetails,
  VICWageCategoryWrapper
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class VicService {
  constructor(private http: HttpClient) {}

  /** Method to get VIC wage categories. */
  getVICWageCategories(nin: number, purpose?: string, transactionType?: string): Observable<VICWageCategoryWrapper> {
    let url = `/api/v1/vic/${nin}/engagement/wage-category`;
    if (purpose) url += `?purposeOfRegistration=${purpose}`;
    if (transactionType) url += `&transactionType=${transactionType}`;
    return this.http.get<VICWageCategoryWrapper>(url);
  }

  /** Method to get purpose of rgistration. */
  getPurposeOfRegistration(nin: number): Observable<Lov[]> {
    const url = `/api/v1/vic/${nin}/engagement/registration-purpose`;
    return this.http.get<BilingualText[]>(url).pipe(
      map(res => {
        let list: Lov[];
        list = res.map((item, index) => {
          const lovItem = new Lov();
          lovItem.sequence = index;
          lovItem.value = item;
          return lovItem;
        });
        return list;
      })
    );
  }

  /** Method to fetch health records. */
  fetchHealthRecords(): Observable<HealthRecordWrapper> {
    const url = `/api/v1/vic/health-record`;
    return this.http.get<HealthRecordWrapper>(url);
  }

  /** Method to search VIC wage update. */
  getVicEngagements(nin: number): Observable<VicEngagementDetails[]> {
    const url = `/api/v1/vic/${nin}/engagement`;
    return this.http.get<VicEngagementDetails[]>(url);
  }

  /** Method to get VIC engagement by id. */
  getVicEngagementById(socialInsuranceNo: number, engagementId: number): Observable<VicEngagementDetails> {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}`;
    return this.http.get<VicEngagementDetails>(url);
  }

  /** Method to get vic contribution details */
  getVicContributionDetails(
    nin: number,
    engagementId: number,
    date?: string,
    type?: string
  ): Observable<VicContributionDetails> {
    const url = `/api/v1/vic/${nin}/engagement/${engagementId}/contribution-details`;
    let params = new HttpParams();
    if (date) params = params.set('terminationDate', date);
    if (type) params = params.set('transactionType', type);
    return this.http.get<VicContributionDetails>(url, { params });
  }

  /** Method to revert transaction. */
  revertTransaction(socialInsuranceNo: number, engagementId: number, referenceNo: number) {
    const url = `/api/v1/vic/${socialInsuranceNo}/engagement/${engagementId}/transaction/${referenceNo}/revert`;
    return this.http.put<null>(url, []);
  }


  /** Method to get purpose of rgistration . */
  getPurposeOfEngagement(nin: number): Observable<RegistrationPurpose> {
    const url = `/api/v1/vic/${nin}/engagement-purpose`;
    return this.http.get<RegistrationPurposeResponse>(url).pipe(
      map(res => {
        let list: Lov[];
        const registrationPurpose: RegistrationPurpose = new RegistrationPurpose();
        list = res.registrationPurpose.map((item, index) => {
          const lovItem = new Lov();
          lovItem.sequence = index;
          lovItem.value = item;
          return lovItem;
        });
        registrationPurpose.registrationPurpose = list;
        registrationPurpose.pensionReformEligible = res.pensionReformEligible
        return registrationPurpose;
      })
    );
    // const registrationPurpose: RegistrationPurpose = new RegistrationPurpose();
    // const list: Lov[] = [];
    // const lovItem = new Lov()
    // lovItem.value = {
    //   english: "Working outside of Saudi Arabia",
    //   arabic: "عامل في خارج المملكة"
    // }
    // lovItem.sequence = 0;
    // list.push(lovItem);
    // registrationPurpose.pensionReformEligible = true;
    // registrationPurpose.registrationPurpose = list;
    // return of(registrationPurpose);
  }
}
