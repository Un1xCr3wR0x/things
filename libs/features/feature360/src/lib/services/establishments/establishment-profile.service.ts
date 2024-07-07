import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentProfileService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentProfileService
   */
  getEstablishmentProfile(registrationNo: number): Observable<EstablishmentProfile> {
    const getEstablishmentProfileUrl = `${this.interceptUrl}/customer360/bv_establishment_profile/views/bv_establishment_profile/?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: EstablishmentProfile[] }>(getEstablishmentProfileUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
