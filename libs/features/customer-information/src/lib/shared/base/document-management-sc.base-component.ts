import { Directive, OnDestroy } from '@angular/core';
import { AlertService, BaseComponent, DocumentItem, DocumentService, Lov, LovList } from '@gosi-ui/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DocumentTransactionIdEnum, DocumentTransactionTypeEnum } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
@Directive()
export abstract class DocumentManagementScBaseComponent extends BaseComponent implements OnDestroy {
  reqDocs: DocumentItem[] = [];
  documentTypeList: LovList;

  documentTransactionType = DocumentTransactionTypeEnum.UPLOAD_DOCUMENTS;
  documentTransactionKey = DocumentTransactionTypeEnum.UPLOAD_DOCUMENTS;
  documentTransactionId = DocumentTransactionIdEnum.UPLOAD_DOCUMENTS;

  constructor(readonly documentService: DocumentService, readonly alertService: AlertService) {
    super();
  }
  getDocuments() {
    this.getRequiredDocs().subscribe((docItems: DocumentItem[]) => {
      this.reqDocs = docItems;
      this.mapDocumentType(docItems);
    });
  }
  getRequiredDocs() {
    return this.documentService.getRequiredDocuments(this.documentTransactionKey, this.documentTransactionType).pipe(
      map(docs => this.documentService.removeDuplicateDocs(docs)),
      tap(res => {
        this.reqDocs = res;
      }),
      catchError(err => {
        this.showError(err);
        return throwError(err);
      })
    );
  }
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
  mapDocumentType(docItem: DocumentItem[]) {
    const items: Lov[] = [];
    docItem.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = element.documentTypeId;
      lookUpValue.sequence = i;
      lookUpValue.value = element.name;
      items.push(lookUpValue);
    });
    this.documentTypeList = new LovList(items);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
