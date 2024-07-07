import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RasedAdvancedSearchDetails } from '../../models/establishments/rased-advanced-search-details';
import { RasedAdvancedSearchResult } from '../../models/establishments/rased-advanced-search-result';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class RasedAdvancedSearchDetailsService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof RasedAdvancedSearchDetailsService
   */
  getRasedAdvancedSearchDetails(registrationNo: number): Observable<RasedAdvancedSearchDetails[]> {
    const getRasedAdvancedSearchDetailsUrl = `${this.interceptUrl}/customer360/src_rased_advancedsearchdetails/views/src_rased_advancedsearchdetails?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: RasedAdvancedSearchResult[]; jsonarray: RasedAdvancedSearchDetails[] }>(
        getRasedAdvancedSearchDetailsUrl,
        { headers: this.getHeaders() }
      )
      .pipe(map(res => res?.elements[0].jsonarray));
  }
}
