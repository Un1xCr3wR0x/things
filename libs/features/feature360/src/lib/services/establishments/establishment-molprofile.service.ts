import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentMOLProfile } from '../../models/establishments/establishment-molprofile';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentMOLProfileService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentMOLProfileService
   */
  getEstablishmentMOLProfile(molestid: number, molestofficeid: number): Observable<EstablishmentMOLProfile> {
    const getEstablishmentMOLProfileUrl = `${this.interceptUrl}/customer360/bv_establishment_mol_profile/views/bv_establishment_mol_profile?$filter=p_molestid+in+%27${molestid}%27+AND+p_molestofficeid+in+%27${molestofficeid}%27`;
    return this.http
      .get<{ elements: EstablishmentMOLProfile[] }>(getEstablishmentMOLProfileUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
