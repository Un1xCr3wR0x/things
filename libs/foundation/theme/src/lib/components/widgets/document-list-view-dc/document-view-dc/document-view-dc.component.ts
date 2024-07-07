import { Component, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, ApplicationTypeToken, BilingualText, DocumentItem, DocumentService, LanguageToken } from '@gosi-ui/core';
import { FileOperation } from '../../input-file-sc/file-operations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
/** File icon names of font awesome */
enum FileIcon {
  pdf = 'file-pdf',
  jpeg = 'image',
  jpg = 'image',
  png = 'image'
}
@Component({
  selector: 'gosi-document-view-dc',
  templateUrl: './document-view-dc.component.html',
  styleUrls: ['./document-view-dc.component.scss']
})
export class DocumentViewDcComponent extends FileOperation implements OnInit {
  @Input() document: DocumentItem;
  @Input() showSequenceNo = false;
  @Input() referenceNo: number;
  documentExcludedForm: FormGroup;
  fileTypes = ['image/jpg', 'image/jpeg', 'application/pdf', 'image/png'];
  documentType: string;
  fileUrl;
  fileName: string;
  downloadable: boolean;
  revokeAllowed: boolean = false;
  bsModal: BsModalRef;
  lang: string;

  constructor(public sanitizer: DomSanitizer,
    public modalService: BsModalService,
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.documentExcludedForm = this.createCheckForm();
    if (
      this.document.documentContent !== null &&
      this.document &&
      this.document.documentContent !== '' &&
      this.document.fileName !== ''
    ) {
      this.setDocumnetViewIcon();
      this.fileUrl = this.getDocumentUrl();
    }
  }

  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }]
    });
  }
  setDocumnetViewIcon() {
    // set document icon according to the file type
    if (this.document) {
      if (this.document.fileName !== undefined && this.document.fileName !== null && this.document.fileName !== '') {
        this.fileName = !this.showSequenceNo
          ? this.document.fileName.split('.')[0]
          : this.document.fileName
              .split('.')[0]
              .replace('_null', '')
              .concat('_', this.document && this.document.sequenceNumber && this.document.sequenceNumber.toString());
        this.documentType = this.document.fileName
          .slice(this.document.fileName.length - 3, this.document.fileName.length)
          .toLowerCase();
        if (this.documentType === 'pdf') {
          this.document.icon = FileIcon.pdf;
        } else {
          this.document.icon = FileIcon.jpeg;
        }
      }
    }
    return this.document.icon;
  }
  /**
   * This method is hide popUp for comfirmation
   */
  declinePopUp() {
    this.bsModal.hide();
    this.documentExcludedForm.reset();
  }
   /**
   * This method is create popUp for comfirmation
   */
   popUp(template: TemplateRef<object>) {
    this.bsModal = this.modalService.show(template, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true
    });
  }

  truncateDocumentAddedBy(value: string): string {
    const maxLength = 20;
    if (value?.length > maxLength) {
      return value?.substring(0, maxLength) + '...';
    } else {
      return value;
    }
  }
  documentExcluded(){
    this.documentService.documentCheckBoxRemove(this.document?.businessKey?.toString(),
      this.document?.name?.english,
      this.document.transactionTraceId,
      this.document.uuid,
      this.document.sequenceNumber,
      this.document.documentUploaderIdentifier,
      this.document.documentTypeId
).subscribe(() =>{
  this.revokeAllowed = true;
  this.bsModal.hide();
},
      (err) => {
        this.alertService.showError(err.error.details[0]?.message)
        this.revokeAllowed = false;
        this.bsModal.hide();
        this.documentExcludedForm.reset();

      }
      );
  }
}
