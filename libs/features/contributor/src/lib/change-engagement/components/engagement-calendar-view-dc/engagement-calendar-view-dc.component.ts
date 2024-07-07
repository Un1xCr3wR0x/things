/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, AfterContentInit } from '@angular/core';
import {
  CalendarMonth,
  CalendarRow,
  CalendarYear,
  startOfMonth,
  subtractDays,
  GosiCalendar,
  startOfDay,
  startOfYear,
  monthDiff,
  subtractMonths
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { EngagementPeriod, SystemParameter } from '../../../shared';

@Component({
  selector: 'cnt-engagement-calendar-view-dc',
  templateUrl: './engagement-calendar-view-dc.component.html',
  styleUrls: ['./engagement-calendar-view-dc.component.scss']
})
export class EngagementCalendarViewDcComponent implements OnChanges, AfterContentInit {
  /* Local variables */
  periodStartDate: moment.Moment;
  periodEndDate: moment.Moment;
  years: CalendarYear[];
  months = [
    ['JAN', 'FEB', 'MAR', 'APR'],
    ['MAY', 'JUN', 'JUL', 'AUG'],
    ['SEP', 'OCT', 'NOV', 'DEC']
  ];
  isSplitInProgress = false;
  monthDiffer: number;

  /* Input variables. */
  @Input() period: EngagementPeriod;
  @Input() changeableStartDate: Date;
  @Input() changeableEndDate: Date;
  @Input() systemParameter: SystemParameter;
  @Input() canEdit: boolean;
  @Input() periodJoiningDate:Date;
  @Input() isAppPublic: boolean;

  /** Output variables. */
  @Output() split: EventEmitter<EngagementPeriod[]> = new EventEmitter();

  /**
   * Method to handle chnages in input.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.period && changes.period.currentValue) {
      this.isSplitInProgress = false;
      this.periodStartDate = moment(startOfMonth(this.period.startDate.gregorian));
      if (this.period.endDate) this.periodEndDate = moment(this.period.endDate.gregorian);
      else this.periodEndDate = moment();
      this.years = this.setChangeableYear(moment(this.periodEndDate).format('YYYY-MM-DD'));
      if (this.systemParameter) {
        this.setChangeableDates();
        if (this.years) {
          this.resetSelectedMonth();
          this.setPeriodAsActive(this.periodStartDate.year());
        } else this.years = this.setChangeableYears();
      }
    }

    if (changes.changeableStartDate && changes.changeableStartDate.currentValue) {
      this.setChangeableDates();
      if (this.years) this.resetChangeableMonths();
    }

    if (changes.changeableEndDate && changes.changeableEndDate.currentValue) {
      this.setChangeableDates();
      if (this.years) this.resetChangeableMonths();
    }

    if (changes.systemParameter && changes.systemParameter.currentValue) {
      //Create calendar only if it is not already created
      if (this.period && !this.years) {
        this.setChangeableDates();
        this.years = this.setChangeableYears();
      }
    }
  }

  /** Method to handle selection after content initialization. */
  ngAfterContentInit() {
    //Fix for wrong selection in calendar when screen is loaded in arabic screen.
    if (this.years) {
      this.resetSelectedMonth();
      setTimeout(() => {
        this.setPeriodAsActive(this.periodStartDate.year());
      }, 500);
    }
  }

  /** Method to set changeable dates based on engagement joining and leaving date. */
  setChangeableDates() {
    this.changeableEndDate = this.changeableEndDate ? this.changeableEndDate : new Date();
    if (
      moment(this.changeableEndDate).isSameOrAfter( this.periodJoiningDate, 'day')
    ) {
      if (
        moment(startOfMonth(this.changeableStartDate)).isSameOrBefore(
          this.periodJoiningDate,
          'day'
        )
      ) {
        // this.monthDiffer = monthDiff(startOfMonth(moment(this.periodJoiningDate).toDate()), startOfMonth(moment(new Date()).toDate()));
        // if (this.isAppPublic && (this.monthDiffer > 24)) {
        //   this.changeableStartDate = moment(subtractMonths(new Date(), 24)).toDate();
        // } else {
          this.changeableStartDate = moment( this.periodJoiningDate).toDate();
      }
    } else {
      this.changeableStartDate = moment( this.periodJoiningDate).toDate();
      this.changeableEndDate = new Date();
    }
  }

  /**
   * Method to get the period changeable years
   * It will return current year - 2 years
   * if person is dead? then current year value should be taken from api response
   */
  setChangeableYears = (): CalendarYear[] => {
    const years: CalendarYear[] = [];
    const currentYear = moment().year();
    years.push(this.setYearValues(currentYear - 2));
    years.push(this.setYearValues(currentYear - 1));
    years.push(this.setYearValues(currentYear));
    return years;
  };
  setChangeableYear = (month): CalendarYear[] => {
    const years: CalendarYear[] = [];
    const currentYear = moment(startOfYear(month)).year();
    years.push(this.setYearValues(currentYear - 2));
    years.push(this.setYearValues(currentYear - 1));
    years.push(this.setYearValues(currentYear));
    return years;
  };

  /**
   * Method to set calendar for a specific year
   * monthRow refers to group of 4 months in a row
   * an year object contain 3 month rows (3*4 = 12)
   */
  setYearValues = (year: number): CalendarYear => {
    const calendarYear: CalendarYear = new CalendarYear(year);
    calendarYear.monthsRows.push(this.setMonthRows(year, 0));
    calendarYear.monthsRows.push(this.setMonthRows(year, 1));
    calendarYear.monthsRows.push(this.setMonthRows(year, 2));
    return calendarYear;
  };

  /**
   * Method to popuplate a month row object of a specific year
   */
  setMonthRows = (year: number, rowIndex: number): CalendarRow => {
    const monthRow: CalendarRow = new CalendarRow(year, year + '-' + rowIndex, rowIndex);
    monthRow.months.push(this.setMonth(rowIndex, 0, year));
    monthRow.months.push(this.setMonth(rowIndex, 1, year));
    monthRow.months.push(this.setMonth(rowIndex, 2, year));
    monthRow.months.push(this.setMonth(rowIndex, 3, year));

    monthRow.activeClass = this.getMonthRowClass(monthRow, this.periodStartDate, this.periodEndDate);
    return monthRow;
  };

  /**
   * Method to set months of a specific month row
   */
  setMonth = (rowIndex: number, monthIndex: number, year: number): CalendarMonth => {
    const month: CalendarMonth = new CalendarMonth(year, rowIndex, monthIndex, this.months[rowIndex][monthIndex]);
    month.disabled = !this.canEditMonth(month);
    month.beyondLimit = this.isMonthBeyondLimit(month);
    return month;
  };

  /**
   * Method to check whether that particular month can be edited
   */
  canEditMonth = (month: CalendarMonth): boolean => {
    const startDate = moment(startOfMonth(this.changeableStartDate));
    const endDate = moment(this.changeableEndDate);
    const yearAndMonth = month.year + '' + this.months[month.rowIndex][month.colIndex];
    const currentMonthDate = moment(yearAndMonth, 'YYYYMMM');
    return currentMonthDate.isBetween(startDate, endDate, 'day', '[]');
  };

  /**
   * This method is to return a class for a specific month row
   * class will be like months-i(-j). i can be 1-4 and j can be 2-4
   * based on this class the selection and highlighting is happening
   */
  getMonthRowClass = (monthRow: CalendarRow, periodStartDate: moment.Moment, periodEndDate: moment.Moment): string => {
    let startIndex = 0;
    let endIndex = 0;

    for (const monthIndex of [0, 1, 2, 3]) {
      const yearAndMonth = monthRow.year + '' + this.months[monthRow.rowIndex][monthIndex];
      const currentMonthDate = moment(yearAndMonth, 'YYYYMMM');
      if (currentMonthDate.isBetween(periodStartDate, periodEndDate, 'day', '[]')) {
        if (startIndex === 0) {
          startIndex = monthIndex + 1;
        } else {
          endIndex = monthIndex + 1;
        }
      }
    }
    let cssClass = '';
    if (startIndex > 0) {
      cssClass += 'months-' + startIndex;
    }
    if (endIndex > 0) {
      cssClass += '-' + endIndex;
    }
    return cssClass;
  };

  /** Method to check whether the month is beyond limit (24 months). */
  isMonthBeyondLimit = (month: CalendarMonth): boolean => {
    const yearAndMonth = month.year + '' + this.months[month.rowIndex][month.colIndex];
    const currentMonthDate = moment(yearAndMonth, 'YYYYMMM');
    if (currentMonthDate.isBefore(this.periodJoiningDate, 'month')) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Method to handle event from child component
   * It will set the suggestion classes to applicable month rows
   */
  handleMonthSuggestion(event) {
    if (this.canEdit && !this.isSplitInProgress) this.setSelectionOrSuggestion(event, false);
  }

  /**
   * Method to handle event from child component
   * It will set the selection classes to applicable month rows
   */
  handleMonthSelection(event) {
    if (this.canEdit && !this.isSplitInProgress) this.setSelectionOrSuggestion(event, true);
  }

  /**
   * Method to set selectin or suggestion classes to month rows
   * isSelection variable decides whether it is a selection or suggestion
   */
  private setSelectionOrSuggestion = (event, isSelection = true) => {
    const monthRow: CalendarRow = event.monthRow;
    const selectedMonth: CalendarMonth = event.month;
    const yearAndMonth = monthRow.year + '' + this.months[selectedMonth.rowIndex][selectedMonth.colIndex];
    const selectedDate = moment(yearAndMonth, 'YYYYMMM');
    if (selectedDate.isAfter(startOfMonth(this.periodStartDate.toDate()), 'day')) {
      if (isSelection) this.isSplitInProgress = true;
      const years = this.years.filter(year => year.year >= selectedMonth.year);
      for (const year of years) {
        for (const months of year.monthsRows) {
          const noOfMonthsCanChange = this.getNoOfChangeableMonths(months, selectedDate);
          if (noOfMonthsCanChange > 0) {
            months.activeClass = this.getMonthRowClass(
              months,
              this.periodStartDate,
              selectedDate.subtract(1, 'months')
            );

            const selectedClass = this.getMonthRowClass(months, selectedDate.add(1, 'months'), this.periodEndDate);

            if (isSelection) {
              months.suggestedClass = undefined;
              months.selectedClass = selectedClass;
              this.splitPeriod(selectedDate.toDate());
            } else {
              months.selectedClass = undefined;
              months.suggestedClass = selectedClass;
            }
          }
        }
      }
    }
  };

  /** Method to identify the number of chnageable months */
  getNoOfChangeableMonths = (months: CalendarRow, startDate: moment.Moment): number => {
    let noOfMonthsCanChange = 0;
    for (const month of months.months) {
      const yearAndMonthCurrent = month.year + '' + this.months[month.rowIndex][month.colIndex];
      const currentDate = moment(yearAndMonthCurrent, 'YYYYMMM');
      if (currentDate.isBetween(startDate, this.periodEndDate, 'day', '[]')) {
        noOfMonthsCanChange++;
      }
    }
    return noOfMonthsCanChange;
  };

  /** Method to handle unselection. */
  handleUnSelection(event) {
    if (!this.isSplitInProgress) {
      this.setPeriodAsActive(event.month.year);
      this.split.emit([this.period]);
    }
  }

  /** Method to set a period as active in calendar. */
  setPeriodAsActive = (newYear: number) => {
    const years = this.years.filter(year => year.year >= newYear);
    for (const year of years) {
      for (const months of year.monthsRows) {
        const noOfMonthsCanChange = this.getNoOfChangeableMonths(months, this.periodStartDate);
        if (noOfMonthsCanChange > 0) {
          months.activeClass = this.getMonthRowClass(months, this.periodStartDate, this.periodEndDate);
          months.suggestedClass = undefined;
          months.selectedClass = undefined;
        }
      }
    }
  };

  /** Method to reset the calendar with selection. */
  resetSelectedMonth = () => {
    this.years.forEach(year => {
      year.monthsRows.forEach(month => {
        month.activeClass = undefined;
        month.suggestedClass = undefined;
        month.selectedClass = undefined;
      });
    });
  };

  /** Method to reset changeable months when changeable dates changes. */
  resetChangeableMonths = () => {
    this.years.forEach(year => {
      year.monthsRows.forEach(monthRow => {
        monthRow.months.forEach(month => {
          month.disabled = !this.canEditMonth(month);
        });
      });
    });
  };

  /**
   * Split the period
   * @param startDate start date
   */
  splitPeriod = (startDate: Date) => {
    const splittedPeriods: EngagementPeriod[] = [];
    const period1: EngagementPeriod = JSON.parse(JSON.stringify(this.period));
    const period2: EngagementPeriod = JSON.parse(JSON.stringify(this.period));
    if (period1.endDate) {
      period1.endDate.gregorian = startOfDay(subtractDays(startDate, 1));
    } else {
      const endDate = new GosiCalendar();
      endDate.gregorian = startOfDay(subtractDays(startDate, 1));
      period1.endDate = endDate;
    }
    period2.startDate.gregorian = startOfDay(startDate);
    period2.wageDetailsUpdated = undefined;
    period2.isSplit = true;
    splittedPeriods.push(period2);
    splittedPeriods.push(period1);
    this.split.emit(splittedPeriods);
  };
}
