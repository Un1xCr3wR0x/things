import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GosiCalendar, startOfDay } from '@gosi-ui/core';
import { ContributionCategory, Coverage, EngagementDetails } from '@gosi-ui/features/contributor/lib/shared';
import * as moment from 'moment';

@Component({
  selector: 'cnt-current-month-engagement-dc',
  templateUrl: './current-month-engagement-dc.component.html',
  styleUrls: ['./current-month-engagement-dc.component.scss']
})
export class CurrentMonthEngagementDcComponent implements OnInit {
  constructor() {}
  lang = 'en';
  displayIcon = true;
  annuity = ContributionCategory.ANNUITY;
  oh = ContributionCategory.OH;
  ui = ContributionCategory.UI;
  @Input() periods: Coverage[] = [];
  @Input() engagementDetails: EngagementDetails[];
  /**Method to initialise tasks */
  ngOnInit(): void {}
  /**Method to detect changes in input property */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.engagementDetails) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.setActualEnagagement();
    }
    if (changes && changes.periods) {
      this.periods = changes.periods.currentValue;
    }
  }
  /**Method to set actual engagement period */
  setActualEnagagement() {
    this.engagementDetails?.forEach(engagement => {
      engagement?.engagementPeriod?.forEach(val => {
        if (val?.id === engagement?.engagementId) {
          engagement.actualEngagementPeriod = val;
        }
      });
    });
  }
  /**
   * Method to get working days
   * @param endDateDuration
   * @param startDateDuration
   */
  getDaysOfWeek(endDateDuration: GosiCalendar, startDateDuration: GosiCalendar) {
    const startDate = moment(startDateDuration?.gregorian);
    const endDate = moment(endDateDuration?.gregorian);
    const daysDifference = endDate.diff(startDate, 'days') + 1;
    return daysDifference;
  }
  /**
   * Method to get last updated date
   * @param lastUpdatedDate
   */
  getLastUpdatedDate(lastUpdatedDate: GosiCalendar) {
    return startOfDay(lastUpdatedDate?.gregorian);
  }
}
