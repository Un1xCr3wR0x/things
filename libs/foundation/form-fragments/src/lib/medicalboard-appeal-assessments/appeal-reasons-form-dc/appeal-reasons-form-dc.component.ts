import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, LovList } from '@gosi-ui/core';

type NewType = LovList;

@Component({
  selector: 'gosi-ui-appeal-reasons-form-dc',
  templateUrl: './appeal-reasons-form-dc.component.html',
  styleUrls: ['./appeal-reasons-form-dc.component.scss']
})
export class AppealReasonsFormDcComponent implements OnInit {
  appealSessionForm: FormGroup = new FormGroup({});
  commentAlert?: boolean;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  @Input() appealList: LovList; //Input Variables
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() isWithdraw = false;

  //Output Variables
  // @Output() onConfirm: EventEmitter<SessionRequestActions> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.appealSessionForm = this.createAppealSessionForm();
    if (this.parentForm) this.parentForm.addControl('appealSessionForm', this.appealSessionForm);
  }
  // Create appeal session form
  createAppealSessionForm() {
    return this.fb.group({
      comments: [null],
      reason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  selectReason() {
    const fields = this.appealSessionForm.get('reason').get('english');
    if (fields.value === 'Other') {
      this.appealSessionForm.get('comments').setValidators([Validators.required]);
    } else if (fields.value !== 'Other') {
      this.commentAlert = false;
      this.appealSessionForm.get('comments').clearValidators();
    }
    this.appealSessionForm.get('comments').updateValueAndValidity();
  }

  confirmappealSession() {
    // if (this.appealSessionForm.valid) {
    //   const cancelSessionObject: SessionRequestActions = new SessionRequestActions();
    //   cancelSessionObject.comments = this.appealSessionForm?.get('comments').value;
    //   cancelSessionObject.reason = this.appealSessionForm?.get('reason')?.value;
    //   // this.onConfirm.emit(cancelSessionObject);
    // } else {
    //   this.commentAlert = true;
    // }
  }

  cancelAppealSession() {
    this.onCancel.emit();
  }
}
