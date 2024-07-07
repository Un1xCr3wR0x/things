import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntPaymentPeriod } from '../../models/establishments/get-cnt-payment-period';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntPaymentPeriodService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntPaymentPeriodService
   */
  getPaymentPeriod(): Observable<GetCntPaymentPeriod> {
    const getPaymentPeriodUrl = `${this.interceptUrl}/customer360/bv_cnt_get_payment_period/views/bv_cnt_get_payment_period`;
    return this.http
      .get<{ elements: GetCntPaymentPeriod[] }>(getPaymentPeriodUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
