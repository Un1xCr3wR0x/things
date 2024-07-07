/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GosiCalendar, subtractMonths, addMonths } from '@gosi-ui/core';

@Component({
  selector: 'bnt-gregorian-hijiri-date-picker-dc',
  templateUrl: './gregorian-hijiri-date-picker-dc.component.html',
  styleUrls: ['./gregorian-hijiri-date-picker-dc.component.scss']
})
export class GregorianHijiriDatePicker implements OnInit {
  selectedDate: GosiCalendar;
  minDate: Date;
  maxDate: Date;
  hijirimaxDate: string;
  hijiriminDate: string;
  calendarType: string;
  constructor(readonly fb: FormBuilder) {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.calendarType = 'gregorian';
    this.minDate = subtractMonths(new Date(), 4);
    this.maxDate = addMonths(new Date(), 4);
    this.hijirimaxDate = '1442-02-15';
    this.hijiriminDate = '1440-02-15';
  }

  /**
   * This method is for handling calendar type change
   */
  calendarTypeChange(event) {
    if (event === 'gregorian') {
      this.calendarType = 'gregorian';
    } else if (event === 'hijiri') this.calendarType = 'hijiri';
  }
}
