import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentInfoByNinumber } from '../../models/establishments/establishment-info-by-ninumber';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentInfoByNinumberService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentInfoByNinumberService
   */
  getEstablishmentInfoByNinumber(
    authorisedId: number,
    niNumber: number,
    newNiNumber: number
  ): Observable<EstablishmentInfoByNinumber[]> {
    const getEstablishmentInfoByNinumberUrl = `${this.interceptUrl}/customer360/bv_establishment_info_by_ninumber/views/bv_establishment_info_by_ninumber?$filter=p_authorised_id+in+%27${authorisedId}%27+AND+p_ninumber+in+%27${niNumber}%27+AND+p_newninumber+in+%27${newNiNumber}%27`;
    return this.http
      .get<{ elements: EstablishmentInfoByNinumber[] }>(getEstablishmentInfoByNinumberUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements));
  }
}
