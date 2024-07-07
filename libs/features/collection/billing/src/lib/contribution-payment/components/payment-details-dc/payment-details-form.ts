/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { greaterThanValidator, NationalityTypeEnum } from '@gosi-ui/core';
import { BankType } from '../../../shared/enums';

const fb: FormBuilder = new FormBuilder();

/** Method to create receipt mode form. */
export function createReceipModeForm() {
  return fb.group({
    receiptMode: fb.group({
      english: [null, { validators: Validators.required }],
      arabic: [null]
    }),
    establishmentType: fb.group({
      english: ['GOSI', {validators: Validators.required}],
      arabic: ['']
    })
  });
}

/** Method to create form for receipt mode Cheque. */
export function createChequeForm(gccFlag: boolean, currencyCode: string) {
  return fb.group({
    description: null,
    transactionDate: fb.group({
      gregorian: [null, { validators: Validators.required }],
      hijiri: [null]
    }),
    bank: getBankControl(gccFlag),
    referenceNo: null,
    chequeDate: !gccFlag
      ? fb.group({
          gregorian: [null, { validators: Validators.required }],
          hijiri: [null]
        })
      : null,
    chequeNumber: [
      null,
      {
        validators: Validators.compose([Validators.required, greaterThanValidator(0)])
      }
    ],
    amountReceived: getAmountControl(currencyCode),
    gccAmountReceived: getGccAmountControl(gccFlag),
    penaltyIndicator: fb.group({
      english: ['Yes', { validators: Validators.required }],
      arabic: [null]
    })
  });
}

/** Method to create form for receipt modes other than cheque */
export function createOtherReceiptForm(gccFlag: boolean, currencyCode: string) {
  return fb.group({
    description: null,
    transactionDate: fb.group({
      gregorian: [null, { validators: Validators.required }],
      hijiri: [null]
    }),
    referenceNo: gccFlag ? [null, { validators: Validators.required }] : null,
    bank: getBankControl(gccFlag),
    amountReceived: getAmountControl(currencyCode),
    gccAmountReceived: getGccAmountControl(gccFlag),
    penaltyIndicator: fb.group({
      english: ['Yes', { validators: Validators.required }],
      arabic: [null]
    })
  });
}

/** Method to get the bank form control */
export function getBankControl(gccFlag: boolean) {
  return fb.group({
    name: fb.group({
      english: [null, { validators: Validators.required }],
      arabic: [null]
    }),
    nonListedBank: [null],
    type: !gccFlag
      ? fb.group({
          english: [BankType.LOCAL_BANK, { validators: Validators.required }],
          arabic: []
        })
      : fb.group({
          english: [BankType.GCC_BANK, { validators: Validators.required }],
          arabic: []
        }),
    country: !gccFlag
      ? fb.group({
          english: [NationalityTypeEnum.SAUDI_NATIONAL, { validators: Validators.required }],
          arabic: []
        })
      : fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
  });
}

/** Method to get the amount form control */
export function getAmountControl(currencyCode: string) {
  return fb.group({
    amount: [
      null,
      {
        validators: Validators.compose([Validators.required, greaterThanValidator(0)]),
        updateOn: 'blur'
      }
    ],
    currency: [currencyCode]
  });
}
/** Method to get the gcc amount form control */
export function getGccAmountControl(gccFlag: boolean) {
  return gccFlag
    ? [
        null,
        {
          validators: Validators.compose([Validators.required, greaterThanValidator(0)]),
          updateOn: 'blur'
        }
      ]
    : null;
}
