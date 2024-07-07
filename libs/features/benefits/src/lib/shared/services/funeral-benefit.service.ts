import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { FuneralGrantBeneficiaryResponse } from '../models/funeral-grant-beneficiary-response';
import { Benefits } from '../models/benefits';
import { GosiCalendar } from '@gosi-ui/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { FuneralGrantSubmit } from '../models/funeral-grant';
import { BenefitResponse } from '../models/benefit-response';

@Injectable({
  providedIn: 'root'
})
export class FuneralBenefitService {
  constructor(private http: HttpClient, readonly router: Router) {}

  /**:
   * method to fetch beneficiary details
   */
  getBeneficiaryRequestDetails(
    sin: number,
    benefitRequestId: number,
    referenceNo: number
  ): Observable<FuneralGrantBeneficiaryResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/beneficiary`;
    let params = new HttpParams();
    params = params.set('referenceNo', referenceNo.toString());
    return this.http.get<FuneralGrantBeneficiaryResponse>(url, { params });
  }

  /**
   * fetching the Annuity Benefits list
   */
  public checkIfEligible(
    sin: number,
    benefitType: string,
    requestDate: GosiCalendar,
    deathDate?: GosiCalendar
  ): Observable<Benefits> {
    const url = `/api/v1/contributor/${sin}/benefit/eligibility`;
    const reqDate = moment(requestDate.gregorian).format('YYYY-MM-DD');
    const death = moment(deathDate?.gregorian)?.format('YYYY-MM-DD');
    let params = new HttpParams();
    params = params.set('deathDate', death.toString());
    params = params.set('benefitType', benefitType.toString());
    params = params.set('requestDate', reqDate.toString());
    return this.http.get<Benefits>(url, { params }).pipe(
      map(res => {
        return res[0];
      })
    );
  }

  submitFuneralGrant(
    benefitRequestId: number,
    sin: number,
    data: { comments: string },
    referenceNo: number
  ): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/funeral-grant`;
    const payload = { comments: data.comments || '', referenceNo: referenceNo };
    return this.http.patch<BenefitResponse>(url, payload);
  }
  applyFuneralGrant(sin: number, data: FuneralGrantSubmit): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/funeral-grant`;
    return this.http.post<BenefitResponse>(url, data);
  }
  updateFuneralGrant(benefitRequestId: number, sin: number, data: FuneralGrantSubmit): Observable<BenefitResponse> {
    const url = `/api/v1/contributor/${sin}/benefit/${benefitRequestId}/funeral-grant`;
    return this.http.put<BenefitResponse>(url, data);
  }
}
