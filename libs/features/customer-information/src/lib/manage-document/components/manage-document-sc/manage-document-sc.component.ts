/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AlertService,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentService,
  RouterData,
  RouterDataToken,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import {
  ChangePersonService,
  Contract,
  ManageDocumentService,
  ManagePersonRoutingService,
  ManagePersonScBaseComponent,
  ManagePersonService
} from '../../../shared';
import { Location } from '@angular/common';

@Component({
  selector: 'cim-manage-document-sc',
  templateUrl: './manage-document-sc.component.html',
  styleUrls: ['./manage-document-sc.component.scss']
})
export class ManageDocumentScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  contracts: Contract[] = [];
  constructor(
    public contributorService: CoreContributorService,
    public managePersonService: ManagePersonService,
    public changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    public documentService: DocumentService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public managePersonRoutingService: ManagePersonRoutingService,
    public manageDocumentService: ManageDocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location
  ) {
    super(
      contributorService,
      managePersonService,
      changePersonService,
      alertService,
      documentService,
      routerDataToken,
      workflowService,
      appToken,
      managePersonRoutingService,
      uuidService,
      location
    );
  }

  ngOnInit() {
    this.manageDocumentService
      .getContracts(this.managePersonService.registrationNo, this.managePersonService.socialInsuranceNo)
      .subscribe(res => (this.contracts = res));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
