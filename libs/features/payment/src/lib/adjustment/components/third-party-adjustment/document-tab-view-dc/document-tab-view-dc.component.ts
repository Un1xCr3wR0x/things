/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { convertToYYYYMMDD, DocumentItem, FileExtensionEnum, FileIcon } from '@gosi-ui/core';
import moment from 'moment';
declare var UTIF;

@Component({
  selector: 'pmt-document-tab-view-dc',
  templateUrl: './document-tab-view-dc.component.html',
  styleUrls: ['./document-tab-view-dc.component.scss']
})
export class DocumentTabViewDcComponent implements OnInit, OnChanges {
  constructor(public sanitizer: DomSanitizer) {}
  // Local Variables
  addDocsPage = false;
  documentType: string;
  fileName = 'nvm';
  name = 'ggg';
  fileUrl;
  transactionDate: string;
  // transactionDate:Date;
  documentValue: DocumentItem;
  @Input() document: DocumentItem;
  @Input() transactionDocs: DocumentItem;
  @Input() showSequenceNo = false;
  @Input() otherDocFlag: boolean;
  @Input() isGosiAdjustment = false;

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.document && changes.document.currentValue) {
      this.documentValue = changes.document.currentValue;
      this.transactionDate = convertToYYYYMMDD(moment(this.documentValue.createdDate).toDate().toString());
      this.fileUrl = this.getDocumentUrl();

      this.setDocumentViewIcon();
    }
  }
  openImage() {
    this.setDocumentType();
    if (this.documentType === FileExtensionEnum.TIFF || this.documentType === FileExtensionEnum.TIF) {
      const buffer = this.getArrayBuffer(this.document.documentContent);
      const ifds = UTIF.decode(buffer);
      const w = window.open('');
      for (let i = 0; i < ifds.length; i++) {
        const img = new Image();
        UTIF.decodeImage(buffer, ifds[i]);
        const timage = ifds[i];
        const array = new Uint8ClampedArray(UTIF.toRGBA8(timage));
        const imageData = new ImageData(array, timage.width, timage.height);
        const canvas = self.document.createElement('canvas');
        canvas.width = timage.width;
        canvas.height = timage.height;
        canvas.getContext('2d').putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL('image/jpeg');
        img.width = 1280;
        w.document.write(img.outerHTML);
        w.document.write('\n\n\n');
      }
    } else {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + this.document.documentContent;
      const w = window.open('');
      w.document.write(img.outerHTML);
    }
  }
  setDocumentType() {
    if (this.document.fileName)
      this.documentType = this.document.fileName
        .slice(this.document.fileName.lastIndexOf('.') + 1, this.document.fileName.length)
        .toLowerCase();
  }
  setDocumentViewIcon() {
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
  getDocumentUrl() {
    this.setDocumentType();
    let byteCharacters = atob(this.document.documentContent);
    if (byteCharacters.includes('data:application/pdf;base64,')) {
      byteCharacters = byteCharacters.replace('data:application/pdf;base64,', '');
      byteCharacters = atob(byteCharacters);
    }
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512),
        byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    if (this.documentType === FileExtensionEnum.PDF) {
      this.document.icon = FileIcon.pdf;
      const blob = new Blob(byteArrays, {
        type: `application/${this.documentType}`
      });
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob) + '#toolbar=0&navpanes=0');
    } else {
      return byteCharacters;
    }
  }
  getArrayBuffer(content: string) {
    const byteCharacters = atob(content);
    const byteCharactersLength = byteCharacters.length;
    const byteArrays = new Uint8Array(byteCharactersLength);
    for (let i = 0; i < byteCharactersLength; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    return byteArrays;
  }
}
