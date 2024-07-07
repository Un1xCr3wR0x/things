/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { greaterThanValidator } from '@gosi-ui/core/lib/validators/greaterthan-validator';

export class InstallmentForm {
  fb: FormBuilder = new FormBuilder();

  /**
   * Method to create  form
   */
  public createGuaranteeModeForm() {
    return this.fb.group({
      category: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /*** Method to create othergurantee  form*/
  createGuaranteeTypeForm() {
    return this.fb.group({
      guaranteeType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createCommentForm() {
    return this.fb.group({
      comments: [null]
    });
  }
  /**
   * Method to create  form
   */
  createBankGuaranteeForm() {
    return this.fb.group({
      guaranteeName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      guarantorId: [null, { validators: Validators.required }],
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      guaranteeAmount: [null, { validators: Validators.required }]
    });
  }
  /**
   * Method to create  form
   */
  createPromissoryGuaranteeForm() {
    return this.fb.group({
      guaranteeName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      guaranteeAmount: [null, { validators: Validators.required }],
      guarantorId: [null, { validators: Validators.required }]
    });
  }
  /**
   * Method to create  form
   */
  public createOthersGuaranteeForm() {
    return this.fb.group({
      guaranteeType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createPensionGuaranteeForm() {
    return this.fb.group({
      guaranteeName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      guarantorId: [null, { validators: Validators.required }],
      amount: [null, { validators: Validators.required }],
      installmentAmount: [100, { validators: Validators.compose([greaterThanValidator(100), Validators.required]) }]
    });
  }
  createOthersSalaryAmountForm() {
    return this.fb.group({
      amount: [null, { validators: Validators.required }],
      installmentAmount: [null, { validators: Validators.required }]
    });
  }
}
