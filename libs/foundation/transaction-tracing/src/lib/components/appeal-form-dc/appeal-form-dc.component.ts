import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, RouterConstants, markFormGroupTouched, AlertService, DocumentItem, AppealRequest, AppealDetailsResponse, DocumentService } from '@gosi-ui/core';
import { Transaction, UuidGeneratorService } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { TransactionConstants } from '@gosi-ui/features/complaints/lib/shared/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DayCellContent } from '@fullcalendar/angular';

@Component({
  selector: 'trn-appeal-form-dc',
  templateUrl: './appeal-form-dc.component.html',
  styleUrls: ['./appeal-form-dc.component.scss']
})
export class AppealFormDcComponent implements OnInit, OnChanges {

  @ViewChild('escalateTemplate', { static: true }) escalateTemplate: TemplateRef<any>;

  @Input() transaction: Transaction;
  @Input() referenceNo: number;
  @Input() userId: number;
  @Input() transactionSource: string = "Private";
  @Input() previousRequest: AppealDetailsResponse;
  /*
   * Output variables
   */
  @Output() appealRequest: EventEmitter<AppealRequest> = new EventEmitter();
  @Output() hideAppealForm: EventEmitter<any> = new EventEmitter();

  backPath = RouterConstants.ROUTE_TRANSACTION_HISTORY;
  appealForm: FormGroup;
  uploadDocuments: DocumentItem[] = [];
  sequenceNumber: number;
  uuid: string;
  transactionId: string;
  registrationNo: number | string;
  modalRef: BsModalRef;
  header: BilingualText;
  noFilesError = false;
  diabledUpload = false;

  /**
    *
    * @param formBuilder
    */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly alertService: AlertService,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly location: Location,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.previousRequest && changes.previousRequest.currentValue) {
      this.previousRequest = changes.previousRequest.currentValue;
      this.previousRequest ? this.onLoadingPreviousRequest(this.escalateTemplate) : '';
    }

  }

  ngOnInit(): void {
    this.appealForm = this.createAppealForm();
    this.uuid = this.uuidGeneratorService.getUuid();
    this.setUpAppealForm();
    this.addAnotherDocument();
  }

  /**
   * Method to set up the appeal from required values
   */
  setUpAppealForm() {
    this.transaction?.canRequestReview
      ? this.appealForm.controls.appealType.setValue(1001) // This value is  for Appeal transaction
      : this.appealForm.controls.appealType.setValue(1002); // This value is for Review Request transaction
    this.appealForm.controls.transactionRefNumber.setValue(this.transaction?.transactionRefNo);
    this.appealForm.controls.transactionSource.setValue(this.transactionSource);
    this.appealForm.controls.objector.setValue(this.userId);
    this.appealForm.controls.registrationNo.setValue(this.transaction?.params?.REGISTRATION_NO);
  }


  /**
   * Method to create Appeal form
   * @returns formGroup
   */
  createAppealForm(): FormGroup {
    return this.formBuilder.group({
      reason: [null, Validators.compose([Validators.required])],
      appealType: [null, Validators.compose([Validators.required])],
      transactionRefNumber: [null, Validators.compose([Validators.required])],
      transactionSource: [null, Validators.compose([Validators.required])],
      objector: [null, Validators.compose([Validators.required])],
      documents: [null, Validators.compose([Validators.required])],
      registrationNo: [null, Validators.compose([Validators.required])],
      edited: [false, Validators.compose([Validators.required])]
    });
  }


  /**
   * Method to add another document to this list of documents
   */
  addAnotherDocument() {
    const documentDetails = this.transaction?.canAppeal
      ? TransactionConstants.APPEAL_DOCUMENT_DETAILS.find((item) => item.actionName == "canAppeal")
      : TransactionConstants.APPEAL_DOCUMENT_DETAILS.find((item) => item.actionName == "canRequestReview")
    this.sequenceNumber = this.uploadDocuments.length + 1;
    let documentItem = new DocumentItem();
    documentItem.uuid = this.uuid;
    documentItem.sequenceNumber = this.sequenceNumber;
    documentItem.transactionId = documentDetails.transactionId.toString();
    documentItem.documentTypeId = documentDetails.documentType;
    documentItem.name = { arabic: '', english: documentDetails.docTitle };
    documentItem.required = true;
    this.transactionId = documentItem.transactionId;
    this.uploadDocuments.push(documentItem);
    this.noFilesError = false;
    this.uploadDocuments.length = this.uploadDocuments.length;
    if (this.uploadDocuments.length > 0 && !this.uploadDocuments[this.uploadDocuments.length - 1].documentContent) {
      this.diabledUpload = true;
    }
  }

  /**
   * Method to show transactions escalation in a popup way 
   */

  onLoadingPreviousRequest(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * Method of cancel template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Metod to emit the delete document
   */
  deleteDocument(document: DocumentItem) {
    this.uploadDocuments = this.uploadDocuments.filter(item => item.contentId !== document.contentId);
    this.uploadDocuments.length == 0 ? this.addAnotherDocument() : "";
  }

  /**
   * Method that gets triggered if any change happends to the files uploadEvent
   */
  uploadEvent(flag: boolean) {
    if (this.uploadDocuments.length > 0 && this.uploadDocuments[this.uploadDocuments.length - 1].documentContent != null) {
      this.diabledUpload = false;
    }
  }

  /**
   * Method to cancel the process of raising the Appeal 
   */
  confirmGeneralCancel() {
    this.alertService.clearAlerts();
    this.modalRef?.hide();
    this.hideAppealForm.emit();
  }

  /**
   * Method to hide modal
   */
  decline() {
    this.modalRef.hide();
  }

/**
 * Method to emit appeal and request review requests after doing the proper form validation
 */
  submitAppeal() {
    let documentContentsList = this.uploadDocuments.map((item) => item.contentId)
    this.appealForm.controls.documents.setValue(documentContentsList);

    if (this.appealForm.valid && documentContentsList[0] != null) {
      this.appealRequest.emit(this.appealForm.value);
    }

    else if (!this.appealForm.valid && documentContentsList[0] != null) {
      markFormGroupTouched(this.appealForm);
      this.alertService.showMandatoryErrorMessage();
    }

    else {
      markFormGroupTouched(this.appealForm);
      this.noFilesError = true;
      this.alertService.showMandatoryErrorMessage();
    }
  }

  hideEscalationModal() {
    this.hideAppealForm.emit();
    this.modalRef?.hide();
  }

  /**
   * @param isAppealModified This method detects which option the user went with.
   *  either escalating without modification or modifiying the appeal before sending it for the second time
   */
  esclateAppeal(isAppealModified: boolean) {
    this.modalRef?.hide();
    this.appealForm.controls.reason.setValue(this.previousRequest.reason);
    this.documentService.getOldDocuments(null, null, null, this.previousRequest.refNumber).subscribe(
      response => {
        this.uploadDocuments = response;
        this.uploadDocuments.forEach(item => {item.canDelete = true; item.required = true});
        this.uploadEvent(true);
      },
      err => {
        this.alertService.showError(err.error.message);
      },
      () => { 
        isAppealModified ? this.appealForm.controls.edited.setValue(true) : this.submitAppeal();
      }
    );
  }

}
