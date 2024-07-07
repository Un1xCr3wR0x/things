/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  LanguageToken
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { ContractAuthenticationService } from '../../../shared/services';
import { Location } from '@angular/common';
import { BreadCrumbConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'cnt-contract-document-sc',
  templateUrl: './contract-document-sc.component.html',
  styleUrls: ['./contract-document-sc.component.scss']
})
export class ContractDocumentScComponent extends BaseComponent implements OnInit, OnDestroy {
  /** Local Variables. */
  contractId: number;
  documents: DocumentItem[];
  selectedLang: string;
  individualApp = false;
  @ViewChild('brdcmb', { static: false })
  cntBillingBrdcmb: BreadcrumbDcComponent;

  /** Creates an instance of ContractDocumentScComponent. */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly contractService: ContractAuthenticationService,
    readonly documentService: DocumentService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly location: Location
  ) {
    super();
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => (this.selectedLang = language));
    this.getIdentifiers();
    this.getDocuments();
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.individualApp = true;
    }
  }
  ngAfterViewInit() {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.cntBillingBrdcmb.breadcrumbs = BreadCrumbConstants.CONTRACT_PRV_BREADCRUMB_VALUES;
    }
  }

  /** Method to get identifiers. */
  getIdentifiers() {
    this.contractId = this.contractService.contractId;
  }

  /** Method to get documents. */
  getDocuments() {
    this.documentService
      .getDocuments(DocumentTransactionId.CONTRACT_DOCUMENT, DocumentTransactionType.CONTRACT_DOCUMENT, this.contractId)
      .subscribe(res => (this.documents = res));
  }

  /** Method to navigate to contract details */
  navigateToContractDetails() {
    if (this.individualApp) {
      this.location.back();
    } else {
      this.router.navigate(['../view'], {
        relativeTo: this.route
      });
    }
  }

  /** This method is used to get the document type from the file name.*/
  getDocumentType(documentItem: DocumentItem) {
    if (documentItem && documentItem.fileName) {
      return documentItem.fileName.slice(documentItem.fileName.length - 3).toLowerCase();
    }
  }

  /** Method invoked when component is destroyed. */
  ngOnDestroy() {
    this.contractService.contractId = undefined;
  }
}
