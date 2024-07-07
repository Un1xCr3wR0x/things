import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contributor } from '@gosi-ui/core';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {
  constructor(private http: HttpClient) {}

  getContributorByPersonId(personId: number): Observable<Contributor> {
    const url = `/api/v1/contributor`;
    let params = new HttpParams();
    params = params.set('personId', personId?.toString());
    return this.http.get<Contributor>(url, { params });
  }
  getContributorIndividual(identifier: number): Observable<Contributor> {
    const url = `/api/v1/contributor/${identifier}`;
    return this.http.get<Contributor>(url);
  }
}
