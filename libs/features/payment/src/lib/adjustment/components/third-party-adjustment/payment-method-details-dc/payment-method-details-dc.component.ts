/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertService,
  BankAccount,
  BilingualText,
  iBanValidator,
  LanguageToken,
  lengthValidator,
  LovList,
  markFormGroupTouched
} from '@gosi-ui/core';
import { Adjustment, AdjustmentPaymentMethodEnum, IbanStatusEnum } from '@gosi-ui/features/payment/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pmt-payment-method-details-dc',
  templateUrl: './payment-method-details-dc.component.html',
  styleUrls: ['./payment-method-details-dc.component.scss']
})
export class PaymentMethodDetailsDcComponent implements OnInit, OnChanges {
  bankTransfer = AdjustmentPaymentMethodEnum.BANK;
  activeIbanStatus = IbanStatusEnum.ACTIVE;
  //bankType: string;
  paymentMethodForm: FormGroup;

  @Input() currentBankAccount: BankAccount;
  @Input() parentForm: FormGroup;
  @Input() paymentModeList: LovList;
  @Input() bankName: BilingualText;
  @Input() isValidator: boolean;
  @Input() isFromSavedData: boolean;
  @Input() adjustmentValues: Adjustment;

  @Output() onIbanchange: EventEmitter<string> = new EventEmitter();
  lang: string;

  constructor(
    private fb: FormBuilder,
    readonly alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    this.paymentMethodForm = this.creatPaymentMethodForm();
  }

  ngOnInit(): void {
    if (!this.parentForm?.get('paymentMethod')) {
      this.parentForm.addControl('paymentMethod', this.paymentMethodForm);
    }

    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currentBankAccount?.currentValue !== undefined) {
      const iban =
        changes?.currentBankAccount?.currentValue?.verificationStatus === this.activeIbanStatus ||
        changes?.currentBankAccount?.currentValue?.verificationStatus === IbanStatusEnum.DRAFT
          ? changes?.currentBankAccount?.currentValue?.ibanAccountNo
          : this.isValidator || this.isFromSavedData
          ? changes?.currentBankAccount?.currentValue?.ibanAccountNo
          : '';
      this.paymentMethodForm?.get('ibanAccountNo')?.setValue(iban);
      this.paymentMethodForm?.get('ibanAccountNo')?.updateValueAndValidity();
      this.setBankNameToForm(changes?.currentBankAccount?.currentValue?.bankName);
    }
    if (changes?.bankName?.currentValue) {
      this.setBankNameToForm(changes?.bankName?.currentValue);
    }

    if (changes?.adjustmentValues?.currentValue) {
      const transferMode = changes?.adjustmentValues?.currentValue?.transferMode as BilingualText;
      this.paymentMethodForm?.get('transferMode')?.setValue(transferMode);
      this.onTransfermodeSelection(transferMode?.english);
    }
  }

  /**
   *Method to set bank name to form
   * @param bankName
   */
  setBankNameToForm(bankName: BilingualText) {
    if (
      bankName &&
      this.paymentMethodForm?.get('ibanAccountNo').value &&
      this.paymentMethodForm?.get('ibanAccountNo').valid
    ) {
      this.bankName = bankName;
      this.paymentMethodForm?.get('bankName')?.get('english')?.setValue(bankName?.english);
      this.paymentMethodForm?.get('bankName')?.get('arabic')?.setValue(bankName?.arabic);
    } else {
      this.bankName = null;
      this.paymentMethodForm?.get('bankName')?.get('english')?.setValue(null);
      this.paymentMethodForm?.get('bankName')?.get('arabic')?.setValue(null);
    }
    this.paymentMethodForm?.get('bankName')?.updateValueAndValidity();
  }

  /**
   * method to create payment form
   */
  creatPaymentMethodForm(): FormGroup {
    return this.fb.group({
      transferMode: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      ibanAccountNo: [''],
      bankName: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  /**
   * method to get bank name
   */
  getBankName() {
    if (this.currentBankAccount?.verificationStatus !== this.activeIbanStatus) {
      this.alertService.clearAlerts();
      this.bankName = null;
      this.paymentMethodForm?.get('bankName')?.get('english')?.setValue(null);
      this.paymentMethodForm?.get('bankName')?.get('arabic')?.setValue(null);
      markFormGroupTouched(this.paymentMethodForm);
      if (this.paymentMethodForm?.get('ibanAccountNo').valid) {
        this.onIbanchange.emit(this.paymentMethodForm?.get('ibanAccountNo')?.value);
      }
    }
  }

  /**
   * method to handle tranfer mode selection
   */
  onTransfermodeSelection(transferMode: string) {
    if (transferMode === this.bankTransfer) {
      this.paymentMethodForm
        ?.get('ibanAccountNo')
        ?.setValidators([Validators.required, iBanValidator, lengthValidator(24)]);
      this.paymentMethodForm?.get('bankName')?.get('english')?.setValidators([Validators.required]);
    } else {
      this.paymentMethodForm?.get('ibanAccountNo')?.clearValidators();
      this.paymentMethodForm?.get('bankName')?.get('english')?.clearValidators();
    }
    this.paymentMethodForm?.get('bankName')?.get('english')?.updateValueAndValidity();
    this.paymentMethodForm?.get('ibanAccountNo')?.updateValueAndValidity();
  }
}
