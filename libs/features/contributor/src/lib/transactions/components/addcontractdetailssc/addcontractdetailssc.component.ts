import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  ContributorRouteConstants,
  DocumentTransactionId,
  DocumentTransactionType,
  SearchTypeEnum
} from '../../../shared';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-addcontractdetailssc',
  templateUrl: './addcontractdetailssc.component.html',
  styleUrls: ['./addcontractdetailssc.component.scss']
})
export class AddcontractdetailsScComponent extends TransactionBaseScComponent implements OnInit {
  //Local Variables

  formSubmissionDate: Date;
  isAddContract: boolean;
  resourceType: string;
  contractId: number;
  isIndividualApp = false;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly engagementService: EngagementService,
    readonly router: Router,
    readonly transactionService: TransactionService,

    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    super.getTransactionDetails();
    super.getSystemParameters();
    this.initializeTransactionSpecificData(this.routerDataToken);
    // Defects : 557910,557878,557932
    // To do : remove the check for individual app, individual app API changes not implemented for contributor transaction screens
    if (!this.isIndividualApp) {
      this.initializeView();
    }
  }

  /** Method to initialize transaction specific data. */
  initializeTransactionSpecificData(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.id) this.engagementId = payload.id;
      if (payload.contractId) this.contractId = payload.contractId;
      if (payload.resource) this.resourceType = payload.resource;
    }
    this.isAddContract =
      this.resourceType === RouterConstants.TRANSACTION_ADD_CONTRACT ||
      this.header.english.trim() === RouterConstants.TRANSACTION_ADD_CONTRACT.trim();
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

  /** This method is used to navigate to csr view on clicking of edit icon. */
  navigateToCsrView(tabIndex: number) {
    this.routerDataToken.tabIndicator = tabIndex;
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRACT_EDIT]);
  }

  /** Method to open contract preview in new tab. */
  openPreviewTab() {
    const url =
      '#' +
      `/validator/preview/${this.registrationNo}/${this.socialInsuranceNo}/${this.engagementId}?param=` +
      encodeURIComponent(this.contractId);
    window.open(url, '_blank');
  }
}
