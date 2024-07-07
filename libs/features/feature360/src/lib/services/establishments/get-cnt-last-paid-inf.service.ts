import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntLastPaidInf } from '../../models/establishments/get-cnt-last-paid-inf';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntLastPaidInfService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntLastPaidInfService
   */
  getCntLastPaidInf(establishmentId: number): Observable<GetCntLastPaidInf> {
    const getCntLastPaidInfUrl = `${this.interceptUrl}/customer360/bv_cnt_get_last_paid_inf/views/bv_cnt_get_last_paid_inf?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntLastPaidInf[] }>(getCntLastPaidInfUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
