import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastWageYear } from '../../models/establishments/last-wage-year';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class LastWageYearService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof LastWageYearService
   */
  getLastWageYear(establishmentId: number): Observable<LastWageYear> {
    const getLastWageYearUrl = `${this.interceptUrl}/customer360/bv_last_wage_year/views/bv_last_wage_year?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: LastWageYear[] }>(getLastWageYearUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
