import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  LookupService,
  StorageService,
  UuidGeneratorService
} from '@gosi-ui/core';
import { DocumentManagementScBaseComponent } from '../../../../shared/base/document-management-sc.base-component';
import {
  DocumentUploadRequest,
  EstablishmentConstants,
  EstablishmentService,
  IndividualDocumentUploadRequest
} from '@gosi-ui/features/establishment/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePersonService, ManageDocumentService } from '@gosi-ui/features/customer-information/lib/shared';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared';

@Component({
  selector: 'cim-upload-document-sc',
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
  personIdentifier: number;

  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly fb: FormBuilder,
    readonly uuidService: UuidGeneratorService,
    readonly manageDocumentService: ManageDocumentService,
    readonly contributorService: ContributorService,
    readonly changePersonService: ChangePersonService,
    readonly storageService: StorageService
  ) {
    super(documentService, alertService);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.changePersonService.getPersonID().subscribe(res => {
        const personId = res;
        if (personId == null) this.location.back();
      });
      if (
        params.personId &&
        (this.storageService.getSessionValue('idType') == 'NIN' ||
          this.storageService.getSessionValue('idType') == 'IQAMA')
      ) {
        this.personIdentifier = Number(params.personId);
      } else {
        this.changePersonService.getSocialInsuranceNo().subscribe(res => {
          this.personIdentifier = res;
        });
      }
    });
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
    doc.identifier = this.personIdentifier.toString();
    doc.isIndividualProfile = true;
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
      description: ['', { validators: Validators.compose([Validators.minLength(3)]) }]
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
    if (this.uploadDocumentForm.get('documentType').value.english == 'Others') {
      this.uploadDocumentForm.get('description').setValidators([Validators.required, Validators.minLength(3)]);
      this.uploadDocumentForm.get('description').updateValueAndValidity();
    } else {
      this.uploadDocumentForm.get('description').setValidators([Validators.minLength(3)]);
      this.uploadDocumentForm.get('description').updateValueAndValidity();
    }
  }
  setDescription() {
    if (
      this.uploadDocumentForm.get('description').value !== '' &&
      this.uploadDocumentForm.get('description').value !== null
    ) {
      this.documents[0].description = this.uploadDocumentForm.get('description').value;
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
        this.personIdentifier,
        this.documentTransactionKey,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.uuid
      )
      .subscribe(res => {
        doc = res;
        doc.uuid = this.uuid;
        doc.businessKey = this.personIdentifier;
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
      const docUploadData: IndividualDocumentUploadRequest = {
        documentTraceList: [
          {
            description: this.uploadDocumentForm.get('description').value,
            // documentTypeId: docTypeId,
            uuid: this.uuid
          }
        ]
      };
      this.manageDocumentService.uploadIndividualDoc(this.personIdentifier, docUploadData).subscribe(
        res => {
          this.location.back();
          this.alertService.showSuccess(res?.bilingualMessage);
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
