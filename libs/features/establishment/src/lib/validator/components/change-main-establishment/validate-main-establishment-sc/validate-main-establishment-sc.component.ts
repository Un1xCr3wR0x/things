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
  Autobind,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Role,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionTypeEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService
} from '../../../../shared';
import { ValidatorScBaseComponent } from '../../../base/validator-sc.base-component';

@Component({
  selector: 'est-validate-main-establishment-sc',
  templateUrl: './validate-main-establishment-sc.component.html',
  styleUrls: ['./validate-main-establishment-sc.component.scss']
})
export class ValidateMainEstablishmentScComponent extends ValidatorScBaseComponent implements OnInit {
  /**
   * Local Variables
   */
  changeMainEstForm: FormGroup;
  newEstablishment: Establishment;
  transactionNumber: number;

  /**
   * @param lookupService
   * @param workflowService
   * @param establishmentService
   * @param fb
   * @param documentService
   * @param modalService
   * @param changeEstablishmentService
   * @param alertService
   * @param estRouterData
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
    this.documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
    this.documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
  }
  ngOnInit(): void {
    scrollToTop();
    if (this.estRouterData.referenceNo) this.initialiseView(this.estRouterData.referenceNo);
    else this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
  }

  /**
   *  Method to initialise the view
   * @param referenceNumber
   */
  initialiseView(referenceNumber: number) {
    this.changeMainEstForm = this.createForm();
    this.transactionNumber = Number(this.estRouterData.referenceNo);
    this.changeMainEstForm.patchValue({
      referenceNo: this.estRouterData.referenceNo,
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
    this.canReturn =
      this.estRouterData.assignedRole === Role.VALIDATOR_2 || this.estRouterData.assignedRole === Role.VALIDATOR;
    this.isReturn = this.estRouterData.previousOwnerRole === Role.VALIDATOR_2;
    this.getRejectReasonList();
    this.getReturnReasonList();
    this.getValidatingEstablishmentDetails(
      this.estRouterData.registrationNo,
      referenceNumber,
      false,
      this.getNewMainEst
    );
    this.getValidateDocuments(
      this.documentTransactionKey,
      this.documentTransactionType,
      +this.estRouterData.registrationNo,
      this.estRouterData.referenceNo
    );
    this.getEstablishmentDetails(+this.estRouterData.registrationNo);
    this.getComments(this.estRouterData);
  }
  navigateToChangeMainEst() {
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN]);
  }

  @Autobind
  getNewMainEst(oldMainEst: Establishment) {
    this.establishmentService
      .getEstablishment(oldMainEst?.mainEstablishmentRegNo)
      .pipe(
        tap(res => {
          this.establishmentToValidate = res;
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message);
          return throwError(null);
        })
      )
      .subscribe(noop, noop);
  }
  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param registrationNo
   */
  getValidateDocuments(transactionKey: string, transactionType: string, registrationNo: number, referenceNo: number) {
    this.changeGroupEstablishmentService
      .getDocuments(transactionKey, transactionType, registrationNo, referenceNo)
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }
}
