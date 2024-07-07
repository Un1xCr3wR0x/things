/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { Question } from '../../models/benefits/questions';
import { EventsType } from '../../enums/benefits/events';
import {QuestionTypes} from "@gosi-ui/features/benefits/lib/shared";

export class EventsConstants {
  public static get EVENT_MANUAL(): BilingualText {
    return { arabic: 'Manual', english: 'Manual' };
  }
  public static get DOWNLOAD_FILE_NAME(): string {
    return 'Certificate of Commitment.pdf';
  }
  public static get NATIONALITY(): string {
    return '1';
  }
  public static get NO_OF_OTP_RETRIES() {
    return 3;
  }
  public static setBilingualText(english, arabic) {
    return {
      english: english,
      arabic: arabic
    };
  }

  public static deathBilingualText() {
    return this.setBilingualText('Death', 'وفاة');
  }
  public static deadBilingualText() {
    return this.setBilingualText('death', 'وفاة');
  }
  public static missingBilingualText() {
    return this.setBilingualText('missing', 'وفاة');
  }

  public static eventsOnlyText(): string {
    return 'EventsOnly';
  }

  public static controlsOnly(): string {
    return 'ControlsOnly';
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

  public static get BEGINNING_OF_DISABILITY(): BilingualText {
    return this.setBilingualText('Beginning of disability', 'بداية العجز');
  }

  public static get MARRIED(): BilingualText {
    return this.setBilingualText('Marriage', 'زواج');
  }

  /** The Widowhood type. */
  public static get WIDOWHOOD(): BilingualText {
    return this.setBilingualText('Widowhood', 'ترمل');
  }

  /** The Divorce( type. */
  public static get DIVORCE(): BilingualText {
    return this.setBilingualText('Divorce', 'طلاق');
  }

  public static get MARITAL_STATUS_UNAVAILABLE(): BilingualText {
    return this.setBilingualText('Unavailable', 'اعزب');
  }

  public static get NO_EVENTS_ADDED(): BilingualText {
    return this.setBilingualText('No Events', 'لا يوجد أحداث');
  }

  public static get NO_MARRIAGE_EVENTS_ADDED(): BilingualText {
    return this.setBilingualText('Please provide marriage event', 'لا يوجد أحداث');
  }

  public static WAGE_AS_ON_ELIGIBILITY_DATE(): BilingualText {
    return this.setBilingualText('Wage as on Eligibility Date', 'اعزب');
  }

  public static BEGINNING_OF_EMPLOYMENT(): BilingualText {
    //TODO: change arabic translation
    return this.setBilingualText(EventsType.BEGINNING_OF_EMPLOYMENT, 'التحاق بعمل');
  }
}
