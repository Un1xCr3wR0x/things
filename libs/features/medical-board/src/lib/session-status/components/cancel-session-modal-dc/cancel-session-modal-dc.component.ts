/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, LovList, scrollToTop } from '@gosi-ui/core';
import { SessionRequestActions, SessionStatusDetails } from '../../../shared';

@Component({
  selector: 'mb-cancel-session-modal-dc',
  templateUrl: './cancel-session-modal-dc.component.html',
  styleUrls: ['./cancel-session-modal-dc.component.scss']
})
export class CancelSessionModalDcComponent implements OnInit {
  //Local Variables
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  cancelSessionForm: FormGroup = new FormGroup({});
  showMandatoryError: boolean;
  //Input Variables
  @Input() reasonForCancellationList: LovList;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() sessionDetails: SessionStatusDetails;
  //Output Variables
  @Output() actionEvent: EventEmitter<SessionRequestActions> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.cancelSessionForm = this.createCancelSessionForm();
    if (this.parentForm) {
      this.parentForm.addControl('cancelSessionForm', this.cancelSessionForm);
    }
  }
  // Create hold session form
  createCancelSessionForm() {
    return this.fb.group({
      comments: [null],
      reason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  confirmCancelSession() {
    if (this.cancelSessionForm.valid) {
      this.showMandatoryError = false;
      const cancelSessionObject: SessionRequestActions = new SessionRequestActions();
      cancelSessionObject.comments = this.cancelSessionForm?.get('comments').value;
      cancelSessionObject.reason = this.cancelSessionForm?.get('reason')?.value;
      this.actionEvent.emit(cancelSessionObject);
    } else {
      this.showMandatoryError = true;
      scrollToTop();
    }
  }

  //Cancel hold session
  cancelCancelSession() {
    this.cancelEvent.emit();
  }
  onSelect() {
    const fields = this.cancelSessionForm.get('reason').get('english');
    if (fields.value === 'Other') {
      this.cancelSessionForm.get('comments').reset();
      this.cancelSessionForm.get('comments').setValidators([Validators.required]);
      this.cancelSessionForm.get('comments').updateValueAndValidity();
    } else if (fields.value !== 'Other') {
      this.cancelSessionForm.get('comments').clearValidators();
      this.cancelSessionForm.get('comments').reset();
      this.cancelSessionForm.get('comments').updateValueAndValidity();
    }
  }
}
