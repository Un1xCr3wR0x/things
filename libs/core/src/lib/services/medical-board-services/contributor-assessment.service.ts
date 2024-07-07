import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contributors, PersonalInformation } from '../../models';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributorAssessmentService {
  _personId: number;
  person = new PersonalInformation();
  contributorType: string;

  constructor(readonly http: HttpClient) { }

  /** Method to handle error while service call fails */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  /** Method to get person by id. */
  getPersonById(personId: number) {
    const url = `/api/v1/person/${personId}`;
    return this.http.get<PersonalInformation>(url).pipe(
      tap(res => (this._personId = res.id)),
      catchError(err => this.handleError(err))
    );
  }
  /** Get contributor api */
  getContributor(
    registerationNo: number,
    socialInsuranceNumber: number,
    queryMap?: Map<string, boolean>
  ): Observable<Contributors> {
    if (socialInsuranceNumber) {
      const contributorUrl = `/api/v1/establishment/${registerationNo}/contributor/${socialInsuranceNumber}`;
      let params = new HttpParams();
      if (queryMap) {
        if (queryMap.get('checkBeneficiaryStatus')) params = params.set('checkBeneficiaryStatus', 'true');
        if (queryMap.get('fetchAddressFromWasel')) params = params.set('fetchAddressFromWasel', 'true');
        if (queryMap.get('absherVerificationRequired')) params = params.set('absherVerificationRequired', 'true');
      }
      return this.http
        .get<Contributors>(contributorUrl, { params })
        .pipe(
          tap(res => {
            this.person = res.person;
            this.contributorType = res.contributorType;
          }),
          catchError(err => this.handleError(err))
        );
    }
  }
}
