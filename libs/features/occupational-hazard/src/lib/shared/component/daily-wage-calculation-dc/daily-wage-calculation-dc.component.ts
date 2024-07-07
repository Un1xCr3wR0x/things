/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllowanceBreakUp, BreakUp } from '../../models';
import { CalculationWrapper } from '../../models/calculation-wrapper';
import { DateFormat } from '../../models/date';

@Component({
  selector: 'oh-daily-wage-calculation-dc',
  templateUrl: './daily-wage-calculation-dc.component.html',
  styleUrls: ['./daily-wage-calculation-dc.component.scss']
})
export class DailyWageCalculationDcComponent implements OnChanges {
  constructor() {}
  /**
   * Input Variables
   */
  @Input() calculationWrapper: CalculationWrapper;
  @Input() contributorWage: string;
  @Input() day: DateFormat[];
  dailyWage: BreakUp[] = [];
  dailyAllowance: BreakUp[] = [];

  /**
   *
   * @param changes Capturing input changes on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
    }
    if (changes && changes.contributorWage) {
      this.contributorWage = changes.contributorWage.currentValue;
    }
    if (changes && changes.day) {
      this.day = changes.day.currentValue;
    }
    this.calculationWrapper.allowanceBreakup.breakUpDetails.forEach(element => {
      if (element.type === 'Daily Wage') {
        this.dailyWage.push(element);
      }
      if (element.type === 'Daily Allowance') {
        this.dailyAllowance.push(element);
      }
    });
  }
  /**
   *
   * @param breakUp Fetching allownace percentage to display
   */
  getAllowancePercentage(breakUp: AllowanceBreakUp) {
    let percent = 0;
    breakUp.breakUpDetails.forEach(item => {
      if (item.type === 'Allowance Percentage') {
        percent = parseFloat(item.value) * 100;
      }
    });
    return percent;
  }
  /**
   *
   * @param month Fetching the month to display
   */
  getMonth(month: number) {
    switch (month) {
      case 1:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.JANUARY';
      case 2:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.FEBRUARY';
      case 3:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.MARCH';
      case 4:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.APRIL';
      case 5:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.MAY';
      case 6:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.JUNE';
      case 7:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.JULY';
      case 8:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.AUGUST';
      case 9:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.SEPTEMBER';
      case 10:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.OCTOBER';
      case 11:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.NOVEMBER';
      case 12:
        return 'OCCUPATIONAL-HAZARD.CALENDAR-LABEL.DECEMBER';
    }
  }
}
