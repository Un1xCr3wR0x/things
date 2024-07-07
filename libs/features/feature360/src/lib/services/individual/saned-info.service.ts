import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SanedInfo } from '../../models/individual/saned-info';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class SanedInfoService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof SanedInfoService
   */
  getSanedInfoDetails(registrationNo: number): Observable<SanedInfo> {
    const getSanedInfoDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/fv_saned_info?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: SanedInfo[] }>(getSanedInfoDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
