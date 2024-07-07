import { of } from 'rxjs';

export class OTPServiceStub {
  generateOTP() {
    return of(true);
  }

  reSendOTP() {
    return of(true);
  }
}
