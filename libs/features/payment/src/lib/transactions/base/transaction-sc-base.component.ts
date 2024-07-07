import { Directive } from '@angular/core';
import { DocumentItem, DocumentService } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
@Directive()
export abstract class TransactionBaseScComponent {
  documents: DocumentItem[];
  lang = 'en';
  constructor(readonly documentService: DocumentService) {}

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param businessId
   */
  getDocumentDetails(transactionKey: string, transactionType: string, businessId: number, referenceNo: number) {
    this.documentService
      .getDocuments(transactionKey, transactionType, businessId, referenceNo)
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }
}
