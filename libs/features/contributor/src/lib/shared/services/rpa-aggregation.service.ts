/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BilingualText } from "@gosi-ui/core";
import { Observable} from 'rxjs';
import { RpaAppointmentDetails } from "../models/enter-rpa-appointment-details";
import { RpaEngResponse } from "../models/rpa-eng-response";
import { RpaSubmitResponse } from "../models/rpa-submit-response";
import { IPensionReformEligibility, SearchEngagementResponse } from "../models";


@Injectable({
    providedIn: 'root'
  })
export class RpaServices{
  message:BilingualText = new BilingualText();
  flag:boolean=false;

constructor ( readonly http:HttpClient){}


// Enter rpa eligibility check api
  verifyEligibility(
    personIdentifier: number,
    scheme: string
  ): Observable<any>{
    const url =`/api/v1/contributor/${personIdentifier}/rpa-request/eligibility?scheme=${scheme}`
    return this.http.post<any>(url,null);
  }

     /** Method to save engagement details in aggregate rpa */
  rpaSaveEngDetails(
    personIdentifier: number,
    isUpdated: boolean,
    scheme: string,
    appointmentDetails: RpaAppointmentDetails
  ): Observable<RpaEngResponse> {
    const url = `/api/v1/contributor/${personIdentifier}/rpa-request?isUpdated=${isUpdated}&scheme=${scheme}`;
    return this.http.post<RpaEngResponse>(url, appointmentDetails);
  } 

  cancelEnterRpaAggregation(
    personIdentifier: number,
    transactionId: number
  ): Observable<any>{
    const url =`/api/v1/contributor/${personIdentifier}/rpa-request/${transactionId}/revert`
    return this.http.put<any>(url,null);

  }

    getEngagementFullDetails(identifier: number) {
    const url = `/api/v1/contributor/${identifier}/rpa-request`;
    return this.http.get<SearchEngagementResponse>(url);
  }
  getEngagementFullDetailsCancelRpa(identifier: number, isCancelRpa :boolean) {
    const url = `/api/v1/contributor/${identifier}/rpa-request?isCancelRpa=${isCancelRpa}`;
    return this.http.get<SearchEngagementResponse>(url);
  }

  getEngagementFullDetailsCancelRpaMytxn(identifier: number, isCancelRpa :boolean, transactionId?:number) {
    const url = `/api/v1/contributor/${identifier}/rpa-request?isCancelRpa=${isCancelRpa}&transactionTraceId=${transactionId}`;
    return this.http.get<SearchEngagementResponse>(url);
  }

  submitCancellationReason(payload: {
    identifier: number,
    rpaRequestId: number,
  }) {
    const url = `/api/v1/contributor/${payload.identifier}/rpa-request/${payload.rpaRequestId}/cancel`;
    return this.http.put<any>(url, payload); 
  }
  
  

  submitRpaAggregation(
    personIdentifier: number,
    scheme: string,
    appointmentDetails: RpaAppointmentDetails
  ): Observable<RpaSubmitResponse>{
    const url =`/api/v1/contributor/${personIdentifier}/rpa-request/submit?scheme=${scheme}`
    return this.http.post<RpaSubmitResponse>(url, appointmentDetails);

  }

  submitCancelRpaAggregation(personIdentifier: number , requestId : number , cancelReason :string){
    console.log(personIdentifier,requestId,cancelReason , 'details in service');
    const url =`/api/v1/contributor/${personIdentifier}/rpa-request/${requestId}/cancel?cancellationReason=${cancelReason}`
    return this.http.put<any>(url,null);
  }

  checkEligibility(ninNumber: number): Observable<IPensionReformEligibility> {
    const url = `/api/v1/contributor/${ninNumber}/pension-reform-eligibility`;
    return this.http.get<IPensionReformEligibility>(url);
  }



}