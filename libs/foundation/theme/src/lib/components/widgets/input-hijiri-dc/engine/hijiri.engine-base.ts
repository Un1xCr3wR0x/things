/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  DatepickerViewMode,
  DayViewModel,
  DaysCalendarViewModel,
  MonthsCalendarViewModel,
  YearsCalendarViewModel
} from '../models';

declare const require;
export class ResultDate {
  date: string;
  id: string;
}

export class PickerType {
  type = false;
  contextId: string = null;
}
export const hijriStartDate = '01/01/1296';
export const hijriEndDate = '31/12/1500';
export abstract class HijiriEngineBase {
  protected calendarData = require('../data/data.json');
  protected monthData = require('../data/months.json');
  protected weekData = require('../data/weeks.json');
  protected startingYear = this.calendarData.days[0].UMALQURAYEAR;
  protected actualStartDay = 6;
  protected endYear = this.calendarData.days[this.calendarData.days.length - 1].UMALQURAYEAR;

  protected years: BehaviorSubject<YearsCalendarViewModel> = null;
  protected years$: Observable<YearsCalendarViewModel> = null;

  protected months: BehaviorSubject<MonthsCalendarViewModel> = null;
  protected months$: Observable<MonthsCalendarViewModel> = null;

  protected days: BehaviorSubject<DaysCalendarViewModel> = null;
  protected days$: Observable<DaysCalendarViewModel> = null;

  protected viewMode: BehaviorSubject<DatepickerViewMode> = null;
  protected viewMode$: Observable<DatepickerViewMode> = null;

  protected selectedDate: BehaviorSubject<ResultDate> = null;
  protected selectedDate$: Observable<ResultDate> = null;

  yearsCalendar: YearsCalendarViewModel = { years: [] };
  monthsCalendar: MonthsCalendarViewModel = { months: [] };
  daysCalendar: DaysCalendarViewModel = {
    weeks: [
      {
        days: []
      }
    ],
    weekdays: []
  };

  protected activeDate = null;
  protected minDate = null;
  protected maxDate = null;

  protected pickerType: PickerType[] = [];
  /**
   * Creates an instance of Hijiri Engine Base.
   *
   * @memberof HijiriEngineBase
   */
  constructor() {
    this.years = new BehaviorSubject<YearsCalendarViewModel>(null);
    this.years$ = this.years.asObservable();

    this.months = new BehaviorSubject<MonthsCalendarViewModel>(null);
    this.months$ = this.months.asObservable();

    this.days = new BehaviorSubject<DaysCalendarViewModel>(null);
    this.days$ = this.days.asObservable();

    this.viewMode = new BehaviorSubject<DatepickerViewMode>(null);
    this.viewMode$ = this.viewMode.asObservable();

    this.selectedDate = new BehaviorSubject<ResultDate>(null);
    this.selectedDate$ = this.selectedDate.asObservable();
  }

  setMinDate(minDate) {
    this.minDate = minDate;
  }

  setMaxDate(maxDate) {
    this.maxDate = maxDate;
  }

  setActiveDate(activeDate) {
    this.activeDate = activeDate;
  }

  getActiveDate() {
    return this.activeDate;
  }

  /**
   * This method to calculate start day of a specific month from the beginning
   * @param selectedMonth
   * @param selectedYear
   */
  calculateStartDayFromTheBeginning(selectedMonth, selectedYear) {
    let startDay = 0;
    let totalDays = 0;
    for (const year of this.calendarData.days) {
      if (year.UMALQURAYEAR === selectedYear) {
        for (let i = 1; i <= selectedMonth; i++) {
          totalDays = this.calculateTotalDays(year, i);
          startDay = startDay === 0 ? this.actualStartDay : this.calculateStartDay(startDay, totalDays);
        }
        break;
      }
      for (let i = 1; i <= 12; i++) {
        totalDays = this.calculateTotalDays(year, i);
        startDay = startDay === 0 ? this.actualStartDay : this.calculateStartDay(startDay, totalDays);
      }
    }
    return startDay;
  }

