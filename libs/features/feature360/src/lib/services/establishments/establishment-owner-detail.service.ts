import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentOwnerDetail } from '../../models/establishments/establishment-owner-detail';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentOwnerDetailService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentOwnerDetailService
   */
  getEstablishmentOwnerDetail(registrationNo: number): Observable<EstablishmentOwnerDetail> {
    const getEstablishmentOwnerDetailUrl = `${this.interceptUrl}/customer360/bv_establishment_owner_detail/views/bv_establishment_owner_detail?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: EstablishmentOwnerDetail[] }>(getEstablishmentOwnerDetailUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
