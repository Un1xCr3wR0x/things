import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntDebitAdjustmentAndPaidViolation } from '../../models/establishments/get-cnt-debit-adjustment-and-paid-violation';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntDebitAdjustmentAndPaidViolationService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntDebitAdjustmentAndPaidViolationService
   */
  getDebitAdjustmentAndPaidViolation(
    fromDate: Date,
    establishmentId: number
  ): Observable<GetCntDebitAdjustmentAndPaidViolation> {
    const getDebitAdjustmentAndPaidViolationUrl = `${
      this.interceptUrl
    }/customer360/bv_cnt_get_debit_adjustment_and_paid_violation/views/bv_cnt_get_debit_adjustment_and_paid_violation?$filter=p_fromdate+in+%27${this.getDate(
      fromDate
    )}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntDebitAdjustmentAndPaidViolation[] }>(getDebitAdjustmentAndPaidViolationUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements?.[0]));
  }
}