  /**
   * Function to set selected date to input
   * @param day Set
   */
  setSelectedDate(day: DayViewModel, id: string) {
    day.isSelected = true;
    let monthNumber = 0;
    const month = this.monthData.months.filter(res => res.english.includes(this.days.getValue().monthTitle));
    if (month) {
      monthNumber = month[0].index;
    }
    const monthString = ('00' + monthNumber).slice(-2);
    const dayString = ('00' + day.label).slice(-2);
    const date =
      (this.getIsMonthPicker(id) ? '01' : dayString) + '/' + monthString + '/' + this.days.getValue().yearTitle;
    this.activeDate = date;
    const resultDate = new ResultDate();
    resultDate.date = this.getIsMonthPicker(id) ? monthString + '/' + this.days.getValue().yearTitle : date;
    resultDate.id = id;
    this.selectedDate.next(resultDate);
  }

  getSelectedDate() {
    return this.selectedDate$;
  }

  calculateTotalDays(year, month) {
    let totalDays = 0;
    const yearNum = parseInt(year.UMALQURAYEAR, null);
    if (yearNum !== this.startingYear) {
      year = month === 1 ? this.calendarData.days.filter(data => data.UMALQURAYEAR === yearNum - 1)[0] : year;
    }
    month = month === 1 ? 12 : month - 1;
    const monthLabel = 'DAYSINHIJMONTH' + month;
    Object.keys(year).forEach(key => {
      if (key === monthLabel) {
        totalDays = year[key];
      }
    });
    return totalDays;
  }

  /**
   * Method to calculate the start day of a month
   * @param prevStartDay previous month start day
   * @param prevTotalDays previous month total days
   */
  calculateStartDay(prevStartDay, prevTotalDays) {
    const firstWeekNoOfDays = 7 - prevStartDay + 1;
    const lastWeekNoOfDays = (prevTotalDays - firstWeekNoOfDays) % 7;
    return lastWeekNoOfDays + 1;
  }

  getCellIsDisabledAfterMaxDate(
    maxYear,
    maxMonth,
    currentYr,
    currentMnth,
    i,
    startDay,
    maxDay,
    currentYear,
    numberOfDays
  ) {
    if (maxYear && maxMonth) {
      if (currentYr === maxYear && currentMnth === maxMonth) {
        //disable date upto minimun date specified
        if (i < startDay || i > maxDay + startDay - 1) {
          return true;
        }
      } else {
        if (currentYear === maxYear) {
          if (currentMnth > maxMonth) {
            //disabling all date before minimum month
            return true;
          } else if (i < startDay || i > numberOfDays + startDay - 1) {
            return true;
          }
        } else if (currentYr > maxYear || i < startDay || i > numberOfDays + startDay - 1) {
          //disable all dates before minimum year
          return true;
        }
      }
    }
  }

  getCellIsDisabledForMinDate(
    currentYear,
    currentMnth,
    currentYr,
    minYear,
    minMonth,
    startDay,
    numberOfDays,
    minDay,
    index
  ): boolean {
    if (currentYr === minYear && currentMnth === minMonth) {
      //disable date upto minimun date specified
      return this.getCellIsDisabledUpToMinDate(minDay, startDay, numberOfDays, index);
    } else {
      return this.getCellIsDisabledBeforeMinDate(
        currentYear,
        currentMnth,
        currentYr,
        minYear,
        minMonth,
        startDay,
        numberOfDays,
        index
      );
    }
  }

  getCellIsDisabledBeforeMinDate(
    currentYear,
    currentMnth,
    currentYr,
    minYear,
    minMonth,
    startDay,
    numberOfDays,
    index
  ): boolean {
    if (currentYear === minYear) {
      if (currentMnth < minMonth) {
        //disabling all date before minimum month
        return true;
      } else if (index < startDay || index > numberOfDays + startDay - 1) {
        return true;
      }
    } else if (currentYr < minYear || index < startDay || index > numberOfDays + startDay - 1) {
      //disable all dates before minimum year
      return true;
    }
    return false;
  }

  getCellIsDisabledUpToMinDate(minDay, startDay, numberOfDays, index): boolean {
    if (minDay < numberOfDays) {
      if (index < startDay + minDay - 1 || index > numberOfDays + startDay - 1) {
        return true;
      }
    } else {
      if (index < numberOfDays + startDay - 1 || index > numberOfDays + startDay - 1) {
        return true;
      }
    }
    return false;
  }

