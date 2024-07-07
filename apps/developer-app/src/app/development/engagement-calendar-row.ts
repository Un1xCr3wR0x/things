import { EngagementCalendarMonth } from './engagement-calendar-month';

/**
 * The wrapper class for engagement period details.
 *
 * @export
 * @class EngagementDetails
 */
export class EngagementCalendarRow {
  months: EngagementCalendarMonth[] = [];
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
