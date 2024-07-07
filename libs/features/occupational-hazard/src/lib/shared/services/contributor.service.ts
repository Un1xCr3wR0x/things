/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConstants, ApplicationTypeEnum, ApplicationTypeToken, StorageService } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contributor, ContributorSearchResult, Engagement, EngagementWrapper, Person } from '../models';
import { ContributorSearchPublic } from '../models/contributor-search-public';
import { OhService } from './oh.service';
import { WorkFlowType } from '../../shared';
import { SearchEngagementResponse } from '@gosi-ui/features/contributor';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is used for  contributor apis
 */
export class ContributorService {
  /**
   * Local Variables
   */
  private registrationNo: number;

  constructor(
    readonly http: HttpClient,
    readonly storageService: StorageService,
    readonly ohService: OhService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    const regNo = storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
    this.registrationNo = regNo != null ? parseInt(regNo, 10) : null;
  }

  /**
   * This method is to get contibutor details
   * @param registrationNo
   * @param socialInsuranceNo
   */
  getContributor(registrationNo, socialInsuranceNo): Observable<Contributor> {
    const isDisease =  this.ohService.getIsDisease();
    const isDiseaseedit = this.ohService.getIsDiseaseedit();
    let url = '';
    if (
      this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ||
      this.ohService.getWorkFlowType() === WorkFlowType.DISEASE || this.ohService.getWorkFlowType() === WorkFlowType.REOPEN_DISEASE || isDisease || isDiseaseedit
    ) {
      url = `/api/v1/contributor/${socialInsuranceNo}`;
    } else {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    }
    return this.http.get<Contributor>(url);
  }

  getDiseaseContributor(registrationNo, socialInsuranceNo): Observable<Contributor> {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE || this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      url = `/api/v1/contributor/${socialInsuranceNo}`;
    } else {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    }

    return this.http.get<Contributor>(url);
  }

  /**
   * This method is to get person details from contributor
   * @param registrationNo
   * @param socialInsuranceNo
   */
  getPerson(registrationNo, socialInsuranceNo): Observable<Person> {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      url = `/api/v1/contributor/${socialInsuranceNo}`;
    } else {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    }
    return this.http.get<Contributor>(url).pipe(map(res => res.person));
  }
  /**
   *
   * @param registrationNo Get Engagements by id
   * @param socialInsuranceNo
   * @param engagementId
   */
  getEngagementDetails(registrationNo, socialInsuranceNo, engagementId) {
    const getEngagementUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}`;
    return this.http.get<Engagement>(getEngagementUrl);
  }
  /**
   *
   * @param registrationNo Get establishment details on a particularDate
   */
  getEngagementOnDate(socialInsuranceNo, asOnDate) {
    const url = `/api/v1/contributor/${socialInsuranceNo}/engagements?asOnDate=${asOnDate}`;
    return this.http.get<EngagementWrapper>(url);
  }
  /**
   *
   * @param registrationNo Get establishment details
   */
  getEngagement(registrationNo, socialInsuranceNo) {
    const url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement?pageNo=0&pageSize=100`;
    return this.http.get<EngagementWrapper>(url);
  }
  /**
   * @param searchValue searching the contributor using NIN/IQAMA/BORDER NUMBER/SIN/PASSPORT NO
   */
  getContributorSearch(searchValue: string, regNumber: number) {
    let url = `/api/v1`;
    let returnValue = null;
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      url += `/establishment/${this.registrationNo}/contributor?identifier=${searchValue}&pageNo=0&pageSize=100`;
      returnValue = this.http.get<ContributorSearchPublic[]>(url);
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      if (regNumber) {
        url += `/contributor?identifier=${searchValue}&pageNo=0&pageSize=100&registrationNo=${regNumber}`;
      } else {
        url += `/contributor?identifier=${searchValue}&pageNo=0&pageSize=100`;
      }
      returnValue = this.http.get<ContributorSearchResult[]>(url);
    }
    return returnValue;
  }
  getEngagementFullDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/search-engagements?searchType=ACTIVE_AND_TERMINATED_AND_CANCELLED&ignorePagination=true`;
    return this.http.get<SearchEngagementResponse>(url);
  }
  getDiseasePerson(registrationNo, socialInsuranceNo): Observable<Person> {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      url = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}`;
    } else {
      url = `/api/v1/contributor/${socialInsuranceNo}`;
    }
    return this.http.get<Contributor>(url).pipe(map(res => res.person));
  }
}
