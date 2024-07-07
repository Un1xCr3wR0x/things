/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccount, endOfMonth, GosiCalendar, LovList, markFormGroupTouched } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import {
  TerminateContributorDetails,
  TerminateContributorPayload,
  VicContributionDetails,
  VicEngagementDetails
} from '../../../shared/models';
import { startOfDay } from '@fullcalendar/angular';

@Component({
  selector: 'cnt-terminate-vic-details-dc',
  templateUrl: './terminate-vic-details-dc.component.html',
  styleUrls: ['./terminate-vic-details-dc.component.scss']
})
export class TerminateVicDetailsDcComponent implements OnChanges {
  /** Local variables. */
  terminateVicForm: FormGroup;
  minTerminateDate: Date;
  maxTerminateDate: Date;
  isBankEdit: boolean;

  /** Input variables. */
  @Input() terminationReasonList: LovList;
  @Input() parentForm: FormGroup;
  @Input() canEdit: boolean;
  @Input() showPreviousSection: boolean;
  @Input() engagementDetails: VicEngagementDetails;
  @Input() bankNameList$: Observable<LovList>;
  @Input() vicContributionDetails: VicContributionDetails;
  @Input() bankDetails: BankAccount;
  @Input() isEditMode: boolean;
  @Input() vicTerminateDetails: TerminateContributorDetails;
  @Input() isBankDetailsPending: boolean;
  @Input() isPREligible = false;
  @Input() lang: string;

  /** Output variables */
  @Output() cancel = new EventEmitter<null>(null);
  @Output() save = new EventEmitter<TerminateContributorPayload>(null);
  @Output() previous = new EventEmitter<null>(null);
  @Output() IBANChange = new EventEmitter<string>(null);
  @Output() terminationDateChange = new EventEmitter(null);
  @Output() showError = new EventEmitter<string>(null);
  @Output() clearError = new EventEmitter<void>();

  /** Method to handle initialize TerminateVicDetailsDcComponent. */
  constructor(readonly fb: FormBuilder) {}

  /** Method to handle changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.terminateVicForm = this.createTerminateVicForm();
      this.initializeTerminateForm();
    }

    if (changes.vicTerminateDetails && changes.vicTerminateDetails.currentValue) {
      this.terminateVicForm = this.createTerminateVicForm();
      this.initializeTerminateForm();
    }

    if (changes.vicContributionDetails && changes.vicContributionDetails.currentValue)
      this.setTerminateDateValidation();
  }
  /** Method to initialize terminate form. */
  initializeTerminateForm(): void {
    if (this.isEditMode) {
      if (this.vicTerminateDetails.joiningDate?.gregorian)
        this.terminateVicForm
          .get('joiningDate.gregorian')
          .setValue(moment(this.vicTerminateDetails.joiningDate.gregorian).toDate());
      if (this.vicTerminateDetails.leavingDate?.gregorian)
        this.terminateVicForm
          .get('terminateOn.gregorian')
          .setValue(moment(this.vicTerminateDetails.leavingDate.gregorian).toDate());
      if (this.vicTerminateDetails.leavingReason?.english)
        this.terminateVicForm.get('terminationReason').setValue(this.vicTerminateDetails.leavingReason);
    } else {
      const joiningDate: GosiCalendar = this.engagementDetails.joiningDate;
      if (joiningDate && joiningDate.gregorian) {
        this.terminateVicForm.get('joiningDate.gregorian').setValue(moment(joiningDate.gregorian).toDate());
      }
    }
    if (this.vicContributionDetails) this.setTerminateDateValidation();
    if (this.parentForm.get('terminateVicForm')) this.parentForm.removeControl('terminateVicForm');
    this.parentForm.addControl('terminateVicForm', this.terminateVicForm);
  }

  /** Method to create terminate form. */
  createTerminateVicForm(): FormGroup {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      terminateOn: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      terminationReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  /** Method to set minimum and maximum limit for terminate date  */
  setTerminateDateValidation(): void {
    if (this.vicContributionDetails.lastBillPaidDate && this.vicContributionDetails.lastBillPaidDate.gregorian) {
      this.minTerminateDate = new Date(
        this.isEditMode
          ? this.vicTerminateDetails?.joiningDate.gregorian
          : this.engagementDetails?.joiningDate.gregorian
      );
      this.maxTerminateDate = new Date(this.vicContributionDetails.lastBillPaidDate.gregorian);
    } else {
      this.terminateVicForm.get('terminateOn').get('gregorian').disable();
    }
  }

  /** Method to save terminate details. */
  saveTerminateDetails(): void {
    markFormGroupTouched(this.parentForm);
    if (this.parentForm.valid && !this.isBankEdit) this.save.emit(this.assembleTerminationPayload());
    else if (this.terminateVicForm.valid && this.isBankEdit) this.showError.emit('CONTRIBUTOR.UNSAVED-BANK-ERROR');
    else this.save.emit(null);
  }

  /** Method to assemble vic termination payload. */
  assembleTerminationPayload(): TerminateContributorPayload {
    const payload: TerminateContributorPayload = new TerminateContributorPayload();
    payload.leavingReason = this.terminateVicForm.get('terminationReason').value;
    payload.leavingDate.gregorian = !this.isPREligible
      ? endOfMonth(this.terminateVicForm.get('terminateOn.gregorian').value)
      : this.terminateVicForm.get('terminateOn').get('gregorian').value;
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

  /** Method on termination date change */
  onTerminationDateChange(date: Date): void {
    if (this.terminateVicForm.get('terminateOn.gregorian').valid)
      !this.isPREligible ? this.terminationDateChange.emit(endOfMonth(date)) : this.terminationDateChange.emit(date);
  }

  /** Method to toggle bank edit mode. */
  toggleBankEditMode(flag: boolean) {
    this.isBankEdit = flag;
  }

  /** Method to clear errors. */
  clearErrors() {
    this.clearError.emit();
  }
}
