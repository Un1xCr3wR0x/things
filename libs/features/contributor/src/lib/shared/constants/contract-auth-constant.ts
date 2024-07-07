/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContractAuthConstant {
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

  public static get WORKING_DAYS(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }

  public static get CANCELEED_CONTRACT_ERROR_CODE(): string {
    return 'CON-ERR-5177';
  }
  public static getGenderList() {
    return [
      { english : "Male", arabic : "ذكر"},
      { english : "Female", arabic : "انثى" }
    ]
  }
  public static getEngagementTypeList() {
    return [
      { english : "VIC", arabic : "مشترك إختياري"},
      { english : "Regular", arabic : "منتظم" }
  ]
  }
  public static getEngagementStatusList() {
    return [
      { english : "Active", arabic : "نشيط"},
      { english : "Inactive", arabic : "غير نشيط" },
      { english : "Cancelled", arabic : "ملغى" }
  ]
  }
}
