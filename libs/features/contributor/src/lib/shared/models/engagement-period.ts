/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Coverage } from './coverage';
import { PeriodDifference } from './period-difference';
import { WageInfo } from './wage-info';

/**
 * The wrapper class for engagement period details.
 * @export
 * @class EngagementPeriod
 */

export class EngagementPeriod {
  id: number = undefined;
  endDate: GosiCalendar = new GosiCalendar();
  occupation: BilingualText = new BilingualText();
  startDate: GosiCalendar = new GosiCalendar();
  effectiveEndDate: GosiCalendar = new GosiCalendar();
  effectiveStartDate: GosiCalendar = new GosiCalendar();
  wage: WageInfo = new WageInfo();
  coverages: Coverage[] = [];
  minDate: Date = new Date();
  monthlyContributoryWage: number = undefined;
  lastUpdatedDate: GosiCalendar = new GosiCalendar();
  coverageType: BilingualText[] = [];
  coverage: BilingualText = new BilingualText();
  editFlow = false;
  wageDetailsUpdated? = false; //Flag to check whether wage is updated or not
  periodDuration: PeriodDifference = new PeriodDifference();
  contributorAbroad = false;
  canEdit = false;
  isSplit = false; //Flag to indicate whether period is split
  uuid: string = undefined;
  comments?: string;
  registrationNo?: number;
  periodOverlapping?: boolean;
  duration?: PeriodDifference = new PeriodDifference();
  jobGradeName?: BilingualText = new BilingualText();
  jobRankName?: BilingualText = new BilingualText();
  jobClassName?: BilingualText = new BilingualText();
  jobClassCode?: number = undefined;
  jobRankCode?: number = undefined;
  jobGradeCode?: number = undefined;
  wageViolationId?: number;
  applicableFromDate?: GosiCalendar = new GosiCalendar();

  fromJsonToObject(json) {
    Object.keys(json).forEach(key => {
      if (key in new EngagementPeriod()) {
        if (key === 'wage') {
          this[key] = new WageInfo().fromJsonToObject(json[key]);
        } else if (key === 'coverages') {
          json[key].forEach(prod => {
            this[key].push(new Coverage().fromJsonToObject(prod));
          });
        } else if (key === 'duration') {
          this[key] = new PeriodDifference().fromJsonToObject(json[key]);
        } else if (key === 'periodDuration') {
          this[key] = new PeriodDifference().fromJsonToObject(json[key]);
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
