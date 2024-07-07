import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths } from '../../models/establishments/get-cnt-total-installment-amount-and-number-of-installment-months';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntTotalInstallmentAmountAndNumberOfInstallmentMonthsService
   */
  getCntTotalInstallmentAmountAndNumberOfInstallmentMonths(
    establishmentId: number
  ): Observable<GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths> {
    const getCntTotalInstallmentAmountAndNumberOfInstallmentMonthsUrl = `${this.interceptUrl}/customer360/bv_cnt_total_installment_amount_and_number_of_installments_months/views/bv_cnt_total_installment_amount_and_number_of_installments_months?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntTotalInstallmentAmountAndNumberOfInstallmentMonths[] }>(
        getCntTotalInstallmentAmountAndNumberOfInstallmentMonthsUrl,
        { headers: this.getHeaders() }
      )
      .pipe(map(res => res?.elements?.[0]));
  }
}
