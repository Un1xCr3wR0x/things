import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntLastMonth } from '../../models/establishments/get-cnt-last-month';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntLastMonthService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntLastMonthService
   */
  getCntLastMonth(establishmentId: number): Observable<GetCntLastMonth> {
    const getCntLastMonthUrl = `${this.interceptUrl}/customer360/bv_cnt_get_last_month/views/bv_cnt_get_last_month?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntLastMonth[] }>(getCntLastMonthUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
