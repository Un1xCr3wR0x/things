/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { BilingualText, LovList, lessThanValidator, greaterThanValidator, Lov } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  BeneficiaryList,
  BenefitDetails,
  RequestType,
  MonthlyDeductionEligibility,
  DeductionTypeEnum
} from '@gosi-ui/features/payment/lib/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputNumberDcComponent, InputTextDcComponent } from '@gosi-ui/foundation-theme/src';
import { PayeeListDcComponent } from '../..';

@Component({
  selector: 'pmt-modify-stop-third-party-dc',
  templateUrl: './modify-stop-third-party-dc.component.html',
  styleUrls: ['./modify-stop-third-party-dc.component.scss']
})
export class ModifyStopThirdPartyDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() hasOtherAdjustments: boolean;
  @Input() reasonForReactivating: LovList;
  @Input() reasonForStopping: LovList;
  @Input() reasonForHolding: LovList;
  @Input() percentageList: LovList;
  @Input() enableReactivate: boolean;
  @Input() adjustment: Adjustment;
  @Input() modifiedAdjustment: Adjustment;
  @Input() monthlyDeductionEligibility: MonthlyDeductionEligibility;
  @Input() benefitDetails: BeneficiaryList;
  @Input() parentForm: FormGroup;
  @Input() netMonthlyDeductionAmount: number;
  @Input() tempMonthlyDeductionAmount: number;
  @Input() stopHoldDeducted: boolean;
  // Output Variables
  @Output() isEditActive: EventEmitter<boolean> = new EventEmitter();
  @Output() onSave: EventEmitter<null> = new EventEmitter();
  // Local Variables
  @ViewChild('monthyDeductionAmount', { static: false }) monthyDeductionAmountInput: InputNumberDcComponent;
  @ViewChild('monthyDeductionPercentAmount', { static: false })
  monthlyDeductionPercentageAmountInput: InputTextDcComponent;
  modifyConstant = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.MODIFY;
  holdConstant = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.HOLD;
  stopConstant = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.STOP;
  reactivateConstant = AdjustmentConstants.ADJUSTMENT_ACTION_TYPE.REACTIVATE;
  modalRef: BsModalRef;
  showModifyLabels: boolean;
  showHoldLabels: boolean;
  showStopLabels: boolean;
  showOther: boolean;
  maintainTpaForm: FormGroup;
  isadjustmentPercentage: boolean;
  monthlyAdjustmentLimit: number;
  selectedBenefit: BenefitDetails;
  isViewDataLoaded = false;
  benefitAmount: number = 0;
  separatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  showBasicBenefitWarning: boolean;
  deductionAmount: number = 0;
  basicBenefitAmount: number = 0;
  minBasicBenefitAmount: number;
  selectedDeductionType = DeductionTypeEnum.AMOUNT;
  warningPercentage: number;
  showDeductionpercentageWarning: boolean;
  constructor(readonly router: Router, readonly modalService: BsModalService, private fb: FormBuilder) {
    this.maintainTpaForm = this.createMaintainTpaForm();
  }

  ngOnInit(): void {
    if (!this.parentForm?.get('paymentMethod')) {
      this.parentForm?.addControl('maintainTpaForm', this.maintainTpaForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.adjustment?.currentValue ||
      changes.benefitDetails?.currentValue ||
      changes.enableReactivate?.currentValue !== undefined
    ) {
      this.initView();
    }
    if (
      changes?.modifiedAdjustment?.currentValue ||
      changes?.reasonForReactivating?.currentValue ||
      changes?.reasonForStopping?.currentValue ||
      changes?.reasonForHolding?.currentValue ||
      changes?.percentageList?.currentValue ||
      changes.adjustment?.currentValue ||
      changes.benefitDetails?.currentValue
    ) {
      this.presetData();
    }
  }
  initView() {
    if (this.adjustment && this.benefitDetails && this.enableReactivate !== undefined) {
      this.isViewDataLoaded = true;
      this.isadjustmentPercentage = this.adjustment?.monthlyDeductionAmount ? false : true;
      this.selectedBenefit = this.benefitDetails?.beneficiaryBenefitList?.find(
        benefit => benefit?.beneficiaryId === this.adjustment?.beneficiaryId
      );
      this.monthlyAdjustmentLimit = this.selectedBenefit?.benefitAmountAfterDeduction;
      this.benefitAmount = this.selectedBenefit?.benefitAmount;
      this.basicBenefitAmount = this.selectedBenefit?.basicBenefitAmount;
      this.deductionAmount = this.selectedBenefit?.deductionAmount;
      if (this.enableReactivate === false && !this.modifiedAdjustment) {
        this.changeStatus(this.modifyConstant);
      } else if (this.enableReactivate && !this.modifiedAdjustment && !this.adjustment?.isStop) {
        this.changeStatus(this.reactivateConstant);
      } else if (this.enableReactivate && !this.modifiedAdjustment && this.adjustment?.isStop) {
        this.changeStatus(this.stopConstant);
      }
    }
  }

  presetData() {
    if (
      this.modifiedAdjustment &&
      this.reasonForReactivating &&
      this.reasonForStopping &&
      this.reasonForHolding &&
      this.percentageList &&
      this.adjustment &&
      this.benefitDetails
    ) {
      this.changeStatus(this.modifiedAdjustment?.actionType);
      if (
        this.modifiedAdjustment?.actionType?.english ===
        AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.REACTIVATE?.english
      ) {
        this.maintainTpaForm
          ?.get('reasonForReactivating')
          .setValue(this.modifiedAdjustment?.reactivateAdjustmentReason);
        this.onReasonSelect(this.modifiedAdjustment?.reactivateAdjustmentReason?.english);
      } else if (
        this.modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.STOP?.english
      ) {
        this.maintainTpaForm?.get('reasonForStopping').setValue(this.modifiedAdjustment?.stopAdjustmentReason);
        this.onReasonSelect(this.modifiedAdjustment?.stopAdjustmentReason?.english);
      } else if (
        this.modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.HOLD?.english
      ) {
        this.maintainTpaForm?.get('reasonForHolding').setValue(this.modifiedAdjustment?.holdAdjustmentReason);
        this.onReasonSelect(this.modifiedAdjustment?.holdAdjustmentReason?.english);
      } else if (
        this.modifiedAdjustment?.monthlyDeductionAmount &&
        this.modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.MODIFY?.english
      ) {
        this.maintainTpaForm
          ?.get('newMonthlyDeductionAmount')
          .setValue(this.modifiedAdjustment?.monthlyDeductionAmount);
      } else if (
        this.modifiedAdjustment?.adjustmentPercentage &&
        this.modifiedAdjustment?.actionType?.english === AdjustmentConstants?.ADJUSTMENT_ACTION_TYPE?.MODIFY?.english
      ) {
        this.maintainTpaForm
          .get('newDebitPercentage')
          .setValue(
            this.percentageList?.items?.find(
              lov => lov?.value?.english === this.modifiedAdjustment?.adjustmentPercentage.toString()
            )?.value
          );
        this.findDeductionAmount();
      }
      this.maintainTpaForm?.get('notes').setValue(this.modifiedAdjustment?.notes);
      this.maintainTpaForm?.get('otherReason').setValue(this.modifiedAdjustment?.otherReason);
      this.updateControlValidation(this.modifiedAdjustment?.actionType);
    }
  }

  // Method to create maintain third party adjustment form
  createMaintainTpaForm() {
    return this.fb.group({
      newMonthlyDeductionAmount: [null],
      newDebitPercentage: this.fb.group({
        english: [null],
        arabic: null
      }),
      manageType: this.fb.group({
        english: [null],
        arabic: null
      }),

      reasonForHolding: this.fb.group({
        english: [null],
        arabic: null
      }),
      reasonForReactivating: this.fb.group({
        english: [null],
        arabic: null
      }),
      reasonForStopping: this.fb.group({
        english: [null],
        arabic: null
      }),
      otherReason: [null],

      notes: [null, { validators: Validators.required }]
    });
  }

  cancelPage() {
    this.modalRef.hide();
    this.isEditActive.emit(false);
  }

  // Method to show modal
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }

  submit() {
    this.onSave.emit();
  }
  changeStatus(actionType: BilingualText) {
    if (actionType?.english === this.modifyConstant?.english && !this.adjustment?.isStop) {
      this.maintainTpaForm?.get('manageType').setValue(actionType);
      this.showModifyLabels = true;
      this.showStopLabels = false;
      this.showHoldLabels = false;
      this.onReasonSelect(null);
      this.findDeductionAmount();
      this.updateControlValidation(actionType);
    } else if (actionType?.english === this.holdConstant?.english && !this.adjustment?.isStop) {
      this.maintainTpaForm?.get('manageType').setValue(actionType);
      this.showHoldLabels = true;
      this.showStopLabels = false;
      this.showModifyLabels = false;
      this.onReasonSelect(this.maintainTpaForm?.get('reasonForHolding.english').value);
      this.updateControlValidation(actionType);
    } else if (actionType?.english === this.stopConstant?.english) {
      this.maintainTpaForm?.get('manageType').setValue(actionType);
      this.showStopLabels = true;
      this.showHoldLabels = false;
      this.showModifyLabels = false;
      this.onReasonSelect(this.maintainTpaForm?.get('reasonForStopping.english').value);
      this.updateControlValidation(actionType);
    } else if (actionType?.english === this.reactivateConstant?.english) {
      this.maintainTpaForm?.get('manageType').setValue(actionType);
      this.showStopLabels = false;
      this.showHoldLabels = false;
      this.showModifyLabels = false;
      this.onReasonSelect(this.maintainTpaForm?.get('reasonForReactivating.english').value);
      this.updateControlValidation(actionType);
    }
  }

  onReasonSelect(selectedReason: string) {
    if (AdjustmentConstants.MANAGE_ADJUSTMENT_OTHER_RESONS.includes(selectedReason)) {
      this.showOther = true;
      this.maintainTpaForm?.get('otherReason').setValidators([Validators.required]);
    } else {
      this.showOther = false;
      this.maintainTpaForm?.get('otherReason').clearValidators();
    }
    this.maintainTpaForm?.get('otherReason').updateValueAndValidity();
  }

  updateControlValidation(actionType: BilingualText) {
    if (actionType?.english === this.modifyConstant?.english) {
      let benefitAmountAfterDeduction = this.benefitAmount - this.netMonthlyDeductionAmount;
      if (!this.stopHoldDeducted) {
        benefitAmountAfterDeduction +=
          this.modifiedAdjustment?.monthlyDeductionAmount || this.tempMonthlyDeductionAmount;
      }
      const monthlyAdjustmentLimit =
        this.adjustment?.adjustmentAmount && this.adjustment?.adjustmentAmount < benefitAmountAfterDeduction
          ? this.adjustment?.adjustmentAmount
          : benefitAmountAfterDeduction;
      if (this.isadjustmentPercentage) {
        this.maintainTpaForm
          ?.get('newMonthlyDeductionAmount')
          .setValidators([
            Validators.required,
            lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
            greaterThanValidator(0)
          ]);
        this.maintainTpaForm
          ?.get('newDebitPercentage.english')
          .setValidators([
            Validators.required,
            lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
            greaterThanValidator(0)
          ]);
      } else {
        this.maintainTpaForm
          ?.get('newMonthlyDeductionAmount')
          .setValidators([
            Validators.required,
            lessThanValidator(this.getFloat(monthlyAdjustmentLimit)),
            greaterThanValidator(0)
          ]);
        this.maintainTpaForm?.get('newDebitPercentage.english').clearValidators();
      }
      this.maintainTpaForm?.get('reasonForHolding.english').clearValidators();
      this.maintainTpaForm?.get('reasonForReactivating.english').clearValidators();
      this.maintainTpaForm?.get('reasonForStopping.english').clearValidators();
    } else if (actionType?.english === this.holdConstant?.english) {
      this.maintainTpaForm?.get('reasonForHolding.english').setValidators([Validators.required]);
      this.maintainTpaForm?.get('newMonthlyDeductionAmount').clearValidators();
      this.maintainTpaForm?.get('newDebitPercentage.english').clearValidators();
      this.maintainTpaForm?.get('reasonForReactivating.english').clearValidators();
      this.maintainTpaForm?.get('reasonForStopping.english').clearValidators();
    } else if (actionType?.english === this.stopConstant?.english) {
      this.maintainTpaForm?.get('reasonForStopping.english').setValidators([Validators.required]);
      this.maintainTpaForm?.get('newMonthlyDeductionAmount').clearValidators();
      this.maintainTpaForm?.get('newDebitPercentage.english').clearValidators();
      this.maintainTpaForm?.get('reasonForHolding.english').clearValidators();
      this.maintainTpaForm?.get('reasonForReactivating.english').clearValidators();
    } else if (actionType?.english === this.reactivateConstant?.english) {
      this.maintainTpaForm?.get('reasonForReactivating.english').setValidators([Validators.required]);
      this.maintainTpaForm?.get('newMonthlyDeductionAmount').clearValidators();
      this.maintainTpaForm?.get('newDebitPercentage.english').clearValidators();
      this.maintainTpaForm?.get('reasonForHolding.english').clearValidators();
      this.maintainTpaForm?.get('reasonForStopping.english').clearValidators();
    }
    this.maintainTpaForm?.get('reasonForReactivating.english').updateValueAndValidity();
    this.maintainTpaForm?.get('newMonthlyDeductionAmount').updateValueAndValidity();
    this.maintainTpaForm?.get('newDebitPercentage.english').updateValueAndValidity();
    this.maintainTpaForm?.get('reasonForHolding.english').updateValueAndValidity();
    this.maintainTpaForm?.get('reasonForStopping.english').updateValueAndValidity();
  }
  checkDeductionWarning() {
    const monthlyDeductionPercentageAmount = +this.maintainTpaForm.get('newDebitPercentage')?.value;
    const monthlyDeductionAmount = +this.maintainTpaForm.get('newMonthlyDeductionAmount')?.value;
    /*basic benfit warning eligibility check */
    if (this.monthlyDeductionEligibility) {
      this.showBasicBenefitWarning =
        this.selectedBenefit?.basicBenefitAmount < this.monthlyDeductionEligibility?.minBasicBenefitAmount;
      this.minBasicBenefitAmount = this.monthlyDeductionEligibility?.minBasicBenefitAmount;
    } else {
      this.showBasicBenefitWarning = false;
    }
    //monthly deduction limit check
    if (
      this.selectedDeductionType &&
      ((this.selectedDeductionType === DeductionTypeEnum.PERCENTAGE && monthlyDeductionPercentageAmount) ||
        (this.selectedDeductionType === DeductionTypeEnum.AMOUNT && monthlyDeductionAmount))
    ) {
      const deductionAmountVal =
        this.selectedDeductionType === DeductionTypeEnum.AMOUNT
          ? monthlyDeductionAmount
          : monthlyDeductionPercentageAmount;
      if (this.monthlyDeductionEligibility && this.benefitAmount) {
        const warningPercentage = this.hasOtherAdjustments
          ? this.monthlyDeductionEligibility?.deductionPercentageForMultipleAdjustment
          : this.monthlyDeductionEligibility?.deductionPercentageForSingleAdjustment;

        this.warningPercentage =
          deductionAmountVal + Math.abs(this.selectedBenefit?.deductionAmount) > this.selectedBenefit?.benefitAmount
            ? 100
            : warningPercentage;

        this.showDeductionpercentageWarning =
          deductionAmountVal + Math.abs(this.selectedBenefit?.deductionAmount) >
          this.selectedBenefit?.benefitAmount * (warningPercentage / 100)
            ? true
            : false;
      } else {
        this.warningPercentage =
          deductionAmountVal + Math.abs(this.selectedBenefit?.deductionAmount) > this.selectedBenefit?.benefitAmount
            ? 100
            : AdjustmentConstants.MONTHLY_TPA_ADJUSTMENT_DEDUCTION_PERCENATGE_LIMIT;
        this.showDeductionpercentageWarning =
          deductionAmountVal + Math.abs(this.selectedBenefit?.deductionAmount) >
          this.selectedBenefit?.benefitAmount *
            (AdjustmentConstants.MONTHLY_TPA_ADJUSTMENT_DEDUCTION_PERCENATGE_LIMIT / 100)
            ? true
            : false;
      }
    } else {
      this.showDeductionpercentageWarning = false;
    }
  }

  // Method to calculate monthly deduction amount
  findDeductionAmount() {
    this.maintainTpaForm.get('newMonthlyDeductionAmount').reset();
    const percentage = +this.maintainTpaForm.get('newDebitPercentage')?.get('english').value;
    if (percentage && this.selectedBenefit?.benefitAmount) {
      const deductionAmount = (percentage * this.selectedBenefit.benefitAmount) / 100;
      this.maintainTpaForm.get('newMonthlyDeductionAmount').setValue(deductionAmount.toFixed(2));
    }
    this.checkDeductionWarning();
    this.monthyDeductionAmountInput?.setErrorMsgs(this.maintainTpaForm.get('newMonthlyDeductionAmount'));
    if (this.maintainTpaForm.get('newMonthlyDeductionAmount').value) {
      this.maintainTpaForm.get('newMonthlyDeductionAmount').markAsTouched();
    }
    this.monthlyDeductionPercentageAmountInput?.setErrorMsgs(this.maintainTpaForm.get('newMonthlyDeductionAmount'));
  }
  getFloat(amount: number) {
    return parseFloat(amount.toFixed(2));
  }
}
