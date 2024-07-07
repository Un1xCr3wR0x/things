/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { filter, takeUntil, tap } from 'rxjs/operators';
import {
  hasCrnChanged,
  hasLicenseChanged
} from '../../../../change-establishment/components/change-identifier-details-sc/change-identifier-helper';
import {
  ChangeEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';
@Component({
  selector: 'est-validate-identifier-details-sc',
  templateUrl: './validate-identifier-details-sc.component.html',
  styleUrls: ['./validate-identifier-details-sc.component.scss']
})
export class ValidateIdentifierDetailsScComponent extends ValidatorScBaseComponent implements OnInit, OnDestroy {
  //Local variables
  IdentifierValidatorForm: FormGroup;
  hasCrnAndLicenseChange = false;

  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    readonly lookUpService: LookupService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router
  ) {
    super(
      lookUpService,
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_IDENTIFIER_DETAILS;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_IDENTIFIER_DETAILS;
  }

  ngOnInit() {
    scrollToTop();
    this.hasInitialisedSubject
      .asObservable()
      .pipe(
        takeUntil(this.destroy$),
        filter(res => res === true),
        tap(() => {
          if (this.establishment && this.establishmentToValidate) {
            this.hasCrnAndLicenseChange =
              hasLicenseChanged(this.establishment, this.establishmentToValidate) &&
              hasCrnChanged(this.establishment?.crn, this.establishmentToValidate?.crn);
          }
        })
      )
      .subscribe();
    if (this.estRouterData.referenceNo) this.initialiseView(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view for showing establishment details and comments
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.IdentifierValidatorForm = this.createForm();
    this.IdentifierValidatorForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(this.estRouterData.registrationNo, referenceNumber);
    this.getComments(this.estRouterData);
    if (this.estRouterData.assignedRole === Role.VALIDATOR) {
      this.isReturnToAdmin = true;
    } else {
      this.isReturnToAdmin = false;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
