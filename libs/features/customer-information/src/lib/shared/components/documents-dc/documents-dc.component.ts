/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'cim-documents-dc',
  templateUrl: './documents-dc.component.html',
  styleUrls: ['./documents-dc.component.scss']
})
export class DocumentsDcComponent implements OnInit {
  isAppPrivate: boolean;

  @Input() documents: DocumentItem[];
  @Input() businessKey: number;
  @Input() transactionId: string;
  @Input() uuid: string;
  @Input() referenceNo: number;
  @Input() showHeading = true;
  @Input() showSequenceNumber = false;
  @Input() noPadding = false;
  @Input() noMarginBottom = false;
  @Input() negativeMobileMargin = true;
  @Input() parentForm: FormGroup;

  //output Variables
  @Output() refreshDocument: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() onUploadDocument: EventEmitter<boolean> = new EventEmitter();
  @Output() onDeleteDocument: EventEmitter<boolean> = new EventEmitter();

  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    } else {
      this.isAppPrivate = false;
    }
  }
  // Method to emit refresh details
  refreshDocumentDetails(document: DocumentItem) {
    this.refreshDocument.emit(document);
  }
  uploadDocument(isUpload) {
    this.onUploadDocument.emit(isUpload);
  }

  deleteDocument(isDeleted) {
    this.onDeleteDocument.emit(isDeleted);
  }
}
