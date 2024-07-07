/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, lessThanValidator, greaterThanValidator } from '@gosi-ui/core';
import moment from 'moment-timezone';
import {
  Adjustment,
  AdjustmentConstants,
  BenefitDetails,
  CountinuesDeductionTypeEnum,
  DeductionTypeEnum,
  MonthlyDeductionEligibility,
  RequestType
} from '@gosi-ui/features/payment/lib/shared';
import { InputNumberDcComponent, InputTextDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'pmt-choose-countinues-deduction-dc',
  templateUrl: './choose-countinues-deduction-dc.component.html',
  styleUrls: ['./choose-countinues-deduction-dc.component.scss']
})
export class ChooseCountinuesDeductionDcComponent implements OnInit, OnChanges {
  // Input  variables
  @Input() continousDeduction: LovList;
  @Input() adjustmentReasonList: LovList;
  @Input() requestByList: LovList;
  @Input() parentForm: FormGroup;
  @Input() percentageList: LovList;
  @Input() cityList: LovList;
  @Input() adjustmentValues: Adjustment;
  @Input() monthlyAdjustmentLimit: number;
  @Input() selectedBenefit: BenefitDetails;
  @Input() monthlyDeductionEligibility: MonthlyDeductionEligibility;
  @Input() hasOtherAdjustments: boolean;
  @Input() netMonthlyDeductionAmount: number;
  @Input() benefitAmount: number;
  @Input() savedMonthlyDeductionAmount = 0;
  // output variables
  @Output() adjustmentReasonKey: EventEmitter<string> = new EventEmitter();

  @ViewChild('monthyDeductionAmount', { static: false }) monthyDeductionAmountInput: InputNumberDcComponent;
  @ViewChild('monthlyDeductionPercentageAmount', { static: false })
  monthlyDeductionPercentageAmountInput: InputTextDcComponent;
  // Local Variables
  showCaseFiledsFlag: boolean;
  selectedDeductionType = DeductionTypeEnum.AMOUNT;
  isRequestedByOther = false;
  deduction: boolean;
  showCityFlag = false;
  continousDeductionForm: FormGroup;
  checkForm: FormGroup;
  percentageContinousDeductionForm: FormGroup;
  deductionPercentageList = [];
  continuosDeductionList = [];
  requestedList = [];
  deductionTypePercentage = DeductionTypeEnum.PERCENTAGE;
  deductionTypeAmount = DeductionTypeEnum.AMOUNT;
  CountinuesTypeYes = CountinuesDeductionTypeEnum.YES;
  CountinuesTypeNo = CountinuesDeductionTypeEnum.NO;
  isPresetActive: boolean;
  showDeductionpercentageWarning: boolean;
  warningPercentage: number;
  minBasicBenefitAmount: number;
  showBasicBenefitWarning: boolean;
  maxDate: Date;
  separatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;

  constructor(private fb: FormBuilder) {
    this.continousDeductionForm = this.createContinousDeductionForm();
  }

  // Method to initialise the component
  ngOnInit(): void {
    this.maxDate = moment(new Date()).toDate();
    if (!this.parentForm?.get('continousDeductionForm')) {
      this.parentForm?.addControl('continousDeductionForm', this.continousDeductionForm);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedBenefit?.currentValue) {
      this.findDeductionAmount();
    }
    if (changes?.monthlyAdjustmentLimit?.currentValue) {
      this.deductionTypeChange(this.selectedDeductionType);
    }
    if (changes?.adjustmentReasonList?.currentValue && this.isPresetActive) {
      setTimeout(() => {
        this.continousDeductionForm?.get('adjustmentReason')?.setValue(this.adjustmentValues?.adjustmentReason);
        this.isPresetActive = false; // To check whether its for initial loading or not
      }, 500);
    }

    if (
      changes?.adjustmentValues?.currentValue ||
      changes?.continousDeduction?.currentValue ||
      changes?.requestByList?.currentValue ||
      changes?.percentageList?.currentValue
    ) {
      this.preSetForm();
    }
  }

