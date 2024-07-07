/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CalendarMonth } from './calendar-month';

/* Class holding calendar row details of calendar picker widget. */
export class CalendarRow {
  months: CalendarMonth[] = [];
  activeClass: string = undefined;
  suggestedClass: string = undefined;
  selectedClass: string = undefined;
  rowId: string = undefined;
  year: number = undefined;
  rowIndex: number = undefined;

  constructor(year, rowId, rowIndex) {
    this.year = year;
    this.rowId = rowId;
    this.rowIndex = rowIndex;
  }
}
