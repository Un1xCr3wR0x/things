/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MaxLength, TransactionId } from '../../../shared/enums';

@Component({
  selector: 'cim-file-upload-dc',
  templateUrl: './file-upload-dc.component.html',
  styleUrls: ['./file-upload-dc.component.scss']
})
export class FileUploadDcComponent implements OnInit {
  /**Input Variables */
  @Input() isCommentRequired: boolean;
  @Input() engagementId: number;
  @Input() parentForm: FormGroup;
  @Input() documentList: DocumentItem[] = [];
  @Input() referenceNo: number;
  @Input() isSubmit: boolean;
  @Input() isApiTriggered: boolean;
  @Input() documentTransactionId: number;

  /**Event Emiters */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

  /**Local variables */
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  contTransactionId = TransactionId.REGISTER_CONTRIBUTOR;
  bsModal: BsModalRef;
  commentMaxLength = MaxLength.COMMENTS;
  hasChanged = false;

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
      comments: '',
      checkBoxFlag: [, { validators: !this.isPrivate ? Validators.requiredTrue : null }]
    });
  }

  previousForm(): void {
    this.previous.emit();
  }

  submitEngagementDetails(): void {
    this.documentUploadForm.markAllAsTouched();
    this.submit.emit(this.documentUploadForm);
  }

  decline(): void {
    this.bsModal.hide();
  }

  confirmCancel(): void {
    this.decline();
    this.cancel.emit(this.hasChanged);
  }

  /** Method to emit refresh details. */
  refreshDocument(item: DocumentItem) {
    this.hasChanged = true;
    this.refresh.emit(item);
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof FileUploadDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.bsModal = this.modalService.show(template, config);
  }
}
