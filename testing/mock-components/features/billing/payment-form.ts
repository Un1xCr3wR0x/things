/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { greaterThanValidator } from '@gosi-ui/core';

export class PaymentForm {
  fb: FormBuilder = new FormBuilder();

  public receiptModeForm() {
    return this.fb.group({
      receiptMode: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  public recordsFormMock() {
    return this.fb.group({
      recordestablishmentName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  public chequeForm() {
    return this.fb.group({
      description: null,
      transactionDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      bank: this.fb.group({
        name: this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        }),
        nonListedBank: [null],
        type: this.fb.group({
          english: null,
          arabic: null
        })
      }),
      chequeDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),

      chequeNumber: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.min(1)])
        }
      ],
      amountReceived: this.fb.group({
        amount: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.min(1)])
          }
        ],
        currency: ['SAR']
      }),
      gccAmountReceived: [null]
    });
  }
  public otherform() {
    return this.fb.group({
      description: null,
      transactionDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      referenceNo: [null, { validators: Validators.required }],
      /* saudiBankName: this.fb.group({
      english: [null, { validators: Validators.required }],
      arabic: [null]
    }) */
      bank: this.fb.group({
        name: this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        }),
        nonListedBank: [null],
        type: this.fb.group({
          english: null,
          arabic: null
        })
      }),
      amountReceived: this.fb.group({
        amount: [
          null,
          {
            validators: Validators.compose([Validators.required, greaterThanValidator(0)])
          }
        ],
        currency: ['SAR']
      }),
      gccAmountReceived: null
    });
  }

  public branchBreakupForm() {
    return this.fb.group({
      registrationNo: null,
      establishmentType: this.fb.group({
        english: '',
        arabic: ''
      }),
      allocatedAmount: this.fb.group({
        amount: '',
        currency: ['SAR']
      })
    });
  }

  public branchBreakupFormArray() {
    return this.fb.array([this.branchBreakupForm(), this.branchBreakupForm()]);
  }

  /* public branchBreakupSingleFormArray() {
    return this.fb.array([this.branchBreakupForm()]);
  } */

  public commentForm() {
    return this.fb.group({
      comments: null
    });
  }
}
