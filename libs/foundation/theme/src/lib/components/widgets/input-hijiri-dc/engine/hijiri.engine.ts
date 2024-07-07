/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { DateType } from '../enums/date-type';
import { CalendarCellViewModel, DatepickerViewMode, DayViewModel, WeekViewModel } from '../models';
import { HijiriEngineBase } from './hijiri.engine-base';

const calendarStartYear = 1296;
const calendarEndYear = 1500;
/**
 * The class to handle hijiri operations.
 * @export
 * @class HijiriEngine
 */
@Injectable({
  providedIn: 'root'
})
export class HijiriEngine extends HijiriEngineBase {
  hideNavEndYear: number;
  hideNavEndMonth: number;
  hideNavStartYear: number;
  hideNavStartMonth: number;
  /**
   * Creates an instance of Hijiri Engine.
   * @memberof HijiriEngine
   */
  constructor() {
    super();
  }
  //Function to set the current month view
  setCurrentMonthView(hijCalendarStartYear, maxDate, contextId: string) {
    const dateArr = maxDate.split('/');
    const year = parseInt(dateArr[2], 10);
    const month = parseInt(dateArr[1], 10);
    this.setYears(year, hijCalendarStartYear, year);
    this.setMonths(year);
    const monthValue = this.monthData.months.filter(data => data.index === month)[0];
    const monthObj: CalendarCellViewModel = {
      label: monthValue.english,
      dateStr: monthValue
    };
    this.setDays(monthObj);
    if (this.getIsMonthPicker(contextId)) this.setViewMode(DatepickerViewMode.Month);
    else this.setViewMode(DatepickerViewMode.Day);
  }

  /**
   * @param date method to set the value for popup
   */
  setCalendarValue(date = this.activeDate, mindate, maxDate, contextId: string) {
    const dateArr = date?.split('/');
    const year = parseInt(dateArr[2], null);
    const month = parseInt(dateArr[1], null);
    let minDateArr = [];
    let maxDateArr = [];
    let minYear = null;
    let maxYear = null;
    this.minDate = mindate;
    this.maxDate = maxDate;
    this.activeDate = date;

    if (this.minDate) {
      minDateArr = this.minDate.split('/');
      minYear = parseInt(minDateArr[2], null);
    }

    if (this.maxDate) {
      maxDateArr = this.maxDate.split('/');
      maxYear = parseInt(maxDateArr[2], 10);
    }

    this.setYears(year, minYear, maxYear);
    this.setMonths(year);
    const monthValue = this.monthData.months.filter(data => data.index === month)[0];
    const monthObj: CalendarCellViewModel = {
      label: monthValue.english,
      dateStr: monthValue
    };
    this.setDays(monthObj);
    if (this.getIsMonthPicker(contextId)) this.setViewMode(DatepickerViewMode.Month);
    else this.setViewMode(DatepickerViewMode.Day);
  }

  // General methods
  // Setting view mode to day,month,year
  getViewMode() {
    return this.viewMode$;
  }
  setViewMode(viewMode) {
    this.viewMode.next(viewMode);
  }

  // Day Block
  /*** funtion to set days based on month and year*/
  setDays(monthDatas?: CalendarCellViewModel) {
    if (this.days.getValue()) {
      this.daysCalendar = this.days.getValue();
    } else {
      this.daysCalendar.weekdays = this.weekData.weeks.map(week => {
        return {
          english: week.english,
          arabic: week.arabic
        };
      });
    }
    this.daysCalendar.weeks = [];
    this.daysCalendar.hideLeftArrow = false;

    if (monthDatas) {
      this.daysCalendar.monthTitle = monthDatas.label;
      this.daysCalendar.month = monthDatas.dateStr;
      this.daysCalendar.monthNum = monthDatas.dateStr.index;
    }
    if (this.months.getValue().yearTitle) {
      this.daysCalendar.yearTitle = this.months.getValue().yearTitle;
    }
    this.setDayCells();
    this.days.next(this.daysCalendar);
  }

  getPrevMonthNumOfDays(prevMonthYear: number, prevMonthLabel: string): number {
    let numOfDays = 0;
    if (prevMonthYear) {
      Object.keys(prevMonthYear).forEach(key => {
        if (key === prevMonthLabel) {
          numOfDays = prevMonthYear[key];
        }
      });
    }
    return numOfDays;
  }

