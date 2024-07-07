/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BranchDetailsWrapper, EstablishmentSearchResponse, EstablishmentStarredList } from '../models';
import { Observable } from 'rxjs';
import { Establishment, AlertService, BilingualText, EstablishmentStatusEnum } from '@gosi-ui/core';
import { catchError, filter, map } from 'rxjs/operators';
import { SearchRequest, DashboardBaseService } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends DashboardBaseService {
  constructor(readonly http: HttpClient, public alertService: AlertService) {
    super(http);
  }
  /**
   * method to get branch lists
   */
  getBranchList(estListRequest: SearchRequest): Observable<BranchDetailsWrapper> {
    if (estListRequest && estListRequest.searchParam && estListRequest.searchParam.personIdentifier) {
      const url = `/api/v1/admin/${estListRequest.searchParam.personIdentifier}/establishment?branchFilter.includeBranches=false&fetchForDashboard=true`;
      return this.http
        .get<BranchDetailsWrapper>(url, { headers: { ignoreLoadingBar: '' } })
        .pipe(
          map(res => {
            res.branchList = res.branchList.filter(
              item =>
                item.status.english === EstablishmentStatusEnum.REGISTERED ||
                item.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS ||
                item.status.english === EstablishmentStatusEnum.CLOSED
            );
            return res;
          })
        );
    }
  }
  /**
   * This method is to get establishment details
   */
  getEstablishmentDetails(registrationNo: number): Observable<Establishment> {
    const establishmentUrl = `/api/v1/establishment/${registrationNo}?includeOnlyTotalCount=true`;
    return this.http
      .get<Establishment>(establishmentUrl, { headers: { ignoreLoadingBar: '' } })
      .pipe(
        catchError(error => {
          this.alertService.showError(error.error.message);
          throw error;
        })
      );
  }
  getDashboardEstablishmentList(
    listRequest: SearchRequest,
    fetchBranches = false
  ): Observable<EstablishmentSearchResponse> {
    let establishmentlistUrl = `${this.baseUrl}/admin/${listRequest.searchParam.personIdentifier}/dashboard?page.pageNo=${listRequest.limit.pageNo}&page.size=${listRequest.limit.pageSize}`;
    if (listRequest.searchKey) {
      establishmentlistUrl += `&searchParam=${listRequest.searchKey}`;
    }
    establishmentlistUrl += `&fetchBranches=${fetchBranches}`;

    if (listRequest.searchParam.registrationNo) {
      establishmentlistUrl += `&mainEstRegNo=${listRequest.searchParam.registrationNo}`;
    }
    if (listRequest?.filter?.status && listRequest.filter.status.length > 0) {
      listRequest.filter.status.map((value: BilingualText) => {
        establishmentlistUrl += `&branchFilter.listOfStatuses=${value.english}`;
      });
    }
    if (listRequest?.filter?.filedOffice && listRequest.filter.filedOffice.length > 0) {
      listRequest.filter.filedOffice.map((value: BilingualText) => {
        establishmentlistUrl += `&branchFilter.location=${value.english}`;
      });
    }
    if (listRequest?.filter?.villageId && listRequest.filter.villageId.length > 0) {
      listRequest.filter.villageId.forEach((value: number) => {
        establishmentlistUrl += `&branchFilter.village=${value}`;
      });
    }
    if (listRequest?.sort?.column && listRequest?.sort?.direction)
      establishmentlistUrl += `&sort.column=${listRequest.sort.column}&sort.direction=${listRequest.sort.direction}`;
    return this.http.get<EstablishmentSearchResponse>(establishmentlistUrl, { headers: { ignoreLoadingBar: '' } });
  }
  postStarredEstablishment(establishmentStarredList:EstablishmentStarredList, idNumber:Number){
    const url = `/api/v1/admin/${idNumber}/establishment/star`;
    return this.http.post(url,establishmentStarredList);
  }
  deleteStarredEstablishment(establishmentStarredList:EstablishmentStarredList, idNumber:Number){
    const url = `/api/v1/admin/${idNumber}/establishment/star`;
    return this.http.request('delete',url,{body:establishmentStarredList})
  }
}
