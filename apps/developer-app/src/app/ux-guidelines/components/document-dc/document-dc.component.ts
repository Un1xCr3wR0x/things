import { Component, OnInit } from '@angular/core';
import { DocumentItem, DocumentService } from '@gosi-ui/core';
import { StateService } from '../../services/state.service';
import { WidgetBase } from '../../base/widget-base';

@Component({
  selector: 'dev-document-dc',
  templateUrl: './document-dc.component.html',
  styleUrls: ['./document-dc.component.scss']
})
export class DocumentDcComponent extends WidgetBase implements OnInit {
  documents: DocumentItem[];
  uuid: string;
  referenceNo: number;
  showHeading = true;
  showSequenceNumber = false;
  isAppPrivate = true;
  documentKey = 'REPLACE_SUPER_ADMIN';
  documentType = 'REPLACE_SUPER_ADMIN_FO';
  transactionId = '300320';
  mainRegNo = 603659945;
  constructor(state: StateService, readonly documentService: DocumentService) {
    super(state);
    state.heading$.next('Documents');
    state.hasToggle$.next(false);
    state.hasFullWidth = true;
  }

  ngOnInit(): void {
    this.documents = [
      {
        show: true,
        identifier: undefined,
        documentContent: null,
        name: {
          arabic: 'نموذج عمليات صاحب العمل',
          english: 'Employer processes form'
        },
        reuse: false,
        referenceNo: 123456,
        sequenceNumber: 1,
        documentType: 'string',
        uuid: 'string',
        required: true,
        started: true,
        valid: true,
        contentId: 'string',
        fileName: 'string',
        uploaded: true,
        transactionId: '',
        isUploading: false,
        size: 'string',
        isContentOpen: false,
        percentageLoaded: 100,
        icon: 'string',
        businessKey: 123456,
        uploadFailed: false,
        isScanning: false,
        canDelete: true,
        fromJsonToObject: () => {
          return undefined;
        },
        transactionReferenceIds: [],
        documentClassification: undefined,
        userAccessList: []
      }
    ];
  }

  /**
   * Method to get the document content
   * @param document
   * @param identifier
   * @param documentType
   */
  refreshDocument(document: DocumentItem, identifier: number, documentType: string) {}
}
