import { of } from 'rxjs';
import { Captcha, BilingualText } from '@gosi-ui/core';

export class CaptchaServiceStub {
  constructor() {}
  /**
   * Method to get captcha
   * @param id
   */
  getCaptchaCode() {
    return of(new Captcha());
  }
  /**
   * Method to verify captcha
   * @param captcha
   */
  verifyCaptcha(captcha) {
    if (captcha) {
      return of(new BilingualText());
    }
  }
}
