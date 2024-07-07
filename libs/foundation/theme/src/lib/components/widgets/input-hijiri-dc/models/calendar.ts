import { BilingualText } from '@gosi-ui/core';

export enum DatepickerViewMode {
  Day = 'day',
  Month = 'month',
  Year = 'year'
}

/** *************** */
export interface BilingualValue extends BilingualText {
  index: number;
}

export interface NavigationViewModel {
  monthTitle?: string;
  yearTitle?: string;
  hideLeftArrow?: boolean;
  hideRightArrow?: boolean;
  disableLeftArrow?: boolean;
  disableRightArrow?: boolean;
  month?: BilingualValue;
}
export interface CalendarCellViewModel {
  date?: Date;
  dateStr?: BilingualValue;
  label: string;
  isDisabled?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
}
/** *************** */
export interface DayViewModel extends CalendarCellViewModel {
  isOtherMonthHovered?: boolean;
  isOtherMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  customClasses?: string;
  monthIndex?: number;
  weekIndex?: number;
  dayIndex?: number;
}
export interface WeekViewModel {
  days: DayViewModel[];
  isHovered?: boolean;
}
export interface DaysCalendarViewModel extends NavigationViewModel {
  weeks: WeekViewModel[];
  month?: BilingualValue;
  monthNum?: number;
  year?: number;
  weekNumbers?: string[];
  weekdays?: BilingualValue[];
}
/** *************** */
export interface MonthsCalendarViewModel extends NavigationViewModel {
  months: CalendarCellViewModel[][];
}
/** *************** */
export interface YearsCalendarViewModel extends NavigationViewModel {
  years: CalendarCellViewModel[][];
}
/** *************** */
/** *************** */
export interface DaysCalendarModel {
  daysMatrix: Date[][];
  month: Date;
}
/** *************** */
export interface MonthViewOptions {
  width?: number;
  height?: number;
  firstDayOfWeek?: number;
}
/** *************** */
export interface DatepickerFormatOptions {
  locale: string;
  monthTitle: string;
  yearTitle: string;
  dayLabel: string;
  monthLabel: string;
  yearLabel: string;
  weekNumbers: string;
}
export interface DatepickerRenderOptions {
  showWeekNumbers?: boolean;
  displayMonths?: number;
}
export interface DatepickerDateCustomClasses {
  date: Date;
  classes: string[];
}
/** *************** */
/** *************** */
export declare enum BsNavigationDirection {
  UP = 0,
  DOWN = 1
}

export interface CellHoverEvent {
  cell: CalendarCellViewModel;
  isHovered: boolean;
}

export interface DateModel {
  year?: number;
  month?: number;
  day?: number;
  monthStr?: BilingualValue;
}
