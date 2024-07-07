/**
 * The wrapper class for engagement period details.
 *
 * @export
 * @class EngagementDetails
 */
export class EngagementCalendarMonth {
  label: string = undefined;
  labelKey: string = undefined;
  rowIndex: number = undefined;
  colIndex: number = undefined;
  year: number = undefined;
  disabled = false;

  constructor(year, rowIndex, colIndex, label) {
    this.year = year;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.label = label;
    this.labelKey = 'MONTHS.' + label;
  }
}
