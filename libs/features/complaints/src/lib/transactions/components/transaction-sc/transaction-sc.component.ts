/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ContactBaseScComponent } from '../../../shared/components';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidatorService, ValidatorRoutingService } from '../../../shared/services';
import {
  DocumentService,
  UuidGeneratorService,
  AlertService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  ApplicationTypeToken,
  RouterService,
  LookupService,
  TransactionService,
  MenuService,
  Environment,
  EnvironmentToken,
  AuthTokenService,
  Transaction,
  TransactionStatus,
  AppealResponse,
  AppealDetailsResponse,
  DocumentItem,
  getPersonNameAsBilingual,
  IdentityTypeEnum,
  NIN,
  Iqama,
  ApplicationTypeEnum,
  RouterConstantsBase
} from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ComplaintConstants, RouterConstants, TransactionConstants } from '../../../shared/constants';
import { FormBuilder } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { AppealOnViolationDetailsResponse } from '@gosi-ui/core/lib/models/appeal-on-violation-details-response';
import {
  ContributorDetails,
  ViolationRouteConstants,
  ViolationTransaction
} from '@gosi-ui/features/violations/lib/shared';
import { AppealViolationsService } from '@gosi-ui/features/violations/lib/shared/services/appeal-violations.service';

@Component({
  selector: 'ces-transaction-sc',
  templateUrl: './transaction-sc.component.html',
  styleUrls: ['./transaction-sc.component.scss']
})
export class TransactionScComponent extends ContactBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  modalRef: BsModalRef;
  complaintId: number;
  canDocuments = true;
  IsReopenTransaction: boolean = false;
  isGeneralAppeal = false;
  isAppealApproved = false;
  isAppealRejected = false;
  isAppealProgress = false;
  transaction: Transaction;
  violationId: number;
  violativeContributorsList: ContributorDetails[];
  appealOnViolationObs$: Observable<AppealOnViolationDetailsResponse>;
  violationTransObs$: Observable<ViolationTransaction>;
  appealOnViolationDocuments$: Observable<DocumentItem[]>;
  violationDetails: ViolationTransaction;

  /**
   *
   * @param modalService
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   * @param router
   * @param workflowService
   * @param route
   * @param routerData
   * @param appToken
   * @param routerService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    public route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly lookUpService: LookupService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionNavigationService: TransactionService,
    readonly authTokenService: AuthTokenService,
    readonly appealVlcService: AppealViolationsService
  ) {
    super(
      formBuilder,
      modalService,
      validatorService,
      documentService,
      uuidService,
      alertService,
      router,
      workflowService,
      route,
      routerData,
      appToken,
      routerService,
      lookUpService,
      validatorRoutingService,
      location,
      menuService,
      environment,
      transactionNavigationService,
      authTokenService
    );
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    let d: any = this.route.snapshot.routeConfig?.path;
    if (d == 'reopen/:isReopen') {
      this.IsReopenTransaction = true;
    } else {
      this.IsReopenTransaction = false;
    }
    console.log('incompliance');
    this.validatorRoutingService.setRouterToken();
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.transactionTraceId = this.transaction.transactionRefNo;
      this.category = TransactionConstants?.TRANSACTION_DOCUMENT_DETAILS?.find(
        item => item?.transactionId === this.transaction?.transactionId
      )?.category;
      this.taskId = this.transaction.taskId;
      this.businessKey = this.transaction.businessId;
      this.appealId = this.transaction.businessId;
      this.violationId = this.transaction.params.VIOLATION_ID;
      this.registrationNo = String(this.transaction.params.REGISTRATION_NO);
      this.assigneeId = '';
      this.transaction.stepStatus.english == TransactionStatus.APPROVED ? (this.isAppealApproved = true) : '';
      this.transaction.stepStatus.english == TransactionStatus.REJECTED ? (this.isAppealRejected = true) : '';
      this.transaction.stepStatus.english == TransactionStatus.ASSIGNED ? (this.isAppealProgress = true) : '';
      this.category ? this.getTrackingDetails() : this.getAppealTrackingDetails();
    }
    if(this.appToken === ApplicationTypeEnum.PRIVATE && this.violationId ){
      this.getAppealViolationDecisionDetails();
    }
}
  /**
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy() {
    this.validatorRoutingService.setRouterToken();
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }
  /**
   * method to get tracking details for CRM Transactions
   */
  getTrackingDetails() {
    this.isTracking = true;
    this.setApplicationType();
    this.setLabels(this.category);
    this.getTaskDetails(false, true);
    this.getTransactionDetails();
    this.getDocuments(false);
    this.workflowService.ticketHistory$
      .pipe(
        takeUntil(this.destroy$),
        tap(res => (this.ticketHistory = res))
      )
      .subscribe();
  }

  /**
   * method to get tracking details for genearl appeal transactions
   */

  getAppealTrackingDetails() {
    this.category = TransactionConstants?.APPEAL_DOCUMENT_DETAILS?.find(
      item => item?.transactionId === this.transaction?.transactionId
    )?.category;
    this.category ? (this.isGeneralAppeal = true) : '';
    this.isTracking = true;
    this.setLabels(this.category);
    this.getAppealDocuments(this.transactionTraceId);

    // This block will handle appeal on violation details
    if (this.violationId) {
      this.appealOnViolationObs$ = this.transactionService.getAppealOnViolationDetailsById(this.appealId);
      this.violationTransObs$ = this.transactionService.getViolationDetails(
        this.violationId,
        this.transaction.params.REGISTRATION_NO
      );
      this.appealOnViolationDocuments$ = this.getDocumentsObservable(this.transactionTraceId);

      forkJoin([this.appealOnViolationObs$, this.violationTransObs$, this.appealOnViolationDocuments$]).subscribe(
        ([appealOnViolationData, violationData, appealOnViolationDocumentsData]) => {
          this.getCustomerDetails(appealOnViolationData.objector);
          this.violationDetails = violationData;
          // Populate the list of violative contributors by joining response from both violation details API and get Appeal on Violation Details API
          this.violativeContributorsList = violationData.contributors
            .map(violContributor => {
              const matchingUser = appealOnViolationData.decisions.find(
                decisionContributor => decisionContributor.contributorId === violContributor.contributorId
              );
              return matchingUser ? { ...violContributor, ...matchingUser } : null;
            })
            .filter(Boolean) as ContributorDetails[];

          // Fill the documents for each contributor based on the provided content ID from get Appeal On Violation API
          this.violativeContributorsList.forEach(contributor => {
            const matchingDecision = appealOnViolationData.decisions.find(
              decision => decision.contributorId == contributor.contributorId
            );
            const matchingDocuments = matchingDecision.contributorDocuments
              .map(docId => {
                return appealOnViolationDocumentsData.find(aovDoc => aovDoc.id === docId);
              })
              .filter(Boolean) as DocumentItem[];
            contributor.documents = matchingDocuments;
          });
        },
        error => {
          this.alertService.showError(error.error.message);
        },
        () => {}
      );
    }

    // This block handles general appeal details
    else {
      this.getAppealDetails();
      this.getAppealDocuments(this.transaction.transactionRefNo);
    }

    this.workflowService.ticketHistory$
      .pipe(
        takeUntil(this.destroy$),
        tap(res => (this.ticketHistory = res))
      )
      .subscribe();
  }

  navigateToTransaction() {
    if (this.appealDetails?.type) {
      const transaction = new Transaction();
      transaction.transactionId = this.appealDetails?.againstTransactionId;
      transaction.status = this.appealDetails?.status;
      transaction.transactionRefNo = this.appealDetails?.transactionRefNumber;
      this.onNavigateToTransaction(transaction);
    } else if (this.violationId) {
      let url = ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(
        this.violationId,
        this.transaction.params.REGISTRATION_NO
      );
      this.router.navigate([url]);
    }
  }

  userProfile(identifier: number) {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      const url = `/establishment-private/#/` + RouterConstantsBase.ROUTE_INDIVIDUAL_PROFILE_INFO(identifier);
      window.open(url, '_blank');
    }
  }
}
