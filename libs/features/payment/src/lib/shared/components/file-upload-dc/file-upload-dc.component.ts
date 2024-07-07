/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnInit, EventEmitter, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, DocumentItem } from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pmt-file-upload-dc',
  templateUrl: './file-upload-dc.component.html',
  styleUrls: ['./file-upload-dc.component.scss']
})
export class FileUploadDcComponent implements OnInit {
  /**Input Variables */
  @Input() isCommentRequired: boolean;
  @Input() engagementId: number;
  @Input() contractId: number;
  @Input() parentForm: FormGroup;
  @Input() referanceNumber;
  @Input() documentList: DocumentItem[] = [];
  @Input() isContract;
  @Input() transactionNumber;
  @Input() uuid;
  @Input() transactionId;
  @Input() businessKey;
  @Input() cancelMessage = 'THEME.CONFIRM-CANCEL';

  /**Event Emiters */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancelDoc: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() onDelete: EventEmitter<DocumentItem> = new EventEmitter();
  /**Local variables */
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  contTransactionId = 1234;
  bsModal: BsModalRef;
  commentMaxLength = 100;

  constructor(
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.documentUploadForm = this.createCommentsForm();
    this.parentForm.addControl('documentsForm', this.documentUploadForm);
  }

  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: ''
    });
  }

  previousContForm(): void {
    this.previous.emit();
  }

  submitPaymentDetails(): void {
    this.documentUploadForm.markAllAsTouched();
    this.submit.emit(this.documentUploadForm);
  }

  declineContract(): void {
    this.bsModal.hide();
  }

  confirmContractCancel(): void {
    this.declineContract();
    this.cancelDoc.emit();
  }

  /** Method to emit refresh details. */
  refreshDocument(item: DocumentItem) {
    this.refresh.emit(item);
  }
  deleteDocument(doc: DocumentItem) {
    this.onDelete.emit(doc);
  }
  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showPaymentTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.bsModal = this.modalService.show(template, config);
  }
}
