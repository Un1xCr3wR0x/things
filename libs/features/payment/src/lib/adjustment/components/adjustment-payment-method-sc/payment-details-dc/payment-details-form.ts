/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { GosiCalendar, greaterThanValidator } from '@gosi-ui/core';
import moment from 'moment-timezone';

const fb: FormBuilder = new FormBuilder();

/** Method to create receipt mode form. */
export function createReceiptModeForm() {
  return fb.group({
    receiptMode: fb.group({
      english: [null, { validators: Validators.required }],
      arabic: [null]
    })
  });
}

/** Method to create form for other receipt modes  */
export function createOtherReceiptForm(systemRunDate?: GosiCalendar) {
  return fb.group({
    additionalPaymentDetails: null,
    comments: null,
    transactionDate: fb.group({
      gregorian: [null, { validators: Validators.required }],
      hijiri: [null]
    }),
    // receiptNumber: [null, { validators: Validators.required }],
    paymentReferenceNo: [null, { validators: Validators.required }],
    amountTransferred: fb.group({
      amount: [
        null,
        {
          validators: Validators.compose([Validators.required, greaterThanValidator(0)]),
          updateOn: 'blur'
        }
      ],
      currency: ['sr']
    })
  });
}
