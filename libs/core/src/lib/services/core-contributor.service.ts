/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Contributor } from '../models/contributor';
import { ContributorStatus } from '../enums';
import { ContributorGlobalSearch, EngagementInformation } from '../models';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is used for common contributor apis
 */
export class CoreContributorService {
  /**Local variable */
  selectedSIN: number;
  registartionNo: number;
  personId: number;
  nin: number;
  isVic: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isVic$: Observable<boolean> = this.isVic.asObservable();
  unifiedRegNo: number;
  engagementId: number;
  contributorSearchList=[];
  NINDetails = [];
  IqamaDetails = [];
  GCCIdDetails = [];
  BordeNoDetails = [];
  PassportDetails = [];
  EmployerList = [];
  constructor(readonly http: HttpClient) {}

  /**
   * This method is to get the contributor details of the establishment
   *
   * @param registerationNo
   * @param socialInsuranceNumber
   */

  getContributor(registerationNo: number, socialInsuranceNumber: number): Observable<Contributor> {
    if (socialInsuranceNumber && registerationNo) {
      const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}`;
      return this.http.get<Contributor>(contributorUrl).pipe(
        tap({
          error: () => {
            this.selectedSIN = null;
          },
          complete: () => {
            this.selectedSIN = socialInsuranceNumber;
            this.registartionNo = registerationNo;
          }
        })
      );
    }
  }
  getEngagement(socialInsuranceNo): Observable<EngagementInformation> {
    const url = `/api/v1/contributor/${socialInsuranceNo}/search-engagements?searchType=${ContributorStatus.ACTIVE_AND_TERMINATED}&ignorePagination=true`;
    return this.http.get<EngagementInformation>(url);
  }
  getContributorGlobalSearch(identity):Observable<ContributorGlobalSearch>{
    const url=`/api/v1/contributor-search?searchKey=${identity}`;
    return this.http.get<ContributorGlobalSearch>(url);
  }

  resetValues() {
    this.selectedSIN = null;
    this.NINDetails = [];
    this.IqamaDetails = [];
    this.GCCIdDetails = [];
    this.BordeNoDetails = [];
    this.registartionNo = null;
    this.personId = null;
    this.nin = null;
    this.isVic = new BehaviorSubject<boolean>(false);
    this.unifiedRegNo = null;
    this.engagementId = null;
  }
}
