/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  HostListener,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';

import {
  iBanValidator,
  lengthValidator,
  BilingualText,
  LookupService,
  AlertService,
  Lov,
  LovList,
  nonSaudiiBanValidator
} from '@gosi-ui/core';
import { PersonBankDetails, BankAccountList } from '../../models';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { deepCopy } from '../../utils';
import { BenefitValues } from '@gosi-ui/features/payment/lib/shared/enums/benefit-values';

@Component({
  selector: 'bnt-bank-account-details-dc',
  templateUrl: './bank-account-details-dc.component.html',
  styleUrls: ['./bank-account-details-dc.component.scss']
})
export class BankAccountDetailsDcComponent implements OnInit, OnChanges, OnDestroy {
  _bankDetails = { bankAccountList: [] };
  payeeForm: FormGroup;
  selectIbanForm: FormGroup;
  /**
   * Input
   */
  // @Input() bankDetails: BankAccountList | PersonBankDetails;
  @Input() listYesNo: LovList;
  @Input() lang = 'en';
  @Input() isIndividualApp: boolean;
  @Input() parentForm: FormGroup;
  @Input() showCard = true;
  @Input() bankName: BilingualText;
  @Input() isSaned: boolean;
  @Input() isDraft = false;
  @Input() isValidator = false;
  @Input() showInternationalBank = true;
  @Input() personId:any;
  @Input() paymentIndex:any;
  @Input()
  public get bankDetails() {
    return this._bankDetails;
  }
  @Input() valNonsaudiBankDetails: PersonBankDetails;
  @Input() savedPayeType: BilingualText;

