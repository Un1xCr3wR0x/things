/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, DocumentItem, DocumentService } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MaxLengthEnum, TransactionId } from '../../../shared';
@Component({
    selector: 'cnt-enter-rpa-file-upload-dc',
    templateUrl: './enter-rpa-file-upload-dc.component.html',
    styleUrls: ['./enter-rpa-file-upload-dc.component.scss']
  })
  export class EnterRpaFileUploadDcComponentimplements implements OnInit {
    /**Input Variables */
    @Input() isCommentRequired: boolean;
    @Input() engagementId: number;
    @Input() parentForm: FormGroup;
    @Input() documentList: DocumentItem[] = [];
    @Input() referenceNo: number;
    @Input() isSubmit: boolean;
    @Input() isApiTriggered: boolean;
    @Input() isFirstSchema: boolean;
    @Input() contTransactionId:number;
  
    /**Event Emiters */
    @Output() previous: EventEmitter<null> = new EventEmitter();
    @Output() submit: EventEmitter<object> = new EventEmitter();
    @Output() cancel: EventEmitter<boolean> = new EventEmitter();
    @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
    @Output() showError: EventEmitter<string> = new EventEmitter();

  
    /**Local variables */
    documentUploadForm: FormGroup;
    bsModal: BsModalRef;
    commentMaxLength = MaxLengthEnum.COMMENTS;
    hasChanged = false;
  
    constructor(
      readonly modalService: BsModalService,
      readonly fb: FormBuilder,
      readonly documentService:DocumentService,
      readonly alertService: AlertService,
      @Inject(ApplicationTypeToken) readonly appToken: string
    ) {}
  
    ngOnInit(): void {
      this.documentUploadForm = this.createCommentsForm();
      this.parentForm.addControl('documentsForm', this.documentUploadForm);
    }
  
    createCommentsForm(): FormGroup {
      return this.fb.group({
        comments: '',
      });
    }
  
    previousForm(): void {
      this.previous.emit();
    }
  
    submitEngagementDetails(): void {
      this.documentUploadForm.markAllAsTouched();
      if(this.documentUploadForm.invalid ){
        this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
      } 
      else {
        this.submit.emit(this.documentUploadForm);
        this.decline();
      }
    }

    checkMandatory(){
      this.documentUploadForm.markAllAsTouched();
      if(this.documentUploadForm.invalid ){
        this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
        return false;
      } else if(!this.checkDocumentValidity()){
        return false;
      }
      else {
        return true;
      }
    }

        /**
   * Method to check form validity
   * @param form form control */
        checkDocumentValidity() {
          if (!this.documentService.checkMandatoryDocuments(this.documentList)) {
            this.alertService.showMandatoryDocumentsError();
            return false;
          } else {
            return true;
          }
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
  