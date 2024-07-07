/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import {
  bindToForm,
  CurrencySar,
  GccCountryCode,
  LovList,
  markFormGroupTouched,
  subtractMonths,
  NationalityTypeEnum,
  AlertService,
  GccCountryEnum,
  BilingualText
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants, PaymentConstants } from '../../../shared/constants';
import { BankType, GccCountry, ReceiptMode, Months } from '../../../shared/enums';
import {
  BranchDetails,
  BranchFilter,
  CurrencyDetails,
  EstablishmentDetails,
  PaymentDetails
} from '../../../shared/models';
import { createReceipModeForm, createChequeForm, createOtherReceiptForm } from './payment-details-form';
@Component({
  selector: 'blg-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent implements OnInit, OnChanges {
  /** Constants */
  typePersonnelCheque = ReceiptMode.PERSONNEL_CHEQUE;
  typeBankersCheque = ReceiptMode.BANKERS_CHEQUE;
  typeAccountTransfer = ReceiptMode.ACCOUNT_TRANSFER;
  typeSAMAVoucher = ReceiptMode.SAMA_VOUCHER;
  typeCashDeposit = ReceiptMode.CASH_DEPOSIT;
  chequeNoMaxLength = PaymentConstants.CHEQUE_NUMBER_MAX_LENGTH;
  transactionNoMaxLength = PaymentConstants.TRANSACTION_NUMBER_MAX_LENGTH;
  bankNameLength = PaymentConstants.BANK_NAME_MAX_LENGTH;
  amountReceivedSeparatorLimit = BillingConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  additionalDetailsMaxLength = BillingConstants.ADDITIONAL_DETAILS_MAX_LENGTH;
  saudiCurrencyCode = BillingConstants.CURRENCY_SAR;
  saudiCountryCode = GccCountryCode.SAUDI_ARABIA;
  /** Input variables */
  @Input() parentForm: FormGroup;
  @Input() isPaymentSaved: boolean;
  @Input() receiptMode: LovList;
  @Input() saudiBankList: LovList;
  @Input() gccCountryList: LovList;
  @Input() yesOrNoList: LovList;
  @Input() establishmentTypeList: LovList;
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() branchLists: BranchDetails[];
  @Input() outsideBranchLists: BranchDetails[];
  @Input() receiptDetails: PaymentDetails;
  @Input() gccFlag: boolean;
  @Input() internationalCountryList: LovList;
  @Input() bankType: LovList;
  @Input() mofFlag: boolean;
  @Input() gccBankList: LovList;
  @Input() isBranchesClosed: boolean;
  @Input() currencyDetails: CurrencyDetails;
  @Input() initialExchangeRate: number;
  @Input() branchFilterDetails: BranchDetails[];
  @Input() establishmentLocationList: LovList;
  @Input() establishmentStatusList: LovList;
  @Input() fieldArray: BranchDetails[];
  @Input() noFilterResult: boolean;
  @Input() isAppPrivate: boolean;
  @Input() isGovPayment? = false;
  @Input() paymentDetails? = undefined;
  /** Output variables */
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() gccBank: EventEmitter<string> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() penalityIndicator: EventEmitter<boolean> = new EventEmitter();
  @Output() isCurrent: EventEmitter<boolean> = new EventEmitter();
  @Output() currentReceipt: EventEmitter<string> = new EventEmitter();
  @Output() estType: EventEmitter<string> = new EventEmitter();
  @Output() branchDetailsFilter: EventEmitter<BranchFilter> = new EventEmitter();
  @Output() outSideBranchSearch: EventEmitter<string> = new EventEmitter();
  @Output() validateOutsideBranch: EventEmitter<boolean> = new EventEmitter();
  @Output() exchangeRate = new EventEmitter<{ transactionDate: string; countryName: string }>();
  @Output() eventDate = new EventEmitter<{ transactionDate: string; countryName: string }>();
  /** Local variables */
  countryName = '';
  receiptModeForm: FormGroup;
  paymentDetailsForm: FormGroup;
  chequeMinDate: Date;
  maxDate: Date;
  transactionMinDate: Date;
  modalRef: BsModalRef;
  initialCurerencyDetails: CurrencyDetails;
  branches: BranchDetails[];
  bankTypeList: LovList;
  currentReceiptMode: string;
  isLocalBank = true;
  isOtherBank = false;
  isInternationalBank = false;
  exchangeValue: number;
  totalAmountValue: number;
  countryChangeFlag = false;
  otherCurrencyFlag = false;
  twoDecimalval: boolean;
  disabled = false;
  allocatedAmount: string;
  isReceiptFormInit = false;
  ThreeDecimal: boolean;
  currentMode: boolean;

  constructor(private modalService: BsModalService, private alertService: AlertService) {}
  /** This method is to initialize the component. */
  ngOnInit() {
    this.receiptModeForm = createReceipModeForm();
    this.isReceiptFormInit = true;
    if (this.parentForm) {
      this.parentForm.addControl('receiptMode', this.receiptModeForm);
    }
    this.maxDate = moment(new Date()).toDate();
    this.chequeMinDate = subtractMonths(new Date(), 6);
    this.transactionMinDate = moment(BillingConstants.TRANSACTION_MINDATE).toDate();
    this.setDecimalval();
    if (this.isGovPayment && this.paymentDetails) {
      this.allocatedAmount = parseFloat(this.paymentDetails.receiptDetails.amount).toFixed(2);
    }
    this.estType.emit(this.receiptModeForm.get('establishmentType').value.english);
  }

  ngAfterViewInit() {}

  setPaymentDetails() {
    if (this.parentForm && !this.disabled) {
      this.disabled = true;
      this.receiptModeForm.get('receiptMode').setValue(this.receiptMode.items[3].value);
      this.currentReceiptMode = this.parentForm.get('receiptMode').get('receiptMode.english').value;
      this.currentReceipt.emit(this.currentReceiptMode);
      this.currentMode = true;
      this.isCurrent.emit(this.currentMode);
      this.createPaymentDetailsForm();
    }
    if (this.currentReceiptMode && this.paymentDetailsForm.value) {
      this.paymentDetailsForm.get('bank').get('name').setValue(this.saudiBankList.items[0].value);
      this.paymentDetailsForm
        .get('amountReceived')
        .get('amount')
        .setValue(
          parseFloat(this.paymentDetails.receiptDetails.amount).toFixed(
            this.twoDecimalval || this.twoDecimalval === undefined ? 2 : 3
          )
        );
      this.paymentDetailsForm.get('transactionDate').setValue({
        gregorian: new Date(this.paymentDetails.receiptDetails.transactionDate),
        hijiri: null
      });
      this.paymentDetailsForm.get('referenceNo').setValue(this.paymentDetails.receiptDetails.referenceNo);
      this.totalAmountValue = Number(this.paymentDetails.receiptDetails.amount);
    }
  }

  /** Method to change the number of decimal places based on country */
  setDecimalval() {
    if (this.paymentDetailsForm || this.receiptDetails) {
      if (
        this.paymentDetailsForm?.get('bank').get('country').get('english').value === GccCountryEnum.BAHRAIN ||
        this.receiptDetails.bank.country.english === GccCountryEnum.BAHRAIN
      ) {
        this.twoDecimalval = false;
      } else if (
        this.paymentDetailsForm?.get('bank').get('country').get('english').value === GccCountryEnum.KUWAIT ||
        this.receiptDetails.bank.country.english === GccCountryEnum.KUWAIT
      ) {
        this.twoDecimalval = false;
      } else if (
        this.paymentDetailsForm?.get('bank').get('country').get('english').value === GccCountryEnum.OMAN ||
        this.receiptDetails.bank.country.english === GccCountryEnum.OMAN
      ) {
        this.twoDecimalval = false;
      } else {
        this.twoDecimalval = true;
      }
    }
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      this.isGovPayment &&
      this.paymentDetails &&
      this.isReceiptFormInit &&
      this.receiptMode &&
      this.bankType
    ) {
      this.setPaymentDetails();
      this.allocatedAmount = this.paymentDetails.receiptDetails.amount;
    }
    if (changes && changes.receiptDetails && changes.receiptDetails.currentValue && !this.isGovPayment) {
      if (this.receiptModeForm && this.receiptDetails.receiptMode.english !== null) {
        bindToForm(this.receiptModeForm, this.receiptDetails);
        this.countryName = GccCountry[this.receiptDetails?.amountReceived?.currency];
        if (this.parentForm.get('receiptMode')) {
          this.parentForm.removeControl('receiptMode');
        }
        this.parentForm.addControl('receiptMode', this.receiptModeForm);
        this.currentReceiptMode = this.receiptDetails.receiptMode.english;
        this.createPaymentDetailsForm();
        if (this.paymentDetailsForm.get('gccAmountReceived').value) {
          this.updateAllocationAmount(this.paymentDetailsForm.get('gccAmountReceived').value);
        }
        this.setDecimalval();
        this.bindDetailsToForm(this.receiptDetails, this.paymentDetailsForm);
      }
    }
    if (changes && changes.initialExchangeRate && changes.initialExchangeRate.currentValue) {
      this.initialExchangeRate = changes.initialExchangeRate.currentValue;
    }
    if (changes && changes.currencyDetails && changes.currencyDetails.currentValue) {
      this.currencyDetails = changes.currencyDetails.currentValue;
      this.exchangeValue = this.currencyDetails.exchangeRate;
      if (this.paymentDetailsForm.get('gccAmountReceived').value) {
        this.updateAllocationAmount(this.paymentDetailsForm.get('gccAmountReceived').value);
      }
      this.initialCurerencyDetails = this.currencyDetails;
      const rate = this.initialCurerencyDetails.exchangeRate;
      const initialRate = Math.round((Number(rate) + Number.EPSILON) * 100) / 100;
      this.initialCurerencyDetails.exchangeRate = initialRate;
    }
    this.setDecimalval();
    this.setthreeDecimalval();
  }
  /** Method to set control for branchBreakup in case of no brances. */
  updateAllocationAmount(amountReceived: string) {
    if (this.gccFlag === true) {
      if (!this.isInternationalBank && !this.isLocalBank) {
        this.exchangeValue = this.paymentDetailsForm.get('gccAmountReceived').value * this.initialExchangeRate;
        this.paymentDetailsForm?.get('amountReceived.amount')?.setValue(parseFloat(this.exchangeValue.toString()));
      } else {
        this.paymentDetailsForm
          .get('gccAmountReceived')
          ?.setValue(this.paymentDetailsForm.get('amountReceived.amount')?.value);
      }
    }
    if (this.branchLists.length === 1 || this.isBranchesClosed) {
      (this.parentForm.get('branchBreakupForm') as FormArray).controls[0]
        .get('allocatedAmount.amount')
        .setValue(parseFloat(amountReceived).toFixed(this.twoDecimalval || this.twoDecimalval === undefined ? 2 : 3));
      this.totalAmountValue = Number(amountReceived);
    }
  }

  /** Method to create  payment details form. */
  createPaymentDetailsForm() {
    this.alertService.clearAlerts();
    this.currentReceiptMode = this.receiptModeForm.get('receiptMode.english').value;
    this.resetBranchBreakupForm();
    if (this.parentForm.get('paymentDetails')) this.parentForm.removeControl('paymentDetails');
    if (this.currentReceiptMode) {
      this.isLocalBank = this.gccFlag ? false : true;
      this.isInternationalBank = false;
      this.isOtherBank = false;
      const currencyCode =
        this.currencyDetails !== undefined ? this.currencyDetails.currencyCode.english : CurrencySar.ENGLISH;
      if (
        this.currentReceiptMode.toLowerCase() === this.typePersonnelCheque.toLowerCase() ||
        this.currentReceiptMode.toLowerCase() === this.typeBankersCheque.toLowerCase()
      )
        this.paymentDetailsForm = createChequeForm(this.gccFlag, currencyCode);
      else this.paymentDetailsForm = createOtherReceiptForm(this.gccFlag, currencyCode);
      this.paymentDetailsForm
        .get('transactionDate')
        .get('gregorian')
        .valueChanges.subscribe(() => this.dateChange());
      if (this.gccFlag) {
        this.paymentDetailsForm.get('bank.country').reset();
        this.paymentDetailsForm.get('amountReceived.amount').reset();
        this.paymentDetailsForm.get('gccAmountReceived').reset();
        this.isInternationalBank = false;
        this.isLocalBank = false;
        this.isOtherBank = false;
        this.bankTypeList = new LovList(this.bankType.items.filter(item => item.value.english !== BankType.LOCAL_BANK));
      } else {
        this.bankTypeList = new LovList(this.bankType.items);
        this.isLocalBank = true;
        this.isInternationalBank = false;
        this.isOtherBank = false;
        this.paymentDetailsForm.get('bank.country.english').setValue(NationalityTypeEnum.SAUDI_NATIONAL);
        this.paymentDetailsForm.updateValueAndValidity();
      }
    }
    this.parentForm.addControl('paymentDetails', this.paymentDetailsForm);
  }

  /** Method to clear brach breakup values on receipt mode change. */
  resetBranchBreakupForm() {
    //Clear the values entered in brach breakup form.
    if (this.parentForm.get('branchBreakupForm')) {
      for (let i = 0; i < (this.parentForm.get('branchBreakupForm') as FormArray).length; i++) {
        (this.parentForm.get('branchBreakupForm') as FormArray).controls[i]
          .get('allocatedAmount.amount')
          .setValue('0.00');
      }
    }
    if (this.parentForm.get('outSideBranchBreakupForm')) {
      for (let i = 0; i < (this.parentForm.get('outSideBranchBreakupForm') as FormArray).length; i++) {
        (this.parentForm.get('outSideBranchBreakupForm') as FormArray).controls[i]
          .get('allocatedAmount.amount')
          .setValue('0.00');
      }
    }
    //Clear the total value on receipt mode change.
    if (this.parentForm.get('totalAmountAllocated')) {
      this.parentForm.get('totalAmountAllocated.totalAmount').setValue('0.00');
    }
    if (this.parentForm.get('totalOutSideAmountAllocated')) {
      this.parentForm.get('totalOutSideAmountAllocated.totalAmount').setValue('0.00');
    }
  }
  /** Method to control bank name field changes. */
  bankNameChange() {
    const bankName = this.paymentDetailsForm.get('bank.name.english');
    if (bankName.value === 'Other') {
      this.isOtherBank = true;
      this.enableField(this.paymentDetailsForm.get('bank.nonListedBank'));
    } else {
      this.isOtherBank = false;
      this.disableField(this.paymentDetailsForm.get('bank.nonListedBank'));
    }
  }
  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  /**
   * Nethod to enable form control.
   * @param formControl form control
   */
  enableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.setValidators([Validators.required]);
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  /** Method to save payment details. */
  saveAndNext() {
    this.save.emit();
    markFormGroupTouched(this.paymentDetailsForm);
    markFormGroupTouched(this.receiptModeForm);
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /**
   * Bind receipt details to form on edt mode.
   * @param data receipt details.
   * @param formGroup form group.
   */
  bindDetailsToForm(data, formGroup: FormGroup) {
    if (data) {
      if (data.amountReceived.currency !== CurrencySar.ENGLISH) {
        this.otherCurrencyFlag = true;
      }
      Object.keys(data).forEach(key => {
        if (key in formGroup.controls) {
          if (key === 'transactionDate' || key === 'chequeDate') {
            // todo make as enum
            if (data[key] !== null) {
              formGroup.get(key).get('gregorian').patchValue(new Date(data[key].gregorian));
            } else {
              formGroup.get(key).patchValue(data[key]);
            }
          } else if (key === 'amountReceived') {
            //For gcc establishment set gcc amount received and convert to SAR
            if (this.gccFlag && this.otherCurrencyFlag) {
              formGroup
                .get('gccAmountReceived')
                .patchValue(
                  parseFloat(data[key].amount).toFixed(this.twoDecimalval || this.twoDecimalval === undefined ? 2 : 3)
                );
              formGroup
                .get(key)
                .get('amount')
                .patchValue(parseFloat((Number(data[key].amount) * this.exchangeValue).toString()).toFixed(2));
            } else {
              formGroup.get(key).get('amount').patchValue(parseFloat(data[key].amount).toFixed(2));
            }
            formGroup.get(key).get('currency').patchValue(data[key].currency);
          } else if (key === 'bank') {
            if (data[key].country) {
              formGroup.get(key).get('country').patchValue(data[key].country);
            }
            if (data[key].name !== null) {
              formGroup.get(key).get('name').patchValue(data[key].name);
            }
            //Set flag based on bank type
            if (data[key].type.english === BankType.GCC_BANK && data[key].country !== null) {
              if (data.amountReceived.currency !== 'SAR') {
                this.isLocalBank = false;
              } else {
                this.isLocalBank = true;
              }

              this.gccBank.emit(data[key].country.english);
            } else if (data[key].type.english === BankType.INTERNATIONAL_BANK) {
              this.isInternationalBank = true;
              this.disableField(formGroup.get(key).get('name.english'));
            }
            formGroup.get(key).get('type').patchValue(data[key].type);
            //Enable other field on edit.
            if (data[key].nonListedBank !== null) {
              if (data[key].name !== null) {
                this.isOtherBank = true;
              }
              this.enableField(formGroup.get(key).get('nonListedBank'));
              formGroup.get(key).get('nonListedBank').patchValue(data[key].nonListedBank);
            }
          } else {
            formGroup.get(key).patchValue(data[key]);
          }
        }
      });
      if (data.penaltyIndicator !== null) {
        formGroup
          .get('penaltyIndicator')
          .setValue(
            data.penaltyIndicator.english === 'Yes' ? { english: 'Yes', arabic: '' } : { english: 'No', arabic: '' }
          );
      }
      // if(data.establishmentType !== null) {
      //   formGroup.get('establishmentType').setValue(data.establishmentType.english === 'GOSI' ? { english: 'GOSI', arabic: ''} : { english: 'PPA', arabic: '' });
      // }
    }
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }
  /**Method to handle the select event of bank tpe radio button. */
  selectBankType(bankType: string) {
    //Clear values on bank type change.
    this.disableField(this.paymentDetailsForm.get('bank.nonListedBank'));
    this.enableField(this.paymentDetailsForm.get('bank.name.english'));
    if (bankType === BankType.LOCAL_BANK) {
      this.isLocalBank = true;
      this.isInternationalBank = false;
      this.isOtherBank = false;
      this.paymentDetailsForm.get('bank.country.english').setValue(NationalityTypeEnum.SAUDI_NATIONAL);
      this.paymentDetailsForm.updateValueAndValidity();
    } else if (bankType === BankType.INTERNATIONAL_BANK) {
      this.isInternationalBank = true;
      this.isOtherBank = false;
      this.disableField(this.paymentDetailsForm.get('bank.name.english'));
      this.disableField(this.paymentDetailsForm.get('bank.name.arabic'));
      this.enableField(this.paymentDetailsForm.get('bank.nonListedBank'));
      this.paymentDetailsForm.get('bank.country').reset();
      this.paymentDetailsForm.get('amountReceived.amount').reset();
      this.paymentDetailsForm.get('gccAmountReceived').reset();
      this.currencyDetails.currencyCode.english = CurrencySar.ENGLISH;
      this.paymentDetailsForm.get('amountReceived.currency').setValue(CurrencySar.ENGLISH);
    } else {
      this.paymentDetailsForm.get('bank.country').reset();
      this.paymentDetailsForm.get('amountReceived.amount').reset();
      this.paymentDetailsForm.get('gccAmountReceived').reset();
      this.isInternationalBank = false;
      this.isLocalBank = false;
      this.isOtherBank = false;
    }
  }
  /***Method to handle the banklist based on country*/
  countryNameChange(countryName: string) {
    this.isLocalBank = countryName === NationalityTypeEnum.SAUDI_NATIONAL ? true : false;
    this.paymentDetailsForm.get('bank.name').reset();
    this.paymentDetailsForm.get('bank.nonListedBank').reset();
    this.paymentDetailsForm.get('amountReceived.amount').reset();
    this.paymentDetailsForm.get('amountReceived.currency').reset();
    this.paymentDetailsForm.get('gccAmountReceived').reset();
    this.isOtherBank = false;
    if (countryName) {
      this.countryChangeFlag = true;
      this.countryName = countryName;
      Object.keys(GccCountry).forEach(key => {
        if (GccCountry[key] === this.countryName) {
          this.gccBank.emit(this.countryName);
          if (this.gccFlag) {
            this.dateChange();
          }
          this.paymentDetailsForm.get('amountReceived.currency').patchValue(key);
        }
      });
    }
    if (countryName === NationalityTypeEnum.SAUDI_NATIONAL || !this.gccFlag || this.isInternationalBank) {
      this.paymentDetailsForm.get('amountReceived.currency').setValue(CurrencySar.ENGLISH);
    }
    if (countryName === NationalityTypeEnum.SAUDI_NATIONAL && this.gccFlag) {
      if (this.currencyDetails !== undefined) {
        this.currencyDetails.currencyCode = this.saudiCurrencyCode;
        this.currencyDetails.countryCode = this.saudiCountryCode;
      }
    }
  }
  dateChange() {
    if (this.paymentDetailsForm.get('transactionDate').get('gregorian').value) {
      const transactionDate = moment(this.paymentDetailsForm.get('transactionDate').get('gregorian').value).format(
        'YYYY-MM-DD'
      );
      const currentMonth = Object.values(Months)[moment(transactionDate).toDate().getMonth()];
      Object.keys(GccCountry).forEach(key => {
        if (GccCountry[key] === this.countryName && currentMonth === Months.january) {
          this.eventDate.emit({ transactionDate: transactionDate, countryName: key });
        } else if (GccCountry[key] === this.countryName) {
          if (this.gccFlag) {
            this.exchangeRate.emit({ transactionDate: transactionDate, countryName: key });
            this.paymentDetailsForm.get('amountReceived.currency').patchValue(key);
          }
        }
      });
    }
  }
  /** Method to change the number of decimal places based on country */
  setthreeDecimalval() {
    if (this.paymentDetailsForm?.get('bank')?.get('country')?.get('english').value === GccCountryEnum.BAHRAIN) {
      this.ThreeDecimal = true;
    } else if (this.paymentDetailsForm?.get('bank')?.get('country')?.get('english').value === GccCountryEnum.KUWAIT) {
      this.ThreeDecimal = true;
    } else if (this.paymentDetailsForm?.get('bank')?.get('country')?.get('english').value === GccCountryEnum.OMAN) {
      this.ThreeDecimal = true;
    } else {
      this.ThreeDecimal = false;
    }
  }
  /** Method to show and hide bank type field. */
  showBankType(): boolean {
    let flag = false;
    if (this.currentReceiptMode && this.mofFlag === false) {
      if (this.gccFlag === true) {
        if (this.currentReceiptMode === this.typeAccountTransfer) {
          flag = true;
        }
      } else {
        if (this.currentReceiptMode !== this.typeSAMAVoucher) {
          flag = true;
        }
      }
    }
    return flag;
  }
  // Method to emit filter details
  getBranchFilter(branchFilter: BranchFilter) {
    this.branchDetailsFilter.emit(branchFilter);
  }
  // Method to emit search details
  searchPaymentDetails(data: string) {
    this.search.emit(data);
  }
  searchOutsideBranches(registerNumber: string) {
    this.outSideBranchSearch.emit(registerNumber);
  }
  outSideBranchValidate(statusFlag: boolean) {
    this.validateOutsideBranch.emit(statusFlag);
  }
  getIndicator(evnt) {
    this.penalityIndicator.emit(evnt);
  }
  getEstablishmentType(type){
    this.estType.emit(type);
  }
}
