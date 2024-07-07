import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerOverallSatisfactionResponse, CustomerSurveyResponse, SurveyResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerSurveyService {
  constructor(readonly http: HttpClient) {}

  getCustomerOverallSatisfaction(identifier): Observable<CustomerOverallSatisfactionResponse> {
    const url = `/api/v1/denodosurveyapiproxy/server/customer360/bv_get_customer_overall_satisfaction/views/bv_get_customer_overall_satisfaction?personidentifier=${identifier}`;
    return this.http.get<CustomerOverallSatisfactionResponse>(url);
  }

  getCustomerSurvey(page, identifier, records): Observable<CustomerSurveyResponse> {
    const url = `/api/v1/denodosurveyapiproxy/server/customer360/bv_getcustomersurvey/views/bv_getcustomersurvey?page=${page}&personidentifier=${identifier}&records=${records}`;
    return this.http.get<CustomerSurveyResponse>(url);
  }

  getSurveyResponse(uuid): Observable<SurveyResponse> {
    const url = `/api/v1/denodosurveyapiproxy/server/customer360/bv_t_surveyresponse/views/bv_t_surveyresponse?uuid=${uuid}`;
    return this.http.get<SurveyResponse>(url);
  }




}
