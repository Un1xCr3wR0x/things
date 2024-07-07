/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms .
 */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-installment-file-upload-dc',
  templateUrl: './installment-file-upload-dc.component.html',
  styleUrls: ['./installment-file-upload-dc.component.scss']
})
export class InstallmentFileUploadDcComponent implements OnInit {
  commentsForm: FormGroup;
  commentsMaxLength = BillingConstants.COMMENTS_MAX_LENGTH;
  modalRef: BsModalRef;
  /** Input variables */
  @Input() isScan: boolean;
  @Input() uuid: string;
  @Input() parentForm: FormGroup;
  @Input() transactionId: string;
  @Input() businessKey: number;
  @Input() referenceNo: number;
  @Input() documentList: DocumentItem[];
  @Input() isDisabled = false;

  /** Output variable */
  @Output() doc: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param fb
   * @param modalService
   */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.commentsForm = this.fb.group({
      comments: [null]
    });
    if (this.parentForm) this.parentForm.addControl('commentsForm', this.commentsForm);
  }

  /** Method to reftrsh the documents. */
  refreshDocument(item) {
    this.doc.emit(item);
  }
  /** Method to update payment details. */
  finalSave() {
    // this.isDisabled = true;
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
    if (this.modalRef) this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    if (this.modalRef) this.modalRef.hide();
    this.cancelBtn.emit();
  }
}
