/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import {
  LovList,
  AlertService,
  DocumentItem,
  RoleIdEnum,
  GosiCalendar,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { createOtherReceiptForm, createReceiptModeForm } from './return-payment-details-form';
import {
  BenefitConstants,
  ReturnLumpsumPaymentDetails,
  markFormGroupTouched
} from '@gosi-ui/features/benefits/lib/shared';
@Component({
  selector: 'bnt-return-payment-details-dc',
  templateUrl: './return-payment-details-dc.component.html',
  styleUrls: ['./return-payment-details-dc.component.scss']
})
export class ReturnPaymentDetailsDcComponent implements OnInit, OnChanges {
  /** Constants */
  transactionConstant = BenefitConstants.RETURN_LUMPSUM_TRANSACTION_CONSTANT;
  transactionNoMaxLength = BenefitConstants.TRANSACTION_NUMBER_MAX_LENGTH;
  bankNameLength = BenefitConstants.BANK_NAME_MAX_LENGTH;
  amountReceivedSeparatorLimit = BenefitConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  additionalDetailsMaxLength = BenefitConstants.ADDITIONAL_DETAILS_MAX_LENGTH;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  accessForActionPublic = [RoleIdEnum.SUBSCRIBER, RoleIdEnum.AUTH_PERSON, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];

  /** Input variables */
  @Input() parentForm: FormGroup;
  @Input() receiptDetails: ReturnLumpsumPaymentDetails;
  @Input() benefitAmount: number;
  @Input() isAppPrivate: boolean;
  @Input() referenceNo: number;
  @Input() inEditMode: boolean;
  @Input() documentuuid: string;
  @Input() ninContributor: number;
  @Input() otherPaymentReqDocument: DocumentItem[];

  //Lov List inputs
  @Input() receiptMode: LovList;
  @Input() saudiBankList: LovList;
  @Input() systemRunDate: GosiCalendar;
  /** Output variables */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
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
  constructor(private modalService: BsModalService, private alertService: AlertService) {}

  /** This method is to initialize the component. */
  ngOnInit() {
    this.receiptModeForm = this.getReceiptForm();
    if (!this.inEditMode) {
      if (this.parentForm) {
        this.parentForm.addControl('receiptMode', this.receiptModeForm);
      }
    }
    // this.maxDate = moment(new Date()).toDate();
    this.transactionMinDate = moment(BenefitConstants.TRANSACTION_MINDATE).toDate();
  }
  getReceiptForm() {
    return this.receiptModeForm ? this.receiptModeForm : createReceiptModeForm();
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.receiptDetails && changes.receiptDetails.currentValue) {
      if (this.receiptDetails.receiptMode.english !== null) {
        this.receiptModeForm = this.getReceiptForm();
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
  }

  /** Method to create  payment details form. */
  createPaymentDetailsForm(isSelected?) {
    this.alertService.clearAlerts();
    this.currentReceiptMode = this.receiptModeForm.get('receiptMode.english').value;
    if (this.parentForm.get('repaymentDetails')) {
      this.parentForm.removeControl('repaymentDetails');
    }
    if (this.currentReceiptMode) {
      this.paymentDetailsForm = createOtherReceiptForm();
      if (this.systemRunDate) {
        if (!this.paymentDetailsForm.get('transactionDate.gregorian')?.value) {
          this.paymentDetailsForm
            .get('transactionDate.gregorian')
            .patchValue(moment(this.systemRunDate.gregorian).toDate());
        }
      }
      this.paymentDetailsForm.get('amountTransferred.amount').patchValue(this.benefitAmount);
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
  OnDelete(documentItem: DocumentItem) {
    if (documentItem) {
      this.isDocDeleted = true;
    }
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
    this.cancel.emit();
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
          } else if (key === 'amountTransferred') {
            if (data[key] !== null) {
              formGroup.get(key).get('amount').patchValue(parseFloat(data[key]).toFixed(2));
            }
          } else if (key === 'bankName') {
            if (data[key] !== null && this.saudiBankList?.items?.length > 0) {
              formGroup.get(key).patchValue(data[key]);
            }
          }
          // else if (key === 'paymentReferenceNo') {
          //   if (data[key] !== null) {
          //     formGroup.get(key).patchValue(data[key]);
          //   }
          // }
          else {
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
}
