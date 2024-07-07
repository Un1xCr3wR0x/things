import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SendSMSResponse } from '../models/send-smsresponse';
import { SMSResponseType } from '../models/sms-response-type';

@Injectable({
  providedIn: 'root'
})
export class SendSMSNotificationService {
  readonly interceptUrl = '/denodo-api';

  constructor(readonly http: HttpClient) {}

  getListOfResponses(selectedLang: string, sourceSystem: string) {
    //const listUrl = `${this.interceptUrl}/customer360/bv_SMS_Template/views/bv_SMS_Template?$filter=%22P_LANGUAGE%22+in+%27${selectedLang}%27+AND+%22P_SOURCESYSTEM%22+in+%27${sourceSystem}%27`;
    const listUrl = `/api/v1/denodosmsapiproxy/server/customer360/bv_SMS_Template/views/bv_SMS_Template?P_LANGUAGE=${selectedLang}&P_SOURCESYSTEM=${sourceSystem}`;
    return this.http.get<{ elements: SMSResponseType[] }>(listUrl);
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
  SendSMS(recepientNumber: string, message: string): Observable<SendSMSResponse> {
    const smsUrl = `/api/v1/yamamah/SendSMS`;
    message = message.replace(/"/g, '');
    message = message.replace(/\\n/gm, '');
    return this.http.post<SendSMSResponse>(smsUrl, {
      RecepientNumber: `${recepientNumber}`,
      Message: `${message}`
    });
  }

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('x-api', 'false');
    return headers;
  }
}
