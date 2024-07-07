/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { throwError, Subject } from 'rxjs';
import { EstablishmentBranchWrapper } from '../models';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

const branchViewUrl = '/api/v1/establishment/';

@Injectable({
  providedIn: 'root'
})
export class BranchOverviewService {
  /**
   * Local variables
   */
  pageSize = 6;
  public searchTerm$ = new Subject<string>();

  constructor(readonly http: HttpClient) {}

  /**
   * Method to retrieve list of main & branch establishments
   * @memberof DashboardService
   * @param registrationNo
   */
  establishmentBranches(registrationNo: number, pageNo: number, searchTerm: string) {
    const branchFilterParams = {
      page: {
        pageNo: pageNo,
        size: this.pageSize
      },
      searchParam: searchTerm
    };

    return this.http
      .post<EstablishmentBranchWrapper>(branchViewUrl + registrationNo + '/branches', branchFilterParams)
      .pipe(
        map(resp => {
          return <EstablishmentBranchWrapper>resp;
        }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * This method is used to handle the error
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
