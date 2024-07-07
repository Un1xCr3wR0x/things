/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, AppConstants } from '@gosi-ui/core';
import { SessionRequestActions } from '../../../shared';

@Component({
  selector: 'mb-hold-session-status-modal-dc',
  templateUrl: './hold-session-status-modal-dc.component.html',
  styleUrls: ['./hold-session-status-modal-dc.component.scss']
})
export class HoldSessionStatusModalDcComponent implements OnInit {
  holdSessionForm: FormGroup = new FormGroup({});
  commentAlert?: boolean;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  @Input() reasonForHoldList: LovList; //Input Variables
  @Input() parentForm: FormGroup = new FormGroup({});

  //Output Variables
  @Output() onConfirm: EventEmitter<SessionRequestActions> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.holdSessionForm = this.createHoldSessionForm();
    if (this.parentForm) this.parentForm.addControl('holdSessionForm', this.holdSessionForm);
  }
  // Create hold session form
  createHoldSessionForm() {
    return this.fb.group({
      comments: [null],
      reason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  selectReason() {
    const fields = this.holdSessionForm.get('reason').get('english');
    if (fields.value === 'Other') {
      this.holdSessionForm.get('comments').setValidators([Validators.required]);
    } else if (fields.value !== 'Other') {
      this.commentAlert = false;
      this.holdSessionForm.get('comments').clearValidators();
    }
    this.holdSessionForm.get('comments').updateValueAndValidity();
  }

  confirmHoldSession() {
    if (this.holdSessionForm.valid) {
      const cancelSessionObject: SessionRequestActions = new SessionRequestActions();
      cancelSessionObject.comments = this.holdSessionForm?.get('comments').value;
      cancelSessionObject.reason = this.holdSessionForm?.get('reason')?.value;
      this.onConfirm.emit(cancelSessionObject);
    } else {
      this.commentAlert = true;
    }
  }

  cancelHoldSession() {
    this.onCancel.emit();
  }
}
