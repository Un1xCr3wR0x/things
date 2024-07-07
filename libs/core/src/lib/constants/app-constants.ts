/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { IdentifierLengthEnum, ApplicationTypeEnum } from '../enums';
import { BilingualText, GosiErrorWrapper } from '../models';

/**
 * This class is to declare application constants.
 *
 * @export
 * @class AppConstants
 */
export class AppConstants {
  /**
   * To store and get the establishment registration number from session storage
   */
  public static get ESTABLISHMENT_REG_KEY(): string {
    return 'registrationNumber';
  }

  /**
   * To store and get the establishment registration number from session storage
   */
  public static get SOCIAL_INSURANCE_NUMBER(): string {
    return 'socialInsuranceNumber';
  }
  /**
   * To store and get private application auth token from local storage
   */
  public static get AUTH_TOKEN_PRIVATE(): string {
    return 'AUTH_TOKEN_PRIVATE';
  }
  /**
   * To store and get public application auth token from local storage
   */
  public static get AUTH_TOKEN_PUBLIC(): string {
    return 'AUTH_TOKEN_PUBLIC';
  }
  /**
   * To store and get public application auth token from local storage
   */
  public static get AUTH_TOKEN_INDIVIDUAL(): string {
    return 'AUTH_TOKEN_INDIVIDUAL';
  }
   /**
   * To store and get contract application auth token from local storage
   */
  public static get AUTH_TOKEN_MEDICAL_BOARD(): string {
    return 'AUTH_TOKEN_MEDICAL_BOARD';
  }
  /**
   * To store and get dev application auth token from local storage
   */
  public static get AUTH_TOKEN_DEV(): string {
    return 'AUTH_TOKEN_DEV';
  }
  public static get NATIONALITY_ID_LENGTH_MAPPING() {
    return {
      'United Arab Emirates': IdentifierLengthEnum.UAE_ID,
      Bahrain: IdentifierLengthEnum.BAHRAIN_ID,
      Qatar: IdentifierLengthEnum.QATAR_ID,
      Oman: IdentifierLengthEnum.OMAN_ID,
      Kuwait: IdentifierLengthEnum.KUWAIT_ID
    };
  }
  public static get NATIONALITY_ID_MIN_LENGTH_MAPPING() {
    return {
      'United Arab Emirates': IdentifierLengthEnum.UAE_ID,
      Bahrain: IdentifierLengthEnum.BAHRAIN_ID,
      Qatar: IdentifierLengthEnum.QATAR_ID,
      Oman: IdentifierLengthEnum.OMAN_ID_MIN,
      Kuwait: IdentifierLengthEnum.KUWAIT_ID
    };
  }

  public static get GOSI_LABEL(): BilingualText {
    return {
      english: 'General Organization For Social Insurance',
      arabic: 'المؤسسة العامة للتأمينات الاجتماعية'
    };
  }

  public static get USER_LABEL(): BilingualText {
    return {
      english: 'User',
      arabic: 'المستخدم'
    };
  }

  public static get GOSI() {
    return 'GOSI';
  }

  public static get ISD_PREFIX_MAPPING(): object {
    return {
      sa: '+966',
      kw: '+965',
      bh: '+973',
      om: '+968',
      qa: '+974',
      ae: '+971'
    };
  }

  public static get ESTABLISHMENT_ID(): string {
    return '2102';
  }

  public static get LOV_URL(): string {
    return '/api/v1/lov';
  }

  public static get INBOX_COUNT_URL(): string {
    return '/api/process-manager/v1/task/count';
  }

  public static get NOTIFICATION_URL(): string {
    return '/api/v1/notification';
  }

  public static get PUBLIC_TITLE(): BilingualText {
    return { arabic: 'تأميناتي أعمال', english: 'Taminaty Business' };
  }

  public static get PRIVATE_TITLE(): BilingualText {
    return { arabic: 'نظام أمين', english: 'Ameen' };
  }

