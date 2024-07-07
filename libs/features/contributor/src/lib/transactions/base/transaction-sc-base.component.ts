import { Directive } from '@angular/core';
import { DocumentItem, DocumentService, scrollToTop } from '@gosi-ui/core';
import { tap } from 'rxjs/operators';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
@Directive()
export abstract class TransactionBaseScComponent {
  documents: DocumentItem[];

  constructor(readonly documentService: DocumentService) {}

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param businessId
   */
  getDocumentDetails(transactionKey: string, transactionType: string, businessId: number, referenceNo: number) {
    return this.documentService
      .getDocuments(transactionKey, transactionType, businessId, referenceNo)
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent != null))));
  }

  goToTop() {
    scrollToTop();
  }
}
