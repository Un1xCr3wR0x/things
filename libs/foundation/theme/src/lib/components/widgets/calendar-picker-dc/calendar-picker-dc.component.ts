/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ApplicationTypeToken, CalendarMonth, CalendarRow, CalendarYear } from '@gosi-ui/core';

@Component({
  selector: 'gosi-calendar-picker-dc',
  templateUrl: './calendar-picker-dc.component.html',
  styleUrls: ['./calendar-picker-dc.component.scss']
})
export class CalendarPickerDcComponent {
  isAppPublic = false;
  /**
   * Input variables
   */
  @Input() year: CalendarYear;

  /**
   * output variables
   */
  @Output() onMonthSuggested = new EventEmitter();
  @Output() onMonthUnselected = new EventEmitter();
  @Output() onMonthSelected = new EventEmitter();

  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {
    this.isAppPublic = false;
    //this.appToken === ApplicationTypeEnum.PUBLIC ? true : false
  }

  /**
   * Method to handle mouse over event.
   * @param monthRow row details of month.
   * @param month month pointed by mouse.
   */
  handleMouseOver(monthRow: CalendarRow, month: CalendarMonth) {
    if (monthRow.activeClass && !month.disabled) {
      this.onMonthSuggested.emit({ monthRow: monthRow, month: month });
    }
  }

  /**
   * Method to handle mouse out event.
   * @param monthRow row details of month.
   * @param month month pointed by mouse.
   */
  handleMouseOut(monthRow: CalendarRow, month: CalendarMonth) {
    if ((monthRow.activeClass || monthRow.suggestedClass) && !month.disabled && monthRow.selectedClass === undefined) {
      this.onMonthUnselected.emit({ monthRow: monthRow, month: month });
    }
  }

  /**
   * Method to handle month selection.
   * @param monthRow row details of month.
   * @param month selected month.
   */
  handleSelection(monthRow: CalendarRow, month: CalendarMonth) {
    if ((monthRow.activeClass || monthRow.suggestedClass) && !month.disabled) {
      this.onMonthSelected.emit({ monthRow: monthRow, month: month });
    }
  }
}
