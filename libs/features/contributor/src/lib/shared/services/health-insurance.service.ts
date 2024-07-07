import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  InsuredList,
  UninsuredList,
  InsuranceInProgressList,
  ComplianceDetails, HealthInsuranceInfoRequest
} from "@gosi-ui/features/contributor";

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {
  /**
   * This method is to create a service
   * @param http
   */
  constructor(readonly http: HttpClient) {}

  insuredListCall(healthInsuranceInfoRequest: HealthInsuranceInfoRequest): Observable<InsuredList> {
    const apiUrl = '/api/v1/insurance-platform/CHI-Insured-Employees/Medical/Insured';
    return this.http.post<InsuredList>(apiUrl,healthInsuranceInfoRequest);
  }
  uninsuredListCall(healthInsuranceInfoRequest:HealthInsuranceInfoRequest ): Observable<UninsuredList> {
    const apiUrl = '/api/v1/insurance-platform/CHI-Uninsured-Employees/Medical/Uninsured';
    return this.http.post<UninsuredList>(apiUrl,healthInsuranceInfoRequest);
  }
  onHoldListCall(healthInsuranceInfoRequest:HealthInsuranceInfoRequest): Observable<InsuranceInProgressList> {
    const apiUrl = '/api/v1/insurance-platform/CHI-OnHold-Employees/Medical/OnHold';
    return this.http.post<InsuranceInProgressList>(apiUrl,healthInsuranceInfoRequest);
  }
  complianceDetailsCall(healthInsuranceInfoRequest:HealthInsuranceInfoRequest): Observable<ComplianceDetails> {
    const apiUrl = '/api/v1/insurance-platform/CHI-Compliance-Details/Medical/Compliance';
    return this.http.post<ComplianceDetails>(apiUrl,healthInsuranceInfoRequest);
  }
}