  /**Method to get the value of a date by type */
  getDateTypeValue(date: string, type: DateType) {
    const dateArr = date.split('/');
    const year = parseInt(dateArr[2], 10);
    const month = parseInt(dateArr[1], 10);
    const day = parseInt(dateArr[0], 10);
    if (type === DateType.MONTH) {
      return month;
    } else if (type === DateType.YEAR) {
      return year;
    } else {
      return day;
    }
  }

  setDayCells() {
    //Variable to set selected year
    const currentYear = parseInt(this.daysCalendar.yearTitle, 10);
    const selectedYear = this.calendarData.days.filter(data => data.UMALQURAYEAR === currentYear)[0];

    //Set default value for number of days in a month
    let numberOfDays = 30;
    const monthLabel = 'DAYSINHIJMONTH' + this.daysCalendar.monthNum;
    const prevMonth = this.daysCalendar.monthNum === 1 ? 12 : this.daysCalendar.monthNum - 1;
    const prevMonthLabel = 'DAYSINHIJMONTH' + prevMonth;
    const prevMonthYear =
      this.daysCalendar.monthNum === 1
        ? this.calendarData.days.filter(data => data.UMALQURAYEAR === currentYear - 1)[0]
        : selectedYear;

    Object.keys(selectedYear).forEach(key => {
      if (key === monthLabel) {
        numberOfDays = selectedYear[key];
      }
    });

    const prevMonthnumberOfDays = this.getPrevMonthNumOfDays(prevMonthYear, prevMonthLabel);

    //Dynamic value
    const startDay = this.calculateStartDayFromTheBeginning(this.daysCalendar.monthNum, selectedYear.UMALQURAYEAR);

    //variable to set the numeric value of day
    let dayNumber = 1;

    let cells: DayViewModel[] = [];

    let minDay = null,
      minMonth = null,
      minYear = null;
    let maxDay = null,
      maxMonth = null,
      maxYear = null;

    if (this.minDate) {
      minYear = this.getDateTypeValue(this.minDate, DateType.YEAR);
      minMonth = this.getDateTypeValue(this.minDate, DateType.MONTH);
      minDay = this.getDateTypeValue(this.minDate, DateType.DAY);
    }

    if (this.maxDate) {
      maxYear = this.getDateTypeValue(this.maxDate, DateType.YEAR);
      maxMonth = this.getDateTypeValue(this.maxDate, DateType.MONTH);
      maxDay = this.getDateTypeValue(this.maxDate, DateType.DAY);
    }
    const currentYr = parseInt(this.daysCalendar.yearTitle, null);
    const currentMnth = this.daysCalendar.monthNum;

    let labelValue = 1;
    let currentMonthRendered = false;
    for (let i = 1; i <= 42; i++) {
      const cell: DayViewModel = { label: dayNumber.toString() };
      cell.isDisabled = this.getCellIsDisabledForMinDate(
        currentYear,
        currentMnth,
        currentYr,
        minYear,
        minMonth,
        startDay,
        numberOfDays,
        minDay,
        i
      );
      //disabling date after max date
      const isDisabledMaxDate = this.getCellIsDisabledAfterMaxDate(
        maxYear,
        maxMonth,
        currentYr,
        currentMnth,
        i,
        startDay,
        maxDay,
        currentYear,
        numberOfDays
      );
      if (isDisabledMaxDate !== undefined) {
        cell.isDisabled = isDisabledMaxDate;
      }
      if (i < startDay) {
        labelValue = prevMonthnumberOfDays - startDay + 1 + i;
        cell.isDisabled = true;
      } else if (dayNumber > numberOfDays) {
        labelValue = 1;
        dayNumber = 2;
        cell.isDisabled = true;
        currentMonthRendered = true;
      } else {
        labelValue = dayNumber;
        dayNumber++;
      }

      if (currentMonthRendered) {
        cell.isDisabled = true;
      }

      cell.isSelected = this.getIsSelectedDate(cell.isDisabled, labelValue, currentYear);
      cell.label = labelValue.toString();
      cells.push(cell);

      if (i % 7 === 0) {
        const week: WeekViewModel = {
          days: cells
        };
        this.daysCalendar.weeks.push(week);
        cells = [];
      }
    }
  }

