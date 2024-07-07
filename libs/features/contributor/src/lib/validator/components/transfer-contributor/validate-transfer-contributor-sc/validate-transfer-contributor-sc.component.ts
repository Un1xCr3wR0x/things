/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import { Establishment, TransferContributorDetails } from '../../../../shared/models';
import { ContributorService, EstablishmentService, TransferContributorService } from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-transfer-contributor-sc',
  templateUrl: './validate-transfer-contributor-sc.component.html',
  styleUrls: ['./validate-transfer-contributor-sc.component.scss']
})
export class ValidateTransferContributorScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  transferDetails: TransferContributorDetails;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly transferContributorService: TransferContributorService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData
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
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    super.getSystemParameters();
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.getDataToDisplay();
  }

  /** Method to get data to display on page load. */
  getDataToDisplay() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.getTransferDetails();
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.TRANSFER_ENGAGEMENT,
            DocumentTransactionType.TRANSFER_ENGAGEMENT,
            this.engagementId,
            this.routerData.transactionId
          );
        }),
        catchError(err => {
          super.handleError(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get transfer details. */
  getTransferDetails(): Observable<Establishment> {
    return this.transferContributorService
      .getTransferDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .pipe(
        tap(res => (this.transferDetails = res)),
        switchMap(res => {
          return this.establishmentService
            .getEstablishmentDetails(res.transferTo)
            .pipe(tap(est => (this.transferDetails.transferToName = est.name)));
        })
      );
  }

  /** Method to handle workflow events. */
  transferWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_CONTRIBUTOR_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
