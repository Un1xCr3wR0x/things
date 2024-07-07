/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive } from '@angular/core';
import {
  AlertService,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DocumentTransactionIdEnum, DocumentTransactionTypeEnum } from '../enums';
import { EstablishmentService } from '../services';
import { EstablishmentScBaseComponent } from './establishment-sc.base-component';

@Directive()
export abstract class ReopenEstablishmentScBaseComponent extends EstablishmentScBaseComponent {
  documentTransactionType = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
  documentTransactionKey = DocumentTransactionTypeEnum.REOPEN_DOCUMENT;
  documentTransactionId = DocumentTransactionIdEnum.REOPEN_ESTABLISHMENT;
  reopenDocuments: DocumentItem[];
  establishment: Establishment;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, workflowService);
  }

  /**
   * Method to get the document content
   * @param document
   * @param identifier
   * @param documentType
   */
  refreshDocumentContent(
    document: DocumentItem,
    identifier: number,
    documentType: string,
    referenceNo?: number,
    uuid?: string
  ) {
    this.documentService
      .refreshDocument(
        document,
        identifier,
        documentType,
        documentType,
        referenceNo,
        undefined,
        referenceNo ? undefined : uuid
      )
      .subscribe(res => {
        document = res;
      });
  }

  /**
   * Method to fetch comments
   */
  fetchComments(routerData: EstablishmentRouterData) {
    this.comments$ = this.getAllComments(routerData);
  }

  // tO GET Establishment details
  getEstablishmentDetails(registrationNo: number) {
    this.establishmentService.getEstablishment(registrationNo).subscribe(
      res => {
        this.establishment = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
}
