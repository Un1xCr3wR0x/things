import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Merged } from '../../models/individual/merged';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class MergedService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof MergedService
   */
  getMergedDetails(registrationNo: number): Observable<Merged[]> {
    const getMergedDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/fv_merged?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: Merged[] }>(getMergedDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements));
  }
}