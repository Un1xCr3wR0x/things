import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminWrapper } from '../../models/establishments/admin-wrapper';
import { EstablishmentOwnersWrapper } from '../../models/establishments/establishment-owners-wrapper';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to check the owner details of the establishment
   * @param registrationNo
   */
  getOwnerDetails(registrationNo: number): Observable<EstablishmentOwnersWrapper> {
    const getEstablishmentUrl = `/api/v1/establishment/${registrationNo}/owner`;
    return this.http.get<EstablishmentOwnersWrapper>(getEstablishmentUrl);
  }

  /**
   * Method to get the admins with or without referenceNo
   * @param registrationNo
   * @param referenceNo
   */
  getAdminsOfEstablishment(registrationNo: number): Observable<AdminWrapper> {
    const url = `/api/v1/establishment/${registrationNo}/admin`;
    return this.http.get<AdminWrapper>(url);
  }
}
