/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CalendarTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'gosi-calendar-type-dc',
  templateUrl: './calendar-type-dc.component.html',
  styleUrls: ['./calendar-type-dc.component.scss']
})
export class CalendarTypeDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() calendarType = CalendarTypeEnum.GREGORIAN;
  /**
   * Output variables
   */
  @Output() onSelected = new EventEmitter<string>();
  /**
   * Local variables
   */
  Gregorian: string = CalendarTypeEnum.GREGORIAN;
  Hijri: string = CalendarTypeEnum.HIJRI;

  constructor() {}

  ngOnInit() {}

  /**
   *
   * @param type
   * Method to change calendar type
   */
  changeType(type) {
    if (type !== this.calendarType) {
      this.calendarType = type;
      this.onSelected.emit(this.calendarType);
    }
  }
}
