import { Location } from '@angular/common';
import { Directive, Inject, TemplateRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  DocumentItem,
  DocumentService,
  LookupService,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  WorkflowService,
  TransactionReferenceData,
  RouterConstants,
  WorkFlowActions,
  LovList
} from '@gosi-ui/core';
import { ViolationBPMRequest, ViolationTransaction } from '../../models';
import { ViolationConstants, ViolationRouteConstants } from '../../constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViolationsValidatorService } from '../../services';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SystemParameterEnum, ViolationValidatorRoles } from '../../enums';
@Directive()
export class RaiseViolationsBaseScComponent extends BaseComponent {
  //Local variables
  referenceNo: number;
  channel: String;
  modalRef: BsModalRef;
  transactionDetails: ViolationTransaction;
  transactionReferenceData: TransactionReferenceData[] = [];
  rejectReasonList$: Observable<LovList>;
  validatorMemberForm: FormGroup = new FormGroup({});
  violationId: number;
  validatorType: String;
  documentList: DocumentItem[];
  isReturn: boolean;
  estRegNum: number;
  returnReasonList$: Observable<LovList>;
  billBatchInProgress = false;

  /**
   *@param modalService
   * @param lookupService
   * @param documentService
   * @param alertService
   * @param workflowService
   * @param modalService
   * @param router
   * @param routerData
   */
  constructor(
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly validatorService: ViolationsValidatorService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }
  /** Method to navigate to inbox. */
  routeToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /** Method to initialize keys from payload. */
  // initializeToken(): void {
  //   this.referenceNo = this.routerData.transactionId;
  //   const payload = JSON.parse(this.routerData.payload);
  //   if (payload) {
  //     this.channel = payload.channel;
  //   }
  //   this.transactionReferenceData = this.routerData.comments;
  // }
  /** Method to navigate to inbox on error during view initialization. */
  handleErrors(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.routeToInbox();
  }

  navigateToProfile(index: number) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    const sinNo = this.transactionDetails.contributors[index].socialInsuranceNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    }
    window.open(url, '_blank');
  }
  navigateToEstProfile(regNo: number) {
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
   * This method is to show the modal reference.
   * @param modalRef
   */
  showTemplate(templateRef: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }
  //   show modal
  /**
   * This method is to show  Modal Reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isSubmitted: boolean): void {
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-lg modal-dialog-centered'
    });
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
  /**Method to return to inbox */
  confirmCancel() {
    this.routeToInbox();
    this.modalRef.hide();
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
      if (token.registrationNo) this.estRegNum = token.registrationNo;
      if (token.previousOutcome === 'RETURN' && token.assignedRole === ViolationValidatorRoles.VALIDATOR_1)
        this.isReturn = true;
    }
    this.transactionReferenceData = this.routerData.comments;
  }

  //   method to hide modal
  hideTemplate(): void {
    this.modalRef.hide();
  }
  getLovList() {
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
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
  // method for service call to get violation details
  getViolationDetails(estRegNum: number, violationId: number): Observable<ViolationTransaction> {
    return this.validatorService.getTransactionDetails(violationId, estRegNum);
  }
}
