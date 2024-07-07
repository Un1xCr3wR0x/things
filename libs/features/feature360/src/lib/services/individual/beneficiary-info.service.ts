import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BeneficiaryInfo } from '../../models/individual/beneficiary-info';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryInfoService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof BeneficiaryInfoService
   */
  getBeneficiaryInfoDetails(registrationNo: number): Observable<BeneficiaryInfo> {
    const getBeneficiaryInfoDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/fv_beneficiary_info?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: BeneficiaryInfo[] }>(getBeneficiaryInfoDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
