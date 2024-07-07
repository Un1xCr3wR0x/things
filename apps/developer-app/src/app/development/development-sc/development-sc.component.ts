import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Engagement } from '../engagement';
import { EngagementCalendarYear } from '../engagement-calendar-year';
import { EngagementCalendarRow } from '../engagement-calendar-row';
import { EngagementCalendarMonth } from '../engagement-calendar-month';

@Component({
  selector: 'dev-development-sc',
  templateUrl: './development-sc.component.html',
  styleUrls: ['./development-sc.component.scss']
})
export class DevelopmentScComponent implements OnInit {
  engagementSubject: BehaviorSubject<Engagement> = new BehaviorSubject(null);
  engagement$: Observable<Engagement> = this.engagementSubject.asObservable();

  /**
   * variables for setting minimum and maximum editable months
   */
  changeableStartDate: Date;
  changeableEndDate: Date;

  /**
   * variables for period start and edit date
   */
  periodStartDate: moment.Moment;
  periodEndDate: moment.Moment;

  months = [
    ['JAN', 'FEB', 'MAR', 'APR'],
    ['MAY', 'JUN', 'JUL', 'AUG'],
    ['SEP', 'OCT', 'NOV', 'DEC']
  ];

  constructor() {}

  ngOnInit(): void {
    this.initializeEngagement();
  }

  /**
   * Method to initialize engagement details for populating calendars for change period
   */
  initializeEngagement() {
    this.initializePeriodDate();
    const engagement: Engagement = new Engagement();
    engagement.changeableYears = this.setChangeableYears();
    this.engagementSubject.next(engagement);
  }

  /**
   * Method to initialize period and editable dates, values should be taken from api.
   * Now added some dummy values
   */
  initializePeriodDate() {
    //Dummy value
    this.changeableStartDate = moment().subtract(18, 'months').toDate();
    this.changeableEndDate = moment().toDate();

    const periodStartDate = moment().subtract(13, 'months').toDate();
    const periodEndDate = moment().subtract(2, 'months').toDate();

    const periodStartMonth = periodStartDate.getMonth() + 1;
    const periodEndMonth = periodEndDate.getMonth() + 1;

    this.periodStartDate = moment(periodStartDate.getFullYear() + '-' + periodStartMonth, 'YYYY-MM');
    this.periodEndDate = moment(periodEndDate.getFullYear() + '-' + periodEndMonth, 'YYYY-MM');
  }

  /**
   * Method to get the period changeable years
   * It will return current year - 2 years
   * if person is dead? then current year value should be taken from api response
   */
  setChangeableYears = (): EngagementCalendarYear[] => {
    const years: EngagementCalendarYear[] = [];
    const currentYear = moment().year();
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
  setYearValues = (year: number): EngagementCalendarYear => {
    const calendarYear: EngagementCalendarYear = new EngagementCalendarYear(year);
    calendarYear.monthsRows.push(this.setMonthRows(year, 0));
    calendarYear.monthsRows.push(this.setMonthRows(year, 1));
    calendarYear.monthsRows.push(this.setMonthRows(year, 2));
    return calendarYear;
  };

  /**
   * Method to popuplate a month row object of a specific year
   */
  setMonthRows = (year: number, rowIndex: number): EngagementCalendarRow => {
    const monthRow: EngagementCalendarRow = new EngagementCalendarRow(year, year + '-' + rowIndex, rowIndex);
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
  setMonth = (rowIndex: number, monthIndex: number, year: number): EngagementCalendarMonth => {
    const month: EngagementCalendarMonth = new EngagementCalendarMonth(
      year,
      rowIndex,
      monthIndex,
      this.months[rowIndex][monthIndex]
    );
    month.disabled = !this.canEditMonth(month);
    return month;
  };

  /**
   * Method to check whether that particular month can be edited
   */
  canEditMonth = (month: EngagementCalendarMonth): boolean => {
    const startDate = moment(this.changeableStartDate);
    const endDate = moment(this.changeableEndDate);
    const yearAndMonth = month.year + '' + this.months[month.rowIndex][month.colIndex];
    const currentMonthDate = moment(yearAndMonth, 'YYYYMMM');
    return currentMonthDate.isAfter(startDate) && currentMonthDate.isBefore(endDate);
  };

  /**
   * This method is to return a class for a specific month row
   * class will be like months-i(-j). i can be 1-4 and j can be 2-4
   * based on this class the selection and highlighting is happening
   */
  getMonthRowClass = (
    monthRow: EngagementCalendarRow,
    periodStartDate: moment.Moment,
    periodEndDate: moment.Moment
  ): string => {
    let startIndex = 0;
    let endIndex = 0;

    for (const monthIndex of [0, 1, 2, 3]) {
      const yearAndMonth = monthRow.year + '' + this.months[monthRow.rowIndex][monthIndex];
      const currentMonthDate = moment(yearAndMonth, 'YYYYMMM');

      if (currentMonthDate.isBetween(periodStartDate, periodEndDate, null, '[]')) {
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

  /**
   * Method to handle event from child component
   * It will set the suggestion classes to applicable month rows
   */
  handleMonthSuggestion(event) {
    this.setSelectionOrSuggestion(event, false);
  }

  /**
   * Method to handle event from child component
   * It will set the selection classes to applicable month rows
   */
  handleMonthSelection(event) {
    this.setSelectionOrSuggestion(event, true);
  }

  /**
   * Method to set selectin or suggestion classes to month rows
   * isSelection variable decides whether it is a selection or suggestion
   */
  private setSelectionOrSuggestion = (event, isSelection = true) => {
    const monthRow: EngagementCalendarRow = event.monthRow;
    const selectedMonth: EngagementCalendarMonth = event.month;
    const engagement: Engagement = this.engagementSubject.getValue();
    const yearAndMonth = monthRow.year + '' + this.months[selectedMonth.rowIndex][selectedMonth.colIndex];
    const selectedDate = moment(yearAndMonth, 'YYYYMMM');

    if (selectedDate.isAfter(this.periodStartDate)) {
      const years = engagement.changeableYears.filter(year => year.year >= selectedMonth.year);
      for (const year of years) {
        for (const months of year.monthsRows) {
          let noOfMonthsCanChange = 0;
          for (const month of months.months) {
            const yearAndMonthCurrent = month.year + '' + this.months[month.rowIndex][month.colIndex];
            const currentDate = moment(yearAndMonthCurrent, 'YYYYMMM');
            if (currentDate.isBetween(selectedDate, this.periodEndDate, null, '[]')) {
              noOfMonthsCanChange++;
            }
          }
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
            } else {
              months.selectedClass = undefined;
              months.suggestedClass = selectedClass;
            }
          }
        }
      }
      this.engagementSubject.next(engagement);
    }
  };

  /**
   * Method to handle unselection of a suggested month
   */
  handleUnSelection() {
    this.initializeEngagement();
  }
}
