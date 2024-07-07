/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';
import { FileOperation } from '../input-file-sc/file-operations';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'gosi-document-detail-dc',
  templateUrl: './document-detail-dc.component.html',
  styleUrls: ['./document-detail-dc.component.scss']
})
export class DocumentDetailDcComponent extends FileOperation implements OnInit, OnChanges {
  @Input() document: DocumentItem;
  @Input() isApprovedByLabel = false;

  documentType: string;
  fileUrl;
  fileName: string;
  downloadable: boolean;

  constructor(public sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    if (
      this.document.documentContent !== null &&
      this.document &&
      this.document.documentContent !== '' &&
      this.document.fileName !== ''
    ) {
      this.fileUrl = this.getDocumentUrl();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.documents && changes.documents.currentValue) {
      this.document = changes.documents.currentValue;
    }
  }
}
