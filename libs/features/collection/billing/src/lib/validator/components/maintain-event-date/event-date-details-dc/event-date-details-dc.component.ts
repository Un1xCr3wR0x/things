/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { EventDateDetails, DateFormat } from '../../../../shared/models';

@Component({
  selector: 'blg-event-date-details-dc',
  templateUrl: './event-date-details-dc.component.html',
  styleUrls: ['./event-date-details-dc.component.scss']
})
export class EventDateDetailsDcComponent implements OnChanges {
  // Input Variables
  @Input() canReturn: boolean;
  @Input() eventDateInfo: EventDateDetails[];

  // Local Variables
  newYear = 0;
  eventDate: DateFormat;
  eventDateMonth: string;
  eventDateValue: Date;
  currentDate: Date;
  previousYear: number;
  currentYear: number;
  nextYear: number;
  previousYearList: EventDateDetails[];
  currentYearList: EventDateDetails[];
  nextYearList: EventDateDetails[];
  constructor() {}

  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.eventDateInfo?.currentValue) {
      this.eventDateInfo = changes.eventDateInfo.currentValue.eventDateInfo;
      this.currentDate = new Date();
      this.previousYear = this.currentDate.getFullYear() - 1;
      this.currentYear = this.currentDate.getFullYear();
      this.nextYear = this.currentDate.getFullYear() + 1;
      this.eventDateInfo.forEach(data => {
        if (data.year === this.previousYear) {
          this.previousYearList = this.eventDateInfo.filter(item => item.year === this.previousYear);
        } else if (data.year === this.currentYear) {
          this.currentYearList = this.eventDateInfo.filter(
            item => item.year === this.currentYear || item.year === this.currentDate.getFullYear() - 1
          );
        } else if (data.year === this.nextYear) {
          this.nextYearList = this.eventDateInfo.filter(item => item.year === this.nextYear);
        }
      });
    }
  }
}
