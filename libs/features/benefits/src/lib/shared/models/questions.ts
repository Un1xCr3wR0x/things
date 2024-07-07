/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, AlertTypeEnum, LovList } from '@gosi-ui/core';
import { QuestionConstands, EventsConstants } from '../constants';
import { EventValidated } from './event';
import { EventCategory } from '../enum/events';
import { ActionType } from '../enum/action-type';
import { DependentEventSource } from '../enum/dependent-event-source';
import { DependentDetails } from '../models';

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
  events: HeirEvent[] = [];
  eventValidationErrorResponse: EventValidated[] = [];
  addEventForAnswer: boolean; //the events dc to be shown for selected toggle answer
  eventsCanbeAdded = true;
  showAddeventButton = true;
  //For event add popup
  maxDate?: Date;
  minDate?: Date;
  mandatoryEventsToBeAdded?: BilingualText[];
  dropDownList = new LovList([]);
  showInfoMsg: boolean = true;

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
    this.events = [];
    this.reason = reason;
    this.arabicLabelForFemale = arabicLabelForFemale;
    this.addEventForAnswer = addEventForAnswer; //shows events table only for this answer
  }
  getEventHeading(showEventsLabelOnly) {
    const labels = QuestionConstands.EVENTS_HEADING_INFO_LABELS();
    return showEventsLabelOnly ? 'BENEFITS.EVENTS' : labels && labels[this.key] ? labels[this.key]?.heading : null;
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
  manualEvent: boolean;
  actionType?: string;
  dependentEventSource?: string;
  eventAddedFromUi?: boolean;
  statusDate: GosiCalendar;
  status: BilingualText;
  valid: boolean;
  message: BilingualText;
  eventOrigin: string;
  odmRemovedEvent: boolean;

  constructor(
    eventType: BilingualText,
    startDate: GosiCalendar,
    eventCanBeDeleted = true,
    key: string,
    manualEvent = false,
    eventAddedFromUi = true
  ) {
    this.eventType = eventType;
    this.eventStartDate = startDate;
    this.eventCanBeDeleted = eventCanBeDeleted;
    this.eventSource = EventsConstants.EVENT_MANUAL;
    this.manualEvent = manualEvent;
    this.actionType = ActionType.ADD;
    this.dependentEventSource = DependentEventSource.UI_EVENT;
    this.eventAddedFromUi = eventAddedFromUi;
    this.setEventCategory(key);
  }
  setEventCategory(key: string) {
    this.eventCategory = key ? EventCategory[key] : null;
  }
}

export class EventResponseDto {
  deathEvent: HeirEvent[];
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
  hijiriAgeInMonths: number = undefined;
  benefitStartDate?: GosiCalendar = undefined;
  benefitEligibilityDate?: GosiCalendar = undefined;
  modifyHeir = false;
}

export interface AddEvent extends HeirEvent {
  actionType?: string;
  eventType: BilingualText;
  eventStartDate: GosiCalendar;
  eventEndDate: GosiCalendar;
  eventSource: BilingualText;
  wage: number;
  eventCategory: string;
}
