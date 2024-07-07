import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntUnPaidAmount } from '../../models/establishments/get-cnt-un-paid-amount';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntUnPaidAmountService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntUnPaidAmountService
   */
  getCntUnPaidAmount(establishmentId: number): Observable<GetCntUnPaidAmount> {
    const getCntUnPaidAmountUrl = `${this.interceptUrl}/customer360/bv_cnt_unpaid_amount/views/bv_cnt_unpaid_amount?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntUnPaidAmount[] }>(getCntUnPaidAmountUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
