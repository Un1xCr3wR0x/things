import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntNumberOfTotallyPaidMonths } from '../../models/establishments/get-cnt-number-of-totally-paid-months';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntNumberOfTotallyPaidMonthsService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntNumberOfTotallyPaidMonthsService
   */
  getCntNumberOfTotallyPaidMonths(establishmentId: number): Observable<GetCntNumberOfTotallyPaidMonths> {
    const getCntNumberOfTotallyPaidMonthsUrl = `${this.interceptUrl}/customer360/bv_cnt_number_of_totally_paid_months/views/bv_cnt_number_of_totally_paid_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntNumberOfTotallyPaidMonths[] }>(getCntNumberOfTotallyPaidMonthsUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements?.[0]));
  }
}
