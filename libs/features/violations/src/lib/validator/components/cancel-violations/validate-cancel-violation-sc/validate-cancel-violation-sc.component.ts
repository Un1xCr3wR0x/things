import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ChangeViolationsBaseScComponent } from '../../../../shared/components';
import { ViolationRouteConstants } from '../../../../shared/constants';
import { DocumentTransactionType, ViolationValidatorRoles } from '../../../../shared/enums';
import { ViolationsValidatorService } from '../../../../shared/services';

@Component({
  selector: 'vol-validate-cancel-violation-sc',
  templateUrl: './validate-cancel-violation-sc.component.html',
  styleUrls: ['./validate-cancel-violation-sc.component.scss']
})
export class ValidateCancelViolationScComponent extends ChangeViolationsBaseScComponent implements OnInit, OnDestroy {
  //Local Variables
  isValidator1: boolean;
  isValidator2: boolean;
  transactionNo: number;
  /**
   *
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param lookupService
   * @param documentService
   * @param validatorService
   * @param appToken
   * @param router
   * @param routerDataToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly validatorService: ViolationsValidatorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
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
    this.initialiseParams();
    this.alertService.clearAlerts();
    super.getLovList();
    this.transactionNo = this.referenceNo;
    this.getCancelValidatorView();
  }

  /** Method to retrieve data for violations validator view. */
  getCancelValidatorView(): void {
    super
      .getViolationValidatorDetails()
      .pipe(
        switchMap(() => {
          return super.getViolationDocuments(
            DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
            DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
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

  initialiseParams() {
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
  saveWorkFlowDetails(value: number) {
    const action = this.getWorkflowActions(value);
    const data = this.setWorkflowData(this.routerDataToken, action);
    this.saveWorkflow(data);
    this.hideTemplate();
  }

  navigateToCancelScreen() {
    this.router.navigate([
      ViolationRouteConstants.ROUTE_EDIT_CANCEL_VIOLATIONS_PROFILE(this.violationId, this.estRegNo)
    ]);
  }
  ngOnDestroy() {
    this.alertService.clearAllInfoAlerts();
  }
}
