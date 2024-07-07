import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OTPService {
  constructor(readonly http: HttpClient) {}

  /** Method  to generate OTP. */
  generateOTP(transaction: string, user: string) {
    const otpUrl = `/api/v1/otp/generate`;
    return this.http.post(otpUrl, { channelType: 'SMS', transactionDesc: transaction, userId: user });
  }

  /** Method to resend otp. */
  reSendOTP(uuid: string, authRequired = true) {
    const url = '/api/v1/otp/resend';
    const headers = authRequired ? undefined : { headers: { noAuth: 'true' } };
    return this.http.post(url, { uuid: uuid }, headers);
  }
}
