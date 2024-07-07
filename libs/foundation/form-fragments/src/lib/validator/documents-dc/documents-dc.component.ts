/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { BaseComponent, DocumentItem, LanguageToken, CsvFile } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'frm-documents-dc',
  templateUrl: './documents-dc.component.html',
  styleUrls: ['./documents-dc.component.scss']
})
export class DocumentsDcComponent extends BaseComponent implements OnInit {
  //Local Variables
  lang = 'en';

  //Input Variables
  @Input() collapseView = false;
  @Input() documents: DocumentItem[];
  @Input() canEdit = true;
  @Input() csvDocument: CsvFile;
  @Input() showDocumentBusinessKey = false;

  //Output Variables
  @Output() onCollapse: EventEmitter<boolean> = new EventEmitter();
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadCsv: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of DocumentListAreaDcComponent
   * @memberof  DocumentListAreaDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
    this.language.subscribe(res => (this.lang = res));
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  DocumentsDcComponent
   */
  ngOnInit() {}

  /**
   * This method is used to get the document type from the file name
   * @param documentItem
   */
  getDocumentType(documentItem: DocumentItem) {
    if (documentItem && documentItem.fileName) {
      return documentItem.documentType && documentItem.documentType === 'application/pdf'
        ? 'pdf'
        : documentItem.fileName.slice(documentItem.fileName.length - 3).toLowerCase();
    }
  }
  // Method to emit edit details

  onEditDocument() {
    this.onEdit.emit();
  }

  /** Method to download csv file */
  downloadCsvFile(): void {
    this.downloadCsv.emit();
  }
}
