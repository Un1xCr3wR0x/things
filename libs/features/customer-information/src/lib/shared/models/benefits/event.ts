/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class EventValidated {
  id: number;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  status: BilingualText;
  statusDate: GosiCalendar;
  valid: boolean;
  eventCategory: string;
  eventSource: BilingualText;
  eventType: BilingualText;
  income: number;
  message: BilingualText;

  constructor(message: BilingualText, valid = true) {
    this.message = message;
    this.valid = valid;
  }
}
