import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  Inject,
  Input,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {
  BaseComponent,
  LanguageToken,
  Lov,
  DocumentItem,
  AppConstants,
  markFormGroupTouched,
  scrollToTop,
  AlertService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MbDocumentTransactionEnum } from '../../../shared/enums';
import { MemberData } from '../../../shared/models';

@Component({
  selector: 'mb-documents-dc',
  templateUrl: './mb-documents-dc.component.html',
  styleUrls: ['./mb-documents-dc.component.scss']
})
export class MbDocumentsDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  lang: string;
  modalRef: BsModalRef;
  items: Lov[] = [];
  commentsForm: FormGroup;
  submitted = false;
  show: number;
  fileUrl;
  regEstablishment = MbDocumentTransactionEnum.MTN_MED_BOARD_DOCTOR;
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;

  // Input Variables
  @Input() documentList: DocumentItem[];
  @Input() registrationNumber: number;
  @Input() isScan = true;
  @Input() comments = null;
  @Input() member: MemberData;
  @Input() referenceNo: number;

  //Output Variables
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<MemberData> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

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
    this.commentsForm = this.createCommentsForm();
    this.language.subscribe(language => (this.lang = language));
    if (this.commentsForm) {
      this.commentsForm.get('comments').setValue(this.comments);
    }
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
   * This method is used to initialise the form template
   */
  createCommentsForm() {
    return this.fb.group({
      comments: ['',
      { validators: Validators.compose([Validators.required]), updateOn: 'blur' }]
    });
  }

  /**
   * Trigger to save the documents in the
   */
  saveDocuments() {
    markFormGroupTouched(this.commentsForm);
    if(this.commentsForm.invalid){
      this.alertService.showMandatoryErrorMessage();
    }
    else{
    this.submitted = true;
    this.member.commentsDto = this.commentsForm.get('comments').value;
    this.submit.emit(this.member);
    }
  }

  //This method is used to reset form on on reset button
  confirmReset() {
    this.resetDocumentUploaded();
    this.modalRef.hide();
  }

  /**
   * This method is used to check if the documents has been scanned
   * @param documentItem
   */
  refreshDocuments(documentItem: DocumentItem) {
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

  //This method is used to reset form
  resetDocumentUploaded() {
    this.submitted = false;
    scrollToTop();
    if (this.documentList) {
      this.documentList.forEach((documentItem: DocumentItem) => {
        documentItem.contentId = null;
        documentItem.documentContent = null;
        documentItem.fileName = null;
        documentItem.icon = null;
        documentItem.documentType = null;
        documentItem.started = false;
        documentItem.valid = false;
      });
    }
    this.resetCommentsForm();
  }
}
