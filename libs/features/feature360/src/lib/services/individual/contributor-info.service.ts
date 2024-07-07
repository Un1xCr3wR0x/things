import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContributorInfo } from '../../models/individual/contributor-info';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContributorInfoService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof ContributorInfoService
   */
  getContributorInfoDetails(registrationNo: number): Observable<ContributorInfo> {
    const getContributorInfoDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/fv_contributor_info?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: ContributorInfo[] }>(getContributorInfoDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
