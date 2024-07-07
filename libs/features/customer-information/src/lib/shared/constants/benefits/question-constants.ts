import { EventsConstants } from './events-constants';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class QuestionConstands {
  public static EVENTS_HEADING_INFO_LABELS(): Object {
    return {
      married: { infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-HEIR', heading: 'BENEFITS.HEADING-MARRIED' },
      employed: { infoMessage: 'BENEFITS.INFO-MESSAGE-EMPLOYED', heading: 'BENEFITS.HEADING-EMPLOYED' },
      student: { infoMessage: 'BENEFITS.INFO-MESSAGE-STUDENT', heading: 'BENEFITS.HEADING-STUDENT' },
      [EventsConstants.eventsOnlyText()]: {
        infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-HEIR',
        heading: 'BENEFITS.HEADING-MARRIED'
      }
    };
  }
  public static EVENTS_HEADING_INFO_LABELS_DEP(): Object {
    return {
      married: { infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-DEP', heading: 'BENEFITS.HEADING-MARRIED' },
      divorcedorwidowed: { infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-DEP', heading: 'BENEFITS.HEADING-MARRIED' },
      marriedwife: { infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-DEP', heading: 'BENEFITS.HEADING-MARRIED' },
      student: { infoMessage: 'BENEFITS.INFO-MESSAGE-STUDENT-DEP', heading: 'BENEFITS.HEADING-STUDENT' },
      [EventsConstants.eventsOnlyText()]: {
        infoMessage: 'BENEFITS.INFO-MESSAGE-MARRIED-DEP',
        heading: 'BENEFITS.HEADING-MARRIED'
      }
    };
  }
}
