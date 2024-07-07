import { EngagementCalendarRow } from './engagement-calendar-row';

/**
 * The wrapper class for engagement period details.
 *
 * @export
 * @class EngagementDetails
 */
export class EngagementCalendarYear {
  year: number = undefined;
  monthsRows: EngagementCalendarRow[] = [];

  constructor(year: number) {
    this.year = year;
  }
}
