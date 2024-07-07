/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { GosiCalendar, startOfDay } from '@gosi-ui/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'bnt-calendar-hijiri-gregorian-dc',
  templateUrl: './calendar-hijiri-gregorian-dc.component.html',
  styleUrls: ['./calendar-hijiri-gregorian-dc.component.scss']
})
export class CalendarHijiriGregorianDcComponent implements OnInit, OnChanges {
  calendarForm: FormGroup;
  subscriptionDob: Subscription;
  maxDateGregorian: Date;
  maxDateHijiri: Date;

  @Output() dateSelected = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Input() systemRunDate: GosiCalendar;
  @Input() parentForm: FormGroup;
  @Input() label = 'BENEFITS.DATE-OF-BIRTH';
  @Input() defaultRequestDate: GosiCalendar;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.calendarForm = this.fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: [null, { updateOn: 'blur' }],
      calendarType: 'gregorian'
    });
    if (this.parentForm) {
      // if (this.parentForm.get('dob') && this.parentForm.get('dob').value) {
      //   this.calendarForm.patchValue(this.parentForm.get('dob').value);
      //   this.parentForm.removeControl('dob');
      //   this.parentForm.addControl('dob', this.calendarForm);
      // } else {
      //   this.parentForm.addControl('dob', this.calendarForm);
      // }
      if (this.parentForm.get('dob')) this.parentForm.removeControl('dob');
      this.parentForm.addControl('dob', this.calendarForm);
    }
    if (this.defaultRequestDate) {
      this.calendarForm.get('gregorian').patchValue(startOfDay(moment(this.defaultRequestDate.gregorian).toDate()));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.systemRunDate && changes.systemRunDate.currentValue) {
      this.maxDateGregorian = moment(changes.systemRunDate.currentValue.gregorian).toDate();
      // this.maxDateHijiri = changes.systemRunDate.currentValue.hijiri;
      this.maxDateHijiri = this.maxDateGregorian;
    }
  }

  // Function to toggle the calendar type between gregorain and hijiri
  calendarTypeChange(data: string) {
    const hijiriDobControl = this.calendarForm.get('hijiri');
    const gregorianControl = this.calendarForm.get('gregorian');
    if (data === 'hijiri') {
      this.calendarForm.get('calendarType').patchValue('hijiri');
      gregorianControl.clearValidators();
      gregorianControl.setErrors(null);
      gregorianControl.reset();
      hijiriDobControl.setValidators(Validators.required);
    } else if (data === 'gregorian') {
      this.calendarForm.get('calendarType').patchValue('gregorian');
      gregorianControl.setValidators(Validators.required);
      hijiriDobControl.clearValidators();
      hijiriDobControl.setErrors(null);
      hijiriDobControl.reset();
    }
    this.calendarForm.updateValueAndValidity();
  }
  valueChanged(data) {
    this.onBlur.emit(data);
  }
}
