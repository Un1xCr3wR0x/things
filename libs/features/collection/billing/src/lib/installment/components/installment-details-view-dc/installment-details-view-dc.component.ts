/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { greaterThanValidator, LanguageToken, lessThanValidator, startOfDay, startOfMonth } from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { OutOfMarketStatus } from '../../../shared/enums/out-of-market-status';
import { InstallmentPeriodDetails, InstallmentRequest, InstallmentDetails } from '../../../shared/models';
import { InstallmentDetailsViewBaseDc } from './installment-details-view-base-dc';
declare const require;
@Component({
  selector: 'blg-installment-details-view-dc',
  templateUrl: './installment-details-view-dc.component.html',
  styleUrls: ['./installment-details-view-dc.component.scss']
})
export class InstallmentDetailsViewDcComponent extends InstallmentDetailsViewBaseDc implements OnInit, OnChanges {
  protected monthData = require('../../../shared/data/month.json');
  /**Input values */
  @Input() installmentDetails: InstallmentDetails = new InstallmentDetails();
  @Input() downPayment = 0;
  @Input() installmentRequest: InstallmentRequest;
  @Input() inWorkflow: boolean;
  @Input() isdownPayment: boolean;
  @Input() isdownPaymentEnabled: boolean;
  @Input() isGuaranteeSelected: boolean;
  @Input() isGuaranteeDisable: boolean;
  @Input() installmentType: string;
  @Input() amount? = 0;
  @Input() installmentAmount?: number;
  @Input() modifiedInstallmentDetails;
  @Input() isOwnerOnJob: boolean;
  @Input() isAppPublic: boolean;
  @Input() isDisabled: boolean;
  /**output Variable */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() save: EventEmitter<InstallmentPeriodDetails> = new EventEmitter();
  @Output() currentInstallmentDetails: EventEmitter<Object> = new EventEmitter();

  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.installmentType?.currentValue) {
      this.installmentType = changes.installmentType.currentValue;
    }
    if (changes && changes?.modifiedInstallmentDetails?.currentValue) {
      if (
        this.modifiedInstallmentDetails?.modifiedAmount !== 0 &&
        this.modifiedInstallmentDetails?.modifiedPeriod !== 0
      ) {
        if (this.currentInstallmentAmount % 1 === 0) this.installmentPeriodDateCalculator(true);
        else this.installmentPeriodDateCalculator(false);
        this.setModifiedInstallmentDetails();
        this.isInstallmentModified = true;
      }
      this.intialLoadValueSetter();
    }
    if (changes && changes?.isdownPaymentEnabled)
      this.isdownPayment = this.isdownPaymentEnabled = changes.isdownPaymentEnabled.currentValue;
    if (changes && changes?.installmentDetails?.currentValue) {
      this.installmentDetails = changes.installmentDetails.currentValue;
      this.installmentDetails?.installmentPlan?.forEach(res => {
        res.guaranteeDetail.forEach(val => {
          val.terms.forEach(evn => {
            this.maxInstallmentPeriod = evn?.maxInstallmentPeriodInMonths;
            this.maxExceptionInstallment = evn?.maxInstallmentPeriodMonthsAfterException;
            this.eligibleForIncreasingMaxInstallPeriod = evn?.eligibleForIncreasingMaxInstallPeriod;
            this.dueAmount = this.installmentDetails.dueAmount.total;
            if (evn.downPaymentRequired) this.isdownPayment = true;
            if (!this.isdownPayment) this.downPaymentAmount = this.downPayment;
            else this.downPaymentAmount = (this.dueAmount * evn.additionalGuarantee.guaranteePercentage) / 100;
            this.isModify = this.isGuaranteeDisable ? true : false;
          });
        });
      });
      if (this.isdownPaymentEnabled) this.downPaymentAmount = this.downPayment;
      this.intialLoadValueSetter();
      this.installmentPeriodDateCalculator(false);
      this.calculateInstallmentAmount();
    }
    if (changes && changes?.installmentRequest?.currentValue) {
      if (!this.isGuaranteeSelected && this.inWorkflow) {
        this.isModify = this.isGuaranteeDisable ? true : false;
        this.intialLoadValueSetter();
        this.installmentPeriodDateCalculator(false);
        this.calculateInstallmentAmount();
      }
    }
  }
  setModifiedInstallmentDetails() {
    this.installmentValue = this.lastPaidAmount = this.currentInstallmentAmount = Number(
      this.modifiedInstallmentDetails?.modifiedAmount
    );
    if (this.totalInstallmentAmount % this.installmentValue !== 0)
      this.noOfRecords = this.currentInstallmentNumber = this.installmentNumber =
        Math.floor(this.totalInstallmentAmount / this.installmentValue);
    else
      this.noOfRecords = this.currentInstallmentNumber = this.installmentNumber =
        this.totalInstallmentAmount / this.installmentValue;
  } /*** Method to initialise tasks*/
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
      this.setStartEndDate();
    });
    this.intialLoadValueSetter();
    this.installmentPeriodDateCalculator(false);
    if (this.isMinimumInstallment) {
      this.calculateInstallmentAmount();
      this.installmentPeriodDateCalculator(true);
      this.modifyInstallmentForm.get('installmentAmount').setValue(this.minInstallmentAmount);
    }
  } /*** Method to initialise the installment values*/
  intialLoadValueSetter() {
    if (this.installmentType === 'Bank Guarantee' || this.installmentType === 'Promissory Note') {
      if (this.downPayment) {
        this.totalInstallmentAmount =
          this.installmentDetails?.dueAmount?.total - this.roundDecimalValue(this.downPayment);
      } else this.totalInstallmentAmount = this.installmentDetails?.dueAmount?.total;
      if (!this.isInstallmentModified) {
        if (
          this.totalInstallmentAmount /
            this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.maxInstallmentPeriodInMonths <
          this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount
        ) {
          this.currentInstallmentNumber = this.noOfRecords = Math.floor(
            this.totalInstallmentAmount /
              this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount
          );
        } else
          this.noOfRecords = this.currentInstallmentNumber = this.inWorkflow
            ? this.installmentRequest?.installmentPeriodInMonths
            : this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.maxInstallmentPeriodInMonths;
        this.currentInstallmentAmount = this.roundDecimalValue(
          this.totalInstallmentAmount / this.currentInstallmentNumber
        );
      } else this.setModifiedInstallmentDetails();
      this.setModifiyInstallment();
    } else if (this.installmentType === 'Other') {
      this.setOtherDataFromCsrView();
    } else if (this.installmentType === 'Pension') {
      this.setPension();
    }
  }
  setModifiyInstallment() {
    this.modifyInstallmentForm = this.createInstallmentForm();
    this.modifyInstallmentForm.get('installmentAmount').setValue(this.installmentValue);
    this.modifyInstallmentForm.get('installmentNumber').setValue(this.installmentNumber);
  }
  setOtherDataFromCsrView() {
    if (this.downPayment) {
      this.totalInstallmentAmount =
        this.installmentDetails?.dueAmount?.total - this.roundDecimalValue(this.downPayment);
    } else this.totalInstallmentAmount = this.installmentDetails?.dueAmount?.total;
    if (!this.isInstallmentModified) {
      if (
        this.isOwnerOnJob ||
        this.installmentRequest?.guaranteeDetail[0]?.type?.english === OutOfMarketStatus.DECEASED_NO_INCOME
      ) {
        this.installmentValue = this.minInstalmentValidatorAmount = this.currentInstallmentAmount = this.installmentAmount;
        if (this.totalInstallmentAmount % this.installmentValue !== 0)
          this.currentInstallmentNumber = this.noOfRecords = this.installmentNumber =
            Math.floor(this.totalInstallmentAmount / this.installmentValue) + 1;
        else
          this.noOfRecords = this.currentInstallmentNumber = this.installmentNumber =
            this.totalInstallmentAmount / this.installmentValue;
        this.setModifyInstallmentValidation();
      } else {
        if (
          this.totalInstallmentAmount /
            this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.maxInstallmentPeriodInMonths <
          this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount
        ) {
          this.installmentAmount = this.currentInstallmentAmount = this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount;
          this.noOfRecords = this.installmentNumber = this.currentInstallmentNumber = Math.round(
            this.totalInstallmentAmount / this.currentInstallmentAmount
          );
        } else {
          this.noOfRecords = this.currentInstallmentNumber = this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.maxInstallmentPeriodInMonths;
          this.currentInstallmentAmount = this.roundDecimalValue(
            this.totalInstallmentAmount / this.currentInstallmentNumber
          );
        }
        this.minInstalmentValidatorAmount = this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.minMonthlyInstallmentAmount;
        this.maxInstallmentPeriod =
          this.currentInstallmentNumber > 30
            ? this.currentInstallmentNumber
            : this.installmentDetails?.installmentPlan[0]?.guaranteeDetail[0]?.terms[0]?.maxInstallmentPeriodInMonths;
        this.setModifiyInstallment();
      }
    } else {
      this.setModifiedInstallmentDetails();
      if (this.isOwnerOnJob) this.setModifyInstallmentValidation();
    }
  } //set pension details
  setPension() {
    this.setPensionDataFromCsrView();
    this.setModifyInstallmentValidation();
  }
  setPensionDataFromCsrView() {
    if (this.downPayment) {
      this.totalInstallmentAmount =
        this.installmentDetails?.dueAmount?.total - this.roundDecimalValue(this.downPayment);
    } else this.totalInstallmentAmount = this.installmentDetails?.dueAmount?.total;
    if (!this.isInstallmentModified) {
      this.installmentValue = this.minInstalmentValidatorAmount = this.currentInstallmentAmount = this.installmentAmount;
      if (this.totalInstallmentAmount % this.installmentValue !== 0)
        this.currentInstallmentNumber = this.noOfRecords = this.installmentNumber =
          Math.floor(this.totalInstallmentAmount / this.installmentValue) + 1;
      else
        this.noOfRecords = this.currentInstallmentNumber = this.installmentNumber =
          this.totalInstallmentAmount / this.installmentValue;
    } else this.setModifiedInstallmentDetails();
  }
  setModifyInstallmentValidation() {
    if (this.installmentRequest?.guaranteeDetail[0]?.type?.english === OutOfMarketStatus.DECEASED_NO_INCOME) {
      this.maxExceptionInstallment = this.maxInstallmentPeriod = 30;
      this.modifyInstallmentForm = this.createInstallmentForm();
      this.modifyInstallmentForm
        .get('installmentAmount')
        .setValidators(
          Validators.compose([
            greaterThanValidator(500),
            lessThanValidator(this.totalInstallmentAmount),
            Validators.required
          ])
        );
    } else {
      const maxInstallment =
        this.totalInstallmentAmount % (Math.round((Number((this.amount * 25) / 100) + Number.EPSILON) * 100) / 100) !==
        0
          ? Math.floor(
              this.totalInstallmentAmount /
                (Math.round((Number((this.amount * 25) / 100) + Number.EPSILON) * 100) / 100)
            ) + 1
          : this.totalInstallmentAmount / (Math.round((Number((this.amount * 25) / 100) + Number.EPSILON) * 100) / 100);

      if (
        Math.round((Number((this.amount * 25) / 100) + Number.EPSILON) * 100) / 100 === this.installmentAmount &&
        maxInstallment < 30
      )
        this.maxExceptionInstallment = this.maxInstallmentPeriod = maxInstallment;
      else this.maxExceptionInstallment = this.maxInstallmentPeriod = maxInstallment > 30 ? maxInstallment : 30;

      this.modifyInstallmentForm = this.createInstallmentForm();
      this.modifyInstallmentForm
        .get('installmentAmount')
        .setValidators(
          Validators.compose([
            greaterThanValidator(Math.round((Number((this.amount * 25) / 100) + Number.EPSILON) * 100) / 100),
            lessThanValidator(this.amount),
            Validators.required
          ])
        );
    }
    this.modifyInstallmentForm.get('installmentAmount').setValue(this.currentInstallmentAmount);
    this.modifyInstallmentForm.get('installmentNumber').setValue(this.currentInstallmentNumber);
    this.modifyInstallmentForm.updateValueAndValidity();
  } /**Calculate instalment number on installment amount change */
  calculateInstallmentNumber() {
    if (Number(this.modifyInstallmentForm.get('installmentAmount').value) !== this.installmentValue) {
      if (this.totalInstallmentAmount % Number(this.modifyInstallmentForm.get('installmentAmount').value))
        this.installmentNumber =
          Math.floor(this.totalInstallmentAmount / Number(this.modifyInstallmentForm.get('installmentAmount').value)) +
          1;
      else this.installmentNumber = this.currentInstallmentNumber = this.totalInstallmentAmount / this.installmentValue;
      this.modifyInstallmentForm.get('installmentNumber').setValue(Number(this.installmentNumber));
      this.modifyInstallmentForm.get('installmentNumber').markAsTouched();
      this.isValid = this.checkFormValidity(this.modifyInstallmentForm) ? false : true;
    }
  } /**Calculate instament amount on installment number change */
  calculateInstallmentAmount() {
    if (Number(this.modifyInstallmentForm.get('installmentNumber').value) !== this.installmentNumber) {
      this.installmentValue =
        this.roundDecimalValue(this.totalInstallmentAmount) /
        this.roundDecimalValue(Number(this.modifyInstallmentForm.get('installmentNumber').value));
      this.installmentValue = this.roundDecimalValue(this.installmentValue);
      if (!this.isMinimumInstallment) this.checkMinimumInstallment();
      this.modifyInstallmentForm.get('installmentAmount').setValue(Number(this.installmentValue));
      this.modifyInstallmentForm.get('installmentAmount').updateValueAndValidity();
      this.modifyInstallmentForm.get('installmentAmount').markAsTouched();
      this.isValid = this.checkFormValidity(this.modifyInstallmentForm) ? false : true;
    }
  }
  checkMinimumInstallment() {
    if (this.installmentRequest) {
      if (this.installmentValue < 2000) {
        this.installmentValue = this.currentInstallmentAmount = this.minimumInstallment = this.installmentRequest?.schedule[0]?.monthlyInstallmentAmount;
        this.lastPaidAmount =
          this.totalInstallmentAmount -
          this.installmentRequest?.monthlyInstallmentAmount * (this.installmentNumber - 1);
        this.lastPaidAmount = this.roundDecimalValue(this.lastPaidAmount);
        this.isMinimumInstallment = true;
      }
    }
  }
  applyModifiyChanges() {
    if (this.checkFormValidity(this.modifyInstallmentForm)) {
      this.modalRef.hide();
      this.pageDetails.currentPage = this.currentPage = 1;
      if (!this.isMinimumInstallment) this.checkMinimumInstallment();
      this.currentInstallmentAmount = this.modifyInstallmentForm.get('installmentAmount').value;
      this.currentInstallmentNumber = this.noOfRecords = this.modifyInstallmentForm.get('installmentNumber').value;
      this.isInstallmentModified = true;
      this.currentInstallmentDetails.emit({
        modifiedAmount: this.currentInstallmentAmount,
        modifiedPeriod: this.currentInstallmentNumber
      });
      if (this.currentInstallmentAmount % 1 === 0) this.installmentPeriodDateCalculator(true);
      else this.installmentPeriodDateCalculator(false);
    } else this.isValid = true;
  } //  Method to check form validity */
  checkFormValidity(form: AbstractControl) {
    if (form) return form.valid;
    return false;
  }
  installmentPeriodDateCalculator(isAmountChange: boolean) {
    let data, amount, month, year, temp;
    this.installmentTableDetails = [];
    let periodDate = this.inWorkflow
      ? moment(startOfDay(this.installmentRequest?.startDate.gregorian)).add(1, 'month').toDate()
      : moment(new Date()).add(2, 'month');
    month = moment(periodDate).toDate().getMonth();
    if (month === 0) {
      month = 12;
      periodDate = moment(new Date()).add(1, 'month');
    }
    year = moment(periodDate).toDate().getFullYear();
    for (let i = 1; i <= this.currentInstallmentNumber; ++i) {
      data = this.monthData?.months.filter(item => item.index === month);
      if (isAmountChange && this.totalInstallmentAmount % this.currentInstallmentNumber !== 0) {
        if (i === this.currentInstallmentNumber) {
          temp =
            this.currentInstallmentAmount * Math.floor(this.totalInstallmentAmount / this.currentInstallmentAmount);
          amount = this.roundDecimalValue(this.totalInstallmentAmount - temp);
        } else amount = this.currentInstallmentAmount;
      } else if (isAmountChange && this.totalInstallmentAmount % Math.floor(this.currentInstallmentAmount) !== 0) {
        if (i === this.currentInstallmentNumber) {
          temp =
            this.currentInstallmentAmount * Math.floor(this.totalInstallmentAmount / this.currentInstallmentAmount);
          amount = this.roundDecimalValue(this.totalInstallmentAmount - temp);
        } else amount = this.currentInstallmentAmount;
      } else if (!isAmountChange && this.totalInstallmentAmount % this.currentInstallmentAmount !== 0) {
        if (i === this.currentInstallmentNumber) {
          temp = this.currentInstallmentAmount * (this.currentInstallmentNumber - 1);
          amount = this.roundDecimalValue(this.totalInstallmentAmount - temp);
        } else amount = this.currentInstallmentAmount;
      } else amount = this.currentInstallmentAmount;
      this.installmentTableDetails.push({
        sequence: i,
        month: {
          english: data[0].english,
          arabic: data[0].arabic
        },
        date: startOfMonth(moment(new Date(year + '-' + month + '-' + 1)).toDate()),
        year: year,
        amount: amount
      });
      month = ++month;
      if (month > 12) {
        month = 1;
        year = ++year;
      }
    }
    this.lastPaidAmount = this.installmentTableDetails[this.installmentTableDetails.length - 1]?.amount;
    this.lastPaidAmount = this.roundDecimalValue(this.lastPaidAmount);
    this.setStartEndDate();
  }
  setStartEndDate() {
    this.startDate =
      (this.lang === 'en'
        ? this.installmentTableDetails[0]?.month.english
        : this.installmentTableDetails[0]?.month.arabic) +
      ' ' +
      this.installmentTableDetails[0]?.year;
    this.endDate =
      (this.lang === 'en'
        ? this.installmentTableDetails[this.installmentTableDetails.length - 1]?.month.english
        : this.installmentTableDetails[this.installmentTableDetails.length - 1]?.month.arabic) +
      ' ' +
      this.installmentTableDetails[this.installmentTableDetails.length - 1]?.year;
  } /*** This method is to show the modal reference.*/
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modifyInstallmentForm.get('installmentAmount').setValue(this.currentInstallmentAmount);
    this.modifyInstallmentForm.get('installmentNumber').setValue(this.currentInstallmentNumber);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  } /** This method is to hide the modal reference. */
  hideModal() {
    //this.intialLoadValueSetter();
    this.modifyInstallmentForm.get('installmentAmount').setValue(this.currentInstallmentAmount);
    this.modifyInstallmentForm.get('installmentNumber').setValue(this.currentInstallmentNumber);
    this.modalRef.hide();
  }
  createInstallmentForm() {
    return this.fb.group({
      installmentAmount: [
        this.installmentValue,
        {
          validators: Validators.compose([
            greaterThanValidator(500),
            Validators.max(this.totalInstallmentAmount - 1),
            Validators.required
          ])
        }
      ],
      installmentNumber: [
        this.installmentNumber,
        {
          validators: Validators.compose([
            greaterThanValidator(this.checkModifyGreaterValidity()),
            lessThanValidator(this.checkModifyLessthanValidity()),
            Validators.required
          ])
        }
      ]
    });
  } //Method to check less than valdiator
  checkModifyLessthanValidity() {
    if (this.eligibleForIncreasingMaxInstallPeriod) return this.maxExceptionInstallment;
    else return this.maxInstallmentPeriod;
  } //Method to check greater than valdiator
  checkModifyGreaterValidity() {
    return 2;
  } /*** Methpd to selct corresponding page*/
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  } /** Method to navigate to prevous section. */
  cancelButtonModal() {
    if (this.modalRefs) this.modalRefs.hide();
    this.cancel.emit();
  } //Method to hide modal
  decline() {
    if (this.modalRefs) this.modalRefs.hide();
  } /*** Method to save installment details*/
  saveandNext() {
    this.detailsToSave.lastInstallmentAmount = this.lastPaidAmount;
    this.detailsToSave.periodOfInstallment = this.currentInstallmentNumber;
    this.detailsToSave.startDate = moment(this.installmentTableDetails[0]?.date).toDate();
    if (this.installmentTableDetails && this.installmentTableDetails[this.installmentTableDetails.length - 1])
      this.detailsToSave.endDate = this.installmentTableDetails[this.installmentTableDetails.length - 1].date;
    this.detailsToSave.monthlyInstallmentAmount = this.currentInstallmentAmount;
    this.save.emit(this.detailsToSave);
  } /*** Method to show a confirmation popup for reseting the form.**/
  popUpModal(template: TemplateRef<HTMLElement>) {
    this.modalRefs = this.modalService.show(template);
  }
  roundDecimalValue(data: number) {
    return Math.round((Number(data) + Number.EPSILON) * 100) / 100;
  } /** Method to navigate to prevous section. */
  previousSection() {
    this.previous.emit();
  }
}
