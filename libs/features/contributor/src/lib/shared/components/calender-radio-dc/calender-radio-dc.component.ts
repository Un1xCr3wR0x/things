/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CalendarTypeEnum } from '@gosi-ui/core';
@Component({
  selector: 'cnt-calender-radio-dc',
  templateUrl: './calender-radio-dc.component.html',
  styleUrls: ['./calender-radio-dc.component.scss']
})
export class CalenderRadioDcComponent implements OnInit {
    /**
   * Input variables
   */
    @Input() calendarType = CalendarTypeEnum.GREGORIAN;
    @Input() disabled = false;
    /**
     * Output variables
     */
    @Output() onSelected = new EventEmitter<string>();
    /**
     * Local variables
     */
    Gregorian: string = CalendarTypeEnum.GREGORIAN;
    Hijri: string = CalendarTypeEnum.HIJRI;

  constructor() { }

  ngOnInit(): void {
  }

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
