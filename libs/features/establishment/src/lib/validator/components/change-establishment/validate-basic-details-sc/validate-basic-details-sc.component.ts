/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService,
  isGccEstablishment
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';
@Component({
  selector: 'est-validate-basic-details-sc',
  templateUrl: './validate-basic-details-sc.component.html',
  styleUrls: ['./validate-basic-details-sc.component.scss']
})
export class ValidateBasicDetailsScComponent extends ValidatorScBaseComponent implements OnInit {
  basicDetailsValidatorForm: FormGroup;

  @Input() isGcc: boolean;

  constructor(
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BASIC_DETAILS;
  }

  ngOnInit() {
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseViewWithBasicDetails(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing the establishment details and comments
   * @param referenceNumber
   */
  initialiseViewWithBasicDetails(referenceNumber: number) {
    this.getComments(this.estRouterData);
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.basicDetailsValidatorForm = this.createForm();
    this.basicDetailsValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);

    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }

  /**
   * // method to get the establishment details to validate
   * @param referenceNumber
   */
  getValidatingEstablishmentDetails(registrationNo: number, referenceNumber: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(registrationNo, referenceNumber)
      .pipe(
        tap(res => (this.establishmentToValidate = res)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          if (isGccEstablishment(this.establishmentToValidate)) {
            this.isGcc = true;
            this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_GCC_BASIC_DETAILS;
          }
          this.getDocumentDetails(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.establishmentToValidate.registrationNo,
            referenceNumber
          );
          this.getEstablishmentDetails(this.establishmentToValidate.registrationNo);
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
  }
}
