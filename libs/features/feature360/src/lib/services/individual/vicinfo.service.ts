import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VICInfo } from '../../models/individual/vicinfo';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class VICInfoService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof VICInfoService
   */
  getVICInfoDetails(registrationNo: number): Observable<VICInfo> {
    const getVICInfoDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/bv_vic_info?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: VICInfo[] }>(getVICInfoDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
