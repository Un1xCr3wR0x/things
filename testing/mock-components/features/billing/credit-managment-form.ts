/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { greaterThanValidator } from '@gosi-ui/core';

export class CreditManagmentForm {
  fb: FormBuilder = new FormBuilder();

  public checkForm() {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
  getBranchBreakupForm() {
    return this.fb.group({
      registrationNo: null,
      estName: this.fb.group({
        english: '',
        arabic: ''
      }),
      amount: ['', { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }]
    });
  }

  /** Method to create total amount form. */
  getOutsideTotalAmountForm() {
    return this.fb.group({
      totalAmount: ['0.00']
    });
  }
  // * This method is used to create new form
  createWavierUploadDetailForm() {
    return this.fb.group({
      comments: [null]
    });
  }
  createBankForm() {
    return this.fb.group({
      option: this.fb.group({
        english: ['Cheque', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }
  createPaymentModeForm() {
    return this.fb.group({
      paymentMode: this.fb.group({
        english: ['Cheque', { validators: Validators.required }],
        arabic: [null],
        updateOn: 'blur'
      })
    });
  }
}
