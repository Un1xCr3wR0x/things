/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterDataToken,
  RouterData,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ChangeViolationsBaseScComponent } from '../../../../shared/components';
import { DocumentTransactionType, ViolationValidatorRoles } from '../../../../shared/enums';
import { ViolationsValidatorService } from '../../../../shared/services';
import { ViolationRouteConstants } from '../../../../shared/constants';

@Component({
  selector: 'vol-validate-modify-violations-sc',
  templateUrl: './validate-modify-violations-sc.component.html',
  styleUrls: ['./validate-modify-violations-sc.component.scss']
})
export class ValidateModifyViolationsScComponent extends ChangeViolationsBaseScComponent implements OnInit, OnDestroy {
  transactionNumber: number;
  isValidator1: boolean;
  isValidator2: boolean;
  /**
   *
   * @param modalService
   * @param lookupService
   * @param workflowService
   * @param router
   * @param documentService
   * @param alertService
   * @param routerDataToken
   */
  constructor(
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly validatorService: ViolationsValidatorService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      alertService,
      workflowService,
      modalService,
      validatorService,
      router,
      lookupService,
      documentService,
      routerDataToken,
      appToken
    );
  }

  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.initializeParameters();
    this.alertService.clearAlerts();
    this.transactionNumber = this.referenceNo;
    super.getLovList();
    this.getModifyViolationsView();
  }

  /** Method to retrieve data for violations validator view. */
  getModifyViolationsView(): void {
    super
      .getViolationValidatorDetails()
      .pipe(
        switchMap(() => {
          return super.getViolationDocuments(
            DocumentTransactionType.MODIFY_VIOLATION_TYPE,
            DocumentTransactionType.MODIFY_VIOLATION_TYPE,
            this.violationId,
            this.referenceNo
          );
        }),
        catchError(err => {
          super.handleErrors(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  initializeParameters() {
    this.getDataFromToken(this.routerDataToken);
    this.getRolesForView(this.routerDataToken);
    if (this.validatorType === ViolationValidatorRoles.VALIDATOR_1) {
      this.isValidator1 = true;
    }
    if (this.validatorType === ViolationValidatorRoles.VALIDATOR_2) {
      this.isValidator2 = true;
    }
  }
  /**
   * Method to save workflow actions
   * @param key
   */
  saveWorkFlowActions(key: number) {
    const action = this.getWorkflowActions(key);
    const data = this.setWorkflowData(this.routerDataToken, action);
    this.saveWorkflow(data);
    this.hideTemplate();
  }

  navigateToModifyScreen() {
    this.router.navigate([
      ViolationRouteConstants.ROUTE_EDIT_MODIFY_VIOLATIONS_PROFILE(this.violationId, this.estRegNo)
    ]);
  }
  ngOnDestroy() {
    this.alertService.clearAllInfoAlerts();
  }
}
