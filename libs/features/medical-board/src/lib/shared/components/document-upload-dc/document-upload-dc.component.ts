/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  scrollToTop,
  markFormGroupTouched,
  Lov,
  AppConstants,
  LanguageToken,
  BaseComponent,
  AlertService,
  BilingualText
} from '@gosi-ui/core';
import { MaxLengthEnum, MbDocumentTransactionEnum } from '../../../shared/enums';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MemberData } from '../..';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-document-upload-dc',
  templateUrl: './document-upload-dc.component.html',
  styleUrls: ['./document-upload-dc.component.scss']
})
export class DocumentUploadDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  lang: string;
  modalRef: BsModalRef;
  items: Lov[] = [];
  comments: FormGroup;
  submitted = false;
  show: number;
  fileUrl;

  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  otherDocuments: DocumentItem = {
    ...new DocumentItem(),
    documentTypeId: 2504,
    required: true,
    name: {
      arabic: 'مستندات اخرى',
      english: 'Other documents'
    },
    description: 'addedByUser',
    documentContent: null,
    reuse: false,
    sequenceNumber: null,
    documentClassification: 'External',
    parentDocumentId: null,
    fromJsonToObject: () => new DocumentItem()
  };
  otherDocumentList: DocumentItem[] = [];
  i = 0;
  // Input Variables
  @Input() documentList: DocumentItem[];
  @Input() registrationNumber: number;
  @Input() isScan = true;
  @Input() referenceNo: number;
  @Input() transactionId: string;
  @Input() isAddOtherDocuments = false;
  @Input() isClarification = false;
  @Input() showPreviousButton = true;
  @Input() isRequestMedicalReports = false;
  @Input() investigationDoc: DocumentItem[];

  //Output Variables
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() submit: EventEmitter<string> = new EventEmitter();
  @Output() onDocUploadCancel: EventEmitter<null> = new EventEmitter();
  @Output() uploadFailed = new EventEmitter();

  /**
   * Creates an instance of ScanDocumentDcComponent
   * @param modalService
   * @param language
   * @memberof ScanDocumentDcComponent
   */
  //Added lookup service for testing do not add service in SC
  constructor(
    readonly alertService: AlertService,
    private fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private modalService: BsModalService
  ) {
    super();
  }

  /**
   * Initialises ScanDocumentDcComponent
   * @memberof ScanDocumentDcComponent
   */
  ngOnInit() {
    this.comments = this.createCommentsForm();
  }

  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentList && changes.documentList.currentValue !== null) {
      this.documentList = changes.documentList.currentValue;
    }
    if (changes?.investigationDoc && changes?.investigationDoc?.currentValue) {
      this.investigationDoc = changes?.investigationDoc?.currentValue;
    }
  }

  /**
   * This method is used to reset the form to initial template
   */
  resetCommentsForm() {
    if (this.comments) {
      this.comments.reset(this.createCommentsForm().getRawValue());
      this.comments.updateValueAndValidity();
      this.comments.markAsPristine();
      this.comments.markAsUntouched();
    }
  }

  /**
   * This method is used to initialise the form template
   */
  createCommentsForm() {
    return this.fb.group({
      comments: ['', { validators: Validators.compose([Validators.required]), updateOn: 'blur' }]
    });
  }

  /**
   * Trigger to save the documents in the
   */
  saveDocuments() {
    if (this.checkDocumentValidity()) {
      if (this.comments.invalid) {
        markFormGroupTouched(this.comments);
        this.alertService.showMandatoryErrorMessage();
      } else {
        this.submitted = true;
        const comments = this.comments.get('comments').value;
        this.submit.emit(comments);
      }
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocument(docsItem: DocumentItem) {
    this.refresh.emit(docsItem);
  }

  /**
   * To show the confirmation modal before deleting the document
   * @param template
   */
  deleteDocument(docsItem: DocumentItem) {
    if (docsItem) {
      this.delete.emit(docsItem);
      if (docsItem?.description === 'addedByUser') {
        this.removeDocument(docsItem.sequenceNumber);
      }
    }
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
      this.documentList.forEach((docsItem: DocumentItem) => {
        docsItem.contentId = null;
        docsItem.documentContent = null;
        docsItem.fileName = null;
        docsItem.icon = null;
        docsItem.documentType = null;
        docsItem.started = false;
        docsItem.valid = false;
      });
    }
    this.resetCommentsForm();
  }
  /**
   *
   * @param index Add document
   */
  addDocument() {
    const isDocumentUploaded = this.otherDocumentList.findIndex(doc => doc.documentContent === null) < 0;
    //TODO optional document button fix mb-contributor-clarification-sc
    if (this.otherDocumentList.length === 0 || (isDocumentUploaded && this.otherDocumentList.length < 3)) {
      this.otherDocumentList.push({ ...this.otherDocuments, sequenceNumber: this.i, fromJsonToObject: json => json });
      this.i++;
    }
  }
  removeDocument(i) {
    if (i > -1) {
      this.otherDocumentList.splice(i, 1);
    }
  }
  checkDocumentValidity() {
    let documentsValid = true;
    this.documentList?.forEach(document => {
      if (document.required && (document.documentContent === null || document.documentContent === 'NULL')) {
        document.uploadFailed = true;
        documentsValid = false;
        this.uploadFailed.emit(document.uploadFailed);
      } else {
        document.uploadFailed = false;
      }
    });
    return documentsValid;
  }
}
