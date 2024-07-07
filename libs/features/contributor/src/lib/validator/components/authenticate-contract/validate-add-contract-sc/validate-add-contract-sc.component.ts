/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants, RouterData, RouterDataToken } from '@gosi-ui/core';
import { AlertService, DocumentService, LookupService, WorkflowService } from '@gosi-ui/core/lib/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, SearchTypeEnum } from '../../../../shared/enums';
import { ContributorService, EstablishmentService, ManageWageService } from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-add-contributor-sc',
  templateUrl: './validate-add-contract-sc.component.html',
  styleUrls: ['./validate-add-contract-sc.component.scss']
})
export class ValidateAddContractScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  //Local Variables
  formSubmissionDate: Date;
  isAddContract: boolean;
  resourceType: string;
  contractId: number;

  /** Creates an instance od ValidateAddContractScComponent. */
  constructor(
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly manageWageService: ManageWageService,
    readonly modalService: BsModalService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  /** This method handles the initialization tasks. */
  ngOnInit() {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerDataToken);
    super.setFlagsForView(this.routerDataToken);
    super.getDefaultLookupValues();
    this.initializeTransactionSpecificData(this.routerDataToken);
    super.getSystemParameters();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.initializeView();
  }

  /** Method to initialize transaction specific data. */
  initializeTransactionSpecificData(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.id) this.engagementId = payload.id;
      if (payload.contractId) this.contractId = payload.contractId;
      if (payload.resource) this.resourceType = payload.resource;
    }
    this.isAddContract = this.resourceType === RouterConstants.TRANSACTION_ADD_CONTRACT;
  }

  /** Method to intialize the view. */
  initializeView() {
    forkJoin([super.getBasicDetails(), this.getFormSubmissionDate()])
      .pipe(
        switchMap(() =>
          super.getDocuments(
            this.isAddContract ? DocumentTransactionId.ADD_CONTRACT : DocumentTransactionId.CANCEL_CONTRACT,
            this.getTransactionTypes(),
            this.contractId,
            this.referenceNo
          )
        )
      )
      .subscribe({
        error: err => this.handleError(err, false)
      });
  }

  /** Method to get form submission date */
  getFormSubmissionDate() {
    return this.manageWageService
      .getEngagements(this.socialInsuranceNo, this.registrationNo, SearchTypeEnum.ACTIVE)
      .pipe(tap(res => (this.formSubmissionDate = res[0]?.formSubmissionDate?.gregorian)));
  }

  /** Method to get transaction types. */
  getTransactionTypes() {
    const types = [this.isAddContract ? DocumentTransactionType.ADD_CONTRACT : DocumentTransactionType.CANCEL_CONTRACT];
    if (this.isAddContract) types.push(DocumentTransactionType.BANK_UPDATE);
    return types;
  }

  /** Method to handle contract workflow events. */
  handleContractWorklowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /** This method is used to navigate to csr view on clicking of edit icon. */
  navigateToCsrView(tabIndex: number) {
    this.routerDataToken.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT_EDIT]);
  }

  /** Method to open contract preview in new tab. */
  openPreviewTab() {
    const url = '#' + `/validator/preview/${this.registrationNo}/${this.socialInsuranceNo}/${this.engagementId}`;
    window.open(url, '_blank');
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
