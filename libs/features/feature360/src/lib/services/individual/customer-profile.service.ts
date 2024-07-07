import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerProfile } from '../../models/individual/customer-profile';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof CustomerProfileService
   */
  getCustomerProfileDetails(registrationNo: number): Observable<CustomerProfile> {
    const getCustomerProfileDetailsUrl = `${this.interceptUrl}/customer360/customer360/views/fv_customer_profile?$filter=id+in+%27${registrationNo}%27`;
    return this.http
      .get<{ elements: CustomerProfile[] }>(getCustomerProfileDetailsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }
}
