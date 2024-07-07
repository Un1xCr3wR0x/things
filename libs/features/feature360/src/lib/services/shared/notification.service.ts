import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenerateOtpResponse } from '../../models/shared/generate-otp-response';
import { GetCreditResponse } from '../../models/shared/get-credit-response';
import { GetMessageStatusResponse } from '../../models/shared/get-message-status-response';
import { ResendOtpResponse } from '../../models/shared/resend-otp-response';
import { VerifyOtpResponse } from '../../models/shared/verify-otp-response';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  constructor(readonly http: HttpClient) {
    super();
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
  generateOTP(channelType: string, transactionDesc: string, ninNumber: number): Observable<GenerateOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/generate`;
    return this.http.post<GenerateOtpResponse>(otpUrl, {
      channelType: channelType,
      transactionDesc: transactionDesc,
      userId: ninNumber
    });
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
  verifyOTP(otp: string, uuid: string): Observable<VerifyOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/verify`;
    return this.http.post<VerifyOtpResponse>(otpUrl, { otp: otp, uuid: uuid });
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
  resendOTP(uuid: string): Observable<ResendOtpResponse> {
    const otpUrl = `/denodo-otp-api/v1/one-time-password/resend`;
    return this.http.post<ResendOtpResponse>(otpUrl, { uuid: uuid });
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
  GetCredit(username: string, password: string): Observable<GetCreditResponse> {
    const smsUrl = `${this.interceptUrl}/GetCredit/${username}/${password}`;
    return this.http
      .post<{ elements: GetCreditResponse[] }>(smsUrl, { headers: this.getHeaders() })
      .pipe(map(res => res?.elements?.[0]));
  }

  /**
   * This method is to fetch the Establishment with registration number
   * @param RegistrationNumber
   * @memberof NotificationService
   */
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
}
