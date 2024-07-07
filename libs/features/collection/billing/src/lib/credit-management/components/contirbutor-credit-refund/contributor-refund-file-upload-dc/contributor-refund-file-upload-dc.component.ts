/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../../shared/constants';
import { DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'blg-contributor-refund-file-upload-dc',
  templateUrl: './contributor-refund-file-upload-dc.component.html',
  styleUrls: ['./contributor-refund-file-upload-dc.component.scss']
})
export class ContributorRefundFileUploadDcComponent implements OnInit {
  /** Local variables */
  commentsFormValue: FormGroup;
  modalRef: BsModalRef;

  /** Input variables */
  @Input() isScan: boolean;
  @Input() uuid: string;
  @Input() transactionId: string;
  @Input() businessKey: number;
  @Input() referenceNo: number;
  @Input() documentList: DocumentItem[];
  @Input() parentForm: FormGroup;
  @Input() receiptNumber: number;

  /** Output variable */
  @Output() doc: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  /** Constants */
  documentTransactionId = BillingConstants.DOCUMENT_TRANSACTION_ID;
  commentsMaxLengthValue = BillingConstants.COMMENTS_MAX_LENGTH;

  /**
   * Creates an instance of PaymentFileUploadDcComponent.
   * @param fb Form builder
   * @param modalService
   */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  /** This method is to initialize the component. */

  ngOnInit(): void {
    this.commentsFormValue = this.createWavierDetailForm();

    if (this.parentForm) {
      this.parentForm.addControl('commentForm', this.commentsFormValue);
    }
  }
  /** This method is to create form */
  createWavierDetailForm(): FormGroup {
    return this.fb.group({
      comments: [null]
    });
  }

  /** Method to update payment details. */
  finalSaveDetails() {
    this.submit.emit();
  }

  /** Method to navigate to prevous section. */
  previousSections() {
    this.previous.emit();
  }

  /** Method to reftrsh the documents. */
  refreshDocument(item) {
    this.doc.emit(item);
  }
  /** Method to decline the popUp. */
  declines() {
    this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form. */
  confirmOnCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /**
   * Method to shows a confirmation popup for cancelling the transaction.
   * @param template template
   */
  popUpTemplate(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
}
