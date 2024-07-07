import { Injectable } from '@angular/core';
import { DocumentService } from '@gosi-ui/core';
import { switchMap, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentDocumentService {
  constructor(readonly documentService: DocumentService) {}

  /** for calling the required docs on the validator screen */
  getUploadedDocuments(benefitRequestId: number, transactionKey: string, transactionType: string) {
    return this.documentService.getRequiredDocuments(transactionKey, transactionType).pipe(
      switchMap(res => {
        return forkJoin(
          res.map(doc => {
            return this.documentService.refreshDocument(doc, benefitRequestId, transactionKey, transactionType);
          })
        ).pipe(catchError(error => of(error)));
      })
    );
  }
}
