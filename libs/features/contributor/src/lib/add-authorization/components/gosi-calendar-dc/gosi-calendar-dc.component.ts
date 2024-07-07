/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CalendarTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'cnt-gosi-calendar-dc',
  templateUrl: './gosi-calendar-dc.component.html',
  styleUrls: ['./gosi-calendar-dc.component.scss']
})
export class GosiCalendarDcComponent {
  /**Creates an instance of GosiCalendarDcComponent. */
  constructor(private fb: FormBuilder) {}
  /** Input variables */
  @Input() label: String;
  @Input() minHijiriDate: String = '01/01/1296';
  @Input() maxGregorianDate: Date = new Date();
  @Input() minGregorianDate: Date = new Date(1900, 1, 1);
  @Input() calendarType = CalendarTypeEnum.GREGORIAN;

  GREGORIAN: string = CalendarTypeEnum.GREGORIAN;
  HIJRI: string = CalendarTypeEnum.HIJRI;

  @Input() calendarForm = this.fb.group({
    calendarType: this.fb.group({
      english: [this.GREGORIAN, { validators: Validators.required }],
      arabic: [null],
      updateOn: 'blur'
    }),
    gregorian: this.fb.control(null, [Validators.required])
  });

  switchCalendarType(type: string) {
    const calendarType = this.calendarForm.get('calendarType.english');
    const typeLower = type === this.GREGORIAN ? 'gregorian' : 'hijiri';

    this.calendarForm.addControl(typeLower, this.fb.control(null, Validators.required));

    this.calendarForm.removeControl(calendarType.value === this.GREGORIAN ? 'gregorian' : 'hijiri');

    calendarType.setValue(type);
  }

  resetAndRecreateFormGroup() {
    const calendarType = this.calendarForm.get('calendarType.english');
    const typeLower = calendarType.value === this.GREGORIAN ? 'gregorian' : 'hijiri';

    this.calendarForm.removeControl('gregorian');
    this.calendarForm.removeControl('hijiri');

    this.calendarForm.addControl(typeLower, this.fb.control(null, Validators.required));
  }
}
