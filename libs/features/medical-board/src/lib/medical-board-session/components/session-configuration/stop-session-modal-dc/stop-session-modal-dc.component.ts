/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants, LovList, markFormGroupTouched, scrollToTop, startOfDay, GosiCalendar } from '@gosi-ui/core';
import { StopSessionDetails } from '../../../../shared/models';
import { GeneralEnum } from '../../../../shared/enums';

@Component({
  selector: 'mb-stop-session-modal-dc',
  templateUrl: './stop-session-modal-dc.component.html',
  styleUrls: ['./stop-session-modal-dc.component.scss']
})
export class StopSessionModalDcComponent implements OnInit {
  //Local Variables
  stopSessionForm: FormGroup;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  // minDate: Date;
  minDate = new Date();
  //Input Variables
  @Input() reasonList: LovList;
  @Input() parentForm: FormGroup;
  @Input() showMandatoryError: boolean;
  @Input () startDate:GosiCalendar;
  //Output Variables
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  @Output() action: EventEmitter<StopSessionDetails> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.stopSessionForm = this.createStopSessionForm();
    this.stopSessionForm?.reset();
    this.parentForm?.removeControl('stopSessionForm');
    if (this.parentForm) {
      this.parentForm.addControl('stopSessionForm', this.stopSessionForm);
    }
    // const today = new Date();
    // this.minDate = new Date(this.startDate.gregorian);
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  // Create stop session form
  createStopSessionForm() {
    return this.fb.group({
      stopDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      stopReasonComments: [null],
      stopReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  //Cancel Stop session
  cancelStopSession() {
    this.cancelEvent.emit();
  }

  confirmStopSession() {
    if (this.stopSessionForm.valid) {
      this.showMandatoryError = false;
      const stopSessionObject: StopSessionDetails = new StopSessionDetails();
      stopSessionObject.comments = this.stopSessionForm?.get('stopReasonComments').value;
      stopSessionObject.stopReason = this.stopSessionForm?.get('stopReason')?.value;
      const statusDate = this.stopSessionForm.get('stopDate')?.value;
      stopSessionObject.stopDate.gregorian = startOfDay(statusDate.gregorian);
      this.action.emit(stopSessionObject);
    } else {
      markFormGroupTouched(this.stopSessionForm);
      scrollToTop();
      this.showMandatoryError = true;
    }
  }
  onReasonSelect() {
    const otherFields = this.stopSessionForm.get('stopReason').get('english');
    if (otherFields.value === GeneralEnum.OTHER) {
      this.stopSessionForm.get('stopReasonComments').reset();
      this.stopSessionForm.get('stopReasonComments').setValidators([Validators.required]);
      this.stopSessionForm.get('stopReasonComments').updateValueAndValidity();
    } else if (otherFields.value !== GeneralEnum.OTHER) {
      this.stopSessionForm.get('stopReasonComments').clearValidators();
      this.stopSessionForm.get('stopReasonComments').reset();
      this.stopSessionForm.get('stopReasonComments').updateValueAndValidity();
    }
  }
}
