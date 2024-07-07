/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert, AlertIconEnum, AlertTypeEnum, iBanValidator, lengthValidator, LovList } from '@gosi-ui/core';
import { noop, Observable } from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';
import { BankAccounts, IbanType, PersonBankDetails } from '../../../shared';

@Component({
  selector: 'cnt-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit, OnChanges {
  /**Creates an instance of BankDetailsDcComponent. */
  constructor(private formBuilder: FormBuilder) {}
  /** Input variables */
  @Input() ibanType = IbanType.SELECT;
  @Input() bankDetails$: Observable<BankAccounts>;
  @Input() bankNameList$: Observable<LovList>;
  @Input() bankAccountDetailsForm: FormGroup;
 // @Input() listYesNo: LovList;
  /**
   * Output variables
   */
  @Output() onSelection = new EventEmitter<PersonBankDetails>();
  @Output() onNew = new EventEmitter<string>();
  @Output() onChangeIbanType = new EventEmitter<IbanType>();
  @Output() isIbanINKSAChange = new EventEmitter<string>();

  New = IbanType.NEW;
  Select = IbanType.SELECT;

  minMaxLengthAccountNo = 24;
  setBankName = false;

  bankAccountList = new LovList([]);
  list: LovList = new LovList([]);
  bankAccounts: BankAccounts;
  noAccountAlert = new Alert();
  ibanVerificationAlert = new Alert();
  listYesNo: LovList = new LovList([
    { value: { english: 'Yes', arabic: 'نعم '}, sequence: 1 },
    { value: { english: 'No', arabic: 'لا' }, sequence: 2 }
  ]);
  isIbanINKSA='Yes';


  ngOnInit() {
    this.noAccountAlert.messageKey = 'CONTRIBUTOR.NO-BANK-ACCOUNT-FOUND';
    this.noAccountAlert.type = AlertTypeEnum.INFO;
    this.noAccountAlert.icon = AlertIconEnum.INFO;
    this.ibanVerificationAlert.messageKey = 'CONTRIBUTOR.IBAN-VERIFIVATION-NOTICE';
    this.ibanVerificationAlert.type = AlertTypeEnum.INFO;
    this.ibanVerificationAlert.icon = AlertIconEnum.INFO;
    this.bankDetails$
      .pipe(take(1))
      .pipe(
        map(res => {
          let accounts = res;
          accounts.bankAccountList = accounts.bankAccountList.filter(acc =>
            acc.ibanBankAccountNo.slice(0, 2).match(/[a-zA-Z]/g)
          );
          return accounts;
        }),
        tap(res => (this.bankAccounts = res)),
        tap(res => this.setBankFormDetails(res)),
        tap(res => {
          this.bankAccountList = new LovList(
            res.bankAccountList.map((account, i) => ({
              value: { english: account.ibanBankAccountNo, arabic: account.ibanBankAccountNo },
              sequence: i
            }))
          );
        }),
        tap(_ => {
          const account = this.bankAccounts.bankAccountList[0];
          if (account) {
            this.selectBankAccount(account.ibanBankAccountNo);
          }
        })
      )
      .subscribe(noop, noop);

      // if (this.isIbanINKSA === 'Yes'){

      //   this.bankAccountDetailsForm
      //   .get('swiftCode')
      //   .patchValue({ english: this.bankAccounts.bankAccountList[0] ? this.bankAccounts.bankAccountList[0].swiftCode : null });

      // }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bankNameList$ && changes.bankNameList$.currentValue && this.bankAccountDetailsForm) {
      this.bankNameList$
        .pipe(take(1))
        .pipe(
          tap(res => (this.list = res)),
          delay(100),
          tap(res => {
            if (this.setBankName && res.items.length > 0) {
              this.bankAccountDetailsForm.get('bankName').patchValue(res.items[0].value);
              this.bankAccountDetailsForm.get('bankName').updateValueAndValidity();
            }
          })
        )
        .subscribe(noop);
    }
  }

  setBankFormDetails(bankAccounts: BankAccounts) {
    this.bankAccountDetailsForm.get('ibanAccountNo').patchValue({
      english: bankAccounts.bankAccountList[0] ? bankAccounts.bankAccountList[0].ibanBankAccountNo : null
    });
    // if(bankAccounts.bankAccountList[0]?.bankName) {
      this.bankAccountDetailsForm
      .get('bankName')
      .patchValue({
        english: bankAccounts.bankAccountList[0] ? bankAccounts.bankAccountList[0].bankName.english : null,
        arabic: bankAccounts.bankAccountList[0] ? bankAccounts.bankAccountList[0].bankName.arabic : null
      });
    //   .patchValue(bankAccounts.bankAccountList[0].bankName);
    // }
  }

  changeType(type: IbanType) {
    this.onChangeIbanType.emit(type);
    this.bankAccountDetailsForm.patchValue({
      ibanAccountNo: {
        english: ''
      },
      bankName: {
        english: ''
      }
    });

    if (type === IbanType.SELECT && this.bankAccounts.bankAccountList[0]) {
      this.setBankFormDetails(this.bankAccounts);
      this.selectBankAccount(this.bankAccounts.bankAccountList[0].ibanBankAccountNo);
    }
    this.validate();

  }

  selectBankAccount(account: string) {
    this.onSelection.emit(this.bankAccounts.bankAccountList.find(el => el.ibanBankAccountNo === account));
    this.getBank();
  }

  validate() {
    this.bankAccountDetailsForm.updateValueAndValidity();
  }

  setMandatory() {
    this.bankAccountDetailsForm
      .get('ibanAccountNo')
      .setValidators(
        Validators.compose([lengthValidator(this.minMaxLengthAccountNo), iBanValidator, Validators.required])
      );
    this.bankAccountDetailsForm.get('ibanAccountNo').markAsUntouched();
    this.bankAccountDetailsForm.get('ibanAccountNo').updateValueAndValidity();
    this.bankAccountDetailsForm.get('bankName').get('english').setValidators(Validators.required);
    this.bankAccountDetailsForm.get('nonSaudiIbanAccNo').get('english').setValidators(Validators.required);
    this.bankAccountDetailsForm.get('nonSaudiBankName').get('english').setValidators(Validators.required);
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  setOptional() {
    this.bankAccountDetailsForm.get('ibanAccountNo').clearValidators();
    this.bankAccountDetailsForm.get('ibanAccountNo').updateValueAndValidity();
    this.resetBankName();
    this.bankAccountDetailsForm.get('bankName').get('english').clearValidators();
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  resetBankName() {
    this.bankAccountDetailsForm.get('bankName').get('english').reset();
    this.bankAccountDetailsForm.get('bankName').get('english').markAsUntouched();
    this.bankAccountDetailsForm.get('bankName').get('english').updateValueAndValidity();
  }

  getBank() {
    this.resetBankName();
    if (
      this.bankAccountDetailsForm.get('ibanAccountNo.english').value &&
      this.bankAccountDetailsForm.get('ibanAccountNo.english').valid
    ) {
      this.setBankName = true;
      const iBanCode = String(this.bankAccountDetailsForm.get('ibanAccountNo.english').value).slice(4, 6);
      this.onNew.emit(iBanCode);
    } else {
      this.setBankName = false;
    }
  }
  selectedIfBankInKSA() {
    const validators = [lengthValidator(this.minMaxLengthAccountNo), iBanValidator];
    this.isIbanINKSA = this.bankAccountDetailsForm.get('isIbanSelectedOption.english').value
    this.isIbanINKSAChange.emit(this.isIbanINKSA);
    if (this.isIbanINKSA === 'No'){
      this.bankAccountDetailsForm.addControl(
        'nonSaudiIbanAccNo',
        new FormControl('', {
          validators: [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\W]*$/)],
          updateOn: 'blur'
        })
      );
      this.bankAccountDetailsForm.addControl('nonSaudiBankName', new FormControl('', Validators.required));
      this.bankAccountDetailsForm.addControl(
        'swiftCode',
        new FormControl('', {
          validators: [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\W]*$/)],
          updateOn: 'blur'
        })
      );
      this.bankAccountDetailsForm.removeControl('ibanAccountNo');
      this.bankAccountDetailsForm.removeControl('bankName');
    }else{
      // remove non KSA ibanAccountNo fields
      this.bankAccountDetailsForm.removeControl('nonSaudiIbanAccNo');
      this.bankAccountDetailsForm.removeControl('nonSaudiBankName');
      this.bankAccountDetailsForm.removeControl('swiftCode');

      // Added KSA ibanAccountNo control dynamically
      this.bankAccountDetailsForm.addControl('ibanAccountNo', this.formBuilder.group({
        english: ['', { validators: [Validators.required,Validators.compose(validators) ]}],
        arabic: [null],
        updateOn: 'blur'
      }));
      this.bankAccountDetailsForm.get('ibanAccountNo').valueChanges.subscribe(() => {
        this.getBank();
      });

      // Add bankName control dynamically
    this.bankAccountDetailsForm.addControl('bankName', this.formBuilder.group({
      english: ['', Validators.required],
      arabic: [null],
      updateOn: 'blur'
    }));
    }
  }

}

