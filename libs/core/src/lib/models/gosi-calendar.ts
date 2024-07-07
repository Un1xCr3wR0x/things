/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/**
 * Wrapper class to hold Gregorian and Hijri date values.
 *
 * @export
 * @class GosiCalendar
 */
export class GosiCalendar {
  gregorian?: Date = undefined;
  hijiri?: string = undefined;
  entryFormat?: string;
  calendarType?: string; // only for non saudi heir/dependent

  constructor() {}
}
