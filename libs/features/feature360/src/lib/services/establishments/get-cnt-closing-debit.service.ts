import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntClosingDebit } from '../../models/establishments/get-cnt-closing-debit';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntClosingDebitService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntClosingDebitService
   */
  getClosingDebit(fromDate: Date, establishmentId: number): Observable<GetCntClosingDebit> {
    const getClosingDebitUrl = `${
      this.interceptUrl
    }/customer360/bv_cnt_get_closing_debit/views/bv_cnt_get_closing_debit?$filter=p_fromdate+in+%27${this.getDate(
      fromDate
    )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntClosingDebit[] }>(getClosingDebitUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
