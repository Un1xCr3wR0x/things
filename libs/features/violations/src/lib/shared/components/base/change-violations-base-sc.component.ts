import { Directive, Inject, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ViolationRouteConstants } from '../../constants';
import { SystemParameterEnum, ViolationValidatorRoles } from '../../enums';
import { ChangeViolationValidator, ViolationBPMRequest } from '../../models';
import { ViolationsValidatorService } from '../../services';
@Directive()
export class ChangeViolationsBaseScComponent extends BaseComponent implements OnDestroy {
  /**
   * Local Varibles
   */
  assignedRole: string;
  assigneeId: string;
  bpmTaskId: string;
  canReturn: boolean;
  channel: string;
  documentList: DocumentItem[];
  modalRef: BsModalRef;
  referenceNo: number;
  transactionReference: TransactionReferenceData[] = [];
  validatorMemberForm: FormGroup = new FormGroup({});
  violationDetails: ChangeViolationValidator;
  violationId: number;
  isSimisFlag: boolean;
  returnReasonList$: Observable<LovList>;
  rejectReasonList$: Observable<LovList>;
  validatorType: string;
  isReturn: boolean;
  estRegNo: number;
  billBatchInProgress = false;
  isReopenClosingInProgress: boolean = false;

  /**
   *
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param validatorService
   * @param router
   * @param routerDataToken
   * @param appToken
   */
  constructor(
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }
  /** Method to navigate to inbox. */
  routeToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * Method to retrieve violations data for modification
   * @param violationId
   * @param referenceNo
   */
  getViolationValidatorDetails(): Observable<ChangeViolationValidator> {
    return this.validatorService.getValidatorViewDetails(this.violationId, this.referenceNo).pipe(
      tap(res => {
        this.violationDetails = res;
        this.estRegNo = res?.establishmentDetails?.registrationNo;
        this.isSimisFlag = this.violationDetails.isSimisViolation;
        this.isReopenClosingInProgress = res?.establishmentDetails?.isReopenClosingInProgress;
      })
    );
  }
  /** Method to get lovlist . */
  getLovList() {
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.validatorService
      .getSystemParams()
      .pipe(
        tap(parameter => {
          const billBatchParamter = parameter.filter(
            param => param.name === SystemParameterEnum.billBatchIndicator
          )?.[0];
          this.billBatchInProgress = +billBatchParamter?.value === 1;
          if (this.billBatchInProgress) {
            this.alertService.setInfoByKey('CORE.INFO.BILL-BATCH-IN-PROGRESS');
          }
        })
      )
      .subscribe();
  }

  /** Method to navigate to inbox on error during view initialization. */
  handleErrors(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.routeToInbox();
  }

  /** Method to get documents for the modify/cancel Violations. */
  getViolationDocuments(
    documentId: string,
    documentType: string | string[],
    contractId: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(documentId, documentType, contractId, referenceNo).pipe(
      tap(res => {
        this.documentList = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /**
   * Method to set data from token.
   * @param token token
   */
  getDataFromToken(tokenData: RouterData) {
    if (tokenData.payload) {
      const token = JSON.parse(tokenData.payload);
      if (token.referenceNo) this.referenceNo = token.referenceNo;
      if (token.channel) this.channel = token.channel;
      if (token.violationId) this.violationId = token.violationId;
      if (token.assignedRole) this.validatorType = token.assignedRole;
      if (token.previousOutcome === 'RETURN' && token.assignedRole === ViolationValidatorRoles.VALIDATOR_1)
        this.isReturn = true;
    }
    this.transactionReference = this.routerDataToken.comments;
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
  /** Method to get workflow action. */
  getWorkflowActions(key: number): string {
    let validatorAction: string;
    switch (key) {
      case 0:
        validatorAction = WorkFlowActions.APPROVE;
        break;
      case 1:
        validatorAction = WorkFlowActions.REJECT;
        break;
      case 2:
        validatorAction = WorkFlowActions.RETURN;
        break;
      case 3:
        validatorAction = WorkFlowActions.SUBMIT;
        break;
    }
    return validatorAction;
  }
  /**
   * Method to set workflow details.
   * @param routerData
   * @param action
   */
  setWorkflowData(routerData: RouterData, action: string): ViolationBPMRequest {
    const bpmRequest = new ViolationBPMRequest();
    if (this.validatorMemberForm.get('rejectionReason'))
      bpmRequest.rejectionReason = this.validatorMemberForm.get('rejectionReason').value;
    if (this.validatorMemberForm.get('comments')) bpmRequest.comments = this.validatorMemberForm.get('comments').value;
    if (this.validatorMemberForm.get('returnReason'))
      bpmRequest.returnReason = this.validatorMemberForm.get('returnReason').value;
    bpmRequest.taskId = routerData.taskId;
    bpmRequest.outcome = action;
    bpmRequest.user = routerData.assigneeId;
    return bpmRequest;
  }
  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(violationRequest: ViolationBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(violationRequest)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(violationRequest.outcome));
          this.routeToInbox();
        }),
        catchError(err => {
          this.handleErrors(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showTemplate(templateRef: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }
  /**
   * Navigate to Establishment profile Page
   */
  navigateToEstablishmentProfile(regNo: number) {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    }
    window.open(url, '_blank');
  }
  /**
   * Method to get success message according to outcome
   * @param outcome
   */
  getSuccessMessage(key: string) {
    let messageValue: string;
    switch (key) {
      case WorkFlowActions.REJECT:
        messageValue = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.APPROVE:
        messageValue = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageValue = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-RETURN-MESSAGE';
        break;
    }
    return messageValue;
  }

  /** This method is to hide the modal reference. */
  hideTemplate(): void {
    this.modalRef.hide();
  }
  /**
   * Navigate to Establishment profile Page
   */
  navigateToViolationProfile(regNo: number) {
    this.router.navigate([ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(regNo, this.estRegNo)]);
  }
  /**Method to return to inbox */
  confirmCancel() {
    this.routeToInbox();
    this.modalRef.hide();
  }
  ngOnDestroy() {
    this.alertService.clearAllInfoAlerts();
  }
}
