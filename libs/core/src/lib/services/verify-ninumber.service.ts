import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenerateOtpResponse } from '../models/generate-otp-response';
import { GetCreditResponse } from '../models/get-credit-response';
import { GetMessageStatusResponse } from '../models/get-message-status-response';
import { ResendOtpResponse } from '../models/resend-otp-response';
import { VerifyOtpResponse } from '../models/verify-otp-response';

@Injectable({
  providedIn: 'root'
})
export class VerifyNiNumberService {
  readonly interceptUrl = '/denodo-api';

  constructor(readonly http: HttpClient) {}

  generateOTP(channelType: string, transactionDesc: string, ninNumber: number): Observable<GenerateOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/generate`;
    return this.http.post<GenerateOtpResponse>(otpUrl, {
      channelType: channelType,
      transactionDesc: transactionDesc,
      userId: ninNumber
    });
  }

  verifyOTP(otp: string, uuid: string): Observable<VerifyOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/verify`;
    return this.http.post<VerifyOtpResponse>(otpUrl, { otp: otp, uuid: uuid });
  }

  resendOTP(uuid: string): Observable<ResendOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/resend`;
    return this.http.post<ResendOtpResponse>(otpUrl, { uuid: uuid });
  }

  GetCredit(username: string, password: string): Observable<GetCreditResponse> {
    const smsUrl = `${this.interceptUrl}/GetCredit/${username}/${password}`;
    return this.http
      .post<{ elements: GetCreditResponse[] }>(smsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }

  GetMessageStatus(
    username: string,
    password: string,
    messageID: string,
    mobileNumbr: number
  ): Observable<GetMessageStatusResponse> {
    const smsUrl = `${this.interceptUrl}/getmessagestatus`;
    return this.http
      .post<{ elements: GetMessageStatusResponse[] }>(smsUrl, {
        username: username,
        password: password,
        messageID: messageID,
        mobileNumbr: mobileNumbr,
        headers: this.getHeaders()
      })
      .pipe(map(res => res?.elements?.[0]));
  }

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('x-api', 'false');
    return headers;
  }
}
