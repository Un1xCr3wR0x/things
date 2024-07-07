import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BenefitsGosiShowRolesConstants } from '@gosi-ui/core';
import { DocumentItem } from '@gosi-ui/core/lib/models';

@Component({
  selector: 'bnt-documents-tab-dc',
  templateUrl: './documents-tab-dc.component.html',
  styleUrls: ['./documents-tab-dc.component.scss']
})
export class DocumentsTabDcComponent implements OnInit {
  documentType = 'pdf';
  selectedDocument: DocumentItem;
  addDocAccess = BenefitsGosiShowRolesConstants.VIEW_DETAILS;
  @Input() scannedDocuments: DocumentItem[];

  @Output() addDocumentEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /** This method is used to get the document type from the file name.*/
  getDocumentType(documentItem: DocumentItem) {
    if (documentItem && documentItem.fileName) {
      return documentItem.fileName.slice(documentItem.fileName.length - 3).toLowerCase();
    }
  }

  /**
   * Method to get the file type
   */
  fileType(document) {
    if (document) {
      if (document.fileName !== undefined && document.fileName !== null) {
        return document.fileName.slice(document.fileName.length - 3, document.fileName.length).toLowerCase();
      }
    }
  }

  refreshDocument(doc) {}

  checkSubmitDisable(doc) {}

  onDocumentSelect(doc) {
    this.selectedDocument = doc;
  }

  addDocuments() {
    this.addDocumentEvent.emit();
  }
}