  preSetForm() {
    if (this.adjustmentValues && this.continousDeduction && this.requestByList && this.percentageList) {
      this.continousDeductionForm?.get('requestedBy')?.setValue(this.adjustmentValues?.requestedBy);
      this.fetchAdjustmentReason(this.adjustmentValues?.requestedBy?.english, true);
      this.isPresetActive = true;

      if (this.adjustmentValues.continuousDeduction) {
        this.continousDeductionForm
          ?.get('continuousDeduction')
          ?.setValue(
            this.continousDeduction?.items?.find(lov => lov?.value?.english === this.CountinuesTypeYes)?.value
          );
      } else {
        this.continousDeductionForm?.get('adjustmentAmount')?.setValue(this.adjustmentValues?.adjustmentAmount);
        this.continousDeductionForm
          ?.get('continuousDeduction')
          ?.setValue(this.continousDeduction?.items?.find(lov => lov?.value?.english === this.CountinuesTypeNo)?.value);
      }
      this.onSelectCountinuesDeductionType();

      if (this.adjustmentValues?.monthlyDeductionAmount) {
        this.continousDeductionForm
          .get('monthlyDeductionAmount')
          .setValue(this.adjustmentValues?.monthlyDeductionAmount);
      } else if (this.adjustmentValues?.adjustmentPercentage) {
        this.deductionTypeChange(this.deductionTypePercentage);
        this.continousDeductionForm
          .get('adjustmentPercentage')
          .setValue(
            this.percentageList?.items?.find(
              lov => lov?.value?.english === this.adjustmentValues?.adjustmentPercentage.toString()
            )?.value
          );
        this.findDeductionAmount();
      }
      if (this.adjustmentValues?.caseDate?.gregorian) {
        this.continousDeductionForm
          .get('caseDate.gregorian')
          .setValue(moment(this.adjustmentValues?.caseDate?.gregorian).toDate());
      }
      if (this.adjustmentValues?.city) {
        this.continousDeductionForm.get('city').setValue(this.adjustmentValues?.city);
      }
      this.continousDeductionForm.get('notes').setValue(this.adjustmentValues?.notes);
      this.continousDeductionForm.get('caseNumber').setValue(this.adjustmentValues?.caseNumber);
      this.continousDeductionForm.get('holdAdjustment').setValue(this.adjustmentValues?.holdAdjustment);
      this.holdAdjustmentChange(this.adjustmentValues?.holdAdjustment?.toString());
    }
  }

