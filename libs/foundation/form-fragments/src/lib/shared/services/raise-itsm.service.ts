import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lov, LovList } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItsmSubmitData } from '../models/itsm-submit';

@Injectable({
  providedIn: 'root'
})
export class RaiseItsmService {

  constructor(readonly http: HttpClient) { }

  type: any;

  /** This method is fetch the ITSM type list. */
  getITSMTypeList(): Observable<any> {
    const url = `/api/v1/lov?category=Itsm&domainName=Itsm`;
    return this.http.get<any>(url);
  }

  /** This method is fetch the ITSM Subtype list. */
  getITSMSubtypeList(subtype): Observable<any> {
    this.type = 'Itsm'+ (subtype.replace(/\s/g, "")).split('-')[1];
    const url = `/api/v1/lov?category=Itsm&domainName=${this.type}`;
    return this.http.get<any>(url);
  }

  /** This method is fetch the ITSM Subtype list2. */
  getITSMSubtype2List(subtype): Observable<any> {
    let type = this.type + subtype.replace(/\s/g, "");
    const url = `/api/v1/lov?category=Itsm&domainName=${type}`;
    return this.http.get<any>(url);
  }

  /** This method is used for submittting itsm request */
  submitITSMRequest(submitData: any): Observable<any> {
    const url = `/api/v2/support-ticket/Helpdesk_Submit_Service`;
    return this.http.post<any>(url, submitData);
  }
  
  /** This method is fetch the ITSM severity list. */
  getITSMSeverityList(): Observable<any> {
    const url = `/api/v1/lov?category=Itsm&domainName=ItsmSeverity`;
    return this.http.get<any>(url);
  }
}
