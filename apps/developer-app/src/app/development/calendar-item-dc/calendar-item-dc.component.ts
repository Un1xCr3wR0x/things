import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EngagementCalendarYear } from '../engagement-calendar-year';
import { EngagementCalendarMonth } from '../engagement-calendar-month';
import { EngagementCalendarRow } from '../engagement-calendar-row';

@Component({
  selector: 'dev-calendar-item-dc',
  templateUrl: './calendar-item-dc.component.html',
  styleUrls: ['./calendar-item-dc.component.scss']
})
export class CalendarItemDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() year: EngagementCalendarYear;

  /**
   * output variables
   */
  @Output() onMonthSuggested = new EventEmitter();
  @Output() onMonthUnselected = new EventEmitter();
  @Output() onMonthSelected = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleMouseOver(monthRow: EngagementCalendarRow, month: EngagementCalendarMonth) {
    if (monthRow.activeClass && !month.disabled) {
      this.onMonthSuggested.emit({ monthRow: monthRow, month: month });
    }
  }

  handleMouseOut(monthRow: EngagementCalendarRow, month: EngagementCalendarMonth) {
    if ((monthRow.activeClass || monthRow.suggestedClass) && !month.disabled && monthRow.selectedClass === undefined) {
      this.onMonthUnselected.emit();
    }
  }

  handleSelection(monthRow: EngagementCalendarRow, month: EngagementCalendarMonth) {
    if ((monthRow.activeClass || monthRow.suggestedClass) && !month.disabled) {
      this.onMonthSelected.emit({ monthRow: monthRow, month: month });
    }
  }
}