  // Method to create continous deduction form data
  createContinousDeductionForm() {
    return this.fb.group({
      continuousDeduction: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: null
      }),
      adjustmentAmount: [null],
      monthlyDeductionAmount: [null, { validators: Validators.required }],
      monthlyDeductionPercentageAmount: [null],
      adjustmentReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      notes: [null, { validators: Validators.required }],
      requestedBy: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      deductionType: [null],
      adjustmentPercentage: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      caseNumber: [null],
      caseDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      city: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      holdAdjustment: [false]
    });
  }

  // Method used to get selected toggler value
  deductionTypeChange(deductionType: DeductionTypeEnum, isUserAction = false) {
    this.selectedDeductionType = deductionType;
    if (isUserAction) {
      this.showDeductionpercentageWarning = false;
      this.continousDeductionForm.get('adjustmentPercentage').reset();
      this.continousDeductionForm.get('monthlyDeductionAmount').reset();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount').reset();
    }
    this.continousDeductionForm?.get('deductionType')?.setValue(deductionType);
    this.deduction = this.selectedDeductionType === this.deductionTypeAmount;
    const benefitAmountAfterDeduction =
      this.benefitAmount - this.netMonthlyDeductionAmount + this.savedMonthlyDeductionAmount;
    const monthlyAdjustmentLimit: number =
      this.continousDeductionForm.get('adjustmentAmount').value &&
      parseFloat(this.continousDeductionForm.get('adjustmentAmount').value) < benefitAmountAfterDeduction
        ? parseFloat(this.continousDeductionForm.get('adjustmentAmount').value)
        : benefitAmountAfterDeduction;
    if (this.selectedDeductionType === this.deductionTypePercentage) {
      this.continousDeductionForm.get('adjustmentPercentage')?.get('english')?.setValidators([Validators.required]);
      this.continousDeductionForm
        .get('monthlyDeductionPercentageAmount')
        ?.setValidators([
          Validators.required,
          lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
          greaterThanValidator(0)
        ]);
      this.continousDeductionForm.get('monthlyDeductionAmount')?.clearValidators();
    } else {
      this.continousDeductionForm.get('adjustmentPercentage')?.get('english')?.clearValidators();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.clearValidators();
      this.continousDeductionForm
        .get('monthlyDeductionAmount')
        ?.setValidators([
          Validators.required,
          lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
          greaterThanValidator(0)
        ]);
    }
    this.continousDeductionForm?.get('adjustmentPercentage')?.get('english').updateValueAndValidity();
    this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.updateValueAndValidity();
    this.continousDeductionForm.get('monthlyDeductionAmount')?.updateValueAndValidity();
    this.monthyDeductionAmountInput?.setErrorMsgs(this.continousDeductionForm.get('monthlyDeductionAmount'));
    if (this.continousDeductionForm.get('monthlyDeductionPercentageAmount').value) {
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount').markAsTouched();
    }
    this.monthlyDeductionPercentageAmountInput?.setErrorMsgs(
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')
    );
  }

  // Method to calculate monthly deduction amount
  findDeductionAmount() {
    const percentage = +this.continousDeductionForm.get('adjustmentPercentage')?.get('english').value;
    this.continousDeductionForm.get('monthlyDeductionPercentageAmount').setValue(null);
    if (percentage && this.selectedBenefit?.benefitAmount) {
      const deductionAmount = (percentage * this.selectedBenefit.benefitAmount) / 100;
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount').setValue(deductionAmount.toFixed(2));
    }
    this.checkDeductionWarning();
    this.deductionTypeChange(this.selectedDeductionType); //To update the validation
  }

  // Method to get requested by value
  fetchAdjustmentReason(requestedBy: string, isPresetActive = false) {
    if (!isPresetActive) {
      this.continousDeductionForm.get('caseDate').reset();
      this.continousDeductionForm.get('caseNumber').reset();
      this.continousDeductionForm.get('city').reset();
    }
    this.continousDeductionForm.get('adjustmentReason.english').reset();
    this.adjustmentReasonList = new LovList([]);
    this.adjustmentReasonKey.emit(requestedBy);
    this.checkDeductionWarning();
    this.showCaseFieleds(requestedBy === RequestType.TPA_MINISTRY_OF_JUSTICE_REASON);
    this.showCityFieled(requestedBy !== RequestType.TPA_OTHER_REASON);
  }

  /**
   * Method to show the case related fileds
   * @param showFlag
   */
  showCaseFieleds(showFlag: boolean) {
    this.showCaseFiledsFlag = showFlag;
    if (showFlag) {
      this.continousDeductionForm.get('caseDate')?.get('gregorian')?.setValidators([Validators.required]);
      this.continousDeductionForm.get('caseNumber')?.setValidators([Validators.required]);
    } else {
      this.continousDeductionForm.get('caseDate')?.get('gregorian')?.clearValidators();
      this.continousDeductionForm.get('caseNumber')?.clearValidators();
    }
    this.continousDeductionForm.get('caseDate')?.get('gregorian')?.updateValueAndValidity();
    this.continousDeductionForm.get('caseNumber')?.updateValueAndValidity();
  }

  checkDeductionWarning() {
    const requestedBy = this.continousDeductionForm.get('requestedBy')?.get('english')?.value;
    const monthlyDeductionPercentageAmount = +this.continousDeductionForm.get('monthlyDeductionPercentageAmount')
      ?.value;
    const monthlyDeductionAmount = +this.continousDeductionForm.get('monthlyDeductionAmount')?.value;

    /*basic benfit warning eligibility check */
    if (
      requestedBy &&
      requestedBy === RequestType.TPA_REAL_ESTATE_DEVELOPMENT_REASON &&
      this.monthlyDeductionEligibility
    ) {
      this.showBasicBenefitWarning =
        this.selectedBenefit?.basicBenefitAmount < this.monthlyDeductionEligibility?.minBasicBenefitAmount;
      this.minBasicBenefitAmount = this.monthlyDeductionEligibility?.minBasicBenefitAmount;
    } else {
      this.showBasicBenefitWarning = false;
    }

    /*monthly deduction limit check */
    if (
      this.selectedDeductionType &&
      ((this.selectedDeductionType === DeductionTypeEnum.PERCENTAGE && monthlyDeductionPercentageAmount) ||
        (this.selectedDeductionType === DeductionTypeEnum.AMOUNT && monthlyDeductionAmount))
    ) {
      const deductionAmount =
        this.selectedDeductionType === DeductionTypeEnum.AMOUNT
          ? monthlyDeductionAmount
          : monthlyDeductionPercentageAmount;
      if (
        requestedBy &&
        requestedBy === RequestType.TPA_REAL_ESTATE_DEVELOPMENT_REASON &&
        this.monthlyDeductionEligibility &&
        this.selectedBenefit?.benefitAmount
      ) {
        const warningPercentage = this.hasOtherAdjustments
          ? this.monthlyDeductionEligibility?.deductionPercentageForMultipleAdjustment
          : this.monthlyDeductionEligibility?.deductionPercentageForSingleAdjustment;

        this.warningPercentage =
          deductionAmount + Math.abs(this.selectedBenefit?.deductionAmount) > this.selectedBenefit?.benefitAmount
            ? 100
            : warningPercentage;

        this.showDeductionpercentageWarning =
          deductionAmount + Math.abs(this.selectedBenefit?.deductionAmount) >
          this.selectedBenefit?.benefitAmount * (warningPercentage / 100)
            ? true
            : false;
      } else {
        this.warningPercentage =
          deductionAmount + Math.abs(this.selectedBenefit?.deductionAmount) > this.selectedBenefit?.benefitAmount
            ? 100
            : AdjustmentConstants.MONTHLY_TPA_ADJUSTMENT_DEDUCTION_PERCENATGE_LIMIT;
        this.showDeductionpercentageWarning =
          deductionAmount + Math.abs(this.selectedBenefit?.deductionAmount) >
          this.selectedBenefit?.benefitAmount *
            (AdjustmentConstants.MONTHLY_TPA_ADJUSTMENT_DEDUCTION_PERCENATGE_LIMIT / 100)
            ? true
            : false;
      }
    } else {
      this.showDeductionpercentageWarning = false;
    }
  }

  /**
   * Method to show the cilty field
   * @param showFlag
   */
  showCityFieled(showFlag: boolean) {
    this.showCityFlag = showFlag;
    if (showFlag) {
      this.continousDeductionForm.get('city')?.get('english')?.setValidators([Validators.required]);
    } else {
      this.continousDeductionForm.get('city')?.get('english')?.clearValidators();
    }
    this.continousDeductionForm.get('city')?.get('english')?.updateValueAndValidity();
  }

  /**
   * method to handle the countinues payment change
   */
  onSelectCountinuesDeductionType(isUserAction = false) {
    if (isUserAction) {
      this.showDeductionpercentageWarning = false;
      this.continousDeductionForm.get('adjustmentPercentage').reset();
      this.continousDeductionForm.get('adjustmentAmount').reset();
      this.continousDeductionForm.get('monthlyDeductionAmount').reset();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount').reset();
    }

    if (this.continousDeductionForm.get('continuousDeduction')?.get('english').value === this.CountinuesTypeNo) {
      this.continousDeductionForm.get('adjustmentAmount').setValidators([Validators.required]);
      this.deductionTypeChange(this.selectedDeductionType); //To update the validation
    } else {
      this.continousDeductionForm.get('adjustmentAmount').clearValidators();
      this.continousDeductionForm.get('adjustmentPercentage')?.get('english')?.clearValidators();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.clearValidators();
      const benefitAmountAfterDeduction =
        this.benefitAmount - this.netMonthlyDeductionAmount + this.savedMonthlyDeductionAmount;
      const monthlyAdjustmentLimit: number =
        this.continousDeductionForm.get('adjustmentAmount').value &&
        parseFloat(this.continousDeductionForm.get('adjustmentAmount').value) < benefitAmountAfterDeduction
          ? parseFloat(this.continousDeductionForm.get('adjustmentAmount').value)
          : benefitAmountAfterDeduction;
      this.continousDeductionForm
        .get('monthlyDeductionAmount')
        ?.setValidators([
          Validators.required,
          lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
          greaterThanValidator(0)
        ]);
    }
    this.continousDeductionForm.get('adjustmentAmount').updateValueAndValidity();
    this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.updateValueAndValidity();
    this.continousDeductionForm.get('adjustmentPercentage')?.get('english')?.updateValueAndValidity();
    this.continousDeductionForm.get('monthlyDeductionAmount')?.updateValueAndValidity();
    this.monthyDeductionAmountInput?.setErrorMsgs(this.continousDeductionForm.get('monthlyDeductionAmount'));
    if (this.continousDeductionForm.get('monthlyDeductionPercentageAmount').value) {
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount').markAsTouched();
    }
    this.monthlyDeductionPercentageAmountInput?.setErrorMsgs(
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')
    );
  }
  getFloat(amount: number) {
    return parseFloat(amount.toFixed(2));
  }
  holdAdjustmentChange(checked) {
    if (checked === 'true') {
      this.continousDeductionForm.get('monthlyDeductionAmount')?.clearValidators();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.clearValidators();
      this.continousDeductionForm.get('monthlyDeductionPercentageAmount')?.updateValueAndValidity();
      this.continousDeductionForm.get('monthlyDeductionAmount')?.updateValueAndValidity();
    } else {
      if (this.continousDeductionForm.get('monthlyDeductionAmount').value) {
        this.continousDeductionForm.get('monthlyDeductionAmount').markAsTouched();
      }
      this.onSelectCountinuesDeductionType();
    }
  }
}
