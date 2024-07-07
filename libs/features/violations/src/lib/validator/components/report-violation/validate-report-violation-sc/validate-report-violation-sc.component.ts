import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { RaiseViolationsBaseScComponent } from '@gosi-ui/features/violations/lib/shared/components/base/raise-violations-base-sc.component';
import { ViolationRouteConstants } from '@gosi-ui/features/violations/lib/shared/constants';
import {
  EstablishmentViolationsService,
  ViolationsValidatorService
} from '@gosi-ui/features/violations/lib/shared/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  ViolationTypeEnum,
  ViolationValidatorRoles,
  ViolationsEnum
} from '../../../../shared/enums';
import { ViolationTransaction } from '../../../../shared/models';
@Component({
  selector: 'vol-validate-report-violation-sc',
  templateUrl: './validate-report-violation-sc.component.html',
  styleUrls: ['./validate-report-violation-sc.component.scss']
})
export class ValidateReportViolationScComponent extends RaiseViolationsBaseScComponent implements OnInit {
  isRaiseViolationFo: boolean;
  violationType: String;
  isCancelEngagement: boolean;
  isIncorrectReason: boolean;
  isAddNewEngagement: boolean;
  isIncorrectWage: boolean;
  isWrongBenefits: boolean;
  isViolatingProvision: boolean;
  transactionDetails: ViolationTransaction;
  isValidator1: boolean;
  isValidator2: boolean;
  canReturn: boolean;
  assignedRole: string;
  assigneeId: string;
  bpmTaskId: string;
  isYes: string;
  @Input() isEdit: boolean;

  /**
   *@param routerDataToken
   * */
  constructor(
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    readonly estViolationService: EstablishmentViolationsService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      modalService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      router,
      validatorService,
      routerData,
      appToken
    );
  }

  ngOnInit(): void {
    this.initialiseParams();
    this.isRaiseViolationFo = true;
    this.getLovList();
    this.isYes = ViolationsEnum.BOOLEAN_YES;
    this.getViolationDetails(this.estRegNum, this.violationId)
      .pipe(
        tap(res => {
          this.transactionDetails = res;
          this.checkViolationType(this.transactionDetails?.violationType?.english);
        }),
        switchMap(() => {
          return super.getViolationDocuments(
            DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION,
            DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO,
            this.transactionDetails?.violationId,
            this.transactionDetails?.violationReferenceNumber
          );
        }),
        catchError(err => {
          this.handleErrors(err, true);
          return throwError(err);
        })
      )
      .subscribe();
  }

  checkViolationType(violationType: string) {
    switch (violationType.toUpperCase()) {
      case ViolationTypeEnum.RAISE_CANCEL_ENGAGEMENT.toUpperCase():
        this.isCancelEngagement = true;
        break;
      case ViolationTypeEnum.RAISE_INCORRECT_REASON.toUpperCase():
        this.isIncorrectReason = true;
        break;
      case ViolationTypeEnum.RAISE_INCORRECT_WAGE.toUpperCase():
        this.isIncorrectWage = true;
        break;
      case ViolationTypeEnum.RAISE_ADD_NEW_ENGAGEMENT.toUpperCase():
        this.isAddNewEngagement = true;
        break;
      case ViolationTypeEnum.RAISE_WRONG_BENEFITS.toUpperCase():
        this.isWrongBenefits = true;
        break;
      case ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS.toUpperCase():
        this.isViolatingProvision = true;
        break;
    }
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
   * Method to set roles for view.
   * @param token token
   */
  getRolesForView(tokenData: RouterData) {
    if (tokenData) {
      this.bpmTaskId = tokenData.taskId;
      this.assigneeId = tokenData.assigneeId;
      this.assignedRole = tokenData.assignedRole;
      if (this.assignedRole === ViolationValidatorRoles.COMMITEE_HEAD) this.canReturn = true;
      else this.canReturn = false;
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
  /** Method to handle workflow events. */
  // manageWorkflowEvents(val: number) {

  // }
  onEditClick() {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    this.estViolationService.estRegNumber = regNo;
    this.router.navigate([ViolationRouteConstants.ROUTE_RAISE_VIOLATIONS_EDIT(regNo)], {
      queryParams: { violationId: this.violationId }
    });
  }
}
