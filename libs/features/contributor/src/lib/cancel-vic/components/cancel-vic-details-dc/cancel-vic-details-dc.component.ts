/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BankAccount, LovList, markFormGroupTouched } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import {
  CancelContributorDetails,
  CancelContributorRequest,
  VicContributionDetails,
  VicEngagementDetails
} from '../../../shared/models';

@Component({
  selector: 'cnt-cancel-vic-details-dc',
  templateUrl: './cancel-vic-details-dc.component.html',
  styleUrls: ['./cancel-vic-details-dc.component.scss']
})
export class CancelVicDetailsDcComponent implements OnChanges {
  /**Local variables */
  cancelVicForm: FormGroup = new FormGroup({});
  bankEditFlag: boolean;

  /** Input variables */
  @Input() leavingReasonList: LovList;
  @Input() cancellationReasonList: LovList;
  @Input() bankNameList$: Observable<LovList>;
  @Input() vicEngagement: VicEngagementDetails;
  @Input() vicContributionDetails: VicContributionDetails;
  @Input() bankDetails: BankAccount;
  @Input() parentForm: FormGroup;
  @Input() isEditMode: boolean;
  @Input() cancellationDetails: CancelContributorDetails;
  @Input() isBankDetailsPending: boolean;
  @Input() isPREligible: boolean;
  @Input() lang: string;

  /** Output variables */
  @Output() cancel = new EventEmitter<null>();
  @Output() save = new EventEmitter<CancelContributorRequest>();
  @Output() verifyIBAN = new EventEmitter<string>();
  @Output() showError = new EventEmitter<string>();
  @Output() clearError = new EventEmitter<void>();

  /**Creates an instance of CancelVicDetailsDcComponent. */
  constructor(private fb: FormBuilder) {}

  /** Method to detectchanges in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.vicEngagement && changes.vicEngagement.currentValue) {
      this.cancelVicForm = this.createCancelVicForm();
      this.initializeCancelVicForm(this.vicEngagement);
    }

    if (changes.cancellationDetails && changes.cancellationDetails.currentValue) {
      this.cancelVicForm = this.createCancelVicForm();
      this.initializeCancelVicForm(this.cancellationDetails);
    }
  }

  /** Method to create cancel vic form. */
  createCancelVicForm() {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      leavingDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      leavingReason: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      cancellationReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  /** Method to initialize cancel vic form. */
  initializeCancelVicForm(value: CancelContributorDetails | VicEngagementDetails) {
    this.cancelVicForm.get('joiningDate.gregorian').setValue(moment(value.joiningDate.gregorian).toDate());
    if (value.leavingDate?.gregorian) {
      this.addValidations(<FormControl>this.cancelVicForm.get('leavingDate.gregorian'));
      this.addValidations(<FormControl>this.cancelVicForm.get('leavingReason.english'));
      this.cancelVicForm.get('leavingDate.gregorian').setValue(moment(value.leavingDate.gregorian).toDate());
      this.cancelVicForm.get('leavingReason').setValue(value.leavingReason);
    }
    if (value.cancellationReason?.english)
      this.cancelVicForm.get('cancellationReason').setValue(value.cancellationReason);
    if (!this.parentForm.get('cancelVicDetails')) this.parentForm.addControl('cancelVicDetails', this.cancelVicForm);
  }

  /** Method to add validations to forrm control. */
  addValidations(formControl: FormControl) {
    formControl.setValidators([Validators.required]);
    formControl.updateValueAndValidity();
  }

  /** Method to save cancellation details. */
  saveCancellationDetails() {
    markFormGroupTouched(this.parentForm);
    if (this.parentForm.valid && !this.bankEditFlag) this.save.emit(this.assembleCancellationPayload());
    else if (this.cancelVicForm.valid && this.bankEditFlag) this.showError.emit('CONTRIBUTOR.UNSAVED-BANK-ERROR');
    else this.save.emit(null);
  }

  /** Method to assemble cancellation payload. */
  assembleCancellationPayload(): CancelContributorRequest {
    const payload: CancelContributorRequest = new CancelContributorRequest();
    payload.cancellationReason = this.cancelVicForm?.get('cancellationReason')?.value;
    payload.editFlow = this.isEditMode;
    payload.bankAccount = this.assembleBankDetails();
    return payload;
  }

  /** Method to assemble bank details. */
  assembleBankDetails(): BankAccount {
    if (
      this.parentForm.get('bankDetailsForm') &&
      (this.bankDetails ? this.bankDetails.ibanAccountNo : '') !==
        this.parentForm.get('bankDetailsForm.ibanAccountNo').value
    )
      return <BankAccount>(this.parentForm.get('bankDetailsForm') as FormGroup).getRawValue();
    else return undefined;
  }

  /** Method to toggle bank edit mode. */
  toggelBankEditMode(flag: boolean) {
    this.bankEditFlag = flag;
  }

  /** Method to clear errors. */
  clearErrors() {
    this.clearError.emit();
  }
}
