/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { Question } from '../models/questions';
import { EventsType, QuestionTypes } from '../enum/events';

export class EventsConstants {
  public static get EVENT_MANUAL(): BilingualText {
    return { arabic: 'Manual', english: 'Manual' };
  }
  public static get EVENT_NIC(): BilingualText {
    return { arabic: 'مركز المعلومات الوطني', english: 'NIC' };
  }
  public static get EVENT_MOJ(): BilingualText {
    return { arabic: 'وزارة العدل', english: 'MOJ' };
  }
  public static get EVENT_SYSTEM(): BilingualText {
    return { arabic: 'System', english: 'System' };
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

  public static EVENT_TYPES_FOR_QUESTION(qn: Question): string[] {
    switch (qn.key) {
      case QuestionTypes.STUDENT:
        return [EventsType.BEGINNING_OF_STUDY, EventsType.END_OF_STUDY];
      case QuestionTypes.MARRIED:
        return [EventsType.MARRIAGE, EventsType.WIDOWHOOD, EventsType.DIVORCE];
      case QuestionTypes.EMPLOYED:
        return [EventsType.BEGINNING_OF_EMPLOYMENT, EventsType.WAGE_CHANGE, EventsType.END_OF_EMPLOYMENT];
      case QuestionTypes.DIVORCED_OR_WIDOWED:
        return [EventsType.MARRIAGE, EventsType.WIDOWHOOD, EventsType.DIVORCE];
      // case QuestionTypes.DISABLED:
      //   return [EventsType.BEGINNING_OF_DISABILITY, EventsType.END_OF_DISABILITY];
      default:
        return [];
    }
  }

  public static WAGE_AS_ON_ELIGIBILITY_DATE(): BilingualText {
    return this.setBilingualText('Wage as on Eligibility Date', 'اعزب');
  }

  public static BEGINNING_OF_EMPLOYMENT(): BilingualText {
    //TODO: change arabic translation
    return this.setBilingualText(EventsType.BEGINNING_OF_EMPLOYMENT, 'التحاق بعمل');
  }

  public static EVENT_TYPES_BILINGUAL(type: EventsType): BilingualText {
    switch (type) {
      case EventsType.BEGINNING_OF_EMPLOYMENT:
        return this.setBilingualText("Beginning of Employment", "التحاق بعمل");
      case EventsType.END_OF_EMPLOYMENT:
        return this.setBilingualText("End of Employment", "ترك العمل");
      case EventsType.WAGE_CHANGE:
        return this.setBilingualText("Wage change", "تغيير الأجر");
      case EventsType.MARRIAGE:
        return this.setBilingualText("Marriage", "زواج");
      case EventsType.WIDOWHOOD:
        return this.setBilingualText("Widowhood", "ترمل");
      case EventsType.DIVORCE:
        return this.setBilingualText("Divorce", "طلاق");
      case EventsType.BEGINNING_OF_STUDY:
        return this.setBilingualText("Beginning of study", "التحاق بالدراسة");
      case EventsType.END_OF_STUDY:
        return this.setBilingualText("End of Study", "إنتهاء الدراسة");
    }
  }

  public static EVENT_TYPES_BILINGUAL_FOR_QUESTION(qn: Question) {
    switch (qn.key) {
      case QuestionTypes.STUDENT:
        return [
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.BEGINNING_OF_STUDY),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.END_OF_STUDY)
        ];
      case QuestionTypes.MARRIED:
        return [
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.MARRIAGE),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.WIDOWHOOD),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.DIVORCE)
        ];
      case QuestionTypes.EMPLOYED:
        return [
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.BEGINNING_OF_EMPLOYMENT),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.WAGE_CHANGE),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.END_OF_EMPLOYMENT)
        ];
      case QuestionTypes.DIVORCED_OR_WIDOWED:
        return [
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.MARRIAGE),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.WIDOWHOOD),
          EventsConstants.EVENT_TYPES_BILINGUAL(EventsType.DIVORCE)
        ];
      // case QuestionTypes.DISABLED:
      //   return [EventsType.BEGINNING_OF_DISABILITY, EventsType.END_OF_DISABILITY];
      default:
        return [];
    }
  }
}
