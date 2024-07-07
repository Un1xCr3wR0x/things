/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/* Class holding calendar month details for calendar picker widget. */
export class CalendarMonth {
  label: string = undefined;
  labelKey: string = undefined;
  rowIndex: number = undefined;
  colIndex: number = undefined;
  year: number = undefined;
  disabled = false;
  beyondLimit = false;

  constructor(year, rowIndex, colIndex, label) {
    this.year = year;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.label = label;
    this.labelKey = 'THEME.MONTHS.' + label;
  }
}
