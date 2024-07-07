/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bindToForm, IbanLength, iBanValidator, lengthValidator, LovList } from '@gosi-ui/core';
import { Observable, Subject } from 'rxjs';
import { BankAccount, EstLookupService, TerminatePaymentMethodEnum, TerminateResponse } from '../../../shared';

@Component({
  selector: 'est-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit, OnChanges, OnDestroy {
  bankDetailsForm: FormGroup;
  private _minMaxLengthAccountNo = IbanLength.SAUDI_IBAN;
  private _gccIbanLength = IbanLength.GCC_IBAN_MAX;
  private _gccIbanMinLength = IbanLength.GCC_IBAN_MIN;
  bankPaymentMetod: string = TerminatePaymentMethodEnum.BANK;
  checkPaymentMetod: string = TerminatePaymentMethodEnum.CHEQUE;
  destroy$: Subject<boolean> = new Subject();
  payentTypeList$: Observable<LovList>;
  showBankName: boolean;
  get minMaxLengthAccountNo(): number {
    return this.isGccEst ? this._gccIbanLength : this._minMaxLengthAccountNo;
  }

  @Input() parentForm: FormGroup;
  @Input() bankAccount: BankAccount;
  @Input() bankNameList: LovList;
  @Input() isPrivate: boolean;
  @Input() terminateEstDetails: TerminateResponse;
  @Input() isGccEst: boolean;
  @Input() isIbanMapped = true;

  @Output() ibanChange: EventEmitter<string> = new EventEmitter();

  constructor(readonly fb: FormBuilder, readonly lookupService: EstLookupService) {
    this.bankDetailsForm = this.createBankDetailsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bankAccount) {
      bindToForm(this.bankDetailsForm, this.bankAccount);
      this.getBank(true);
    }
    if (changes.terminateEstDetails && changes.terminateEstDetails.currentValue.paymentType) {
      this.bankDetailsForm.get('paymentMethod').setValue(changes.terminateEstDetails.currentValue.paymentType);
      this.performBankValidation(
        !(changes.terminateEstDetails.currentValue.paymentType?.english === TerminatePaymentMethodEnum.BANK)
      );
    }
    if (changes?.bankNameList?.currentValue?.items[0]?.value) {
      setTimeout(() => {
        if (this.isIbanMapped)
          this.bankDetailsForm.patchValue({
            bankName: changes.bankNameList.currentValue?.items[0]?.value
          });
      }, 1000);
    }
  }

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl('bankDetails', this.bankDetailsForm);
    }
    this.payentTypeList$ = this.lookupService.getEstablishmentTerminationPaymentType();
    if (!this.isPrivate) {
      this.bankDetailsForm.get('paymentMethod').get('english').setValue(TerminatePaymentMethodEnum.BANK);
      this.performBankValidation(false);
    }
  }

  /**
   * Method to impliment bank validation
   */
  performBankValidation(isReset: boolean) {
    if (isReset) {
      this.bankDetailsForm.get('ibanAccountNo').setValidators(null);
      this.bankDetailsForm.get('ibanAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').get('english').setValidators(null);
      this.bankDetailsForm.get('bankName').get('english').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').get('arabic').setValidators(null);
      this.bankDetailsForm.get('bankName').get('arabic').updateValueAndValidity();
    } else {
      if (this.isGccEst) {
        this.bankDetailsForm
          .get('ibanAccountNo')
          .setValidators([Validators.required, lengthValidator(this._gccIbanMinLength, this.minMaxLengthAccountNo)]);
      } else {
        this.bankDetailsForm
          .get('ibanAccountNo')
          .setValidators([Validators.required, lengthValidator(this.minMaxLengthAccountNo), iBanValidator]);
      }
      this.bankDetailsForm.get('ibanAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').get('english').setValidators([Validators.required]);
      this.bankDetailsForm.get('bankName').get('english').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').get('arabic').setValidators([Validators.required]);
      this.bankDetailsForm.get('bankName').get('arabic').updateValueAndValidity();
    }
  }

  /**
   * Method to create the bank details form
   */
  createBankDetailsForm() {
    return this.fb.group({
      ibanAccountNo: [
        '',
        {
          updateOn: 'blur'
        }
      ],
      bankName: this.fb.group({
        english: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        arabic: [
          null,
          {
            updateOn: 'blur'
          }
        ]
      }),
      paymentMethod: this.fb.group({
        english: [
          null,
          {
            updateOn: 'blur',
            validators: Validators.required
          }
        ],
        arabic: [
          null,
          {
            updateOn: 'blur'
          }
        ]
      })
    });
  }
  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param iBanCode
   *
   */
  getBank(initialLoad = false) {
    if (this.isGccEst) {
      if (!initialLoad) {
        this.bankDetailsForm.get('bankName').get('english').setValue(null);
      }
      if (this.bankDetailsForm.get('ibanAccountNo').value && this.bankDetailsForm.get('ibanAccountNo').valid)
        this.showBankName = true;
    } else {
      this.showBankName = false;
      if (!initialLoad) {
        this.bankDetailsForm.get('bankName').get('english').setValue(null);
      }
      if (this.bankDetailsForm.get('ibanAccountNo').value && this.bankDetailsForm.get('ibanAccountNo').valid) {
        const iBanCode = String(this.bankDetailsForm.get('ibanAccountNo').value).slice(4, 6);
        this.ibanChange.emit(iBanCode);
      }
    }
    this.bankDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  /**
   * Metode to handle the change event of payment methode
   */
  onPaymentMethodChange() {
    this.performBankValidation(
      this.bankDetailsForm.get('paymentMethod').get('english').value !== TerminatePaymentMethodEnum.BANK
    );
  }

  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
