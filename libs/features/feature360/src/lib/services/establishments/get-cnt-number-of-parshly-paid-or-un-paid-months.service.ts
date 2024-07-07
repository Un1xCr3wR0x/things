import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntNumberOfParshlyPaidOrUnPaidMonths } from '../../models/establishments/get-cnt-number-of-parshly-paid-or-un-paid-months';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntNumberOfParshlyPaidOrUnPaidMonthsService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntNumberOfParshlyPaidOrUnPaidMonthsService
   */
  getCntNumberOfParshlyPaidOrUnPaidMonths(
    establishmentId: number
  ): Observable<GetCntNumberOfParshlyPaidOrUnPaidMonths> {
    const getCntNumberOfParshlyPaidOrUnPaidMonthsUrl = `${this.interceptUrl}/customer360/bv_cnt_number_of_parshly_paid_or_unpaid_months/views/bv_cnt_number_of_parshly_paid_or_unpaid_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntNumberOfParshlyPaidOrUnPaidMonths[] }>(getCntNumberOfParshlyPaidOrUnPaidMonthsUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements?.[0]));
  }
}
