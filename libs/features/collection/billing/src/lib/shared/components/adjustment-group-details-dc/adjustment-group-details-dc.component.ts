import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-adjustment-group-details-dc',
  templateUrl: './adjustment-group-details-dc.component.html',
  styleUrls: ['./adjustment-group-details-dc.component.scss']
})
export class AdjustmentGroupDetailsDcComponent implements OnInit, OnChanges {
  //Local Varibales
  adjustmentGroupDeatilsForm: FormGroup;
  isFocused: boolean;
  isClicked: boolean;
  modalRef: BsModalRef;
  total = 0;
  hide = true;
  separatorLimit = BillingConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  // Input Variables
  @Input() selectedReason;
  @Input() isEdit;
  @Input() isGcc;
  @Input() isMofpayment = false;
  @Input() isContributorLevel: boolean;
  @Input() parentForm: FormGroup;
  @Input() contributorDetails;
  @Input() previousTab;
  @Input() totalAdjustmentAmount;
  @Input() miscellanousSubmittedDetails;
  @Input() isEstablishmentClosed;
  @Input() isPPAEst = false;
  //Output Variables
  @Output() cancel = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();

  constructor(private modalService: BsModalService, private fb: FormBuilder) {}

  ngOnInit() {
    // creating adjustment Group details form
    this.adjustmentGroupDeatilsForm = this.createAdjustmentGroupDetailsForm();
    this.total = 0; // init total
    if (this.miscellanousSubmittedDetails && this.miscellanousSubmittedDetails.length !== 0 && !this.previousTab) {
      this.setAdjustmentGroupDetailsForm();
    }
    if (this.parentForm) {
      this.parentForm.addControl('adjustmentGroupDeatilsForm', this.adjustmentGroupDeatilsForm);
    }
    this.isFocused = false;
    if (this.previousTab) {
      this.setPrevVales();
    }
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.totalAdjustmentAmount && changes.totalAdjustmentAmount.currentValue) {
      this.totalAdjustmentAmount = changes.totalAdjustmentAmount.currentValue;
      this.total = this.totalAdjustmentAmount;
    }
    if (
      changes &&
      changes.miscellanousSubmittedDetails &&
      changes.miscellanousSubmittedDetails.currentValue &&
      changes.miscellanousSubmittedDetails.currentValue.length !== 0 &&
      !this.previousTab
    ) {
      this.miscellanousSubmittedDetails = changes.miscellanousSubmittedDetails.currentValue;
      this.setAdjustmentGroupDetailsForm();
    }
  }
  /** Method to create adjustment group form */
  createAdjustmentGroupDetailsForm() {
    return this.fb.group({
      AdjustmentLevel: this.fb.group({
        annuity: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'ANNUITY'
        }),
        prAnnuity: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'PR_ANNUITY'
        }),
        ppaAnnuity: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'PPA_ANNUITY'
        }),
        UI: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'UI'
        }),
        OH: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'OH'
        }),
        annuityPenalty: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'ANNUITY_PENALTY'
        }),
        prAnnuityPenalty: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'PR_ANNUITY_PENALTY'
        }),
        ppaAnnuityPenalty: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'PPA_ANNUITY_PENALTY'
        }),
        UIPenalty: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'UI_PENALTY'
        }),
        OHPenalty: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'OH_PENALTY'
        }),

        rejectedOH: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'REJECTED_OH'
        }),
        violation: this.fb.group({
          identifier: null,
          amount: '0.00',
          billProductType: 'VIOLATIONS'
        })
      }),
      totalAmount: 0.0
    });
  }

  /** Method to show modal. */
  saveAndNextDetails() {
    this.save.emit();
  }

  /** Method to show popup for cancelling the transaction. */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form */
  confirmCancelBtn() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /** Method to decline the popUp. */
  declinePopup() {
    this.modalRef.hide();
  }

  /** Method to calculate total amount */
  calculateTotal() {
    const contributorLevel = this.adjustmentGroupDeatilsForm.get('AdjustmentLevel');
    // caculating the total amount
    this.total =
      Number(contributorLevel.get('annuity')?.get('amount')?.value) +
      Number(contributorLevel.get('prAnnuity')?.get('amount')?.value) +
      Number(contributorLevel.get('ppaAnnuity')?.get('amount')?.value) +
      Number(contributorLevel.get('UI')?.get('amount')?.value) +
      Number(contributorLevel.get('OH')?.get('amount')?.value) +
      Number(contributorLevel.get('annuityPenalty')?.get('amount')?.value) +
      Number(contributorLevel.get('prAnnuityPenalty')?.get('amount')?.value) +
      Number(contributorLevel.get('ppaAnnuityPenalty')?.get('amount')?.value) +
      Number(contributorLevel.get('UIPenalty')?.get('amount')?.value) +
      Number(contributorLevel.get('OHPenalty')?.get('amount')?.value) +
      Number(contributorLevel.get('rejectedOH').get('amount')?.value) +
      Number(contributorLevel.get('violation').get('amount')?.value);
    // set the total amount in the form
    this.adjustmentGroupDeatilsForm.get('totalAmount').setValue(this.total);
  }

  /** Method to set AdjustmentGroupDetails form with submitted details */
  setAdjustmentGroupDetailsForm() {
    this.adjustmentGroupDeatilsForm = this.createAdjustmentGroupDetailsForm();
    const adjustmentForm = this.adjustmentGroupDeatilsForm.get('AdjustmentLevel');
    this.miscellanousSubmittedDetails.forEach(product => {
      if (product.amount % 1 === 0 && this.isEdit) {
        product.amount = product.amount.toFixed(2);
      }
      if (product.billProductType === 'ANNUITY') {
        adjustmentForm.get('annuity').get('identifier').setValue(product.identifier);
        adjustmentForm.get('annuity').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'PR_ANNUITY') {
        adjustmentForm.get('prAnnuity').get('identifier').setValue(product.identifier);
        adjustmentForm.get('prAnnuity').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'PPA_ANNUITY') {
        adjustmentForm.get('ppaAnnuity').get('identifier').setValue(product.identifier);
        adjustmentForm.get('ppaAnnuity').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'UI') {
        adjustmentForm.get('UI').get('identifier').setValue(product.identifier);
        adjustmentForm.get('UI').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'OH') {
        this.adjustmentGroupDeatilsForm.get('AdjustmentLevel').get('OH').get('amount').setValue(product.amount);
        adjustmentForm.get('OH').get('identifier').setValue(product.identifier);
        adjustmentForm.get('OH').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'ANNUITY_PENALTY') {
        adjustmentForm.get('annuityPenalty').get('identifier').setValue(product.identifier);
        adjustmentForm.get('annuityPenalty').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'PR_ANNUITY_PENALTY') {
        adjustmentForm.get('prAnnuityPenalty').get('identifier').setValue(product.identifier);
        adjustmentForm.get('prAnnuityPenalty').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'PPA_ANNUITY_PENALTY') {
        adjustmentForm.get('ppaAnnuityPenalty').get('identifier').setValue(product.identifier);
        adjustmentForm.get('ppaAnnuityPenalty').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'UI_PENALTY') {
        adjustmentForm.get('UIPenalty').get('identifier').setValue(product.identifier);
        adjustmentForm.get('UIPenalty').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'OH_PENALTY') {
        adjustmentForm.get('OHPenalty').get('identifier').setValue(product.identifier);
        adjustmentForm.get('OHPenalty').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'REJECTED_OH') {
        adjustmentForm.get('rejectedOH').get('identifier').setValue(product.identifier);
        adjustmentForm.get('rejectedOH').get('amount').setValue(product.amount);
      } else if (product.billProductType === 'VIOLATIONS') {
        adjustmentForm.get('violation').get('identifier').setValue(product.identifier);
        adjustmentForm.get('violation').get('amount').setValue(product.amount);
      }
    });
    this.parentForm.removeControl('adjustmentGroupDeatilsForm');
    if (this.parentForm) {
      this.parentForm.addControl('adjustmentGroupDeatilsForm', this.adjustmentGroupDeatilsForm);
    }
    this.calculateTotal();
  }
  /** Method to set AdjustmentGroupDetails form previous btn */
  setPrevVales() {
    this.total = this.parentForm.value.adjustmentGroupDeatilsForm.totalAmount;
    this.adjustmentGroupDeatilsForm
      .get('totalAmount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.totalAmount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuity')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuity.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuity')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuity.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuity')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuity.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuity')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuity.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuity')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuity.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuity')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuity.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuity')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuity.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuity')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuity.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuity')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuity.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OH')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OH.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OH')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OH.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OH')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OH.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UI')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UI.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UI')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UI.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UI')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UI.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OHPenalty')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OHPenalty.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OHPenalty')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OHPenalty.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('OHPenalty')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.OHPenalty.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UIPenalty')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UIPenalty.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UIPenalty')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UIPenalty.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('UIPenalty')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.UIPenalty.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuityPenalty')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuityPenalty.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuityPenalty')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuityPenalty.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('annuityPenalty')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.annuityPenalty.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuityPenalty')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuityPenalty.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuityPenalty')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuityPenalty.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('prAnnuityPenalty')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.prAnnuityPenalty.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuityPenalty')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuityPenalty.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuityPenalty')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuityPenalty.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('ppaAnnuityPenalty')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.ppaAnnuityPenalty.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('violation')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.violation.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('violation')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.violation.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('violation')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.violation.billProductType);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('rejectedOH')
      .get('identifier')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.rejectedOH.identifier);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('rejectedOH')
      .get('amount')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.rejectedOH.amount);
    this.adjustmentGroupDeatilsForm
      .get('AdjustmentLevel')
      .get('rejectedOH')
      .get('billProductType')
      .setValue(this.parentForm.value.adjustmentGroupDeatilsForm.AdjustmentLevel.rejectedOH.billProductType);
    this.parentForm.removeControl('adjustmentGroupDeatilsForm');
    if (this.parentForm) {
      this.parentForm.addControl('adjustmentGroupDeatilsForm', this.adjustmentGroupDeatilsForm);
    }
  }
}
