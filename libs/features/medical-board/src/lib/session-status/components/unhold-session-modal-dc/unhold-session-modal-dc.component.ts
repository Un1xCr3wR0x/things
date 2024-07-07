/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, AppConstants } from '@gosi-ui/core';
import { SessionRequestActions } from '../../../shared';

@Component({
  selector: 'mb-unhold-session-modal-dc',
  templateUrl: './unhold-session-modal-dc.component.html',
  styleUrls: ['./unhold-session-modal-dc.component.scss']
})
export class UnholdSessionModalDcComponent implements OnInit {
  unholdForm: FormGroup = new FormGroup({});
  commentAlert?: boolean;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  //Input Variables
  @Input() reasonForHoldList: LovList;
  @Input() parentForm: FormGroup = new FormGroup({});

  //Output Variables
  @Output() onConfirm: EventEmitter<SessionRequestActions> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.unholdForm = this.createunholdForm();
    if (this.parentForm) this.parentForm.addControl('unHoldSession', this.unholdForm);
  }
  // Create hold session form
  createunholdForm() {
    return this.fb.group({
      comments: [null],
      reason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  selectReason() {
    const fields = this.unholdForm.get('reason').get('english');
    if (fields.value === 'Other') {
      this.unholdForm.get('comments').setValidators([Validators.required]);
    } else if (fields.value !== 'Other') {
      this.commentAlert = false;
      this.unholdForm.get('comments').clearValidators();
    }
    this.unholdForm.get('comments').updateValueAndValidity();
  }

  confirmHoldSession() {
    if (this.unholdForm.valid) {
      const cancelSessionObject: SessionRequestActions = new SessionRequestActions();
      cancelSessionObject.comments = this.unholdForm?.get('comments').value;
      cancelSessionObject.reason = this.unholdForm?.get('reason')?.value;
      this.onConfirm.emit(cancelSessionObject);
    } else {
      this.commentAlert = true;
    }
  }

  cancelHoldSession() {
    this.onCancel.emit();
  }
}
