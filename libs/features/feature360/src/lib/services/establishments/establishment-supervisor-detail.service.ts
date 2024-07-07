import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstablishmentSupervisorDetail } from '../../models/establishments/establishment-supervisor-detail';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentSupervisorDetailService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof EstablishmentSupervisorDetailService
   */
  getEstablishmentSupervisorDetail(registrationNo: number): Observable<EstablishmentSupervisorDetail[]> {
    const getEstablishmentSupervisorDetailUrl = `${this.interceptUrl}/customer360/bv_establishment_supervisor_detail/views/bv_establishment_supervisor_detail?$filter=p_registrationnumber+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: EstablishmentSupervisorDetail[] }>(getEstablishmentSupervisorDetailUrl, {
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements));
  }
}