  /**
   * Comments Section Max-Length
   */
  public static get MAXLENGTH_COMMENTS(): number {
    return 300;
  }
  /**
   * Comments Section BPM Max-Length
   */
  public static get BPM_MAXLENGTH_COMMENTS(): number {
    return 1200;
  }
  /**
   * Comments Section BPM Byte Max-Length
   */
  public static get BPM_BYTE_MAXLENGTH_COMMENTS(): number {
    return 2000;
  }
  /**
   * Constant for getting the document size in MB
   */
  public static get DOCUMENT_SIZE(): number {
    return 2;
  }
  public static get DOCUMENT_CAPTURE_BASE_URL(): string {
    return 'http://10.4.11.3:8060/dc-client/faces/dc-client-launch.jspx?';
  }
  /**
   * Constant for getting terms of use URL
   */
  public static get TERMS_OF_USE_URL(): string {
    return 'https://www.gosi.gov.sa/GOSIOnline/Term_of_Use&locale={lang}_US';
  }
  /**
   * Constant for getting privacy policy URL
   */
  public static get PRIVACY_POLICY_URL(): string {
    return 'https://www.gosi.gov.sa/GOSIOnline/Privacy_Policy?locale={lang}_US';
  }
  /**
   *  Constant for getting help URL
   */
  public static get HELP_PUBLIC_EN_URL(): string {
    return 'https://www.gosi.gov.sa/GOSIOnline/Contact_US?locale=en_US';
  }
  /**
   * Constant for getting help URL
   */
  public static get HELP_PUBLIC_AR_URL(): string {
    return 'https://www.gosi.gov.sa/GOSIOnline/Contact_US?locale=ar_SA';
  }

  /**
   * Constant for getting help URL
   */
  public static get HELP_PRIVATE_URL(): string {
    return 'http://saedni.gosi.ins';
  }

  public static get UNAUTH_ERROR(): GosiErrorWrapper {
    return {
      error: {
        code: 'AMN-ERR-0005',
        message: {
          arabic: 'الوصول غير مصرح به، آمل التواصل مع الدعم التقني',
          english: 'Unauthorized access, Please contact IT helpdesk.'
        },
        status: 'UNAUTHORIZED',
        key: undefined,
        details: []
      }
    };
  }
  /**
   * Constant for getting add admin gpt Arabic URL
   */
  public static get ADD_ADMIN_GPT_LINK_AR(): string {
    return 'href="https://gosi.gov.sa/GOSIOnline/Establishment_Admin_Access?locale=ar_SA" target="_blank"';
  }

  /**
   * Constant for getting add admin gpt English URL
   */
  public static get ADD_ADMIN_GPT_LINK_EN(): string {
    return 'href="https://gosi.gov.sa/GOSIOnline/Establishment_Admin_Access?locale=en_US" target="_blank"';
  }

  /**
   * For getting localstorage key name for each app
   * @param appToken
   * @constructor
   */
  public static APPLICATION_AUTH_TOKEN(appToken) {
    const app = {
      [ApplicationTypeEnum.PUBLIC]: AppConstants.AUTH_TOKEN_PUBLIC,
      [ApplicationTypeEnum.PRIVATE]: AppConstants.AUTH_TOKEN_PRIVATE,
      [ApplicationTypeEnum.DEV]: AppConstants.AUTH_TOKEN_DEV,
      [ApplicationTypeEnum.CONTRACT_APP]: undefined,
      [ApplicationTypeEnum.INDIVIDUAL_APP]: AppConstants.AUTH_TOKEN_INDIVIDUAL,
      [ApplicationTypeEnum.MBASSESSMENT_APP]: undefined,
      [ApplicationTypeEnum.MEDICAL_BOARD]: AppConstants.AUTH_TOKEN_MEDICAL_BOARD
    };
    return app[appToken] || AppConstants.AUTH_TOKEN_PUBLIC;
  }
}
