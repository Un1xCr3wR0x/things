import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerSurveyService {
  constructor(readonly http: HttpClient) {}

  getSurveyDetails(uuid): Observable<any> {
    const url = `/api/v1/survey/${uuid}`;
    return this.http.get<any>(url, { headers: { noAuth: 'true' } });
  }
  saveSurveyDetails(body, uuid): Observable<any> {
    const url = `/api/v1/survey/${uuid}`;
    return this.http.post(url, body, { headers: { noAuth: 'true' } });
  }
}
