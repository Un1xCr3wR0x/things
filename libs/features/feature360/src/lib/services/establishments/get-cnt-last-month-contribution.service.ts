import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntLastMonthContribution } from '../../models/establishments/get-cnt-last-month-contribution';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntLastMonthContributionService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntLastMonthContributionService
   */
  getLastMonthContribution(fromDate: Date, establishmentId: number): Observable<GetCntLastMonthContribution> {
    const getLastMonthContributionUrl = `${
      this.interceptUrl
    }/customer360/bv_cnt_get_last_month_contribution/views/bv_cnt_get_last_month_contribution?$filter=p_fromdate+in+%27${this.getDate(
      fromDate
    )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntLastMonthContribution[] }>(getLastMonthContributionUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
