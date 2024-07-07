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
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  RouterConstants,
  startOfDay,
  WorkflowService
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  FlagDetails,
  FlagEstablishmentService,
  FlagQueryParam,
  TerminateEstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-flag-establishment-sc',
  templateUrl: './validate-flag-establishment-sc.component.html',
  styleUrls: ['./validate-flag-establishment-sc.component.scss']
})
export class ValidateFlagEstablishmentScComponent extends ValidatorScBaseComponent implements OnInit {
  /**
   * Local Variables
   */
  flagEstForm: FormGroup;
  transactionNumber: number;
  flagDetails: FlagDetails;
  modifiedFlagDetails: FlagDetails;
  isModify = false;
  isJustificationModified = false;
  isEndDateModified = false;
  heading = 'ESTABLISHMENT.REJECT.FLAG-EST';
  returnHeading = 'ESTABLISHMENT.RETURN.FLAG-EST';
  currentDate = startOfDay(new Date());
  canApprove = true;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstService: ChangeEstablishmentService,
    readonly changeGroupEstService: ChangeGroupEstablishmentService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly flagService: FlagEstablishmentService,
    readonly terminateEstService: TerminateEstablishmentService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      lookupService,
      changeEstService,
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
    this.documentTransactionType = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
  }

  ngOnInit(): void {
    if (this.estRouterData.referenceNo) {
      this.initialiseView(this.estRouterData.referenceNo);
    } else {
      this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
    }
  }

  /**
   *  Method to initialise the view
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.flagEstForm = this.createForm();
    this.flagEstForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.getRejectReasonList();
    this.getReturnReasonList();
    if (this.estRouterData.resourceType === RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT) {
      this.isModify = true;
      this.documentTransactionKey = DocumentTransactionTypeEnum.MODIFY_FLAG_ESTABLISHMENT;
      this.heading = 'ESTABLISHMENT.REJECT.MODIFY-FLAG-EST';
      this.returnHeading = 'ESTABLISHMENT.RETURN.MODIFY-FLAG-EST';
    }
    //this.getValidatingEstablishmentDetails(referenceNumber, false);
    this.getFlagDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      +this.estRouterData.registrationNo,
      this.estRouterData.referenceNo
    );
    this.getEstablishmentDetails(+this.estRouterData.registrationNo);
    this.getComments(this.estRouterData);
    this.getFlagDetails();
    if (this.isModify) {
      this.getModifiedFlagDetails();
    }
  }

  /**
   * Method to navigate to flag establishment
   */
  navigateToFlagEst() {
    this.router.navigate([EstablishmentRoutesEnum.FLAG]);
  }
  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param registrationNo
   */
  getFlagDocuments(transactionKey: string, transactionType: string, registrationNo: number, referenceNo: number) {
    this.changeGroupEstService
      .getDocuments(transactionKey, transactionType, registrationNo, referenceNo)
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }

  getFlagDetails() {
    const params = new FlagQueryParam();

    if (this.isModify) {
      params.flagId = this.estRouterData.flagId;
    } else {
      params.status = EstablishmentQueryKeysEnum.INITIATE_MODE;
      params.transactionTraceId = this.estRouterData.referenceNo;
    }
    this.flagService.getFlagDetails(+this.estRouterData.registrationNo, params).subscribe(res => {
      this.flagDetails = res[0];
      const startDate = startOfDay(this.flagDetails?.startDate?.gregorian);
      const endDate = startOfDay(this.flagDetails?.endDate?.gregorian);
      if (moment(startDate).isBefore(this.currentDate) && moment(endDate).isBefore(this.currentDate)) {
        this.canApprove = false;
      }
    });
  }

  getModifiedFlagDetails() {
    const params = new FlagQueryParam();
    params.transactionTraceId = this.estRouterData.referenceNo;
    params.flagId = this.estRouterData.flagId;
    params.getTransient = true;
    this.flagService.getFlagDetails(+this.estRouterData.registrationNo, params).subscribe(res => {
      this.modifiedFlagDetails = res[0];
      const startDate = startOfDay(this.modifiedFlagDetails?.startDate?.gregorian);
      const endDate = startOfDay(this.modifiedFlagDetails?.endDate?.gregorian);
      if (moment(startDate).isBefore(this.currentDate) && moment(endDate).isBefore(this.currentDate)) {
        this.canApprove = false;
      }
      if (this.modifiedFlagDetails !== null && this.modifiedFlagDetails !== undefined) {
        if (this.modifiedFlagDetails?.justification !== this.flagDetails?.justification) {
          this.isJustificationModified = true;
        }
        if (this.modifiedFlagDetails?.endDate?.gregorian || this.flagDetails?.endDate?.gregorian) {
          const modifiedDate = startOfDay(this.modifiedFlagDetails?.endDate?.gregorian);
          const flagEndDate = startOfDay(this.flagDetails?.endDate?.gregorian);
          if (!moment(flagEndDate).isSame(moment(modifiedDate), 'day')) {
            this.isEndDateModified = true;
          }
        }
      }
    });
  }

  restrictApproveTransaction() {
    if (this.isModify) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.RESTRICT-MODIFY-FLAG-APPROVE');
    } else {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.RESTRICT-ADD-FLAG-APPROVE');
    }
  }
}
