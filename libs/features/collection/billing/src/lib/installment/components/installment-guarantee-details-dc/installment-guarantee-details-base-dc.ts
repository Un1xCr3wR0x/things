/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import {
  BaseComponent,
  BilingualText,
  greaterThanValidator,
  IdentifierLengthEnum,
  lengthValidator,
  LovList,
  ninValidator
} from '@gosi-ui/core';
import { GuaranteeTerms } from '../../../shared/models/guarantee-terms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Directive()
export abstract class InstallmentGuaranteeDetailsBaseDc extends BaseComponent {
  guaranteeModeForm: FormGroup;
  isFirstChange = true;
  guaranteeTypeModeForm: FormGroup;
  bankingTypeForm: FormGroup;
  pensionTypeForm: FormGroup;
  promissoryTypeForm: FormGroup;
  otherTypeForm: FormGroup;
  enableSalaryAmount = false;
  enableDeathDate = false;
  maxDeathDate: Date = new Date();
  guaranteeMode: string;
  isBanking = false;
  isPension = false;
  isPromissory = false;
  isOthers = false;
  pensionAmount: number;
  modalRefs: BsModalRef;
  isDownPaymentRequired = false;
  downPaymentDetails: GuaranteeTerms;
  totalAmount: number;
  isDownPayment = false;
  typeList: LovList;
  isGuaranteeMode = false;
  isGuaranteeType = false;
  isGuarantee = false;
  category: BilingualText;
  installmentMinDate: Date;
  installmentMaxDate: Date;
  ninLength = IdentifierLengthEnum.NIN;
  lang = 'en';
  disablePensionAmount = true;
  guaranteeIdLength = BillingConstants.GUARANTEE_ID_MAX_LENGTH;
  disableToggle = false;

  constructor(readonly fb: FormBuilder) {
    super();
  }
  outOfMarketFlag: boolean;

  /**---------------------------------------Guarantee Form---------------------------------------------------- */
  createGuaranteeModeForm() {
    return this.fb.group({
      category: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  } /*** Method to create bank gurantee  form*/
  createBankGuaranteeForm() {
    return this.fb.group({
      guaranteeName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      guarantorId: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.ninLength)
          ])
        }
      ],
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      endDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      guaranteeAmount: [null, { validators: Validators.compose([Validators.required, greaterThanValidator(0)]) }]
    });
  } /*** Method to create promissory  form*/
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
      guaranteeAmount: [null, { validators: Validators.compose([Validators.required, greaterThanValidator(0)]) }],
      guarantorId: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.ninLength),
            ninValidator
          ])
        }
      ]
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
  createOthersSalaryAmountForm() {
    return this.fb.group({
      amount: [null, { validators: Validators.required }],
      installmentAmount: [null, { validators: Validators.required }]
    });
  }
  createOthersDeathDateForm() {
    return this.fb.group({
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      })
    });
  } /*** Method to create pension form*/
  createPensionGuaranteeForm() {
    return this.fb.group({
      guaranteeName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      guarantorId: [
        null,
        {
          validators: Validators.compose([
            Validators.pattern('[0-9]+'),
            Validators.required,
            lengthValidator(this.ninLength),
            ninValidator
          ])
        }
      ],
      amount: [null, { validators: Validators.required }],
      installmentAmount: [null, { validators: Validators.required }]
    });
  }
  setGuaranteeAmountValidation() {
    if (
      this.guaranteeMode === 'Bank Guarantee' &&
      this.guaranteeTypeModeForm.get('guaranteeType.english').value ===
        'Provided a bank guarantee of at least 50% of the dues'
    ) {
      this.bankingTypeForm
        .get('guaranteeAmount')
        .setValidators([
          Validators.required,
          greaterThanValidator(Math.round((Number((this.totalAmount * 50) / 100) + Number.EPSILON) * 100) / 100)
        ]);
    } else if (this.guaranteeMode === 'Bank Guarantee') {
      this.bankingTypeForm
        .get('guaranteeAmount')
        .setValidators([
          Validators.required,
          greaterThanValidator(Math.round((Number((this.totalAmount * 100) / 100) + Number.EPSILON) * 100) / 100)
        ]);
    }
    if (
      this.guaranteeMode === 'Promissory Note' &&
      this.guaranteeTypeModeForm.get('guaranteeType.english').value ===
        'Provided a promissory note of at least 50% of the dues'
    ) {
      this.promissoryTypeForm
        .get('guaranteeAmount')
        .setValidators([
          Validators.required,
          greaterThanValidator(Math.round((Number((this.totalAmount * 50) / 100) + Number.EPSILON) * 100) / 100)
        ]);
    } else if (this.guaranteeMode === 'Promissory Note') {
      this.promissoryTypeForm
        .get('guaranteeAmount')
        .setValidators([
          Validators.required,
          greaterThanValidator(Math.round((Number((this.totalAmount * 100) / 100) + Number.EPSILON) * 100) / 100)
        ]);
    }
  }
}
