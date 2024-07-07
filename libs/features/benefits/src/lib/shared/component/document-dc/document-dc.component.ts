/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ApplicationTypeEnum, DocumentItem } from '@gosi-ui/core';
import { ProcessType } from '../../enum';
import { BenefitBaseScComponent } from '../base/benefit-base-sc.component';
import { Comments } from '../../models/ui-benefits-response';
import { markFormGroupTouched } from '../../utils/benefitUtil';

/**
 * This component is used to handle scan of documents
 * @export
 * @class DocumentDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'bnt-document-dc',
  templateUrl: './document-dc.component.html',
  styleUrls: ['./document-dc.component.scss']
})
export class DocumentDcComponent extends BenefitBaseScComponent implements OnChanges, OnInit {
  /**
   * Local Variables
   */

  uploadDocumentForm: FormGroup;
  isAppPrivate: boolean;
  isSmallScreen: boolean;
  isReopen = false;
  canUpload = true;
  uuid: string;

  /**
   * Input Variables
   */
  @Input() documentList: DocumentItem[];
  @Input() documents;
  @Input() businessKey: number;
  @Input() referenceNo: number;
  @Input() requestId: number;
  @Input() isWorkflow = false;
  @Input() isDisabled = false;
  @Input() assignedRole: string;
  @Input() parentForm: FormGroup;
  @Input() canEdit = true;
  @Input() isValidator2: boolean;
  @Input() isSelectedReasonOthers: boolean;
  @Input() isCommitment = false;
  @Input() processType = '';
  @Input() requestTransactionId: string;
  @Input() isEditMode: boolean;
  @Input() isRemove: boolean;
  @Input() showActionsButtons = true;
  /**
   * Output Events
   */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() cancelDoc: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() documentFormDetails: EventEmitter<null> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() uploadFailed = new EventEmitter();
  @Output() uploadSuccess: EventEmitter<Comments> = new EventEmitter();
  @Output() confirmCancelAction: EventEmitter<null> = new EventEmitter();
  @Output() decline: EventEmitter<null> = new EventEmitter();

  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.uploadDocumentForm = this.createUploadForm();
    this.uuid = this.uuidGeneratorService.getUuid();
    if (this.isEditMode) this.uuid = null;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.isSelectedReasonOthers === true) {
      this.enableField(this.uploadDocumentForm.get('comments'));
    }
    if (this.parentForm) {
      this.parentForm.addControl('uploadDocument', this.uploadDocumentForm);
    }
    //to get the screen width
    this.getScreenSize();
  }
  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isSelectedReasonOthers && this.uploadDocumentForm) {
      if (changes.isSelectedReasonOthers.currentValue === true) {
        this.enableField(this.uploadDocumentForm.get('comments'));
      } else if (changes.isSelectedReasonOthers.currentValue === false) {
        this.disableField(this.uploadDocumentForm.get('comments'));
        if (this.parentForm) {
          this.parentForm.addControl('uploadDocument', this.uploadDocumentForm);
        }
      }
    }
    if (changes && changes.isEditMode) this.isEditMode = changes.isEditMode.currentValue;
    if (this.isEditMode) this.uuid = null;

    if (changes && changes.isDisabled) this.isDisabled = changes.isDisabled.currentValue;
    this.setProcessType();
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
    if (this.checkDocumentValidity()) {
      if (this.uploadDocumentForm.invalid) {
        markFormGroupTouched(this.uploadDocumentForm);
        this.documentFormDetails.emit();
      } else {
        // this.submit.emit();
        this.uploadSuccess.emit({ comments: this.uploadDocumentForm.get('comments').value });
      }
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }
  confirmCancel() {
    this.confirmCancelAction.emit();
  }

  declineCancel() {
    this.decline.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }
  /**
   * Creating Upload Form and initialize
   */
  createUploadForm() {
    return this.fb.group({
      comments: []
    });
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   */
  showCancelTemplate() {
    this.cancelDoc.emit();
  }
  /**
   * This method is used to get the document type from the file name
   * @param documentItem
   */
  getDocumentType(documentItem: DocumentItem) {
    if (documentItem && documentItem.fileName) {
      return documentItem.fileName.slice(documentItem.fileName.length - 3).toLowerCase();
    }
  }
  /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkDocumentValidity() {
    let documentsValid = true;
    this.documentList?.forEach(document => {
      if (document.required && (document.documentContent === null || document.documentContent === 'NULL')) {
        document.uploadFailed = true;
        documentsValid = false;
        this.uploadFailed.emit(document.uploadFailed);
      } else {
        document.uploadFailed = false;
        // this.uploadSuccess.emit();
      }
    });
    return documentsValid;
  }

  /** Method to check whether andatory documents are uploaded. */
  checkDocumentUploaded() {
    let uploadSuccess = true;
    if (this.documentList.length > 0) {
      this.documentList.forEach(document => {
        if (document.required && (document.documentContent === null || document.documentContent === 'NULL')) {
          document.uploadFailed = true;
          uploadSuccess = false;
          this.uploadFailed.emit(document.uploadFailed);
        } else {
          document.uploadFailed = false;
          // this.uploadSuccess.emit();
        }
      });
    }
    return uploadSuccess;
  }

  /** Method to check whether andatory documents are scanned. */
  checkDocumentScanned() {
    let scanSuccess = true;
    for (const documentItem of this.documentList) {
      if (documentItem.required && !documentItem.valid) {
        documentItem.uploadFailed = true;
        scanSuccess = false;
      } else {
        documentItem.uploadFailed = false;
        // this.uploadSuccess.emit();
      }
    }
    return scanSuccess;
  }
  /**
   * method to check if process type is reopen
   */
  setProcessType() {
    if (this.processType === ProcessType.REOPEN) {
      this.isReopen = true;
    }
  }

  /**
   * Nethod to enable form control.
   * @param formControl form control
   */
  enableField(formControl: AbstractControl) {
    formControl.setValidators([Validators.required]);
    formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
}
