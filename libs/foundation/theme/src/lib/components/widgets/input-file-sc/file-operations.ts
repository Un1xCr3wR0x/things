/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FileExtensionEnum, FileIcon } from '@gosi-ui/core';
import { DocumentDetailDcComponent } from '../document-detail-dc/document-detail-dc.component';
import { DocumentDetailViewDcComponent } from '../document-detail-view-dc/document-detail-view-dc.component';
import { DocumentViewDcComponent } from '../document-list-view-dc/document-view-dc/document-view-dc.component';
import { InputFileScComponent } from './input-file-sc.component';
import { InputCustomFileScComponent } from '../input-custom-file-sc/input-custom-file-sc.component';
declare var UTIF;
export abstract class FileOperation {
  /**
   * This method is to generate a Url with document content
   */
  getDocumentUrl(
    this: InputFileScComponent | DocumentViewDcComponent | DocumentDetailDcComponent | DocumentDetailViewDcComponent | InputCustomFileScComponent
  ) {
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
      const config = this.downloadable ? '#toolbar=1' : '#toolbar=0&navpanes=0';
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob) + config);
    } else {
      return byteCharacters;
    }
  }
  /**
   * This method is used to open images in new tabs;
   */
  openImage(this: InputFileScComponent | DocumentViewDcComponent | DocumentDetailDcComponent | InputCustomFileScComponent
    ) {
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
  /**
   * Method to set document type
   * @param this
   */
  setDocumentType(
    this: InputFileScComponent | DocumentViewDcComponent | DocumentDetailDcComponent | DocumentDetailViewDcComponent | InputCustomFileScComponent
  ) {
    if (this.document.fileName)
      this.documentType = this.document.fileName
        .slice(this.document.fileName.lastIndexOf('.') + 1, this.document.fileName.length)
        .toLowerCase();
  }
  /**
   * Methood to convert data to buffer
   * @param content
   */
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
