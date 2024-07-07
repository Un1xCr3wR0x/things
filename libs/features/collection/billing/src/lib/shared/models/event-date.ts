/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EventDateDetails } from './event-date-details';

export class EventDate {
  eventDateInfo: EventDateDetails[] = [];
  workflow: string = undefined;

  fromJsonToObject(json) {
    Object.keys(new EventDate()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