  getIsSelectedDate(isDisabled, labelValue, currentYear): boolean {
    if (this.activeDate != null) {
      const monthString = ('00' + this.daysCalendar.monthNum).slice(-2);
      const dayString = ('00' + labelValue).slice(-2);
      const date = dayString + '/' + monthString + '/' + currentYear;

      if (date === this.activeDate && !isDisabled) {
        return true;
      }
    }
    return false;
  }

  //Method for checking whether the entered date is a valid date
  dateValidator(date) {
    if (date === null) return false;
    const dateArr = date.split('/');
    const selectedYear = dateArr[2];
    const selectedMonth = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[0], null);
    let totalDays = 0;
    const monthLabel = 'DAYSINHIJMONTH' + selectedMonth;
    for (const year of this.calendarData.days) {
      if (parseInt(selectedYear, null) === year?.UMALQURAYEAR) {
        if (selectedMonth <= 12 && selectedMonth >= 1) {
          Object.keys(year).forEach(key => {
            if (key === monthLabel) {
              totalDays = year[key];
            }
          });
          if (day <= totalDays && day >= 1) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
  //Method for checking whether the entered date is within the max date
  minDateValidator(date) {
    if (date === null) return false;
    const dateArr = date.split('/');
    const selectedYear = dateArr[2];
    const selectedMonth = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[0], null);
    const defaultMinDate = this.minDate ? this.minDate : hijriStartDate;
    const minDateArr = defaultMinDate.split('/');
    const minSelectedYear = minDateArr[2];
    const minSelectedMonth = parseInt(minDateArr[1], null);
    const minDay = parseInt(minDateArr[0], null);

    if (parseInt(minSelectedYear, null) < parseInt(selectedYear, null)) {
      return true;
    } else if (parseInt(minSelectedYear, null) > parseInt(selectedYear, null)) {
      return false;
    } else {
      if (minSelectedMonth < selectedMonth) {
        return true;
      } else if (minSelectedMonth > selectedMonth) {
        return false;
      } else {
        if (minDay <= day) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  //Method for checking whether the entered date is within the max date
  maxDateValidator(date) {
    if (date === null) return false;
    const dateArr = date.split('/');
    const selectedYear = dateArr[2];
    const selectedMonth = parseInt(dateArr[1], null);
    const day = parseInt(dateArr[0], null);
    const maxAllowedDate = hijriEndDate;
    const maxAllowedDateArr = maxAllowedDate.split('/');
    const maxAllowedYear = maxAllowedDateArr[2];
    const maxAlloweddMonth = parseInt(maxAllowedDateArr[1], null);
    const maxAllowedDay = parseInt(maxAllowedDateArr[0], null);
    const defaultMaxDate = this.maxDate ? this.maxDate : hijriEndDate;
    const maxDateArr = defaultMaxDate.split('/');
    const maxSelectedYear = maxDateArr[2];
    const maxSelectedMonth = parseInt(maxDateArr[1], null);
    const maxDay = parseInt(maxDateArr[0], null);
    if (parseInt(maxAllowedYear, null) >= parseInt(selectedYear, null)) {
      if (maxAlloweddMonth >= selectedMonth) {
        if (maxAllowedDay >= day) {
          if (parseInt(maxSelectedYear, null) > parseInt(selectedYear, null)) {
            return true;
          } else if (parseInt(maxSelectedYear, null) < parseInt(selectedYear, null)) {
            return false;
          } else {
            if (maxSelectedMonth > selectedMonth) {
              return true;
            } else if (maxSelectedMonth < selectedMonth) {
              return false;
            } else {
              if (maxDay >= day) {
                return true;
              } else {
                return false;
              }
            }
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Returning years as observables
   */
  getYears() {
    return this.years$;
  }

  /**
   * Returning years as observables
   */
  getMonths() {
    return this.months$;
  }

  /**
   * Returning years as observables
   */
  getDays() {
    return this.days$;
  }
  /**
   * Method to set picker type
   * @param state
   * @param id
   */
  setIsMonthPicker(state: boolean, id: string) {
    const pickerType = new PickerType();
    pickerType.contextId = id;
    pickerType.type = state;
    this.pickerType.push(pickerType);
  }
  /**
   * Method to get picker type
   * @param id
   */
  getIsMonthPicker(id: string): boolean {
    return this.pickerType.find(item => item.contextId === id).type;
  }
  /**
   * Method to remove context
   * @param contextId
   */
  removeContext(contextId: string) {
    this.pickerType.filter(item => item.contextId !== contextId);
  }
}
