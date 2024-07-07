/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  markFormGroupTouched,
  BilingualText,
  bindToObject
} from '@gosi-ui/core';
import { OhConstants } from '../../constants';
import { ProcessType } from '../../enums';

/**
 * This component is used to handle scan of documents
 * @export
 * @class DocumentDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'oh-document-dc',
  templateUrl: './document-dc.component.html',
  styleUrls: ['./document-dc.component.scss']
})
export class DocumentDcComponent extends BaseComponent implements OnChanges, OnInit {
  /**
   * Local Variables
   */
  // injuryTransactionId = OhConstants.TRANSACTION_ID;
  uploadDocumentForm: FormGroup;
  isAppPrivate = false;
  
  addButtonDisable = false;

  isReopen = false;
  documentScanItem: DocumentItem[];
  canUpload = true;
  maxLengthComments = 300;
  documentListItem = [];
  reqdocumentTemp: Partial<DocumentItem[]>;
  TransactionId = OhConstants.DISEASE_TRANSACTION_ID;
  otherDocumentList: DocumentItem[] = [];
  i=0;
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
  /**
   * Input Variables
   */
  @Input() registrationNumber: number;
  @Input() referenceNo: number;
  @Input() documentList: DocumentItem[] = [];
  @Input() requiredList: BilingualText[];
  @Input() documents = [];
  @Input() showAddDoc: boolean = false;
  @Input() businessKey: number;
  @Input() isWorkflow = false;
  @Input() assignedRole: string;
  @Input() parentForm: FormGroup;
  @Input() isValidator1 = false;

  @Input() canEdit = true;
  @Input() showHeaders = true;
  @Input() isValidator2: boolean;
  @Input() isSelectedReasonOthers: boolean;
  @Input() processType = '';
  @Input() taskId: string;
  @Input() isReassessment = false;
  @Input() forContributorReassessments: boolean;

  @Input() transactionId: number;
  @Input() isIndividualApp = false;
  @Input() transactionType: string;
  @Input() allowanceFlag: boolean;
  @Input() allowanceFlagReturn: boolean;
  @Input() repatriationReturn: boolean;
  @Input() isDiseaseReturn: boolean;
  @Input() repatriation: boolean = false;
  /**
   * Output Events
   */
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() documentFormDetails: EventEmitter<null> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();
  @Output() uploadFailed: EventEmitter<boolean> = new EventEmitter();

  /**
   * Creates an instance of DocumentDcComponent
   * @memberof DocumentDcComponent
   */

  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }

  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.uploadDocumentForm = this.createUploadForm();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.isAppPrivate || this.isReassessment || this.repatriation) {
      this.disableField(this.uploadDocumentForm.get('checkBoxFlag'));
    }

    if (this.isSelectedReasonOthers === true) {
      this.enableField(this.uploadDocumentForm.get('comments'));
    }
    if (this.parentForm) {
      this.parentForm.addControl('uploadDocument', this.uploadDocumentForm);
    }
    if(this.allowanceFlag && this.allowanceFlagReturn) {
      this.canUpload = false;
    }
  }
  /**
   * This method is used to detect input changes and handles corresponding functionalities
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
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
    if (this.isAppPrivate && (this.processType === ProcessType.ADD || this.processType === ProcessType.EDIT || this.processType === ProcessType.REPATRIATION)) {
      for (const documentItem of this.documentList) {
        if (
          documentItem.name.english === 'Occupational Hazard Processes Form' &&
          (documentItem.documentContent === null || documentItem.documentContent === 'NULL')
        ) {
          documentItem.required = true;
          documentItem.valid = false;
        }
      }
    } else if (!this.isAppPrivate && this.documentList && this.transactionType !== OhConstants.GROUP_INJURY_TRANSACTION_KEY) {
      this.documentList = this.documentList?.filter(
        item => item?.name?.english !== 'Occupational Hazard Processes Form'
      );
    }
    if(this.isIndividualApp && this.documentList){
      this.documentList = this.documentList.filter(
        item => item.name.english !== 'Iqama'
      );

    }
    if (this.processType === ProcessType.RE_OPEN && this.assignedRole === undefined) {
      this.setDocumentCondition();
    }
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
    if (this.checkMandatoryDocuments()) {
      if (!this.isAppPrivate && this.uploadDocumentForm.invalid) {
        markFormGroupTouched(this.uploadDocumentForm);
        this.documentFormDetails.emit(this.uploadDocumentForm.value);
      } else {
        this.submit.emit(this.uploadDocumentForm.get('comments').value);
      }
    }
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.documentList.forEach(doc => {
      if (doc.started && doc.uploadFailed) {
        doc.uploadFailed = false;
        doc.started = false;
      }
      if (!doc.documentContent) {
        doc.isScanning = false;
      }
    });
    this.previous.emit();
  }
  /**
   * Creating Upload Form and initialize
   */
  createUploadForm() {
    return this.fb.group({
      checkBoxFlag: [false, Validators.requiredTrue],
      comments: []
    });
  }

  /**
   * This method is used to show the cancellation template on click of cancel
   */
  showCancelTemplate() {
    this.template.emit();
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
  checkMandatoryDocuments() {
    let isDocumentsValid: boolean;
   if (this.isAppPrivate) {
      isDocumentsValid = this.checkDocumentScanned();
   } else {
     isDocumentsValid = this.checkDocumentUploaded();
   }
    return isDocumentsValid;
  }

  /** Method to check whether andatory documents are uploaded. */
  checkDocumentUploaded() {
    let uploadSuccess = true;
    if (this.documentList.length > 0) {
      this.documentList.forEach(document => {
        if (document.required && (document?.documentContent === null || document?.documentContent === 'NULL')) {
          document.uploadFailed = true;
          uploadSuccess = false;
          this.uploadFailed.emit(document.uploadFailed);
        } else if (document) {
          document.uploadFailed = false;
        }
      });      
    }
    if(this.isDiseaseReturn){
      if (this.documents.length > 0) {
        this.documents.forEach(document => {
          if (document[0]?.required  && (document[0]?.documentContent === null || document[0]?.documentContent === 'NULL')) {
            document[0].uploadFailed = true;
            uploadSuccess = false;
            this.uploadFailed.emit(document[0].uploadFailed);
          } else if (document[0]) {
            document[0].uploadFailed = false;
          }
        });      
      }
    }
    return uploadSuccess;
  }

  /** Method to check whether andatory documents are scanned. */
  checkDocumentScanned() {
    let scanSuccess = true;
    for (const documentItem of this.documentList) {
      if (documentItem.required && documentItem.documentContent === null) {
        documentItem.uploadFailed = true;
        scanSuccess = false;
        this.uploadFailed.emit(documentItem.uploadFailed);
      } else {
        documentItem.uploadFailed = false;
      }
    }
    return scanSuccess;
  }
  /**
   * method to check if process type is reopen
   */
  setProcessType() {
    if (this.isAppPrivate) {
      if (this.taskId === null || this.taskId === undefined) {
        this.canUpload = true;
      } else if (this.taskId !== null && this.taskId !== undefined) {
        if (
          this.processType === ProcessType.EDIT ||
          this.processType === ProcessType.REOPEN ||
          this.processType === ProcessType.RE_OPEN ||
          this.processType === ProcessType.MODIFY
        ) {
          this.canUpload = true;
        } else {
          this.canUpload = false;
        }
      }
    } else {
      if (this.taskId === null || this.taskId === undefined) {
        this.canUpload = true;
      } else if (this.taskId !== null && this.taskId !== undefined) {
        if (
          this.processType === ProcessType.EDIT ||
          this.processType === ProcessType.REOPEN ||
          this.processType === ProcessType.RE_OPEN ||
          this.processType === ProcessType.MODIFY
        ) {
          this.canUpload = true;
        }
      }
    }
    if (this.processType === ProcessType.REOPEN) {
      this.isReopen = true;
      this.setDocumentCondition();
    }
    if(this.allowanceFlag && this.allowanceFlagReturn) {
      this.canUpload = false;
    }
    if(this.repatriationReturn) {
      this.canUpload = false;
    }
  }
  setDocumentCondition() {
    if (this.requiredList) {
      for (const doc of this.requiredList) {
        this.reqdocumentTemp = this.documentList.filter(item => item.name.english === doc.english);
        this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
        if (this.reqdocumentTemp && this.documentListItem) {
          this.documentListItem.push(this.reqdocumentTemp);
          this.documentListItem = this.documentListItem.filter(element => this.reqdocumentTemp.indexOf(element) !== -1);
        } else {
          this.documentListItem.push(this.reqdocumentTemp);
        }
      }
    }
    if (this.documentList?.length > 0 && this.documentListItem?.length > 0) {
      this.documentListItem.forEach(element => {
        this.documentList.forEach(item => {
          if (item?.name?.english === element[0]?.name?.english) {
            if (item?.documentContent === null) {
              item.required = true;
              item.valid = false;
            }
          }
        });
      });
    }
    if (!this.isAppPrivate && this.documentListItem.length > 0) {
      this.documents = this.documentListItem;
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
  uploadedEventDetails(item) {
    for (const documentItem of this.documentList) {
      if (documentItem.name.english === 'Occupational Hazard Processes Form') {
        if (item.name.english === documentItem.name.english) {
          documentItem.uploadFailed = false;
          documentItem.valid = true;
        }
      }
      if (documentItem.name.english === 'Medical Report' || documentItem.name.english === 'Other documents') {
        if (item.name.english === documentItem.name.english) {
          documentItem.uploadFailed = false;
          documentItem.valid = true;
        }
      }
      if (this.isReassessment) {
        documentItem.uploadFailed = false;
        documentItem.valid = true;
      }
    }
  }

}

