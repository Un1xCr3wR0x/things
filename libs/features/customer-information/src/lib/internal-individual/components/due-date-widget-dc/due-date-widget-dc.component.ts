/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken, startOfDay } from '@gosi-ui/core';
import { DueDateWidgetLabels } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import moment from 'moment-timezone';
import { BehaviorSubject, interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
// import { DueDateWidgetLabels } from '../../../../shared/enums';

@Component({
  selector: 'cim-due-date-widget-dc',
  templateUrl: './due-date-widget-dc.component.html',
  styleUrls: ['./due-date-widget-dc.component.scss']
})
export class DueDateWidgetDcComponent implements OnInit, OnChanges {
  /* Local variables */
  days = '0';
  hours = '0';
  dayCount = 0;
  hourCount = 0;
  lang = 'en';
  hourLabel: string = DueDateWidgetLabels.ZERO_HOURS;
  dayLabel: string = DueDateWidgetLabels.ZERO_DAYS;

  /* Input variables */
  @Input() startDate: Date;
  @Input() isMofFlag: boolean;
  @Input() isGccCountry: boolean;

  /**
   * Creates an instance of DueDateWidgetDcComponent
   * @param language language token
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to instantiate the component. */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }

  /**
   * Method to detect chnages to input varibles;
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startDate && changes.startDate.currentValue) {
      this.startDate = moment(this.startDate).add(1, 'day').toDate();
      const date = moment(startOfDay(this.startDate)).subtract(3, 'hour').toDate();
      if (moment(date).isAfter(new Date())) {
        this.dayCount = moment(date).diff(new Date(), 'day');
        this.hourCount = moment(date).diff(new Date(), 'hour') - this.dayCount * 24;
        this.setDataForView();
        this.startTimer(date);
      }
    }
  }

  /**
   * Method to start the timer
   * @param date date
   */
  startTimer(date: Date) {
    interval(18000000) //30 mins interval
      .pipe(
        takeWhile(() => this.dayCount > 0 || this.hourCount > 0), //emit untill the count is zero
        tap(() => {
          this.dayCount = moment(date).diff(new Date(), 'day');
          this.hourCount = moment(date).diff(new Date(), 'hour') - this.dayCount * 24;
          this.setDataForView();
        })
      )
      .subscribe();
  }

  /** Method to set data for view. */
  setDataForView() {
    //Append 0 if value is less than 10
    this.days = this.dayCount < 10 && this.dayCount > 0 ? '0' + this.dayCount : this.dayCount.toString();
    this.hours = this.hourCount < 10 && this.hourCount > 0 ? '0' + this.hourCount : this.hourCount.toString();

    this.setLabelsForDay();
    this.setLabelsForHour();
  }

  /** Method to set hour label. */
  setLabelsForHour() {
    if (this.hourCount === 0) {
      this.hourLabel = DueDateWidgetLabels.ZERO_HOURS;
    } else if (this.hourCount === 1) {
      this.hourLabel = DueDateWidgetLabels.ONE_HOUR;
    } else if (this.hourCount === 2) {
      this.hourLabel = DueDateWidgetLabels.TWO_HOURS;
    } else if (this.hourCount > 2 && this.hourCount < 11) {
      this.hourLabel = DueDateWidgetLabels.THREE_TO_TEN_HOURS;
    } else if (this.hourCount > 10) {
      this.hourLabel = DueDateWidgetLabels.GRT_THAN_TEN_HOURS;
    }
  }

  /** Method to set day label. */
  setLabelsForDay() {
    if (this.dayCount === 0) {
      this.dayLabel = DueDateWidgetLabels.ZERO_DAYS;
    } else if (this.dayCount === 1) {
      this.dayLabel = DueDateWidgetLabels.ONE_DAY;
    } else if (this.dayCount === 2) {
      this.dayLabel = DueDateWidgetLabels.TWO_DAYS;
    } else if (this.dayCount > 2 && this.dayCount < 11) {
      this.dayLabel = DueDateWidgetLabels.THREE_TO_TEN_DAYS;
    } else if (this.hourCount > 10) {
      this.dayLabel = DueDateWidgetLabels.GRT_THAN_TEN_DAYS;
    }
  }
}
