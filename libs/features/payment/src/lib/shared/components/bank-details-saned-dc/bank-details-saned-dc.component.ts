/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, SimpleChanges, OnChanges, HostListener, OnDestroy } from '@angular/core';

import { iBanValidator, lengthValidator, BilingualText, LookupService, AlertService } from '@gosi-ui/core';
import { PersonBankDetails } from '@gosi-ui/features/benefits/lib/shared/models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

//This component is to get the bank account details of the person

@Component({
  selector: 'pmt-bank-details-saned-dc',
  templateUrl: './bank-details-saned-dc.component.html',
  styleUrls: ['./bank-details-saned-dc.component.scss']
})
export class BankDetailsSanedDcComponent implements OnInit, OnChanges, OnDestroy {
  //Input variables
  @Input() bankDetails: PersonBankDetails = new PersonBankDetails();
  @Input() parentForm: FormGroup;
  @Input() saveApiResp: BilingualText;
  @Input() hideSaveButton = false;
  @Input() showCard = true;
  @Input() lang = 'en';

  //Output Variables
  modalRef: BsModalRef;
  bankInfo: PersonBankDetails = null;
  savedBankInfo: PersonBankDetails = new PersonBankDetails();
  editBankDetails = false;
  bankForm: FormGroup;
  disableBankSaveButton = true;
  bankSavedFlag = false;
  isSmallScreen: boolean;
  minMaxLengthAccountNo = 24;
  bankEditForm: FormGroup;

  constructor(readonly lookUpService: LookupService, readonly alertService: AlertService, readonly fb: FormBuilder) {}

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.getScreenSize();
    this.createForm();
  }

  createForm() {
    if (!this.bankForm) {
      this.bankForm = this.createEditBankDetailsForm();
      if (this.parentForm) {
        if (this.parentForm.get('bankAccount')) {
          this.savedBankInfo.ibanBankAccountNo = this.parentForm.get('bankAccount').get('ibanBankAccountNo').value;
          this.bankInfo = new PersonBankDetails();
          this.bankInfo = this.savedBankInfo;
          this.parentForm.removeControl('bankAccount');
        }
        this.parentForm.addControl('bankAccount', this.bankForm);
        this.parentForm.controls.bankAccount.markAsPristine();
        this.parentForm.controls.bankAccount.markAsUntouched();
      }
    }
  }
  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.bankDetails?.currentValue) {
      if (this.bankDetails.bankAccountList && this.bankDetails.bankAccountList?.length) {
        this.bankInfo = this.bankDetails.bankAccountList[0];
      } else {
        this.bankInfo = this.bankDetails;
      }
      this.createForm();
      this.editBankDetails = false;
      this.getBank(this.bankInfo.ibanBankAccountNo, this.bankForm);
    }
  }

  // Method to emit edit details
  editEventDetails() {
    this.bankEditForm = this.bankForm;
  }
  // Method to cancel edit
  cancelBankSave() {
    this.bankForm.reset();
  }

  cancelEdit() {
    this.bankEditForm = null;
    if (this.bankInfo) {
      this.bankForm.get('bankName').patchValue(this.bankInfo.bankName);
      this.bankForm.get('ibanBankAccountNo').patchValue(this.bankInfo.ibanBankAccountNo);
      this.bankForm.get('bankCode').patchValue(this.bankInfo.bankCode);
    }
  }
  // Method to hide submit modal popup
  hideSubmitModal() {
    this.modalRef.hide();
  }
  // Method to create edit bank details form
  createEditBankDetailsForm() {
    return this.fb.group({
      ibanBankAccountNo: [
        '',
        {
          validators: Validators.compose([
            lengthValidator(this.minMaxLengthAccountNo),
            iBanValidator,
            Validators.required
          ]),
          updateOn: 'blur'
        }
      ],
      bankName: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      }),
      bankCode: [
        '',
        {
          updateOn: 'blur'
        }
      ]
    });
  }
  // Method to get bank details
  getBank(iban: string, form: FormGroup) {
    if (iban) {
      form.get('ibanBankAccountNo').patchValue(iban);
      const bankCode = form.get('ibanBankAccountNo').value.slice(4, 6);
      form.get('bankCode').patchValue(bankCode);
      this.lookUpService.getBank(bankCode).subscribe(
        res => {
          this.disableBankSaveButton = false;
          if (res.items[0]) {
            form.get('bankName').patchValue(res.items[0].value);
            //this.bankInfo.bankName = res.items[0].value;
            form.updateValueAndValidity();
          }
        },
        err => this.showErrorMessage(err)
      );
    }
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  // Method to save bank info
  saveBankInfo() {
    if (this.bankForm.valid) {
      this.bankInfo = this.bankForm.getRawValue();
    }
  }

  saveEditedBankDetails() {
    if (this.bankEditForm.valid) {
      this.bankInfo = this.bankEditForm.getRawValue();
      this.bankForm.patchValue(this.bankEditForm.getRawValue());
      this.cancelEdit();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }

  ngOnDestroy() {}
}
