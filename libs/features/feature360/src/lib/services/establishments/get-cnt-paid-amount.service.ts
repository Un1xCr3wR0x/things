import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntPaidAmount } from '../../models/establishments/get-cnt-paid-amount';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntPaidAmountService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntPaidAmountService
   */
  getCntPaidAmount(establishmentId: number): Observable<GetCntPaidAmount> {
    const getCntPaidAmountUrl = `${this.interceptUrl}/customer360/bv_cnt_paid_amount/views/bv_cnt_paid_amount?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntPaidAmount[] }>(getCntPaidAmountUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
