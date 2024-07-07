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
import { forkJoin, noop, Observable, throwError } from 'rxjs';
import { catchError, pluck, switchMap, tap } from 'rxjs/operators';
import { ValidatorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType } from '../../../../shared/enums';
import {
  ContributorCountDetails,
  ContributorWageParams,
  Establishment,
  TransferAllContributorDetails
} from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EstablishmentService,
  TransferContributorService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-validate-transfer-all-contributor-sc',
  templateUrl: './validate-transfer-all-contributor-sc.component.html',
  styleUrls: ['./validate-transfer-all-contributor-sc.component.scss']
})
export class ValidateTransferAllContributorScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  transferAllDetails: TransferAllContributorDetails;
  contributorDetails: ContributorCountDetails;
  requestId: number;

  /** Creates an instance of ValidateTransferAllContributorScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly transferContributorService: TransferContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly contributorWageService: ContributorsWageService,
    readonly workflowService: WorkflowService,
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

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    this.readTransactionDataFromToken(this.routerData);
    super.getDefaultLookupValues();
    super.getSystemParameters();
    if (this.registrationNo && this.requestId) this.getDataToDisplay();
  }

  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.requestId) this.requestId = payload.requestId;
    }
  }

  /** Method to get data to display on page load. */
  getDataToDisplay() {
    this.getTransferAllDetails()
      .pipe(
        switchMap(res => {
          return this.getTransferAllEstablishmentDetails(res.transferFrom, res.transferTo);
        }),
        switchMap(() => {
          return super.getDocuments(
            DocumentTransactionId.TRANSFER_ALL_ENGAGEMENT,
            DocumentTransactionType.TRANSFER_ALL_ENGAGEMENT,
            this.requestId,
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

  /** Method to get transfer all details. */
  getTransferAllDetails(): Observable<TransferAllContributorDetails> {
    return this.transferContributorService
      .getTransferAllDetails(this.registrationNo)
      .pipe(tap(res => (this.transferAllDetails = res)));
  }

  /** Method to get establishment details of transfer all transaction. */
  getTransferAllEstablishmentDetails(
    fromRegNo: number,
    toRegNo: number
  ): Observable<[Establishment, number, number, Establishment]> {
    return forkJoin([
      this.establishmentService.getEstablishmentDetails(fromRegNo),
      this.contributorWageService
        .getContributorWageDetails(fromRegNo, new ContributorWageParams(false, true, 'ACTIVE'), false)
        .pipe(pluck('numberOfContributors')),
      this.contributorWageService
        .getContributorWageDetails(fromRegNo, new ContributorWageParams(false, true, 'TRANSFERABLE'), false)
        .pipe(pluck('numberOfContributors')),
      this.establishmentService.getEstablishmentDetails(toRegNo)
    ]).pipe(
      tap(([fromEst, active, transferable, toEst]) => {
        this.transferAllDetails.transferFromName = fromEst.name;
        this.transferAllDetails.transferFromType = fromEst.establishmentType;
        this.transferAllDetails.transferToName = toEst.name;
        this.transferAllDetails.transferToType = toEst.establishmentType;
        this.contributorDetails = new ContributorCountDetails(Number(active), Number(transferable));
      })
    );
  }

  /** Method to handle workflow events. */
  transferAllWorkflowEvent(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    this.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_TRANSFER_ALL_CONTRIBUTOR_EDIT]);
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
