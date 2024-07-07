import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  InspectionService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import {
  CancelContributorDetails,
  CancelContributorService,
  ContractAuthenticationService,
  ContributorService,
  DocumentTransactionId,
  DocumentTransactionType,
  EstablishmentService,
  ValidatorBaseScComponent
} from '@gosi-ui/features/contributor/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'cnt-validate-cancel-eng-ind-sc',
  templateUrl: './validate-cancel-eng-ind-sc.component.html',
  styleUrls: ['./validate-cancel-eng-ind-sc.component.scss']
})
export class ValidateCancelEngIndScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  cancellationDetails: CancelContributorDetails;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly cancelContributorService: CancelContributorService,
    readonly contractService: ContractAuthenticationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly inspectionService: InspectionService,
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
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) this.initializeView();
  }

  /** Method to initialize validator view. */
  initializeView() {
    super
      .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
      .pipe(
        switchMap(() => {
          return this.cancelContributorService
            .getCancellationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
            .pipe(tap(res => (this.cancellationDetails = res)));
        }),
        switchMap(() => {
          return this.isPPA
            ? super.getAllDocuments(this.referenceNo)
            : super.getDocuments(
                DocumentTransactionId.CANCEL_CONTRIBUTOR,
                [
                  DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL,
                  DocumentTransactionType.CANCEL_ENGAGEMENT_INDIVIDUAL_ADMIN
                ],
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
  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    let action = super.getWorkflowAction(key);
    const approveWithDocs = this.customActions.includes('APPROVEBYDOC') ? true : false;
    if (action === WorkFlowActions.APPROVE && this.isPPA && approveWithDocs) {
      action = WorkFlowActions.APPROVE_WITH_DOCS;
    }
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
  /** Method invoked when component is destroyed. */
  ngOnDestroy(): void {
    this.alertService.clearAllInfoAlerts();
  }
}
