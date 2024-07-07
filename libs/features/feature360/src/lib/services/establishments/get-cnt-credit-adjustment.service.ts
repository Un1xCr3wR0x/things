import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntCreditAdjustment } from '../../models/establishments/get-cnt-credit-adjustment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntCreditAdjustmentService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntCreditAdjustmentService
   */
  getCreditAdjustment(fromDate: Date, establishmentId: number): Observable<GetCntCreditAdjustment> {
    const getCreditAdjustmentUrl = `${
      this.interceptUrl
    }/customer360/bv_cnt_get_credit_adjustment/views/bv_cnt_get_credit_adjustment?$filter=p_fromdate+in+%27${this.getDate(
      fromDate
    )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntCreditAdjustment[] }>(getCreditAdjustmentUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
