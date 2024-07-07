/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList, markFormGroupTouched } from '@gosi-ui/core';
import { ViolationConstants } from '@gosi-ui/features/violations/lib/shared/constants';
import { ViolationsEnum } from '@gosi-ui/features/violations/lib/shared/enums';
import { ChangeViolationValidator, ViolationTransaction } from '../../../../shared/models';

@Component({
  selector: 'vol-cancel-violation-dc',
  templateUrl: './cancel-violation-dc.component.html',
  styleUrls: ['./cancel-violation-dc.component.scss']
})
export class CancelViolationDcComponent implements OnInit, OnChanges {
  //Local Variables
  amount: number;
  cancelViolationForm: FormGroup = new FormGroup({});

  //Input Variables
  @Input() parentForm: FormGroup;
  @Input() cancelReasonList: LovList;
  @Input() transactionDetails: ViolationTransaction;
  @Input() editMode: boolean;
  @Input() violationDetails: ChangeViolationValidator = new ChangeViolationValidator();

  //Output Variables
  @Output() save = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter(null);
  @Output() errorFlag: EventEmitter<null> = new EventEmitter();
  showComments: boolean;
  commentsMaxLength = ViolationConstants.JUSTIFICATION_MAX_LENGTH;

  constructor(readonly fb: FormBuilder) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.cancelViolationForm = this.createCancelViolationForm();
    if (this.parentForm) this.parentForm.addControl('cancelViolatonDetailsForm', this.cancelViolationForm);
  }
  /**
   * Method to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionDetails && changes.transactionDetails.currentValue)
      this.transactionDetails = changes.transactionDetails.currentValue;
    if (changes && changes.violationDetails) this.violationDetails = changes.violationDetails.currentValue;
    if (changes && changes.editMode) {
      this.editMode = changes.editMode.currentValue;
    }
    this.initializeCancelView();
  }
  initializeCancelView() {
    if (this.transactionDetails) this.amount = this.transactionDetails?.penaltyAmount;
    this.setCancelValues();
  }
  setCancelValues() {
    if (this.violationDetails && this.editMode) {
      this.cancelViolationForm
        ?.get('cancelReason.english')
        ?.setValue(this.violationDetails?.cancellationReason?.english);
      this.cancelViolationForm?.get('cancelReason.arabic')?.setValue(this.violationDetails?.cancellationReason?.arabic);
      this.cancelViolationForm?.get('comments').setValue(this.violationDetails?.comments);
      const value = this.cancelViolationForm?.get('cancelReason').value;
      if (this.cancelViolationForm) this.selectReasonCancellation(value.english);
    }
  }
  /**
   * Method to create violations form
   */
  createCancelViolationForm(): FormGroup {
    return this.fb.group({
      cancelReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      comments: [null]
    });
  }
  /**
   * Method to save cancel violation details
   */
  saveCancelVolationDetails() {
    if (this.cancelViolationForm.valid) {
      const cancelReason = this.cancelViolationForm.get('cancelReason').value;
      const comments = this.cancelViolationForm.get('comments').value;
      this.save.emit({ cancelReason: cancelReason, comments: comments });
    } else {
      this.errorFlag.emit();
      markFormGroupTouched(this.cancelViolationForm);
    }
  }
  /**
   * Method to get current penalty
   * @param lists
   */
  getCurrentPenalty(lists: ViolationTransaction) {
    this.amount = lists.penaltyAmount;
  }
  /**
   * Method to trigger cancel violation event
   * @param lists
   */
  cancelVolationDetails() {
    this.cancel.emit();
  }
  /**
   * Method to select reason for cancellation
   * @param lists
   */
  selectReasonCancellation(value) {
    if (value === ViolationsEnum.OTHER_REASON) {
      this.showComments = true;
      this.cancelViolationForm.get('comments').setValidators(Validators.required);
      this.cancelViolationForm.get('comments').updateValueAndValidity();
    } else {
      this.cancelViolationForm.get('comments').setValue(null);
      this.cancelViolationForm.get('comments').clearValidators();
      this.cancelViolationForm.get('comments').updateValueAndValidity();
      this.showComments = false;
    }
  }
}
