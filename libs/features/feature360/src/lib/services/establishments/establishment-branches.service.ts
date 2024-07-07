import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentBranches } from '../../models/establishments/establishment-branches';
import { EstablishmentProfile } from '../../models/establishments/establishment-profile';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentBranchesService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentBranchesService
   */
  getEstablishmentBranches(establishmentId: number): Observable<EstablishmentBranches[]> {
    const getEstablishmentBranchesUrl = `${this.interceptUrl}/customer360/bv_establishment_branches/views/bv_establishment_branches?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: EstablishmentBranches[] }>(getEstablishmentBranchesUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements));
  }
}