  public set bankDetails(bankAccount) {
    this.createForm();
    if (bankAccount && bankAccount['ibanBankAccountNo']) {
      this._bankDetails = { bankAccountList: [bankAccount] };
    } else if (bankAccount && bankAccount?.bankAccountList) {
      this._bankDetails = bankAccount;
    }
    this.ibanList = this.generateIbanLovList(this._bankDetails);
    this.nonSaudiList = this.generateNonSaudiList(this._bankDetails);
    if (this.ibanList) {
      this.selectIfSingleValueAvailable();
      // } else {
      //   this.bankTypeChange('selectIBAN');
    }
    if (
      this.isValidator &&
      this.valNonsaudiBankDetails &&
      this.parentForm.get('payeeType.english').value === this.savedPayeType?.english
    ) {
      if (this.isValidator && this.valNonsaudiBankDetails && this.valNonsaudiBankDetails?.isNonSaudiIBAN) {
        setTimeout(() => {
          this.bankTypeChange('addNewIBAN');
          this.getNonSaudiBank(this.valNonsaudiBankDetails);
        }, 1);
      } else if (this.isValidator && this.valNonsaudiBankDetails?.ibanBankAccountNo) {
        setTimeout(() => {
          this.bankTypeChange('addNewIBAN');
          this.getSaudiBank(this.valNonsaudiBankDetails?.ibanBankAccountNo);
        }, 1);
      }
    }
  }
  @Input() ibanBankAccountNo;
  @Input() isBankAccountRequired = true;
  /**
   * Output
   */
  @Output() getBankName: EventEmitter<string> = new EventEmitter();
  bankInfo: PersonBankDetails = null;
  savedBankInfo: PersonBankDetails = new PersonBankDetails();
  bankForm: FormGroup;
  isSmallScreen: boolean;
  minMaxLengthAccountNo = 24;
  bankType = 'selectIBAN';
  ibanList: Lov[] = [];
  nonSaudiList: PersonBankDetails[] = [];
  ibanAlreadyAvailable = false;
  isDisableSelectIban = false;
  showSaudiAddnewIban: boolean;
  newIban = true;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }
  constructor(readonly lookUpService: LookupService, readonly alertService: AlertService, readonly fb: FormBuilder) {}

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    console.log('init', this.personId);
    console.log('init',this.paymentIndex);
    this.getScreenSize();
    this.createForm();
    // this.setNonSaudiDetails();
    if (this.parentForm) {
      if (this.parentForm.get('bankAccount')) {
        this.bankForm.patchValue(this.parentForm.get('bankAccount').value);
        this.parentForm.removeControl('bankAccount');
        this.parentForm.addControl('bankAccount', this.bankForm);
      } else {
        this.parentForm.addControl('bankAccount', this.bankForm);
      }
      this.parentForm.updateValueAndValidity();
    }
  }

  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.bankName && changes.bankName?.currentValue) {
        this.bankForm.get('bankName').patchValue(this.bankName);
      }
      if (changes?.ibanBankAccountNo && changes?.ibanBankAccountNo?.currentValue) {
        this.bankForm.get('ibanBilingual.english').setValue(this.ibanBankAccountNo);
      }
      if (changes?.isBankAccountRequired && changes?.isBankAccountRequired.currentValue === false) {
        this.clearValidators();
      }
      if (
        changes?.valNonsaudiBankDetails &&
        changes?.valNonsaudiBankDetails?.currentValue &&
        this.parentForm.get('payeeType.english').value === this.savedPayeType?.english
      ) {
        if (this.isValidator && this.valNonsaudiBankDetails && this.valNonsaudiBankDetails?.isNonSaudiIBAN) {
          this.bankTypeChange('addNewIBAN');
          this.getNonSaudiBank(this.valNonsaudiBankDetails);
        } else if (this.isValidator && this.valNonsaudiBankDetails?.ibanBankAccountNo) {
          this.bankTypeChange('addNewIBAN');
          this.getSaudiBank(this.valNonsaudiBankDetails?.ibanBankAccountNo);
        }
      }
    }
  }

  selectIfSingleValueAvailable() {
    const banks = this.ibanList.filter(iban => iban.value.english);
    if (banks.length === 0) {
      this.isDisableSelectIban = true;
      this.bankTypeChange('addNewIBAN');
      // this.bankForm?.get('nationality')?.get('english')?.setValue(BenefitValues.yes);
      this.newIban = true;
    } else {
      this.isDisableSelectIban = false;
      this.bankTypeChange('selectIBAN');
      this.newIban = false;
      //Defect 495926
      const savedAccount = this._bankDetails.bankAccountList.filter(element => element.savedAccount);
      if (savedAccount[0]?.ibanBankAccountNo) {
        setTimeout(() => {
          this.bankForm.get('ibanBilingual').get('english').setValue(savedAccount[0]?.ibanBankAccountNo);
          this.bankForm.get('ibanBilingual.arabic').patchValue(savedAccount[0]?.ibanBankAccountNo);
        }, 1);
        this.getBank(savedAccount[0]?.ibanBankAccountNo);
      } else if (banks.length === 1) {
        setTimeout(() => {
          this.bankForm.get('ibanBilingual')?.patchValue(banks[0]?.value);
        }, 1);
        this.getBank(banks[0]?.value?.english);
      }
      this.bankForm.get('ibanBilingual').markAllAsTouched();
      // if (index >= 0) {
      //   const selectdBank = banks.filter(
      //     bank => bank.value.english === this._bankDetails.bankAccountList[index].ibanBankAccountNo
      //   );
      //   this.bankForm.get('ibanBilingual')?.patchValue(selectdBank[0]?.value);
      //   this.getBank(selectdBank[0]?.value?.english);
      // } else {
      //   this.bankForm.get('ibanBilingual')?.patchValue(this.ibanList[0]?.value);
      //   this.getBank(this.ibanList[0]?.value?.english);
      // }
    }
  }
  selectNationality(type: string) {
    if (!(this.isValidator && !this.isDraft)) {
      this.bankForm?.get('ibanBankAccountNo')?.reset();
      this.bankForm?.get('bankName')?.reset();
      this.bankForm?.get('swiftCode')?.reset();
    }
    if (type === BenefitValues.yes) {
      //Saudi
      this.showSaudiAddnewIban = true;
      this.bankForm.get('isNonSaudiIBAN').setValue(false);
      // this.bankForm.removeControl('swiftCode');
      this.removeControlForNonSaudi();
      this.bankForm?.get('bankName').reset();
      // Defect 482378 simultaneous nationality option click resetting
    } else {
      //Non Saudi
      this.showSaudiAddnewIban = false;
      if (!(this.isValidator && !this.isDraft)) {
        this.bankForm?.get('ibanBilingual')?.reset();
        this.bankForm?.get('bankName').reset();
        // this.newBankName = null;
      }
      this.addControlForNonSaudi();
      // this.bankForm.addControl('swiftCode', this.bankForm?.get('swiftCode'));
      this.bankForm.get('isNonSaudiIBAN').setValue(true);
    }
    this.bankForm.get('isNewlyAdded').setValue(true);
    this.bankForm.updateValueAndValidity();
    this.updateParentForm();
    this.parentForm.updateValueAndValidity();
  }
  createForm() {
    this.bankForm = this.createEditBankDetailsForm();
  }
  updateParentForm() {
    if (this.parentForm.get('bankAccount')) {
      this.parentForm.removeControl('bankAccount');
      this.parentForm.addControl('bankAccount', this.bankForm);
    }
  }
  bankTypeChange(bankType) {
    this.bankForm.reset();
    this.ibanAlreadyAvailable = false;
    if (bankType === 'selectIBAN') {
      this.bankType = 'selectIBAN';
      this.newIban = false;
    } else if (bankType === 'addNewIBAN') {
      this.bankType = 'addNewIBAN';
      this.showSaudiAddnewIban = true;
      this.newIban = true;
      this.bankForm?.get('nationality')?.get('english')?.setValue(BenefitValues.yes);
      this.bankForm?.get('isNewlyAdded')?.setValue(true);
      //Defect 614592 non saudi iban on select iban, ibanvalidator check and bank code removed
      this.removeControlForNonSaudi();
      // this.bankForm.get('isNonSaudiIBAN').setValue(false);
    }
    this.bankForm.get('bankType').setValue(this.bankType);
  }

  /*** this function generate lov list for the saved IBAN values */
  generateIbanLovList(bankDetails: BankAccountList): Lov[] {
    let ibanList: Lov[] = [];
    if (bankDetails?.bankAccountList && bankDetails?.bankAccountList.length) {
      bankDetails?.bankAccountList?.forEach((items, index) => {
        if (items.ibanBankAccountNo && !items.isNonSaudiIBAN) {
          const lov = new Lov();
          lov.sequence = index;
          lov.bankName = items?.bankName;
          lov.value.english = items?.ibanBankAccountNo;
          lov.value.arabic = items?.ibanBankAccountNo;
          if (ibanList?.length) {
            ibanList.push(lov);
          } else {
            ibanList = [lov];
          }
        }
      });
    }
    return ibanList;
  }
  /*** this function is to generate array of non saudi bank details */
  generateNonSaudiList(bankDetails: BankAccountList): PersonBankDetails[] {
    let nonSaudiList: PersonBankDetails[] = [];
    if (bankDetails?.bankAccountList && bankDetails?.bankAccountList.length) {
      bankDetails?.bankAccountList?.forEach((eachBank, index) => {
        if (eachBank.isNonSaudiIBAN) {
          const nonSaudiBanks = new PersonBankDetails();
          // nonSaudiBanks.sequence = index;
          nonSaudiBanks.ibanBankAccountNo = eachBank?.ibanBankAccountNo;
          // nonSaudiBanks.ibanBankAccountNo.arabic = eachBank?.ibanBankAccountNo;
          nonSaudiBanks.bankName.english = eachBank?.bankName?.english;
          nonSaudiBanks.bankName.arabic = eachBank?.bankName?.arabic;
          nonSaudiBanks.isNonSaudiIBAN = eachBank?.isNonSaudiIBAN;
          nonSaudiBanks.swiftCode = eachBank?.swiftCode;
          if (nonSaudiList?.length) {
            nonSaudiList.push(nonSaudiBanks);
          } else {
            nonSaudiList = [nonSaudiBanks];
          }
        }
      });
    }
    return nonSaudiList;
  }
  // Method to create edit bank details form
  createEditBankDetailsForm() {
    if (this.bankForm) {
      return this.bankForm;
    } else {
      return this.fb.group({
        ibanBilingual: this.fb.group({
          english: [
            null,
            {
              validators: Validators.compose([
                lengthValidator(this.minMaxLengthAccountNo),
                iBanValidator,
                this.isBankAccountRequired ? Validators.required : null
              ]),
              updateOn: 'blur'
            }
          ],
          arabic: [null, { updateOn: 'blur' }]
        }),
        bankType: '',
        ibanBankAccountNo: [
          '',
          {
            validators: Validators.compose([
              this.isBankAccountRequired ? Validators.required : null,
              iBanValidator,
              lengthValidator(0, 30)
            ])
          }
        ],
        bankAccountId: 0,
        bankName: this.fb.group({
          english: [null, { updateOn: 'blur', validators: Validators.required }],
          arabic: [null, { updateOn: 'blur' }]
        }),
        bankCode: [
          '',
          {
            updateOn: 'blur'
          }
        ],
        isNewlyAdded: [false],
        nationality: this.fb.group({
          english: [BenefitValues.yes],
          arabic: null
        })
        // NonSaudiIbanAccNo and nonSaudiBankName to be passed to existing form values only.
        // only swift code to be passed extra.
        // nonSaudiIbanAccNo: [
        //   '',
        //   {
        //     validators: Validators.compose([Validators.required, nonSaudiiBanValidator, lengthValidator(0, 30)])
        //   }
        // ],
        // nonSaudiBankName: this.fb.group({
        //   english: [null, { validators: Validators.required }],
        //   arabic: [null]
        // }),
        // swiftCode: [null, { validators: Validators.required }, { updateOn: 'blur' }],
        // isNonSaudiIBAN: [false]
      });
    }
  }

  addControlForNonSaudi() {
    this.bankForm.get('ibanBankAccountNo').reset();
    this.bankForm.get('bankName').reset();
    this.bankForm.addControl('swiftCode', new FormControl('', Validators.required));
    this.bankForm.addControl('isNonSaudiIBAN', new FormControl(true));
    this.bankForm
      .get('ibanBankAccountNo')
      .setValidators([Validators.required, nonSaudiiBanValidator, lengthValidator(0, 30)]);
    this.bankForm.removeControl('ibanBilingual');
  }

  removeControlForNonSaudi() {
    this.bankForm.removeControl('swiftCode');
    this.bankForm.removeControl('isNonSaudiIBAN');
  //   this.addIbanBilingualControl();
  //   this.bankForm.get('ibanBankAccountNo').setValidators([this.isBankAccountRequired ? Validators.required : null, iBanValidator, lengthValidator(0, 30)]);
  // }
  // addIbanBilingualControl() {
    this.bankForm.addControl(
      'ibanBilingual',
      this.fb.group({
        english: [
          null,
          {
            validators: Validators.compose([
              lengthValidator(this.minMaxLengthAccountNo),
              iBanValidator,
              Validators.required
            ]),
            updateOn: 'blur'
          }
        ],
        arabic: [null, { updateOn: 'blur' }]
      })
    );
    if(!this.isBankAccountRequired && !this.bankForm.get('ibanBankAccountNo')?.value && !this.bankForm.get('ibanBilingual')?.get('english').value){
      this.bankForm.get('ibanBankAccountNo')?.clearValidators();
      this.bankForm.get('ibanBilingual')?.get('english').clearValidators();
      this.bankForm.get('ibanBilingual')?.get('english').setErrors(null);
      this.bankForm.get('bankName')?.get('english')?.clearValidators();
      this.bankForm.get('bankName')?.get('english')?.setErrors(null);
      this.bankForm.get('bankName')?.updateValueAndValidity();
    }else{
      this.bankForm.get('ibanBankAccountNo').setValidators([this.isBankAccountRequired ? Validators.required : null, iBanValidator, lengthValidator(0, 30)]);
    }
  }
  setSaudiIbanValidations(controlName: string) {
    this.bankForm
      .get(controlName)
      .setValidators([lengthValidator(this.minMaxLengthAccountNo), iBanValidator, Validators.required]);
  }
  setNonSaudiIbanValidations(controlName: string) {
    this.bankForm.get(controlName).setValidators([Validators.required, nonSaudiiBanValidator, lengthValidator(0, 30)]);
  }
  // Method to get bank details
  getBank(iban: string, isManuallyEntered = false) {
    if (iban) {
      this.ibanAlreadyAvailable = false;
      if (isManuallyEntered && this.ibanList?.length) {
        const ibanAvailableInList = this.ibanList.filter(lov => {
          return lov.value.english === iban;
        });
        if (ibanAvailableInList.length) {
          this.ibanAlreadyAvailable = true;
          //const bankCode = iban.slice(4, 6);
         // this.getBankName.emit(bankCode);
        // this.bankForm.get('ibanBankAccountNo').patchValue(ibanAvailableInList[0].value);
          this.bankForm.get('bankName').patchValue(ibanAvailableInList[0].bankName);
        }
      }
      if (!this.ibanAlreadyAvailable) {
        const ibanNonSaudiList = this.nonSaudiList.filter(eachbank => {
          return eachbank.ibanBankAccountNo === iban;
        });
        if (ibanNonSaudiList.length) {
          this.getNonSaudiBank(ibanNonSaudiList[0]);
        } else {
          this.getSaudiBank(iban);
        }
      }
      this.bankForm.get('isNewlyAdded').setValue(isManuallyEntered);
    }
  }
  getSaudiBank(iban: string) {
    const ibanId = this._bankDetails.bankAccountList.find(val => val?.ibanBankAccountNo === iban)?.bankAccountId;
    // if(!this.bankForm.get('ibanBilingual')) this.addIbanBilingualControl();
    this.setSaudiIbanValidations('ibanBilingual.english');
    const bankCode = iban.slice(4, 6);
    this.bankForm.get('isNewlyAdded').setValue(true);
    this.bankForm.get('bankCode').patchValue(bankCode);
    this.bankForm.get('bankAccountId').patchValue(ibanId);
    this.bankForm.get('ibanBilingual.english').patchValue(iban);
    this.bankForm.get('ibanBilingual.arabic').patchValue(iban);
    this.bankForm.get('ibanBankAccountNo').patchValue(iban);
    this.getBankName.emit(bankCode);
  }
  getNonSaudiBank(nonSaudiBankDetails: PersonBankDetails) {
    //571461 International
    this.bankForm.get('isNewlyAdded').setValue(true);
    if (nonSaudiBankDetails?.isNonSaudiIBAN) {
      this.bankForm?.get('nationality').get('english').setValue(BenefitValues.no);
      this.bankForm.removeControl('ibanBilingual');
    } else {
      this.bankForm?.get('nationality').get('english').setValue(BenefitValues.yes);
    }
    this.setNonSaudiIbanValidations('ibanBankAccountNo');
    const bankCode = nonSaudiBankDetails?.ibanBankAccountNo.slice(4, 6);
    //Defect 614592 non saudi iban on select iban, ibanvalidator check and bank code removed
    if(nonSaudiBankDetails?.ibanBankAccountNo.slice(0, 2) === 'SA') this.bankForm.get('bankCode').patchValue(bankCode); // To do : remove bankCode
    if(this.bankType === 'selectIBAN' && nonSaudiBankDetails?.ibanBankAccountNo.slice(0, 2) !== 'SA'){
      this.bankForm.get('ibanBankAccountNo').clearValidators();
    }//Defect 614592 non saudi iban on select iban, ibanvalidator check and bank code removed
    this.bankForm.get('ibanBankAccountNo').patchValue(nonSaudiBankDetails?.ibanBankAccountNo);
    this.bankForm.get('bankName.english').patchValue(nonSaudiBankDetails?.bankName?.english);
    this.bankForm
      .get('bankName.arabic')
      .patchValue(
        nonSaudiBankDetails?.bankName?.arabic
          ? nonSaudiBankDetails?.bankName?.arabic
          : nonSaudiBankDetails?.bankName?.english
      );
    this.bankForm.addControl('swiftCode', new FormControl('', Validators.required));
    this.bankForm.addControl('isNonSaudiIBAN', new FormControl(true));
    this.bankForm.get('isNonSaudiIBAN').patchValue(nonSaudiBankDetails?.isNonSaudiIBAN);
    this.bankForm.get('swiftCode').patchValue(nonSaudiBankDetails?.swiftCode);
    this.getBankName.emit(bankCode); // To do : remove bankCode
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  clearValidators() {
    this.bankForm.get('ibanBankAccountNo').clearValidators();
    this.bankForm.get('ibanBankAccountNo').setErrors(null);
    this.bankForm.get('ibanBilingual.english').clearValidators();
    this.bankForm.get('ibanBankAccountNo.english').setErrors(null);
    this.bankForm.updateValueAndValidity();
  }

  ngOnDestroy() {}
}
