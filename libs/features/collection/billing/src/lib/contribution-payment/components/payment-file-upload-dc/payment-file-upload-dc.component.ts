/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-payment-file-upload-dc',
  templateUrl: './payment-file-upload-dc.component.html',
  styleUrls: ['./payment-file-upload-dc.component.scss']
})
export class PaymentFileUploadDcComponent implements OnInit, OnChanges {
  /** Constants */
  documentTransactionId = BillingConstants.DOCUMENT_TRANSACTION_ID;
  commentsMaxLength = BillingConstants.COMMENTS_MAX_LENGTH;

  commentsForm: FormGroup;
  modalRef: BsModalRef;

  /** Input variables */
  @Input() documentList: DocumentItem[];
  @Input() receiptNumber: number;
  @Input() parentForm: FormGroup;
  @Input() uuid: string;
  @Input() isScan: boolean;
  @Input() isPaymentScanned: boolean;
  @Input() isChequeScanned: boolean;

  /** Output variable */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of PaymentFileUploadDcComponent.
   * @param fb Form builder
   * @param modalService
   */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  /** This method is to initialize the component. */
  ngOnInit() {
    this.commentsForm = this.fb.group({
      comments: [null]
    });

    if (!this.parentForm.get('comments')) {
      this.parentForm.addControl('comments', this.commentsForm);
    }
  }

  /**
   * This method is used to handle the changes in the input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes && changes.isChequeScanned && changes.isChequeScanned.currentValue) ||
      (changes && changes.isPaymentScanned && changes.isPaymentScanned.currentValue)
    ) {
      this.toggleMandatoryDocument();
    }
  }

  /** Method to update payment details. */
  finalSave() {
    this.submit.emit();
  }

  /** Method to navigate to prevous section. */
  previousSection() {
    this.previous.emit();
  }

  /**
   * Method to show a confirmation popup for cancelling the transaction.
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
    this.cancelBtn.emit();
  }

  /** Method to toggle mandatory document based on scan flag. */
  toggleMandatoryDocument() {
    this.documentList.forEach(document => {
      if (this.isChequeScanned) {
        if (!this.isPaymentScanned) {
          if (document.name.english === BillingConstants.PROOF_PAYMENT) {
            document.required = false;
          } else if (document.name.english === BillingConstants.COPY_CHEQUE) {
            document.required = true;
          }
        }
      } else if (this.isPaymentScanned) {
        if (!this.isChequeScanned) {
          if (document.name.english === BillingConstants.COPY_CHEQUE) {
            document.required = false;
          } else if (document.name.english === BillingConstants.PROOF_PAYMENT) {
            document.required = true;
          }
        }
      } else {
        if (document.name.english === BillingConstants.COPY_CHEQUE) {
          document.required = true;
        } else if (document.name.english === BillingConstants.PROOF_PAYMENT) {
          document.required = true;
        }
      }
    });
  }

  /** Method to toggle scan flag. */
  deleteDocument(document: DocumentItem) {
    if (document.name.english === BillingConstants.PROOF_PAYMENT && document.documentContent === null) {
      this.isPaymentScanned = false;
    }
    if (document.name.english === BillingConstants.COPY_CHEQUE && document.documentContent === null) {
      this.isChequeScanned = false;
    }
    this.toggleMandatoryDocument();
  }

  /** Method to handle upload event. */
  uploadDocument(document: DocumentItem) {
    if (document.name.english === BillingConstants.COPY_CHEQUE && document.documentContent !== null) {
      this.isChequeScanned = true;
    }
    if (document.name.english === BillingConstants.PROOF_PAYMENT && document.documentContent !== null) {
      this.isPaymentScanned = true;
    }
    this.toggleMandatoryDocument();
  }
  // Method to emit refresh details
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }
}
