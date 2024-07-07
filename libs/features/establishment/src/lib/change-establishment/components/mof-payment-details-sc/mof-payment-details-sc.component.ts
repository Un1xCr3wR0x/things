/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  MainEstablishmentInfo,
  RoleIdEnum,
  RouterConstants,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentWorkFlowStatus,
  PaymentTypeEnum,
  canEditMofPaymentDetails,
  goToResumeTransaction,
  isLegalEntitySame
} from '../../../shared';

@Component({
  selector: 'est-mof-payment-details-sc',
  templateUrl: './mof-payment-details-sc.component.html',
  styleUrls: ['./mof-payment-details-sc.component.scss']
})
export class MofPaymentDetailsScComponent extends ChangeEstablishmentScBaseComponent implements OnInit {
  selectedRegistrationNo: number;
  selectedEstablishment: Establishment;
  viewMode = false;
  isAppPrivate: boolean;
  isMofPayment: boolean;
  workflows: EstablishmentWorkFlowStatus[];
  mainEstablishment: MainEstablishmentInfo;
  editWarningMsg: Alert[];
  routeToView: string;
  accessRoles: RoleIdEnum[] = [];
  draftTransaction: EstablishmentWorkFlowStatus;

  @ViewChild('draftModal', { static: false }) draftModal: TemplateRef<HTMLElement>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
  }

  ngOnInit(): void {
    if (this.changeEstablishmentService.selectedRegistrationNo) {
      this.accessRoles = [RoleIdEnum.CSR];
      this.selectedRegistrationNo = this.changeEstablishmentService.selectedRegistrationNo;
      this.selectedEstablishment = this.changeEstablishmentService.selectedEstablishment;
      if (
        this.estRouterData.taskId &&
        RouterConstants.TRANSACTIONS_UNDER_ESTABLISHMENT.indexOf(this.estRouterData.resourceType) !== -1
      ) {
        this.viewMode = true;
      }
      this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
      this.isMofPayment =
        this.selectedEstablishment?.establishmentAccount?.paymentType?.english === PaymentTypeEnum.MOF;
      this.routeToView = EstablishmentConstants.EST_PROFILE_ROUTE(this.selectedRegistrationNo);
      this.getWorkflowDetails();
    } else {
      this.location.back();
    }
  }

  /**
   *Method to navigate back
   */
  navigateBack() {
    this.location.back();
  }

  /**
   * method to get workflow details
   */
  getWorkflowDetails() {
    of(this.selectedEstablishment?.mainEstablishment)
      .pipe(
        switchMap(mainEst => {
          this.mainEstablishment = mainEst;
          return this.establishmentService
            .getWorkflowsInProgress(this.selectedRegistrationNo, false)
            .pipe(catchError(() => of([])));
        })
      )
      .subscribe(
        workflows => {
          this.workflows = workflows;
        },
        err => this.alertService.showError(err?.error?.message)
      );
  }

  /**
   * method to navigate modify mof details
   * @param editWarningTemplate
   */
  modifyMofPayment(editWarningTemplate: TemplateRef<HTMLElement>) {
    canEditMofPaymentDetails(
      editWarningTemplate,
      this.workflows,
      this.selectedEstablishment.status.english === EstablishmentStatusEnum.REGISTERED ||
        this.selectedEstablishment.status.english === EstablishmentStatusEnum.REOPEN,
      !isLegalEntitySame(
        this.selectedEstablishment?.legalEntity?.english,
        this.mainEstablishment?.legalEntity?.english
      ),
      this,
      this.draftModal
    );
  }

  cancelAndStart() {
    this.changeEstablishmentService
      .revertTransaction(this.selectedRegistrationNo, this.draftTransaction?.referenceNo)
      .pipe(
        tap(() => {
          this.goToMofTransaction();
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
          return of(null);
        })
      )
      .subscribe();
  }

  navigateToTransaction() {
    goToResumeTransaction(this.router, this.draftTransaction?.referenceNo, this.draftTransaction?.transactionId);
  }

  goToMofTransaction() {
    this.router.navigate([EstablishmentRoutesEnum.MODIFY_MOF_PAYMENT]);
  }
}
