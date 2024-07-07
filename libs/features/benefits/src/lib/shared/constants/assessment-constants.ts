/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AssessmentConstants {
  public static get NO_OF_OTP_RETRIES() {
    return 3;
  }
  public static setBilingualText(english, arabic) {
    return {
      english: english,
      arabic: arabic
    };
  }

  public static get INTERNATIONAL_COUNTRY_FILTER(): string[] {
    return ['Saudi Arabia'];
  }
  public static get NATIONALITY(): string {
    return '1';
  }
  public static get WORKING_DAYS(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }

  public static get CANCELEED_CONTRACT_ERROR_CODE(): string {
    return 'CON-ERR-5177';
  }
  public static get ROUTE_VERIFY_OTP(): string {
    return 'home/authenticate/bypass/verify-otp';
  }
  public static get ROUTE_ASSESSMENT_DISPLAY(): string {
    return 'home/benefits/bypass/assessment-decision';
  }
  public static get DISABILITY_ASSESSMENT(): string {
    return 'DISABILITY_ASSESSMENT';
  }
}
