/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BankAccount, BilingualText, GosiCalendar, Lov, LovList } from '@gosi-ui/core';
import {
  Adjustment,
  AdjustmentConstants,
  BeneficiaryList,
  BenefitDetails,
  MonthlyDeductionEligibility,
  PayeeDetails
} from '@gosi-ui/features/payment/lib/shared';
import { PayeeListDcComponent } from '../payee-list-dc/payee-list-dc.component';

@Component({
  selector: 'pmt-add-third-party-adjustment-dc',
  templateUrl: './add-third-party-adjustment-dc.component.html',
  styleUrls: ['./add-third-party-adjustment-dc.component.scss']
})
export class AddThirdPartyAdjustmentDcComponent implements OnInit, OnChanges {
  // local variables
  addTpaForm: FormGroup;
  showSearchResult = false;
  payeeList: LovList = null;
  benefitAmount: number;
  benefitStatus: BilingualText;
  benefitStartDate: GosiCalendar;
  benefitTypeListLov: LovList;
  iscomponentEqual = false;
  benType: string;
  basicBenAmount: number;
  threeMonthAmount: number;
  fourMonthOnwardsAmount: number;
  helperAmount: number;
  dependentAmount: number;
  deductionAmount: number;
  benefitAmountAfterDeduction: number;
  selectedBenefit: BenefitDetails;
  sanedPension = AdjustmentConstants.SANED_PENSION;

  // input variables
  @Input() paymentModeList: LovList;
  @Input() adjustmentReasonList: LovList;
  @Input() requestByList: LovList;
  @Input() percentageList: LovList;
  @Input() continousDeduction: LovList;
  @Input() parentForm: FormGroup;
  @Input() benefitTypeList: BeneficiaryList;
  @Input() payeeDetails: PayeeDetails[];
  @Input() showPayeesList: boolean;
  @Input() showPayeeSummary: boolean;
  @Input() totalPayeesCount: number;
  @Input() itemsPerPage: number;
  @Input() payeeListPageDetails;
  @Input() selectedpayee: PayeeDetails;
  @Input() showBenefitDetails: boolean;
  @Input() payeeCurrentBank: BankAccount;
  @Input() isValidator: boolean;
  @Input() isFromSavedData: boolean;
  @Input() newBankName: BilingualText;
  @Input() cityList: LovList;
  @Input() adjustmentValues: Adjustment;
  @Input() hasOtherAdjustments: boolean;
  @Input() monthlyDeductionEligibility: MonthlyDeductionEligibility;
  @Input() netMonthlyDeductionAmount: number;
  @Input() savedMonthlyDeductionAmount: number = 0;

  // output variables
  @Output() adjustmentReasonValue: EventEmitter<string> = new EventEmitter();
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();
  @Output() onSelectPayee: EventEmitter<PayeeDetails> = new EventEmitter();
  @Output() onChangePayee: EventEmitter<null> = new EventEmitter();
  @Output() onIbanchange: EventEmitter<string> = new EventEmitter();
  @Output() onBenefitSelected = new EventEmitter();

  @ViewChild('payeesList', { static: false }) payeesList: PayeeListDcComponent;

  constructor(private fb: FormBuilder) {
    this.addTpaForm = this.createTpaForm();
  }

  /** This method is to initialize the component */
  ngOnInit(): void {
    if (!this.parentForm?.get('addTpaForm')) {
      this.parentForm.addControl('addTpaForm', this.addTpaForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.benefitTypeList?.currentValue) {
      const benefitTypeListLov = new LovList([]);
      this.benefitTypeList?.beneficiaryBenefitList?.forEach((data, i) => {
        benefitTypeListLov.items.push({
          value: data.benefitType,
          code: data.beneficiaryId,
          sequence: i++
        });
        this.benefitTypeListLov = benefitTypeListLov;
      });
      this.preSelectBenefitType();
    }
    if (changes && changes?.adjustmentValues?.currentValue) {
      this.preSelectBenefitType();
    }
  }

  /**
   * method to select the benfit type on page load
   */
  preSelectBenefitType() {
    if (this.adjustmentValues && this.benefitTypeList) {
      this.addTpaForm.get('benefitType')?.setValue(this.adjustmentValues?.benefitType);
      this.addTpaForm.get('nationalID')?.setValue(this.adjustmentValues?.payeeId);
      this.selectBenefitType(
        this.benefitTypeListLov.items.find(item => item.code === this.adjustmentValues?.beneficiaryId),
        true
      );
      this.addTpaForm.get('benefitType')?.updateValueAndValidity();
      this.addTpaForm.get('nationalID')?.updateValueAndValidity();
    }
  }

  /** This method is to create form */
  createTpaForm() {
    return this.fb.group({
      benefitType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      nationalID: [null, { validators: [Validators.required], updateOn: 'blur' }],
      beneficiaryId: [null]
    });
  }

  // method to find the payee details
  findPayee() {
    this.searchValue.emit(this.addTpaForm.get('nationalID').value);
  }

  // method to find beneficiary details
  selectBenefitType(selectedBenefit: Lov, isFromPreselect = false) {
    this.showBenefitDetails = this.addTpaForm.get('benefitType.english').value !== null;
    this.benType = selectedBenefit?.value?.english;
    /**<- To reset the all form */
    if (!isFromPreselect) {
      this.changePayee();
    }
    /** --> */
    this.benefitTypeList?.beneficiaryBenefitList.forEach(data => {
      if (data.beneficiaryId === selectedBenefit?.code) {
        this.addTpaForm.get('beneficiaryId').setValue(data.beneficiaryId);
        this.selectedBenefit = data;
        this.benefitAmount = data.benefitAmount;
        this.benefitStatus = data.benefitStatus;
        this.benefitStartDate = data.startDate;
        this.basicBenAmount = data.basicBenefitAmount;
        this.threeMonthAmount = data.initialBenefitAmount;
        this.fourMonthOnwardsAmount = data.subsequentBenefitAmount;
        this.helperAmount = data.helperComponentAmount;
        this.dependentAmount = data.dependentComponentAmount;
        this.deductionAmount = Math.abs(data.deductionAmount);
        this.benefitAmountAfterDeduction = data.benefitAmountAfterDeduction;
        this.onBenefitSelected.emit(this.selectedBenefit);
      }
    });
  }

  /**
   * Method to chnage payee
   */
  changePayee() {
    /**<- To reset the all form */
    this.parentForm?.get('continousDeductionForm')?.reset();
    this.parentForm?.get('paymentMethod')?.reset();
    /** --> */
    this.addTpaForm?.get('nationalID')?.reset();
    this.payeesList?.reset();
    this.onChangePayee.emit();
  }
  adjustmentReasonKey(val: string) {
    this.adjustmentReasonValue.emit(val);
  }

  selectPayee(payee: PayeeDetails, scrollToView: HTMLElement) {
    scrollToView.scrollIntoView();
    this.onSelectPayee.emit(payee);
  }
}
