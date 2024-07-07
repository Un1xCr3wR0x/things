/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Captcha, BilingualText } from '../models';
import { ApplicationTypeToken } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  captchaUrl: string;
  constructor(readonly http: HttpClient, @Inject(ApplicationTypeToken) readonly appToken: string) {}

  /**
   * Method to get captcha
   * @param id
   */
  getCaptchaCode(id: number): Observable<Captcha> {
    this.captchaUrl = `/api/v1/captcha/generate?absherIdentifier=${id}`;
    return this.http.post<Captcha>(this.captchaUrl, null, { headers: { noAuth: 'true' } });
  }

  /**
   * Method to verify captcha
   * @param captcha
   */
  verifyCaptcha(captcha: Captcha): Observable<BilingualText> {
    const url = `/api/v1/captcha/verify?captchaId=${captcha.captchaId}&captcha=${captcha.captcha}`;
    return this.http.post<BilingualText>(url, null);
  }
}
