import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  LookupService,
  UuidGeneratorService,
  removeEscapeChar
} from '@gosi-ui/core';
import {
  DocumentManagementScBaseComponent,
  DocumentUploadRequest,
  EstablishmentConstants,
  EstablishmentService
} from '@gosi-ui/features/establishment/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'est-upload-document-sc',
  templateUrl: './upload-document-sc.component.html',
  styleUrls: ['./upload-document-sc.component.scss']
})
export class UploadDocumentScComponent extends DocumentManagementScBaseComponent implements OnInit {
  modalRef: BsModalRef;
  estRegNo: number;
  rowSize = 3;
  documents: DocumentItem[] = [];
  uploadDocumentForm: FormGroup = new FormGroup({});
  descriptionMaxLength = EstablishmentConstants.EST_DOC_DESCRIPTION_MAX_LENGTH;
  uuid: string;
  referenceNo: number;
  showScan: boolean;
  isReadOnly: boolean;

  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly uuidService: UuidGeneratorService,
    readonly establishmentService: EstablishmentService
  ) {
    super(documentService, alertService);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      param => (this.estRegNo = param.get('registrationNo') ? Number(param.get('registrationNo')) : null)
    );
    this.uploadDocumentForm = this.createUploadDocumentForm();
    this.uuid = this.uuidService.getUuid();
    this.documents = [];
    const doc = new DocumentItem();
    doc.required = true;
    doc.name.english = '';
    doc.name.arabic = '';
    this.documents.push(doc);
    super.getDocuments();
  }

  /**
   * Method to create violations form
   */
  createUploadDocumentForm(): FormGroup {
    return this.fb.group({
      documentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      description: ['', { validators: Validators.compose([Validators.required, Validators.minLength(3)]) }]
    });
  }
  setDocType() {
    if (this.uploadDocumentForm.get('documentType').value.english !== null) {
      this.documents[0].name.english = this.uploadDocumentForm.get('documentType').value.english;
      this.documents[0].name.arabic = this.uploadDocumentForm.get('documentType').value.arabic;
    }
    if (this.checkForDocumentUploaded() === true) {
      const fileName = this.documents[0]?.fileName.split('_');
      fileName[0] = this.uploadDocumentForm.get('documentType').value.english;
      this.documents[0].fileName = fileName.join('_');
    }
  }
  setDescription() {
    if (
      this.uploadDocumentForm.get('description').value !== '' &&
      this.uploadDocumentForm.get('description').value !== null
    ) {
      this.documents[0].description = removeEscapeChar(this.uploadDocumentForm.get('description').value);
    }
  }
  /**
   * Method to get the document content
   * @param doc
   */
  bindDocumentContent(doc: DocumentItem) {
    this.documentService
      .refreshDocument(
        doc,
        this.estRegNo,
        this.documentTransactionKey,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.uuid
      )
      .subscribe(res => {
        doc = res;
        doc.uuid = this.uuid;
        doc.businessKey = this.estRegNo;
      });
  }
  mandatoryDocCheck() {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }
  uploadDocuments() {
    this.uploadDocumentForm.markAllAsTouched();
    if (this.uploadDocumentForm.invalid) this.alertService.showMandatoryErrorMessage();
    else if (!this.mandatoryDocCheck()) this.alertService.showMandatoryDocumentsError();
    else {
      let docTypeId: number;
      this.documentTypeList?.items.forEach(element => {
        if (this.uploadDocumentForm.get('documentType').value.english === element?.value?.english)
          docTypeId = element?.code;
      });
      const docUploadData: DocumentUploadRequest = {
        description: this.uploadDocumentForm.get('description').value,
        documentTypeId: docTypeId,
        uuid: this.uuid
      };
      this.establishmentService.uploadEstDoc(this.estRegNo, docUploadData).subscribe(
        res => {
          this.location.back();
          this.alertService.showSuccess(res.message);
        },
        err => {
          this.showError(err);
        }
      );
    }
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, ignoreBackdrop: boolean): void {
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: ignoreBackdrop
    });
  }
  /**method to initiate cancel template
   *
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    if (this.checkForDocumentUploaded() === true) {
      this.removeDocument();
    } else this.location.back();
  }
  checkForDocumentUploaded(): boolean {
    if (this.documents[0]?.contentId && this.documents[0]?.documentContent) return true;
    else return false;
  }
  removeDocument() {
    const doc = this.documents[0];
    this.documentService.deleteDocument(doc?.businessKey, doc?.name?.english, null, doc?.uuid).subscribe(
      () => {
        this.documents = [];
        this.location.back();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }
}
