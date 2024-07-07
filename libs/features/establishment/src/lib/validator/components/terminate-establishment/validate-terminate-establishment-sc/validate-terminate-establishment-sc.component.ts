/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  scrollToTop,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  TerminateEstablishmentService,
  TerminateResponse
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-terminate-establishment-sc',
  templateUrl: './validate-terminate-establishment-sc.component.html',
  styleUrls: ['./validate-terminate-establishment-sc.component.scss']
})
export class ValidateTerminateEstablishmentScComponent extends ValidatorScBaseComponent implements OnInit {
  /**
   * Local Variables
   */
  terminateEstForm: FormGroup;
  closeEstablishmentDetails: TerminateResponse;
  canReject = true;
  hasDebit: boolean;
  isFCTransaction: boolean;

  /**
   *
   * @param lookupService
   * @param workflowService
   * @param establishmentService
   * @param fb
   * @param documentService
   * @param modalService
   * @param changeEstablishmentService
   * @param alertService
   * @param estRouterData
   * @param router
   * @param appToken
   */
  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService,
    readonly alertService: AlertService,
    readonly terminateService: TerminateEstablishmentService,
    readonly storageService: StorageService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      lookupService,
      changeEstablishmentService,
      establishmentService,
      alertService,
      documentService,
      fb,
      workflowService,
      modalService,
      appToken,
      estRouterData,
      router
    );
    this.documentTransactionKey = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.TERMINATE_ESTABLISHMENT;
  }

  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) {
      this.initialiseView(this.estRouterData.referenceNo);
    } else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.terminateEstForm = this.createForm();
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.terminateEstForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    if (
      this.estRouterData.assignedRole === Role.VALIDATOR_2 ||
      this.estRouterData.assignedRole === Role.CNT_FC_APPROVER
    ) {
      this.canReturn = true;
      this.canEdit = false;
    }
    if (this.estRouterData.assignedRole === Role.VALIDATOR_1) {
      this.canEdit = true;
      this.canReturn = false;
    }
    if (this.estRouterData.assignedRole === Role.CNT_FC_APPROVER) {
      this.canReject = false;
      this.isFCTransaction = true;
    }
    if (
      (this.estRouterData.previousOwnerRole === Role.VALIDATOR_2 &&
        this.estRouterData.assignedRole !== Role.CNT_FC_APPROVER) ||
      this.estRouterData.previousOwnerRole === Role.CNT_FC_APPROVER
    ) {
      this.isReturn = true;
    }
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
      this.canReturn = true;
    } else {
      this.isReturnToAdmin = false;
    }
    if (this.estRouterData.assignedRole === 'EstAdmin') {
      this.canEdit = true;
    }

    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber, false);
    this.getCloseEstDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      +this.estRouterData.registrationNo,
      this.estRouterData.referenceNo
    );
    this.getEstablishmentDetails(+this.estRouterData.registrationNo);
    this.getComments(this.estRouterData);
    this.getClosureDetails(+this.estRouterData.registrationNo);
  }

  /**
   * method to fetch the closues details of the establishment
   * @param registrationNo
   */
  getClosureDetails(registrationNo) {
    this.terminateService
      .terminateEstablishment(registrationNo, null, [
        {
          queryKey: EstablishmentQueryKeysEnum.MODE,
          queryValue: EstablishmentQueryKeysEnum.DRAFT_MODE
        }
      ])
      .subscribe(
        res => {
          this.closeEstablishmentDetails = res;
          this.hasDebit = res?.debit;
        },
        err => {
          this.alertService.showError(err?.error?.message);
        }
      );
  }

  /**
   * method to navigate to terminate est screen on V1 edit
   */
  navigateToTerminateEst() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE_MODIFY]);
  }

  /**
   * method to navigate to bill dashborad
   */
  naviagteBillDashboard() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      const url = '#' + EstablishmentConstants.COLLECTION_DASHBOARD_ROUTE(this.estRouterData.registrationNo);
      window.open(url, '_blank');
    } else {
      this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, this.estRouterData.registrationNo);
      const url = '#' + EstablishmentRoutesEnum.BILL_DASHBOARD_ROUTE;
      window.open(url, '_blank');
    }
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param registrationNo
   */
  getCloseEstDocuments(transactionKey: string, transactionType: string, registrationNo: number, referenceNo: number) {
    this.changeGroupEstablishmentService
      .getDocuments(transactionKey, transactionType, registrationNo, referenceNo)
      .subscribe(
        res => (
          (this.documents = res.filter(item => item.documentContent != null)),
          err => {
            this.alertService.showError(err?.error?.message);
          }
        )
      );
  }
}
