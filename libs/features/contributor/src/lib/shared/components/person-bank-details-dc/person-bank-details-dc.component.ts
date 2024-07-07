/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BankAccount, LovList, markFormGroupTouched, SamaVerificationStatus } from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cnt-person-bank-details-dc',
  templateUrl: './person-bank-details-dc.component.html',
  styleUrls: ['./person-bank-details-dc.component.scss']
})
export class PersonBankDetailsDcComponent implements OnChanges {
  /** Local variables. */
  showBankEdit = false;
  noBankProvided = false;
  ibanChanged = true;
  showMandatoryError = false;
  canEdit = false;
  noMandatory = false;

  /** Input variables. */
  @Input() bankNameList$: Observable<LovList>;
  @Input() bankDetails: BankAccount;
  @Input() parentForm: FormGroup;
  @Input() isEditMode: boolean;
  @Input() isBankDetailsPending: boolean;
  @Input() notMandatory: boolean;

  /** Output variables */
  @Output() IBANChange = new EventEmitter<string>(null);
  @Output() bankEditMode = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit() {
    this.noMandatory = this.notMandatory === true ? false : true;
  }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bankDetails) {
      if (!this.bankDetails) this.noBankProvided = true;
      else {
        this.noBankProvided = false;
        if (this.bankDetails?.verificationStatus) this.checkBankAccountStatus();
      }
      if (this.bankDetails && !this.noBankProvided) this.parentForm.removeControl('bankDetailsForm');
    }
  }

  /** Method to check bank account status. */
  checkBankAccountStatus() {
    //Only allow bank status other than Pending and Not Verified for editing
    if (
      this.bankDetails?.verificationStatus === SamaVerificationStatus.PENDING ||
      this.bankDetails?.verificationStatus === SamaVerificationStatus.NOT_VERIFIED
    )
      this.canEdit = false;
    else this.canEdit = true;
  }

  /** Method to handle iban change. */
  handleIbanChange(ibanCode: string) {
    if (this.showBankEdit) this.checkForIbanChange();
    this.IBANChange.emit(ibanCode);
  }

  /** Method to check for iban change. */
  checkForIbanChange() {
    this.showMandatoryError = false;
    this.ibanChanged = this.parentForm.get('bankDetailsForm.ibanAccountNo').value !== this.bankDetails.ibanAccountNo;
  }

  /** Method to toggle bank edit status. */
  toggleBankEdit(flag: boolean) {
    this.showBankEdit = flag;
    this.bankEditMode.emit(flag);
  }

  /** Method to update bank details. */
  updateBankDetails(): void {
    this.parentForm.get('bankDetailsForm').updateValueAndValidity();
    if (this.parentForm.get('bankDetailsForm').valid) {
      this.resetAlertState();
      this.bankDetails = (this.parentForm.get('bankDetailsForm') as FormGroup).getRawValue();
      this.toggleBankEdit(false);
    } else {
      this.showMandatoryError = true;
      markFormGroupTouched(this.parentForm.get('bankDetailsForm') as FormGroup);
    }
  }

  /** Method to cancel bank edit. */
  cancelBankEdit() {
    this.resetAlertState();
    this.toggleBankEdit(false);
    // this.parentForm.get('bankDetailsForm').setValue(this.bankDetails);
    this.parentForm.get('bankDetailsForm')?.get('ibanAccountNo').setValue(this.bankDetails?.ibanAccountNo);
    this.parentForm.get('bankDetailsForm')?.get('bankName').setValue(this.bankDetails?.bankName);
    if (this.parentForm.get('bankDetailsForm')?.get('holdStatus'))
      this.parentForm.get('bankDetailsForm')?.get('holdStatus').setValue(this.bankDetails?.holdStatus);
    if (this.parentForm.get('bankDetailsForm')?.get('accountStatus'))
      this.parentForm.get('bankDetailsForm')?.get('accountStatus').setValue(this.bankDetails?.accountStatus);
    if (this.parentForm.get('bankDetailsForm')?.get('verificationStatus'))
      this.parentForm.get('bankDetailsForm')?.get('verificationStatus').setValue(this.bankDetails?.verificationStatus);
    this.cancel.emit();
  }

  /** Method to reset alert state */
  resetAlertState() {
    this.showMandatoryError = false;
    this.ibanChanged = true;
  }
}
