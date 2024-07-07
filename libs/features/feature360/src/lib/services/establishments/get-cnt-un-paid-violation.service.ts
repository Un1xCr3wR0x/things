import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { GetCntUnPaidViolation } from '../../models/establishments/get-cnt-un-paid-violation';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class GetCntUnPaidViolationService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof GetCntUnPaidViolationService
   */
  getCntUnPaidViolation(entityId: number, establishmentId: number): Observable<GetCntUnPaidViolation> {
    const getCntUnPaidViolationUrl = `${this.interceptUrl}/customer360/bv_cnt_get_unpaid_violation/views/bv_cnt_get_unpaid_violation?$filter=p_entityid+in+%27${entityId}%27+AND+p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: GetCntUnPaidViolation[] }>(getCntUnPaidViolationUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
