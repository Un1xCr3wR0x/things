import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentMOLAuthorizerDetail } from '../../models/establishments/establishment-molauthorizer-detail';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentMOLAuthorizerDetailService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentMOLAuthorizerDetailService
   */
  getEstablishmentMOLAuthorizerDetail(
    molestofficeid: number,
    molestid: number
  ): Observable<EstablishmentMOLAuthorizerDetail> {
    const getEstablishmentMOLAuthorizerDetailUrl = `${this.interceptUrl}/customer360/bv_establishment_mol_authorizer_detail/views/bv_establishment_mol_authorizer_detail?$filter=p_molestofficeid+in+%27${molestofficeid}%27+AND+p_molestid+in+%27${molestid}%27`;
    return this.http
      .get<{ elements: EstablishmentMOLAuthorizerDetail[] }>(getEstablishmentMOLAuthorizerDetailUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements?.[0]));
  }
}
