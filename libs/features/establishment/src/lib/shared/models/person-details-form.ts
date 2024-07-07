import { GosiCalendar, Name, BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PersonDetailsFormModel {
  name: Name = new Name();
  sex: BilingualText = new BilingualText();
  startDate?: GosiCalendar = new GosiCalendar();
  endDate?: GosiCalendar = new GosiCalendar();

  /**
   * Method to bind json values to object instance
   * @param json
   */
  fromJsonToObject(json): PersonDetailsFormModel {
    Object.keys(this).forEach(key => {
      if (key in json && json[key] !== null) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
