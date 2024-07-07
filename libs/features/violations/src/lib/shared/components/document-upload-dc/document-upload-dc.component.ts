import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AppConstants,
  BaseComponent,
  DocumentItem,
  LanguageToken,
  Lov,
  markFormGroupTouched,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vol-document-upload-dc',
  templateUrl: './document-upload-dc.component.html',
  styleUrls: ['./document-upload-dc.component.scss']
})
export class DocumentUploadDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  comments: FormGroup;
  show: number;
  fileUrl;
  lang: string;
  modalRef: BsModalRef;
  items: Lov[] = [];
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  // Input Variables
  @Input() isScan = true;
  @Input() referenceNo: number;
  @Input() transactionNo: string;
  @Input() documentList: DocumentItem[];
  @Input() registrationNumber: number;
  @Input() parentForm: FormGroup;
  @Input() editMode: boolean;

  //Output Variables
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

  /**
   * Creates an instance of ScanDocumentDcComponent
   * @param language
   * @memberof ScanDocumentDcComponent
   * @param modalService
  
   */
  //Added lookup service for testing do not add service in SC
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * Initialises ScanDocumentDcComponent
   * @memberof ScanDocumentDcComponent
   */
  ngOnInit() {
    scrollToTop();
    this.comments = this.createCommentsForm();
    if (this.parentForm) this.parentForm.addControl('comments', this.comments);
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
      comments: [null]
    });
  }

  /**
   * Trigger to save the documents in the
   */
  saveDocuments() {
    this.submit.emit(null);
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
    }
  }
}
