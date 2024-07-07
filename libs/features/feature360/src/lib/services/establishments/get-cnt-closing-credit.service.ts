import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCntClosingCredit } from '../../models/establishments/get-cnt-closing-credit';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntClosingCreditService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntClosingCreditService
   */
  getClosingCredit(fromDate: Date, establishmentId: number): Observable<GetCntClosingCredit> {
    const getClosingCreditUrl = `${
      this.interceptUrl
    }/customer360/bv_cnt_get_closing_credit/views/bv_cnt_get_closing_credit?$filter=p_fromdate+in+%27${this.getDate(
      fromDate
    )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntClosingCredit[] }>(getClosingCreditUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
