import { Component, OnInit, Input, TemplateRef, Inject } from '@angular/core';
import { AlertService, ApplicationTypeToken, BilingualText, DocumentItem, DocumentService, FileIcon, LanguageToken } from '@gosi-ui/core';
import { FileOperation } from '../input-file-sc/file-operations';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-document-detail-view-dc',
  templateUrl: './document-detail-view-dc.component.html',
  styleUrls: ['./document-detail-view-dc.component.scss']
})
export class DocumentDetailViewDcComponent extends FileOperation implements OnInit {
  // local variables
  documentType: string;
  fileTypes = ['image/jpg', 'image/jpeg', 'application/pdf', 'image/png'];
  fileName: string;
  fileUrl;
  downloadable = true;

  // input variables
  @Input() showSequenceNo = false;
  @Input() document: DocumentItem;
  @Input() referenceNo: number;
  documentExcludedForm: FormGroup;
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
    if (
      this.document &&
      this.document?.documentContent !== null &&
      this.document?.fileName !== '' &&
      this.document?.documentContent !== ''
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

  truncateDocumentAddedBy(value: string): string {
    const maxLength = 20;
    if (value?.length > maxLength) {
      return value?.substring(0, maxLength) + '...';
    } else {
      return value;
    }
  }
  documentExcluded(){}
  popUp(template: TemplateRef<object>) {
    this.bsModal = this.modalService.show(template, {
      class: 'modal-dialog-centered'
    });
  }
  declinePopUp() {
    this.bsModal.hide();
  }

}
