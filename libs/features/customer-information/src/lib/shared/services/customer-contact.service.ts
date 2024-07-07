import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCustomerTouchPoints } from '../models/response-customer-touch-points';
import { BaseService } from './base.service';
import { TouchpointResponse } from '../models/touch-point-response';

@Injectable({ providedIn: 'root' })
export class CustomerContactService extends BaseService {
  constructor(readonly http: HttpClient, @Inject(ApplicationTypeToken) readonly appToken: string) {
    super();
  }


  getCustomerContactLog(userId: number): Observable<TouchpointResponse>{
    const url = `/api/v1/denodocustomertouchpointapiproxy/server/customer360/dv_customer_touchpoint/views/dv_customer_touchpoint?nin=${userId}`;
    return this.http.get<TouchpointResponse>(url);
  }

  getUsersVisitors(nin: number, lang: string): Observable<any> {
    const getDenodoCustomerContactsUrl = `${this.interceptUrl}/customer360/dv_customer_contact/views/dv_customer_contact/?nin=${nin}`;
    return this.http
      .get<{ elements: ResponseCustomerTouchPoints[] }>(getDenodoCustomerContactsUrl, { headers: this.getHeaders() })
      .pipe(
        map(resp => {
          const labelListCustomerVis = [];
          const countEachChannel = [];
          const channelListColors = [];
          for (const iterator of resp.elements) {
            if (iterator.count > 0) {
              const arabicChannel = lang === 'ar' ? iterator.app_name_ar : iterator.app_name_en;
              labelListCustomerVis.push(arabicChannel);
              countEachChannel.push(iterator.count);
              channelListColors.push(iterator.app_color);
            }
          }
          return { apps: labelListCustomerVis, count: countEachChannel, color: channelListColors };
        })
      );
  }
}
