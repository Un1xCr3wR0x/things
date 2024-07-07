/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken, startOfDay } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject, interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { DueDateWidgetLabels } from '../../../../shared/enums';

@Component({
  selector: 'blg-vic-due-date-widget-dc',
  templateUrl: './vic-due-date-widget-dc.component.html',
  styleUrls: ['./vic-due-date-widget-dc.component.scss']
})
export class VicDueDateWidgetDcComponent implements OnInit, OnChanges {
  /* Local variables */
  hours = '0';
  lan = 'en';
  daysCount = 0;
  days = '0';
  hourLabel: string = DueDateWidgetLabels.ZERO_HOURS;
  hoursCount = 0;
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;

  /* Input variables */

  @Input() isMofFlag: boolean;
  @Input() isGccCountry: boolean;
  @Input() startDate: Date;

  /**
   * Creates an instance of DueDateWidgetDcComponent
   * @param language language token
   */
  constructor(@Inject(LanguageToken) readonly languages: BehaviorSubject<string>) {}

  /** Method to instantiate the component. */
  ngOnInit() {
    this.languages.subscribe(lang => {
      this.lan = lang;
    });
  }

  /**
   * Method to detect chnages to input varibles;
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startDate && changes.startDate.currentValue) {
      const date = moment(startOfDay(this.startDate)).subtract(3, 'hour').toDate();
      if (moment(date).isAfter(new Date())) {
        this.daysCount = moment(date).diff(new Date(), 'day');
        this.hoursCount = moment(date).diff(new Date(), 'hour') - this.daysCount * 24;
        this.setDataForView();
        this.setTimer(date);
      }
    }
  }

  /** Method to set data for view. */
  setDataForView() {
    //Append 0 if value is less than 10
    this.days = this.daysCount < 10 && this.daysCount > 0 ? '0' + this.daysCount : this.daysCount.toString();
    this.hours = this.hoursCount < 10 && this.hoursCount > 0 ? '0' + this.hoursCount : this.hoursCount.toString();

    this.setLabelForDay();
    this.setLabelForHour();
  }

  /** Method to set day label. */
  setLabelForDay() {
    if (this.daysCount === 0) {
      this.dayLabel = DueDateWidgetLabels.ZERO_DAYS;
    } else if (this.daysCount === 1) {
      this.dayLabel = DueDateWidgetLabels.ONE_DAY;
    } else if (this.daysCount === 2) {
      this.dayLabel = DueDateWidgetLabels.TWO_DAYS;
    } else if (this.daysCount > 2 && this.daysCount < 11) {
      this.dayLabel = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (this.hoursCount > 10) {
      this.dayLabel = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
    }
  }
  /** Method to set hour label. */
  setLabelForHour() {
    if (this.hoursCount === 0) {
      this.hourLabel = DueDateWidgetLabels.ZERO_HOURS;
    } else if (this.hoursCount === 1) {
      this.hourLabel = DueDateWidgetLabels.ONE_HOUR;
    } else if (this.hoursCount === 2) {
      this.hourLabel = DueDateWidgetLabels.TWO_HOURS;
    } else if (this.hoursCount > 2 && this.hoursCount < 11) {
      this.hourLabel = DueDateWidgetLabels.THREE_TO_TEN_HOURS;
    } else if (this.hoursCount > 10) {
      this.hourLabel = DueDateWidgetLabels.GRT_THAN_TEN_HOURS;
    }
  }
  /**
   * Method to start the timer
   * @param date date
   */
  setTimer(date: Date) {
    interval(18000000) //30 mins interval
      .pipe(
        takeWhile(() => this.daysCount > 0 || this.hoursCount > 0), //emit untill the count is zero
        tap(() => {
          this.daysCount = moment(date).diff(new Date(), 'day');
          this.hoursCount = moment(date).diff(new Date(), 'hour') - this.daysCount * 24;
          this.setDataForView();
        })
      )
      .subscribe();
  }
}
