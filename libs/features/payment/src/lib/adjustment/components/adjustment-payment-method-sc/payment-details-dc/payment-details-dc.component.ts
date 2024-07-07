/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { LovList, AlertService, DocumentItem, markFormGroupTouched, GosiCalendar } from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { createOtherReceiptForm, createReceiptModeForm } from './payment-details-form';
import { AdjustmentConstants, AdjustmentService, AdjustmentRepaymentDetails } from '../../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'pmt-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent implements OnInit, OnChanges {
  /** Constants */
  transactionConstant = AdjustmentConstants.ADJUSTMENT_REPAY_TRANSACTION_CONSTANT;
  transactionNoMaxLength = AdjustmentConstants.TRANSACTION_NUMBER_MAX_LENGTH;
  bankNameLength = AdjustmentConstants.BANK_NAME_MAX_LENGTH;
  amountReceivedSeparatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  additionalDetailsMaxLength = AdjustmentConstants.ADDITIONAL_DETAILS_MAX_LENGTH;

  /** Input variables */
  @Input() parentForm: FormGroup;
  @Input() receiptDetails: AdjustmentRepaymentDetails;
  @Input() benefitAmount: number;
  @Input() isAppPrivate: boolean;
  @Input() referenceNo: number;
  @Input() inEditMode: boolean;
  @Input() documentuuid: string;
  @Input() adjustmentRepayId: number;
  @Input() otherPaymentReqDocument: DocumentItem[];
  @Input() isAdjFormModified = false;
  @Input() systemRunDate: GosiCalendar;
  //Lov List inputs
  @Input() receiptMode: LovList;
  @Input() saudiBankList: LovList;

  /** Output variables */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() onCancelPayment: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() getDocument: EventEmitter<null> = new EventEmitter();
  @Output() uploadFailed = new EventEmitter();

  /** Local variables */

  receiptModeForm: FormGroup;
  paymentDetailsForm: FormGroup;
  maxDate: Date;
  transactionMinDate: Date;
  modalRef: BsModalRef;
  currentReceiptMode: string;
  isDocDeleted = false;

  /**
   * Creates an instance of PaymentDetailsDcComponent.
   * @param modalService
   * @param alertService
   */
  constructor(
    private modalService: BsModalService,
    private alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly router: Router
  ) {}

  /** This method is to initialize the component. */
  ngOnInit() {
    if (!this.inEditMode) {
      this.receiptModeForm = createReceiptModeForm();
      if (this.parentForm) {
        this.parentForm.addControl('receiptMode', this.receiptModeForm);
      }
    }
    this.transactionMinDate = moment(AdjustmentConstants.TRANSACTION_MINDATE).toDate();
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.receiptDetails && changes.receiptDetails.currentValue) {
      if (this.receiptDetails.receiptMode.english !== null) {
        this.receiptModeForm = createReceiptModeForm();
        this.receiptModeForm.get('receiptMode').patchValue(this.receiptDetails.receiptMode);

        if (this.parentForm.get('receiptMode')) {
          this.parentForm.removeControl('receiptMode');
        }
        this.parentForm.addControl('receiptMode', this.receiptModeForm);
        this.currentReceiptMode = this.receiptDetails.receiptMode.english;
      }
      this.createPaymentDetailsForm();
      this.bindPaymentDetailsToForm(this.receiptDetails, this.paymentDetailsForm);
    }
    if (changes && changes.saudiBankList && changes.saudiBankList.currentValue) {
      this.saudiBankList = changes.saudiBankList.currentValue;
    }
    if (changes?.systemRunDate?.currentValue) {
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
      if (!this.paymentDetailsForm.get('transactionDate.gregorian')?.value) {
        this.paymentDetailsForm.get('gregorian').patchValue(moment(this.systemRunDate.gregorian).toDate());
      }
    }
  }

  /** Method to create  payment details form. */
  createPaymentDetailsForm(isSelected?) {
    this.alertService.clearAlerts();
    this.currentReceiptMode = this.receiptModeForm.get('receiptMode.english').value;
    if (this.parentForm.get('repaymentDetails')) {
      this.parentForm.removeControl('repaymentDetails');
    }
    if (this.currentReceiptMode) {
      this.paymentDetailsForm = createOtherReceiptForm(this.systemRunDate);
      if (this.systemRunDate) {
        if (!this.paymentDetailsForm.get('transactionDate.gregorian')?.value) {
          this.paymentDetailsForm
            .get('transactionDate.gregorian')
            .patchValue(moment(this.systemRunDate.gregorian).toDate());
        }
      }
      // if (this.inEditMode) {
      //   this.paymentDetailsForm
      //     .get('amountTransferred.amount')
      //     .patchValue(this.receiptDetails.amountTransferred.toFixed(2));
      // } else {
      //   this.paymentDetailsForm.get('amountTransferred.amount').patchValue(this.benefitAmount.toFixed(2));
      // }
      this.paymentDetailsForm.get('amountTransferred.amount').patchValue(this.benefitAmount.toFixed(2));
      this.paymentDetailsForm.updateValueAndValidity();
    }
    if (isSelected) {
      this.getDocument.emit();
    }
    this.parentForm.addControl('repaymentDetails', this.paymentDetailsForm);
  }

  /** Method to submit payment details. */
  submitpayment() {
    if (this.receiptModeForm.invalid) {
      markFormGroupTouched(this.receiptModeForm);
    }
    if (this.paymentDetailsForm.valid) {
      if (this.checkMandatoryDocuments()) {
        this.submit.emit();
      }
    } else {
      this.checkMandatoryDocuments();
      markFormGroupTouched(this.paymentDetailsForm);
      markFormGroupTouched(this.receiptModeForm);
    }
  }

  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocument(documentItem: DocumentItem) {
    this.refresh.emit(documentItem);
  }
  deleteDoc(documentItem: DocumentItem) {
    if (documentItem) {
      this.isDocDeleted = true;
    }
  }
  /** Method to check whether mandatory documents are scanned / uploaded. */
  checkMandatoryDocuments(): boolean {
    let flag = true;
    if (this.otherPaymentReqDocument) {
      this.otherPaymentReqDocument.forEach(document => {
        if (document.required && (document.documentContent === null || document.documentContent === 'NULL')) {
          document.uploadFailed = true;
          flag = false;
        } else {
          document.uploadFailed = false;
        }
      });
    }
    return flag;
  }

  /** helper functions  */
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
    this.onCancelPayment.emit();
  }

  /**
   * Bind receipt details to form on edt mode.
   * @param data receipt details.
   * @param formGroup form group.
   */
  bindPaymentDetailsToForm(data, formGroup: FormGroup) {
    if (data) {
      Object.keys(data).forEach(key => {
        if (key in formGroup.controls) {
          if (key === 'transactionDate') {
            if (data[key] !== null) {
              formGroup.get(key).get('gregorian').patchValue(new Date(data[key].gregorian));
            } else {
              formGroup.get(key).patchValue(data[key]);
            }
          }
          //  else if (key === 'amountTransferred') {
          //   if (data[key] !== null) {
          //     formGroup.get(key).get('amount').patchValue(parseFloat(data[key]).toFixed(2));
          //   }
          // }
          else if (key === 'bankName') {
            if (data[key] !== null) {
              formGroup.get(key).patchValue(data[key]);
            }
          } else if (key === 'paymentReferenceNo') {
            if (data[key] !== null) {
              formGroup.get(key).patchValue(data[key]);
            }
          } else {
            formGroup.get(key).patchValue(data[key]);
          }
        }
      });
    }
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }

  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    //formControl.disable();
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
    //formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  goToPrevAction() {
    this.adjustmentService.setPageName('PAYMENT_DETAILS');
    if (this.inEditMode) {
      this.router.navigate(['home/adjustment/pay-adjustment'], {
        queryParams: {
          edit: true
        }
      });
    } else {
      this.router.navigate(['home/adjustment/pay-adjustment']);
    }
  }
}
