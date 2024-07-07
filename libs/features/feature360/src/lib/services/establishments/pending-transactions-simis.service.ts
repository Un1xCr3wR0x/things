import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PendingTransactionsSimis } from '../../models/establishments/pending-transactions-simis';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class PendingTransactionsSimisService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof PendingTransactionsSimisService
   */
  getPendingTransactionsSimis(registrationNo: number): Observable<PendingTransactionsSimis[]> {
    const getPendingTransactionsSimisUrl = `${this.interceptUrl}/customer360/bv_pending_transactions_simis/views/bv_pending_transactions_simis?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: PendingTransactionsSimis[] }>(getPendingTransactionsSimisUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements));
  }
}
