/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, ApplicationTypeToken, BaseComponent, BilingualText, DocumentService, LanguageToken } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-document-item-dc',
  templateUrl: './document-item-dc.component.html',
  styleUrls: ['./document-item-dc.component.scss']
})
export class DocumentItemDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  fileUrl;
  isOpen: boolean;
  showId = false;
  idTitle: string;
  showName: boolean = false;
  lang: string;
  revokeAllowed: boolean = false;
  bsModal: BsModalRef;

  //Input Variables
  @Input() content: string;
  @Input() index: number;
  @Input() documentType = 'pdf';
  @Input() documentName: BilingualText;
  @Input() collapseView: boolean;
  @Input() documentIdentifier: string;
  @Input() showDocumentBusinessKey = false;
  @Input() businessKey: string;
  @Input() documentAddedBy: string;
  @Input() documentUploaderIdentifier: string;
  @Input() documentClassification: string;
  @Input() allowPublicAccess: boolean;
  @Input() sequenceNumber: number;
  @Input() documentTypeId: number;
  @Input() referenceNo: number;
  @Input() uuid: string;

  /**
   * Creates an instance of DocumentItemDcComponent
   * @memberof  DocumentItemDcComponent
   *
   */
  constructor(private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  DocumentItemDcComponent
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isOpen = false;
    if (this.index === 0) {
      this.isOpen = true;
      this.fileUrl =
        this.documentType === 'pdf' ? this.getDocumentUrl(this.content) : 'data:image/jpeg;base64,' + this.content;
    }
    if (this.documentIdentifier) {
      this.showId = true;
    }
    if (this.documentUploaderIdentifier && this.documentAddedBy){
      this.showName = true;
      this.idTitle = '(' + this.documentUploaderIdentifier + ' : ' + this.documentAddedBy + ')';
    }
    else if (this.documentAddedBy && !this.documentUploaderIdentifier){
      this.showName = true;
      this.idTitle = '(' + this.documentAddedBy + ')';
    }
  }

  /**
   * This method handles the tasks by changes made.
   */
  ngOnChanges(changes: SimpleChanges) {
    if ((changes.index && changes.index.currentValue) || changes.content) {
      this.isOpen = false;
      this.fileUrl =
        this.documentType === 'pdf' ? this.getDocumentUrl(this.content) : 'data:image/jpeg;base64,' + this.content;
      if (this.index === 0) {
        this.isOpen = true;
      }
    }
  }

  /**
   * This method handles the document preview.
   */
  previewDocument() {
    this.fileUrl =
      this.documentType === 'pdf' ? this.getDocumentUrl(this.content) : 'data:image/jpeg;base64,' + this.content;
  }

  /**
   * This method is to generate a Url with document content
   * @param documentContent
   */
  getDocumentUrl(documentContent: string) {
    if (documentContent) {
      let byteChar = atob(documentContent);
      if (byteChar.includes('data:application/pdf;base64,')) {
        byteChar = byteChar.replace('data:application/pdf;base64,', '');
        byteChar = atob(byteChar);
      }
      const byteArrays = [];
      for (let offset = 0; offset < byteChar.length; offset += 512) {
        const slice = byteChar.slice(offset, offset + 512),
          byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      if (this.documentType === 'pdf') {
        const blob = new Blob(byteArrays, {
          type: `application/${this.documentType}`
        });
        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob) + '#toolbar=0&navpanes=0');
      } else {
        return byteChar;
      }
    }
  }
  /**
   * This method is hide popUp for comfirmation
   */
  declinePopUp() {
    this.bsModal.hide();
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

  /**
   * This method is used to open images in new tabs;
   */
  openImage() {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + this.content;
    const w = window.open('');
    w.document.write(img.outerHTML);
  }
  revokeAccess(){
    this.documentService.documentCheckBoxRemove(this.businessKey,
      this.documentName.english,
      this.referenceNo,
      this.uuid,
      this.sequenceNumber,
      this.documentUploaderIdentifier,
      this.documentTypeId
).subscribe(() =>{
  this.revokeAllowed = true;
  this.allowPublicAccess = false;
  this.bsModal.hide();
},
      (err) => {
        this.alertService.showError(err.error.details[0]?.message)
        this.bsModal.hide();
        this.revokeAllowed = false;
      }
      );
    } 
  // }
}
