import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contributors } from '../../models/establishments/contributors';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContributorsService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof ContributorsService
   */
  getContributors(establishmentId: number): Observable<Contributors[]> {
    const getContributorsUrl = `${this.interceptUrl}/customer360/bv_contributors/views/bv_contributors?$filter=p_establishmentid+in+%27${establishmentId}%27`;
    return this.http
      .get<{ elements: Contributors[] }>(getContributorsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements));
  }
}
