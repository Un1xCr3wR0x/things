/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, AlertTypeEnum, LovList } from '@gosi-ui/core';
import { QuestionConstands, EventsConstants } from '../../constants/benefits';
import { EventValidated } from './event';
import { EventCategory } from '../../enums/benefits';
export class QuestionBase {
  value: boolean | string | Date | BilingualText; // control default value
  key: string; //Formcontrol name
  label: string;
  arabicLabelForFemale: string;
  required: boolean;
  disabled: boolean; //Control disabled or not
  order: number;
  constructor(key: string, label: string, value: boolean | string | Date | BilingualText) {
    this.key = key;
    this.label = label;
    this.value = value;
  }
}

export class Question extends QuestionBase {
  infoMessage: string;
  infoMessageWarningType = AlertTypeEnum.INFO; //To show the warning when apply without events
  quesInfo: string;
  isQuesInfoRequired: boolean;
  reason: string;
  inputControls: Control[];
  events: HeirEvent[];
  eventValidationErrorResponse: EventValidated[] = [];
  addEventForAnswer: boolean; //the events dc to be shown for selected toggle answer
  eventsCanbeAdded = true;
  showAddeventButton = true;
  //For event add popup
  maxDate?: Date;
  minDate?: Date;
  mandatoryEventsToBeAdded?: BilingualText[];
  dropDownList = new LovList([]);

  constructor(
    key: string,
    label: string,
    reason: string = null,
    arabicLabelForFemale: string = null,
    addEventForAnswer = true,
    value?: boolean | string | Date
  ) {
    super(key, label, value);
    this.infoMessage = null;
    this.reason = reason;
    this.arabicLabelForFemale = arabicLabelForFemale;
    this.addEventForAnswer = addEventForAnswer; //shows events table only for this answer
  }
  getEventHeading() {
    const labels = QuestionConstands.EVENTS_HEADING_INFO_LABELS();
    return labels && labels[this.key] ? labels[this.key]?.heading : null;
  }
  getEventInfoMessage() {
    const labels = QuestionConstands.EVENTS_HEADING_INFO_LABELS();
    return labels && this.key && labels[this.key] ? labels[this.key]?.infoMessage : null;
  }
  geteventInfoDep() {
    const labels = QuestionConstands.EVENTS_HEADING_INFO_LABELS_DEP();
    return labels && this.key && labels[this.key] ? labels[this.key]?.infoMessage : null;
  }
}

export class Control extends QuestionBase {
  controlType: string;
  maxDate?: Date;
  minDate?: Date;
  pattern: string;
  placeBelowEventInHtml: boolean;
  constructor(
    key: string,
    label: string,
    value: boolean | string | Date | BilingualText,
    controlType: string,
    required = false,
    maxDate?: Date,
    minDate?: Date,
    disabled = false,
    placeBelowEventInHtml = false
  ) {
    super(key, label, value);
    this.required = required;
    this.controlType = controlType;
    this.maxDate = maxDate;
    this.minDate = minDate;
    this.disabled = disabled;
    this.placeBelowEventInHtml = placeBelowEventInHtml;
  }
}

// export class Events extends QuestionBase {
export class HeirEvent {
  eventType: BilingualText;
  eventStartDate: GosiCalendar;
  eventEndDate: GosiCalendar;
  wage: number;
  eventSource: BilingualText; //default value is manual
  eventCategory: string;
  eventCanBeDeleted: boolean;
  constructor(eventType: BilingualText, startDate: GosiCalendar, eventCanBeDeleted = true, key: string) {
    this.eventType = eventType;
    this.eventStartDate = startDate;
    this.eventCanBeDeleted = eventCanBeDeleted;
    this.eventSource = EventsConstants.EVENT_MANUAL;
    this.setEventCategory(key);
  }
  setEventCategory(key: string) {
    this.eventCategory = key ? EventCategory[key] : null;
  }
}

export class EventResponseDto {
  maritalEvents: HeirEvent[];
  employmentEvents: HeirEvent[];
  constructor() {
    this.maritalEvents = [];
    this.employmentEvents = [];
  }
}

export class RequestEventType {
  sin: number = undefined;
  heirPersonId: number = undefined;
  relationship: BilingualText = undefined;
  requestDate: GosiCalendar = undefined;
  maritalStatus: BilingualText = undefined;
  missingDate?: GosiCalendar = undefined;
  deathDate?: GosiCalendar = undefined;
  depOrHeirDeathDate: GosiCalendar = undefined;
  questionObj: Question = undefined;
  age: number = undefined;
  benefitStartDate?: GosiCalendar = undefined;
  benefitEligibilityDate?: GosiCalendar = undefined;
}

export interface AddEvent extends HeirEvent {
  eventType: BilingualText;
  eventStartDate: GosiCalendar;
  eventEndDate: GosiCalendar;
  eventSource: BilingualText;
  wage: number;
  eventCategory: string;
}
