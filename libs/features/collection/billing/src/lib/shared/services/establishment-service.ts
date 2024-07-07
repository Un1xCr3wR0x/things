/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BranchDetails, BranchDetailsWrapper, BranchFilter, EstablishmentDetails } from '../models';
import { EstablishmentOwnersWrapper } from '@gosi-ui/features/establishment/lib/shared/models';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  constructor(readonly http: HttpClient) {}

  /**
   *  This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentService
   */
  getEstablishment(registrationNo: number): Observable<EstablishmentDetails> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    return this.http.get<EstablishmentDetails>(getEstablishmentUrl);
  }

  /**
   * Method to get branch details of establishment.
   * @param registrationNo registartion number
   * @param param search param
   * @param branchFilter filter criteria
   */
  getBranchDetails(registrationNo: number, param?: string, branchFilter?: BranchFilter): Observable<BranchDetails[]> {
    const branchFilterParams = {
      branchFilter: branchFilter ? branchFilter : null,
      page: {
        pageNo: 0,
        size: 500
      },
      searchParam: param ? param : null
    };

    const branchViewUrl = `/api/v1/establishment/${registrationNo}/branches`;

    return this.http
      .post<BranchDetailsWrapper>(branchViewUrl, branchFilterParams)
      .pipe(map(response => response.branchList));
  }

  /**
   * This method is to check the owner details of the establishment
   * @param registrationNo
   */
  getOwnerDetails(registrationNo: number): Observable<EstablishmentOwnersWrapper> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
      return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl);
  }
}