  /**
   * Function to update the month after navigation
   * @param state
   */
  updateDays(state) {
    let currentYear = parseInt(this.daysCalendar.yearTitle, null);
    let currentMonth = this.daysCalendar.monthNum;

    this.daysCalendar.weeks = [];
    this.daysCalendar.hideRightArrow = false;
    this.daysCalendar.hideLeftArrow = false;
    this.hideNavEndYear = this.getDateTypeValue(this.maxDate, DateType.YEAR);
    this.hideNavEndMonth = this.getDateTypeValue(this.maxDate, DateType.MONTH);
    this.hideNavStartYear = this.minDate ? this.getDateTypeValue(this.minDate, DateType.YEAR) : this.startingYear;
    this.hideNavStartMonth = this.minDate ? this.getDateTypeValue(this.minDate, DateType.MONTH) : 1;
    if (state > 0 && (currentYear < this.hideNavEndYear || currentMonth < this.hideNavEndMonth)) {
      if (currentMonth === 12 && currentYear < this.endYear) {
        currentYear++;
        currentMonth = 1;
      } else if (currentMonth !== 12) {
        currentMonth++;
      }
    } else if (state !== 0) {
      if (
        (state === 1 && (currentYear < this.hideNavEndYear || currentMonth < this.hideNavEndMonth)) ||
        (state === -1 && (currentYear > this.hideNavStartYear || currentMonth > this.hideNavStartMonth))
      ) {
        if (currentMonth === 1 && currentYear > this.startingYear) {
          currentYear--;
          currentMonth = 12;
        } else if (currentMonth !== 1) {
          currentMonth--;
        }
      }
    }
    this.setHideArrow(currentYear, currentMonth);
    /*** increase or decrease month + year*/
    this.daysCalendar.monthNum = currentMonth;
    this.daysCalendar.month = this.monthData.months.filter(data => data.index === currentMonth)[0];
    this.daysCalendar.monthTitle = this.daysCalendar.month.english;
    this.daysCalendar.yearTitle = currentYear.toString();
    this.setDayCells();
    this.days.next(this.daysCalendar);
  }
  setHideArrow(currentYearValue, currentMonthValue) {
    /*** Hide the next arrow if no funture years to show*/
    if (currentYearValue >= this.hideNavEndYear && currentMonthValue >= this.hideNavEndMonth) {
      this.daysCalendar.hideRightArrow = true;
    }

    /*** Hide the previous arrow if no previous years to show*/
    if (currentYearValue <= this.hideNavStartYear && currentMonthValue <= this.hideNavStartMonth) {
      this.daysCalendar.hideLeftArrow = true;
    }
  }
  // Month Block

  /**
   * @param
   * Function used to set the month values
   */
  setMonths(year) {
    year = parseInt(year, null);
    this.monthsCalendar = { months: [] };
    this.setMonthCells(year);
    this.monthsCalendar.yearTitle = year;
    this.months.next(this.monthsCalendar);
  }

  /**
   * Function to update the month after navigation
   * @param state
   */
  updateMonth(state) {
    const currentYear = parseInt(this.monthsCalendar.yearTitle, null) + state;
    if (currentYear >= calendarStartYear && currentYear <= calendarEndYear) {
      this.monthsCalendar = { months: [] };
      this.monthsCalendar.hideRightArrow = false;
      this.monthsCalendar.hideLeftArrow = false;
      const hideNavEndYear = this.getDateTypeValue(this.maxDate, DateType.YEAR);
      const hideNavStartYear = this.minDate ? this.getDateTypeValue(this.minDate, DateType.YEAR) : this.startingYear;
      /** Hide the next arrow if no funture years to show */

      if (currentYear >= hideNavEndYear) {
        this.monthsCalendar.hideRightArrow = true;
      }

      /** Hide the previous arrow if no previous years to show */
      if (currentYear <= hideNavStartYear) {
        this.monthsCalendar.hideLeftArrow = true;
      }
      this.monthsCalendar.yearTitle = currentYear;
      this.setMonthCells(currentYear);
      this.months.next(this.monthsCalendar);
    }
  }

