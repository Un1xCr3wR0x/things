/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertTypeEnum,
  BankAccount,
  BilingualText,
  IbanLength,
  iBanValidator,
  lengthValidator,
  LovList
} from '@gosi-ui/core';
import { noop, Observable } from 'rxjs';
import {delay, pairwise, startWith, takeUntil, tap} from 'rxjs/operators';
import {
  EstablishmentIbanValidationRequest, EstablishmentIbanValidationResponse
} from "../../../../../../features/establishment/src/lib/shared/models/establishment-iban-validation";
import {
  AccountStatusEnum,
  ResponseStatusEnum
} from "../../../../../../features/establishment/src/lib/shared/enums/sama-response-enum";
import {EstablishmentService} from "../../../../../../features/establishment/src/lib/shared/services";
import {AlertDcComponent} from "@gosi-ui/foundation-theme";

@Component({
  selector: 'frm-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit, OnChanges {
  //Input Variables
  @Input() bankNameList$: Observable<LovList>;
  @Input() bankAccount: BankAccount;
  @Input() parentForm: FormGroup;
  @Input() isMandatory = false;
  @Input() header = 'FORM-FRAGMENTS.BANK-ACCOUNT-DETAILS';
  @Input() noBottomMargin = false;
  @Input() infoMessage: string;
  @Input() isGcc = false;
  @Input() isIbanMapped = true;
  @Input() isProactive = false;
  @Input() unn: number;
  @Input() estNameAr: string;
  @Input() registrationNo: number;

  //output variables
  @Output() IBAN: EventEmitter<string> = new EventEmitter();
  @Output() samaResponseEmitter: EventEmitter<EstablishmentIbanValidationResponse> = new EventEmitter()
  @Output() samaFailureEmitter: EventEmitter<boolean> = new EventEmitter()
  @Output() enableNextButton: EventEmitter<boolean> = new EventEmitter();

  //child components
  @ViewChild('verifyAlert') verifyAlert: AlertDcComponent;

  //local variables
  bankAccountDetailsForm: FormGroup;
  setBankName = false;
  list: LovList = new LovList([]);
  private _minMaxLengthAccountNo = IbanLength.SAUDI_IBAN;
  private _gccIbanLength = IbanLength.GCC_IBAN_MAX;
  private _gccIbanMinLength = IbanLength.GCC_IBAN_MIN;
  bindOnChange = false;
  isVerified = false;
  verifyMessage: BilingualText;
  verifyType: AlertTypeEnum;
  accountStatus: string;
  showAccountStatus = false;
  get minMaxLengthAccountNo(): number {
    return this.isGcc ? this._gccIbanLength : this._minMaxLengthAccountNo;
  }
  get minGccLengthNo(): number {
    return this._gccIbanMinLength;
  }

  /**
   * This method is used to initialise the component
   * @param fb
   * @param establishmentService
   * @memberof BankDetailsDcComponent
   */
  constructor(private fb: FormBuilder,
              readonly establishmentService: EstablishmentService) {}

  /**
   * This method handles the initialization tasks.
   * @memberof BankDetailsDcComponent
   */
  ngOnInit() {
    this.bankAccountDetailsForm = this.createBankDetailsForm();
    if (this.parentForm && this.parentForm.get('bankDetailsForm')) this.parentForm.removeControl('bankDetailsForm');
    if (this.parentForm && this.bankAccountDetailsForm)
      this.parentForm.addControl('bankDetailsForm', this.bankAccountDetailsForm);
    if (this.isMandatory) {
      this.setMandatory();
    }
    this.setComponentState(this.bankAccount, this.bankAccountDetailsForm);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bankNameList$ && changes.bankNameList$.currentValue && this.bankAccountDetailsForm) {
      this.bankNameList$
        .pipe(
          tap(res => {
            this.list = res;
          }),
          delay(200),
          tap(res => {
            if (this.setBankName && res?.items?.length > 0) {
              this.bindAfterBankListLoaded(res, this.bankAccountDetailsForm, this.isIbanMapped);
            }
          })
        )

        .subscribe(noop);
    }

    if (changes.bankAccount && changes.bankAccount.currentValue && this.bankAccountDetailsForm) {
      this.setComponentState(this.bankAccount, this.bankAccountDetailsForm);
    }

    if (changes.isMandatory && changes.isMandatory.currentValue && this.bankAccountDetailsForm) {
      this.setMandatory();
    }
    if (this.bankAccountDetailsForm && this.bankAccountDetailsForm.get('ibanAccountNo')) {
      this.bankAccountDetailsForm.get('ibanAccountNo').valueChanges.pipe(
        startWith(this.bankAccountDetailsForm.get('ibanAccountNo').value),
        pairwise()
      ).subscribe(([oldValue, newValue]) => {
        if (oldValue !== newValue) {
          this.isVerified = false;
          this.showAccountStatus = false;
          this.verifyAlert.triggerDismissEvent();
          this.samaResponseEmitter.emit(undefined);
          this.enableNextButton.emit(!newValue || (newValue.length === 0));
        }
      })
    }
  }

  /**
   * Method to bind the form value once the bank list has been loaded
   * @param bankList
   * @param form
   * @param isIbanMapped
   */
  bindAfterBankListLoaded(bankList: LovList, form: FormGroup, isIbanMapped: boolean) {
    if (isIbanMapped) {
      form.get('bankName').patchValue(bankList.items[0].value);
      form.get('bankName').updateValueAndValidity();
    } else {
      if (this.bindOnChange) {
        this.bindOnChange = false;
        const bankName = form.get('bankName').value;
        if (bankName?.english) {
          form.get('bankName').reset();
          form.get('bankName').updateValueAndValidity();
          setTimeout(() => {
            form.get('bankName').patchValue(bankName);
            form.get('bankName').updateValueAndValidity();
          }, 300);
        }
      }
    }
  }

  /**
   * Method to bind input data to form
   * @param bankAccount
   * @param form
   */
  setComponentState(bankAccount: BankAccount, form: FormGroup) {
    if (bankAccount && form) {
      Object.keys(this.bankAccount).forEach(name => {
        if (name in this.bankAccountDetailsForm.controls && this.bankAccount[name]) {
          this.bankAccountDetailsForm.get(name).patchValue(this.bankAccount[name]);
          this.bankAccountDetailsForm.get(name).updateValueAndValidity();
          if (name === 'ibanAccountNo') {
            this.bindOnChange = true;
            this.getBank();
          }
        }
      });
    }
  }

  /**
   * This method is used to initialise the form template
   */
  createBankDetailsForm() {
    const form = this.fb.group({
      ibanAccountNo: [
        '',
        {
          validators: Validators.compose([lengthValidator(this._gccIbanMinLength, this.minMaxLengthAccountNo)]),
          updateOn: 'blur'
        }
      ],
      bankName: this.fb.group({
        english: [null, { updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      })
    });
    if (!this.isGcc) {
      form.get('ibanAccountNo').setValidators([lengthValidator(this.minMaxLengthAccountNo), iBanValidator]);
    }
    return form;
  }

  /**
   * This method is used to reset bank details form
   */
  resetBankDetailsForm() {
    this.setBankName = false;
    this.resetBankName();
    this.createBankDetailsForm();
    this.bankAccountDetailsForm.reset(this.createBankDetailsForm().getRawValue());
    this.bankAccountDetailsForm.updateValueAndValidity();
    this.bankAccountDetailsForm.markAsPristine();
    this.bankAccountDetailsForm.markAsUntouched();
  }

  /**
   *This method is used to value exists in form
   *   @memberof BankDetailsDcComponent
   */
  validate() {
    if (
      this.bankAccountDetailsForm.get('ibanAccountNo').value ||
      this.bankAccountDetailsForm.get('ibanAccountNo').value !== ''
    ) {
      this.setMandatory();
    } else {
      this.setOptional();
    }
    this.bankAccountDetailsForm.updateValueAndValidity();
  }

  /**
   *This method is used to set mandatory validation for the form
   *   @memberof BankDetailsDcComponent
   */
  setMandatory() {
    const validators = [Validators.required];
    if (!this.isGcc) {
      validators.push(lengthValidator(this.minMaxLengthAccountNo));
      validators.push(iBanValidator);
    } else {
      validators.push(lengthValidator(this.minGccLengthNo, this.minMaxLengthAccountNo));
    }
    this.bankAccountDetailsForm.get('ibanAccountNo').setValidators(Validators.compose(validators));
    this.bankAccountDetailsForm.get('ibanAccountNo').markAsUntouched();
    this.bankAccountDetailsForm.get('ibanAccountNo').updateValueAndValidity();
    this.bankAccountDetailsForm.get('bankName').get('english').setValidators(Validators.required);
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }
  /**
   *This method is used to set optional validation for the form control
   *   @memberof BankDetailsDcComponent
   */
  setOptional() {
    this.bankAccountDetailsForm.get('ibanAccountNo').clearValidators();
    this.bankAccountDetailsForm.get('ibanAccountNo').updateValueAndValidity();
    this.resetBankName();
    this.bankAccountDetailsForm.get('bankName').get('english').clearValidators();
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  /**
   * This method is reset bank name of the form
   */
  resetBankName() {
    this.bankAccountDetailsForm.get('bankName').get('english').reset();
    this.bankAccountDetailsForm.get('bankName').get('english').markAsUntouched();
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof BankDetailsDcComponent
   */
  getBank() {
    if (this.isGcc) {
      this.validate();
      return;
    }
    this.resetBankName();
    if (!this.isMandatory) this.validate();
    if (
      this.bankAccountDetailsForm.get('ibanAccountNo').value &&
      this.bankAccountDetailsForm.get('ibanAccountNo').valid
    ) {
      this.setBankName = true;
      const iBanCode = String(this.bankAccountDetailsForm.get('ibanAccountNo').value).slice(4, 6);
      this.IBAN.emit(iBanCode);
    } else {
      this.setBankName = false;
    }
  }

  verifyIban(){
    const request = new EstablishmentIbanValidationRequest();
    request.iban = this.bankAccountDetailsForm.get('ibanAccountNo').value;
    request.unn = this.unn;
    request.name = this.estNameAr;
    this.establishmentService.verifyEstablishmentIban(this.registrationNo, request).subscribe(res => {
      if (res.responseStatus === ResponseStatusEnum.SUCCESS) {
        this.verifyType = AlertTypeEnum.SUCCESS;
        this.isVerified=true;
      } else if (res.responseStatus === ResponseStatusEnum.REQUEST_UNDER_PROCESSING) {
        this.verifyType = AlertTypeEnum.DANGER;
        this.verifyMessage = res.ibanValidationResult;
      }
      this.accountStatus = 'ESTABLISHMENT.BANK-ACCOUNT-STATUS.' + res.accountStatus;
      this.showAccountStatus = !(res.accountStatus === AccountStatusEnum.NONE);
      this.samaResponseEmitter.emit(res);
      this.samaFailureEmitter.emit(false);
    }, () => {
      this.samaFailureEmitter.emit(true);
    });
  }
}
