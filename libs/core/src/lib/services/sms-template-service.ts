import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SMSResponseType } from '@gosi-ui/core/lib/models/sms-response-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaveSMSTemplateResponse } from '../models/save-sms-template-response';
import { SaveSMSSendMessageResponse } from '../models/save-sms-send-message-response';
import { SMSMaxid } from '../models/sms-maxid';
import { SMSTemplateResponse } from '../models/sms-template-response';
import { UpdateSMSTemplateResponse } from '../models/update-sms-template-response';
import { SaveFreeTextMessageResponse } from '../models/save-free-text-message-response';

@Injectable({
  providedIn: 'root'
})
export class SMSTemplateService {
  readonly interceptUrl = '/denodo-api';

  constructor(readonly http: HttpClient) {}

  //
  getListOfResponses(selectedLang: string) {
    //const listUrl = `${this.interceptUrl}/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS?$format=JSON`;
    const listUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS?$format=JSON`;
    return this.http.get<{ elements: SMSResponseType[] }>(listUrl);
  }

  saveSMSSendMessage(
    id: number,
    SMS_SYSTEM_ID: number,
    idMessage: number,
    idFreeText: number,
    phoneNumber: number,
    ninnumber: number,
    registrationNumber: number,
    username: string,
    creationtimestamp: string,
    createdby: string
  ) {
    //const saveSMSSendMessageUrl = `${this.interceptUrl}/customer360/T_AMEEN_SMS_AUDIT/views/T_AMEEN_SMS_AUDIT?$format=JSON`;
    const saveSMSSendMessageUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_SMS_AUDIT/views/T_AMEEN_SMS_AUDIT?$format=JSON`;
    return this.http.post<SaveSMSSendMessageResponse[]>(saveSMSSendMessageUrl, {
      ID: id,
      SMS_SYSTEM_ID: SMS_SYSTEM_ID,
      T_AMEEN_NOTIFICATIONS_ID: idMessage,
      T_AMEEN_FREE_TEXT_SMS_ID: idFreeText,
      PHONENUMBER: phoneNumber,
      NINUMBER: ninnumber,
      REGISTRATIONNUMBER: registrationNumber,
      USERNAME: `${username}`,
      CREATIONTIMESTAMP: creationtimestamp,
      CREATEDBY: createdby
    });
  }

  saveSMSFreeText(id: number, body: string, language: string, createdby: string, lastmodifiedby: number) {
    //const saveSMSFreeTextUrl = `${this.interceptUrl}/customer360/T_AMEEN_FREE_TEXT_SMS/views/T_AMEEN_FREE_TEXT_SMS?$format=JSON`;
    const saveSMSFreeTextUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_FREE_TEXT_SMS/views/T_AMEEN_FREE_TEXT_SMS?$format=JSON`;
    return this.http.post<SaveFreeTextMessageResponse[]>(saveSMSFreeTextUrl, {
      ID: id,
      BODY: body,
      LANGUAGE: language,
      CREATEDBY: createdby,
      LASTMODIFIEDBY: lastmodifiedby
    });
  }

  saveSMSTemplate(
    Id: number,
    groupType: string,
    body: string,
    language: string,
    channel: string,
    sourceSystem: string
  ): Observable<SaveSMSTemplateResponse[]> {
    //const saveSMSTemplateUrl = `${this.interceptUrl}/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS?$format=JSON`;
    const saveSMSTemplateUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS?$format=JSON`;
    return this.http.post<SaveSMSTemplateResponse[]>(saveSMSTemplateUrl, {
      ID: `${Id}`,
      GROUPTYPE: `${groupType}`,
      BODY: `${body}`,
      LANGUAGE: `${language}`,
      CHANNEL: `${channel}`,
      SOURCESYSTEM: `${sourceSystem}`
    });
  }
  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof SMSTemplateService
   */
  updateSMSTemplate(
    Id: number,
    groupType: string,
    body: string,
    language: string,
    channel: string,
    sourceSystem: string
  ): Observable<UpdateSMSTemplateResponse[]> {
    //const updateSMSTemplateUrl = `${this.interceptUrl}/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS/${Id}?$format=JSON`;
    const updateSMSTemplateUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS/${Id}?$format=JSON`;
    return this.http
      .put<{ elements: UpdateSMSTemplateResponse[] }>(updateSMSTemplateUrl, {
        ID: `${Id}`,
        GROUPTYPE: `${groupType}`,
        CHANNEL: `${channel}`,
        BODY: `${body}`,
        LANGUAGE: `${language}`,
        SOURCESYSTEM: `${sourceSystem}`
      })
      .pipe(map(res => res?.elements));
  }
  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof SMSTemplateService
   */
  deleteSMSTemplate(Id: number): Observable<SMSTemplateResponse[]> {
    //const deleteSMSTemplateUrl = `${this.interceptUrl}/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS/${Id}?$format=JSON`;
    const deleteSMSTemplateUrl = `/api/v1/denodosmsapiproxy/server/customer360/T_AMEEN_NOTIFICATIONS/views/T_AMEEN_NOTIFICATIONS/${Id}?$format=JSON`;
    return this.http.delete<{ elements: SMSTemplateResponse[] }>(deleteSMSTemplateUrl).pipe(map(res => res?.elements));
  }

  /**
   * This method is to get the max sms id to increase it by 1 for adding new sms
   * @memberof SMSTemplateService
   */
  getMaxSmsId() {
    //const getMaxSmsId = `${this.interceptUrl}/customer360/bv_t_ameen_notifications_get_max_id/views/bv_t_ameen_notifications_get_max_id`;
    const getMaxSmsId = `/api/v1/denodosmsapiproxy/server/customer360/bv_t_ameen_notifications_get_max_id/views/bv_t_ameen_notifications_get_max_id`;
    return this.http.get<{ elements: SMSMaxid[] }>(getMaxSmsId).pipe(map(res => res?.elements));
  }

  getMaxSmsAuditId() {
    //const getMaxSmsId = `${this.interceptUrl}/customer360/bv_t_ameen_sms_audit_get_max_id/views/bv_t_ameen_sms_audit_get_max_id`;
    const getMaxSmsId = `/api/v1/denodosmsapiproxy/server/customer360/bv_t_ameen_sms_audit_get_max_id/views/bv_t_ameen_sms_audit_get_max_id`;
    return this.http.get<{ elements: SMSMaxid[] }>(getMaxSmsId).pipe(map(res => res?.elements));
  }

  getMaxSMSFreeTextId() {
    //const getMaxSmsId = `${this.interceptUrl}/customer360/bv_t_ameen_free_text_sms_get_max_id/views/bv_t_ameen_free_text_sms_get_max_id`;
    const getMaxSmsId = `/api/v1/denodosmsapiproxy/server/customer360/bv_t_ameen_free_text_sms_get_max_id/views/bv_t_ameen_free_text_sms_get_max_id`;
    return this.http.get<{ elements: SMSMaxid[] }>(getMaxSmsId).pipe(map(res => res?.elements));
  }

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('x-api', 'false');
    return headers;
  }
}
