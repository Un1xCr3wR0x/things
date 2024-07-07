/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../../shared/constants';

@Component({
  selector: 'blg-credit-details-file-upload-dc',
  templateUrl: './credit-details-file-upload-dc.component.html',
  styleUrls: ['./credit-details-file-upload-dc.component.scss']
})
export class CreditDetailstFileUploadDcComponent implements OnInit {
  /** Constants */
  documentTransactionId = BillingConstants.DOCUMENT_TRANSACTION_ID;
  commentsMaxLength = BillingConstants.COMMENTS_MAX_LENGTH;

  commentsForm: FormGroup;
  modalRef: BsModalRef;

  /** Input variables */
  @Input() documentList: DocumentItem[];
  @Input() parentForm: FormGroup;
  @Input() receiptNumber: number;
  @Input() isScan: boolean;
  @Input() uuid: string;
  @Input() transactionId: string;
  @Input() businessKey: number;
  @Input() referenceNo: number;

  /** Output variable */
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();
  @Output() doc: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();

  /**
   * Create an instance of CreditDetailstFileUploadDcComponent.
   * @param fb Form builder
   * @param modalService
   */
  constructor(private modalService: BsModalService, private fb: FormBuilder) {}

  /** This method is to initializing the component. */

  ngOnInit(): void {
    this.commentsForm = this.createWavierUploadDetailForm();
    if (this.parentForm) {
      this.parentForm.addControl('commentForm', this.commentsForm);
    }
  }
  // * This method is used to create new form
  createWavierUploadDetailForm(): FormGroup {
    return this.fb.group({
      comments: [null]
    });
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
  refreshDocuments(item) {
    this.doc.emit(item);
  }
}
