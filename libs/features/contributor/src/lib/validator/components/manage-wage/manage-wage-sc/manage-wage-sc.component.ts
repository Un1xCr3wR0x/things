/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { UpdatedWageListResponse } from '../../../../shared/models';
import { ContributorService, EstablishmentService, ValidateWageUpdateService } from '../../../../shared/services';

@Component({
  selector: 'cnt-manage-wage-sc',
  templateUrl: './manage-wage-sc.component.html',
  styleUrls: ['./manage-wage-sc.component.scss']
})
export class ManageWageScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**Local variables */
  comments: TransactionReferenceData[] = [];
  modalRef: BsModalRef = new BsModalRef();
  cntValidatorForm: FormGroup;
  updatedWageListResponse: UpdatedWageListResponse;

  constructor(
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
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

  ngOnInit(): void {
    super.readDataFromToken(this.routerDataToken);
    super.setFlagsForView(this.routerDataToken);
    super.getDefaultLookupValues();
    this.fetchDataForView();
    super.getSystemParameters();
  }

  /** Method to retrieve data for validator view. */
  fetchDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      super
        .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
        .pipe(
          switchMap(() => {
            return this.wageUpdateService
              .getOccupationAndWageDetails(
                this.registrationNo,
                this.socialInsuranceNo,
                this.engagementId,
                this.referenceNo
              )
              .pipe(tap((res: UpdatedWageListResponse) => (this.updatedWageListResponse = res)));
          }),
          switchMap(() => {
            return super.getDocuments(
              DocumentTransactionId.MANAGE_WAGE,
              DocumentTransactionType.MANAGE_WAGE,
              this.engagementId,
              this.routerDataToken.transactionId
            );
          }),
          catchError(err => {
            super.handleError(err, true);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /**
   * Method to set transaction reff data
   * @param transactionReferenceData
   */
  setComments(transactionReferenceData) {
    const tempComments = [];
    transactionReferenceData.forEach(referenceData => {
      tempComments.push(referenceData);
    });
    this.comments = [...tempComments];
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /**
   * Navigate to CSR edit view from validator view
   */
  navigateToCSR() {
    this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
