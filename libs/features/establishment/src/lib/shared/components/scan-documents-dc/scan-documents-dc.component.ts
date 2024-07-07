/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  DocumentItem,
  LanguageToken,
  Lov,
  markFormGroupTouched,
  scrollToTop,
  Establishment
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { DocumentTransactionIdEnum } from '../../enums';

/**
 * This component is used to handle scan of documents
 * @export
 * @class ScanDocumentsDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'est-scan-documents-dc',
  templateUrl: './scan-documents-dc.component.html',
  styleUrls: ['./scan-documents-dc.component.scss']
})
export class ScanDocumentsDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  lang: string;
  modalRef: BsModalRef;
  items: Lov[] = [];
  commentsForm: FormGroup;
  submitted = false;
  show: number;
  fileUrl;

  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  // Input Variables
  @Input() documentList: DocumentItem[];
  @Input() registrationNumber: number;
  @Input() isScan = true;
  @Input() comments = null;
  @Input() csrComments = null;
  @Input() establishment: Establishment;
  @Input() referenceNo: number;
  @Input() regEstablishment = DocumentTransactionIdEnum.REG_ESTABLISHMENT;

  //Output Variables
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();
  @Output() keepDraft: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ScanDocumentDcComponent
   * @param modalService
   * @param language
   * @memberof ScanDocumentDcComponent
   */
  //Added lookup service for testing do not add service in SC
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
  }

  /**
   * Initialises ScanDocumentDcComponent
   * @memberof ScanDocumentDcComponent
   */
  ngOnInit() {
    this.commentsForm = this.createCommentsForm();
    if (this.commentsForm) {
      this.commentsForm.get('comments').setValue(this.comments);
    }
    this.language.subscribe(language => (this.lang = language));
  }

  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentList && changes.documentList.currentValue !== null) {
      this.documentList = changes.documentList.currentValue;
    }
  }

  /**
   * This method is used to initialise the form template
   */
  createCommentsForm() {
    return this.fb.group({
      comments: ''
    });
  }

  /**
   * This method is used to reset the form to initial template
   */
  resetCommentsForm() {
    if (this.commentsForm) {
      this.commentsForm.reset(this.createCommentsForm().getRawValue());
      this.commentsForm.updateValueAndValidity();
      this.commentsForm.markAsPristine();
      this.commentsForm.markAsUntouched();
    }
  }

  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocument(documentItem: DocumentItem) {
    this.refresh.emit(documentItem);
  }

  /**
   * To show the confirmation modal before deleting the document
   * @param template
   */
  deleteDocument(documentItem: DocumentItem) {
    if (documentItem) {
      this.delete.emit(documentItem);
    }
  }

  /**
   * Trigger to save the documents in the
   */
  saveDocuments() {
    this.submitted = true;
    markFormGroupTouched(this.commentsForm);
    this.submit.emit(this.commentsForm.getRawValue());
  }

  /**
   * For moving to previous form
   */
  previousForm() {
    this.previous.emit();
  }
  /**
   * This method is to show a confirmation popup for cancelling the form
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.modalRef.hide();
    this.cancelBtn.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }

  /**
   * This method is to decline cancelation the form   *
   */
  decline() {
    this.modalRef.hide();
  }

  //This method is used to reset form on on reset button
  confirmReset() {
    this.resetDocuments();
    this.modalRef.hide();
  }

  //This method is used to reset form
  resetDocuments() {
    this.submitted = false;
    scrollToTop();
    if (this.documentList) {
      this.documentList.forEach((documentItem: DocumentItem) => {
        documentItem.contentId = null;
        documentItem.documentContent = null;
        documentItem.started = false;
        documentItem.valid = false;
        documentItem.fileName = null;
        documentItem.icon = null;
        documentItem.documentType = null;
      });
    }
    this.resetCommentsForm();
  }

  /**
   * This method is to keep transactions in draft
   */
  onKeepDraft() {
    this.modalRef.hide();
    this.keepDraft.emit();
  }
}
