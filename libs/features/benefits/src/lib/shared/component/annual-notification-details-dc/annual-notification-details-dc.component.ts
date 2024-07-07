/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment-timezone';
import { GosiCalendar, addYears } from '@gosi-ui/core';

@Component({
  selector: 'bnt-annual-notification-details-dc',
  templateUrl: './annual-notification-details-dc.component.html',
  styleUrls: ['./annual-notification-details-dc.component.scss']
})
export class AnnualNotificationDetailsDcComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() currentDate: GosiCalendar;
  @Input() requestDate: GosiCalendar;
  @Input() lessPadding = true;
  @Input() showCard = true;
  @Input() validator = false;
  @Input() showHeading = false;

  notificationForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.notificationForm = this.getForm();
    if (this.parentForm) {
      if (this.parentForm.get('notificationDetails') && this.parentForm.get('notificationDetails').value) {
        this.notificationForm.patchValue(this.parentForm.get('notificationDetails').value);
        this.parentForm.removeControl('notificationDetails');
        this.parentForm.addControl('notificationDetails', this.notificationForm);
      } else {
        this.parentForm.addControl('notificationDetails', this.notificationForm);
      }
      this.parentForm.updateValueAndValidity();
    }
  }
  getForm(): FormGroup {
    if (this.notificationForm) {
      return this.notificationForm;
    } else {
      return this.fb.group({
        gregorian: [new Date(), { validators: Validators.required, updateOn: 'blur' }],
        hijiri: [null]
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.notificationForm = this.getForm();
      if (changes.requestDate && changes.requestDate.currentValue && !this.validator) {
        this.notificationForm.get('gregorian').patchValue(addYears(moment(this.requestDate?.gregorian).toDate(), 1));
      }
      if (changes.currentDate && changes.currentDate.currentValue) {
        //TODO: max or min date
        this.maxDate = addYears(moment(this.currentDate?.gregorian).toDate(), 1);
      }
    }
  }
}
