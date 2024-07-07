/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CalendarRow } from './calendar-row';

/* Class holding calendar year details for calendar picker widget. */
export class CalendarYear {
  year: number = undefined;
  monthsRows: CalendarRow[] = [];

  constructor(year: number) {
    this.year = year;
  }
}
