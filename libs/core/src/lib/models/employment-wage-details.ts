/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar } from './gosi-calendar';
import { BilingualText } from './bilingual-text';
import { WageInfo } from '../models/wage-info';
/**
 * Model class to hold EmployeeWageDetails fields
 *
 * @export
 * @class EmployeeWageDetails
 */

export class EmployeeWageDetails {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  contributorAbroad = false;
  occupation: BilingualText = new BilingualText();
  wage: WageInfo = new WageInfo();
  minDate?: Date = new Date();
  coverageType?: BilingualText = new BilingualText();
  canEdit? = false;
  jobGradeName?: BilingualText = new BilingualText();
  jobRankName?: BilingualText = new BilingualText();
  jobClassName?: BilingualText = new BilingualText();

  fromJsonToObject(json: EmployeeWageDetails) {
    Object.keys(json).forEach(key => {
      if (key in new EmployeeWageDetails()) {
        if (key === 'wage') {
          this[key].fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
