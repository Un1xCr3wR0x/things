import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveHeirData, ActiveHeirDetails, PaymentDetail } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HeirActiveService {
  private baseUrl = `/api/v1/contributor`;

  activeHeirDetails: ActiveHeirDetails;

  constructor(private http: HttpClient) {}

  setActiveHeirDetails(activeHeirDetails) {
    this.activeHeirDetails = activeHeirDetails;
  }

  getActiveHeirDetails() {
    return this.activeHeirDetails;
  }

  getHeirDetails(sin: number, benefitRequestId: number, identifier: number) {
    const url = `${this.baseUrl}/${sin}/benefit/${benefitRequestId}/heir/${identifier}/benefit`;
    return this.http.get<ActiveHeirData>(url);
  }

  public getPaymentDetails(sin: number, benefitRequestId: number, identifier: number) {
    const url = `${this.baseUrl}/${sin}/benefit/${benefitRequestId}/heir/${identifier}/payment-detail`;
    return this.http.get<PaymentDetail>(url);
  }
}