  setMonthCells(year) {
    let minYear = null,
      minMonth = null;
    let maxYear = null,
      maxMonth = null;
    let minDateArr = [],
      maxDateArr = [];
    let activeMonth = null,
      activeDay = null,
      activeYear = null;

    if (this.activeDate) {
      const activeDateArr = this.activeDate.split('/');
      activeYear = parseInt(activeDateArr[2], null);
      activeMonth = parseInt(activeDateArr[1], null);
      activeDay = parseInt(activeDateArr[0], null);
    }
    if (this.minDate) {
      minDateArr = this.minDate.split('/');
      minYear = parseInt(minDateArr[2], null);
      minMonth = parseInt(minDateArr[1], null);
    }
    if (this.maxDate) {
      maxDateArr = this.maxDate.split('/');
      maxYear = parseInt(maxDateArr[2], null);
      maxMonth = parseInt(maxDateArr[1], null);
    }

    const months = this.monthData.months;
    let count = 0;
    for (let i = 0; i < months.length; i++) {
      const cells: CalendarCellViewModel[] = [];
      for (let j = 0; j < 3; j++) {
        const cell: CalendarCellViewModel = {
          dateStr: months[count],
          label: months[count].english
        };

        if (minYear && year < minYear) {
          cell.isDisabled = true;
        } else if (maxYear && year > maxYear) {
          cell.isDisabled = true;
        }
        if (minYear && minMonth) {
          if (year === minYear && count + 1 < parseInt(minMonth, null)) {
            cell.isDisabled = true;
          }
        }
        if (maxYear && maxMonth) {
          if (year === maxYear && count + 1 > parseInt(maxMonth, null)) {
            cell.isDisabled = true;
          }
        }
        if (activeYear === year && activeMonth === count + 1) cell.isSelected = true;
        cells.push(cell);
        count++;
      }
      i = i + 2;
      this.monthsCalendar.months.push(cells);
    }
  }

  // Years Block
  /*** Function used to set the year values*/
  setYears(startYear, minYear, maxYear = calendarEndYear) {
    /**start year should be calculated based on the calendar start date */
    if (!minYear) {
      minYear = calendarStartYear;
    }
    if (startYear - calendarStartYear > 16 && (startYear - calendarStartYear) % 16 > 0) {
      startYear = startYear - ((startYear - calendarStartYear) % 16);
    }
    let currentYear = startYear;
    this.yearsCalendar = { years: [] };
    for (let i = 0; i < 4; i++) {
      const cells: CalendarCellViewModel[] = [];
      for (let j = 0; j < 4; j++) {
        const cell: CalendarCellViewModel = {
          dateStr: { english: currentYear, arabic: currentYear, index: i },
          label: currentYear
        };
        cell.isDisabled = false;
        if (currentYear < this.startingYear) {
          cell.isDisabled = true;
        }
        if (minYear && currentYear < minYear) {
          cell.isDisabled = true;
        }
        if (maxYear && currentYear > maxYear) {
          cell.isDisabled = true;
        }
        cells.push(cell);

        if (currentYear >= this.endYear) {
          currentYear++;
          break;
        }
        currentYear++;
      }
      this.yearsCalendar.years.push(cells);
    }

    /*** Hide the next arrow if no funture years to show*/
    if (currentYear >= maxYear) {
      this.yearsCalendar.hideRightArrow = true;
    }
    /*** Hide the previous arrow if no previous years to show*/
    if (startYear <= minYear) {
      this.yearsCalendar.hideLeftArrow = true;
    }
    this.yearsCalendar.yearTitle = startYear + ' - ' + (parseInt(currentYear, null) - 1);
    this.years.next(this.yearsCalendar);
  }

  /**
   * @param state show previous years if -1 show future if 1
   * Method to updating years
   */
  updateYear(state) {
    const yearsVal = this.years.getValue().years;
    const maxYears = yearsVal[yearsVal.length - 1];
    const minYears = yearsVal[0];
    const maxYear = maxYears[maxYears.length - 1].label;
    const minYear = minYears[0].label;
    let minYearInput = null;
    let maxYearInput = null;
    if (this.minDate) {
      minYearInput = this.minDate.split('/')[2];
    }
    if (this.maxDate) {
      maxYearInput = this.maxDate.split('/')[2];
    }
    if (maxYear < this.endYear && state === 1) {
      this.setYears(parseInt(this.yearsCalendar.years[0][0].label, null) + 16, minYearInput, maxYearInput);
    }
    if (minYear > this.startingYear && state === -1) {
      this.setYears(parseInt(this.yearsCalendar.years[0][0].label, null) - 16, minYearInput, maxYearInput);
    }
    if (state === 0) {
      this.setYears(parseInt(this.yearsCalendar.years[0][0].label, null), minYearInput, maxYearInput);
    }
  }
}
