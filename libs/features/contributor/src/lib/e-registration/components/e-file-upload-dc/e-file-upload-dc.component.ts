/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, DocumentItem, scrollToTop } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContributorService, MaxLengthEnum, TransactionId } from '../../../shared';

@Component({
  selector: 'cnt-e-file-upload-dc',
  templateUrl: './e-file-upload-dc.component.html',
  styleUrls: ['./e-file-upload-dc.component.scss']
})
export class EFileUploadDcComponent implements OnInit {
  /**Input Variables */
  @Input() isCommentRequired: boolean;
  @Input() engagementId: number;  @Input() parentForm: FormGroup;
  @Input() documentList: DocumentItem[] = [];
  @Input() referenceNo: number;
  @Input() isSubmit: boolean;
  @Input() isApiTriggered: boolean;
  @Input() uuid;
  @Input() isEditMode: boolean;


  /**Event Emiters */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();
  @Output() onContinueClicked = new EventEmitter();


  /**Local variables */
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  contTransactionId = TransactionId.E_REGISTER_ENGAGEMENT;
  bsModal: BsModalRef;
  commentMaxLength = MaxLengthEnum.COMMENTS;
  hasChanged = false;

  constructor(
    readonly modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if(!this.isEditMode)this.documentUploadForm = this.createCommentsForm();
    this.parentForm.addControl('documentsForm', this.documentUploadForm);
  }

  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: '',
      checkBoxFlag: [false, { validators: Validators.requiredTrue }]    });
  }

  previousForm(): void {
    this.previous.emit();
  }

  submitDocumentDetails(): void {
    if(!this.isEditMode){
     this.documentUploadForm.markAllAsTouched();
    if(this.documentUploadForm.invalid ){
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    } else {
    this.submit.emit();
    // this.onContinueClicked.emit();
    }
    }
    else{
        this.submit.emit();
    }
  }

  decline(): void {
    this.bsModal.hide();
  }

  confirmCancel(): void {
    this.decline();
    this.reset.emit(this.hasChanged);
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
