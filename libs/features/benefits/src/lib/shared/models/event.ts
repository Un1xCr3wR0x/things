/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar, LovList } from '@gosi-ui/core';
import { EventsType, MaritalValues } from '../enum';
import {HeirEvent} from "../models/questions";

export class EventValidated extends HeirEvent{
  id: number;
  status: BilingualText;
  statusDate: GosiCalendar;
  valid: boolean;
  eventCategory: string;
  eventSource: BilingualText;
  eventType: BilingualText;
  income: number;
  message: BilingualText;
  eventStartDate: GosiCalendar;
  eventEndDate: GosiCalendar;
  actionType?: string;
  originalEventDate: GosiCalendar;
  startDateModified: boolean;

  constructor(message: BilingualText, valid = true) {
    super(null, null, null, null, null, null);
    this.message = message;
    this.valid = valid;
  }
}

export class EventTypeToMaritalStatus {
  eventTypeToStatus = {
    [EventsType.MARRIAGE]: MaritalValues.married,
    [EventsType.DIVORCE]: MaritalValues.divorcee,
    [EventsType.WIDOWHOOD]: MaritalValues.widower
  };

  getStatus(eventTypeBilingual: BilingualText, maritalStatusList: LovList): BilingualText {
    const eventType = this.eventTypeToStatus[eventTypeBilingual.english];
    const status = maritalStatusList.items.filter(item => item.value?.english === eventType);
    return status[0]?.value || eventTypeBilingual;
  }
}
