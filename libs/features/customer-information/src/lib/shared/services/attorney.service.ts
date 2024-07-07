import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AttorneyInquiryResponse } from '../models/attorney/attorney-inquiry-response';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttorneyService extends BaseService {

    constructor(readonly http: HttpClient) { super(); }

    /** Method to Get Heir from MOJ. */
    getHeirFromMOJ(personIdUser: number, personIdDead: number) {
        const url = `/api/v1/moj/inheritance?personIdUser=${personIdUser}&personIdDead=${personIdDead}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Marriage from MOJ. */
    getMarriageFromMOJ(personIdHusband: number, personIdWife: number) {
        const url = `/api/v1/moj/marriage?personIdHusband=${personIdHusband}&personIdWife=${personIdWife}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Marital incident from MOJ. */
    getMaritalIncidentFromMOJ(personIdHusband: number, personIdWife: number) {
        const url = `/api/v1/moj/marital/incident?personIdHusband=${personIdHusband}&personIdWife=${personIdWife}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Divorce from MOJ. */
    getDivorceFromMOJ(personIdHusband: number, personIdWife: number) {
        const url = `/api/v1/moj/divorce?personIdHusband=${personIdHusband}&personIdWife=${personIdWife}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Guardianship from MOJ. */
    getGuardianshipFromMOJ(personIdUser: number, custodianId: number, minorId: number) {
        const url = `/api/v1/moj/custody?PersonIdUser=${personIdUser}&CustodianId=${custodianId}&MinorId=${minorId}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Attorney from MOJ. */
    getAttorneyFromMOJ(attorneyNumber: number, agentId: number): Observable<AttorneyInquiryResponse> {
        const url = `/api/v1/moj/attorney/inquiry?attorneynumber=${attorneyNumber}&agentid=${agentId}`;
        return this.http.get<AttorneyInquiryResponse>(url);
    }

    /** Method to Get Custody Deed Text from MOJ. */
    getCustodyDeedTextFromMOJ(custodianId: number, custodyNumber: number) {
        const url = `/api/v1/moj/custody/deed?custodianid=${custodianId}&custodynumber=${custodyNumber}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }

    /** Method to Get Deed Text from MOJ. */
    getDeedTextFromMOJ(custodyNumber: number, custodianId: number) {
        const url = `/api/v1/moj/deedtext?custodynumber=${custodyNumber}&custodianid=${custodianId}`;
        //return this.http.get<{ elements: SMSResponseType[] }>(url);
    }
}