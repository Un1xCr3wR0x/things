/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MaxLengthEnum, TransactionId } from '../../enums';

@Component({
  selector: 'cnt-contract-file-upload-dc',
  templateUrl: './file-upload-dc.component.html',
  styleUrls: ['./file-upload-dc.component.scss']
})
export class FileUploadDcComponent implements OnInit {
  /**Input Variables */
  @Input() isCommentRequired: boolean;
  @Input() engagementId: number;
  @Input() contractId: number;
  @Input() parentForm: FormGroup;
  @Input() referenceNumber;
  @Input() documentList: DocumentItem[] = [];
  @Input() isContract;
  @Input() transactionNumber;
  @Input() uuid;
  @Input() infoMessage: string = 'CONTRIBUTOR.COMPLIANCE.ATLEAST-ONE_DOC';
  /**Event Emiters */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() delete: EventEmitter<null> = new EventEmitter();

  /**Local variables */
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  contTransactionId = TransactionId.ADD_CONTRACT;
  bsModal: BsModalRef;
  commentMaxLength = MaxLengthEnum.COMMENTS;

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

  submitContractDetails(): void {
    this.documentUploadForm.markAllAsTouched();
    this.submit.emit(this.documentUploadForm);
  }

  declineContract(): void {
    if (this.bsModal) this.bsModal.hide();
  }

  confirmContractCancel(): void {
    this.declineContract();
    this.reset.emit();
  }

  /** Method to emit refresh details. */
  refreshDocument(item: DocumentItem) {
    this.refresh.emit(item);
    this.changeDocStatus();
  }
  /** Method to change document status. */
  changeDocStatus() {
    if (this.parentForm && !this.parentForm.get('docStatus.changed'))
      this.parentForm.addControl('docStatus', this.fb.group({ changed: true }));
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showContractTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.bsModal = this.modalService.show(template, config);
  }
}
