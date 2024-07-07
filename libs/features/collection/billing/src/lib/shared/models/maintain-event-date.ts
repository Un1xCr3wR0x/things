/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { EventDateDetails } from './event-date-details';

export class MaintainEventDate {
  year: number = null;
  eventDateInfo: EventDateDetails[] = [];

  fromJsonToObject(json) {
    Object.keys(new MaintainEventDate()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
