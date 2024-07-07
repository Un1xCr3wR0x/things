/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, TemplateRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  WorkFlowActions,
  WorkflowService,
  RouterDataToken,
  Channel,
  TransactionReferenceData,
  Role,
  BilingualText
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorRoles } from '../../../shared/enums';
import { DoctorService, MedicalBoardService, MemberService } from '../../../shared/services';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { OhBPMRequest } from '../../models/early-reassessment';
import { TransactionContent } from '@gosi-ui/core/lib/models/transaction-content';

@Directive()
export class ValidatorMemberBaseScComponent extends BaseComponent {
  /** Local variables */
  canEdit: boolean;
  canReject: boolean;
  canReturn: boolean;
  isReturnToAdmin: boolean;
  referenceNo: number;
  documents: DocumentItem[];
  modalRef: BsModalRef;
  validatorMemberForm: FormGroup = new FormGroup({});
  channel: string;
  professionalId: number;
  contractId: number;
  comments: TransactionReferenceData[];
  personId: number;
  socialInsuranceNo: number;
  sessionId: number;
  disabilityAssessmentId: number;
  isGosiDoctor = false;
  registrationNo: number;
  canApprove = false;
  canAppeal: boolean;
  identifier: number;
  occBusinessType = 'OCC_DISAB_ASSESSMENT';
  nonOccBusinessType = 'NON_OCC_DISAB_ASSESSMENT';
  heirBusinessType = 'HEIR_DISB_ASSESSMENT';
  reassessmentType = 'REQUEST_MB_RE_ASSESSMENT';
  businessType;
  assmntReqId: number;
  ambTransaction = false;
  isReassessment = false;
  injuryId: number;
  injuryBusinessType = 'CLOSE_INJURY';
  complicationBusinessType = 'CLOSE_COMPLICATION';

  /** Observables */
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  isNoReturn = false;
  isNonOcc = false;
  hoDoctor = false;
  isHoReturn = false;
  /** Creates an instance of ValidatorBaseScComponent. */
  constructor(
    readonly doctorService: DoctorService,
    readonly medicalBoardService: MedicalBoardService,
    readonly memberService: MemberService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) routerData: RouterData
  ) {
    super();
  }

  /**
   * Method to set data from token.
   * @param token token
   */
  getDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.referenceNo) this.referenceNo = payload.referenceNo;
      if (payload.channel) this.channel = payload.channel;
      if (payload.professionalId) this.professionalId = payload.professionalId;
      if (payload.contractId) this.contractId = payload.contractId;
      if (payload.personid) this.personId = payload.personid;
      if (payload.socialInsuranceNo) this.socialInsuranceNo = payload.socialInsuranceNo;
      if (payload.mbSessionId) this.sessionId = payload.mbSessionId;
      if (payload.disabilityAssessmentId) this.disabilityAssessmentId = payload.disabilityAssessmentId;
      if (payload.establishmentRegNo) this.registrationNo = payload.establishmentRegNo;
      if (payload.injuryId) this.injuryId = payload.injuryId;
      this.identifier = payload?.identifier;
      this.assmntReqId = payload?.assessmentRequestId;
      if (payload.titleEnglish.includes('Reassessment')) {
        this.isReassessment = true;
      }
      if (payload.assignedRole === Role.GOSI_DOCTOR1 || payload.assignedRole === Role.GOSI_DOCTOR_CAPS) {
        this.isGosiDoctor = true;
        this.canApprove = true;
        this.canReturn = true;
        this.canAppeal = false;
      }
      if (
        payload.assignedRole === Role.HO_DOCTOR ||
        payload.assignedRole === Role.HO_OFFICER ||
        payload.assignedRole === Role.HEAD_GOSI_DOCTOR ||
        payload.assignedRole === Role.HEAD_OFFICE_GOSI_DOCTOR
      ) {
        this.hoDoctor = true;
        this.isGosiDoctor = false;
        this.canApprove = true;
        this.canReturn = true;
        this.canAppeal = true;
      }
      if (
        payload?.titleEnglish === 'Occupational Disability Assessment' ||
        payload?.titleEnglish === 'Occupational Disability Reassessment'
      ) {
        this.businessType = this.occBusinessType;
      } else if (
        payload?.titleEnglish === 'Non-Occupational Disability Assessment' ||
        payload?.titleEnglish === 'Non-Occupational Disability Reassessment' ||
        payload?.titleEnglish === 'Non - Occupational Disability Reassessment' ||
        payload?.titleEnglish === 'Non - Occupational Disability Assessment' ||
        payload?.titleEnglish === 'Dependent Disability Assessment' ||
        payload?.titleEnglish === 'Dependent Disability Reassessment'
      ) {
        this.businessType = this.nonOccBusinessType;
        this.isNonOcc = true;
      } else if (
        payload?.titleEnglish === 'Reassessment Non-Occupational Disability' ||
        payload?.titleEnglish === 'Reassessment Occupational Disability'
      ) {
        this.businessType = this.reassessmentType;
      } else {
        this.businessType = this.heirBusinessType;
      }
      if ((payload.assignedRole === Role.GOSI_DOCTOR1 || payload.assignedRole === Role.GOSI_DOCTOR_CAPS) && payload.previousOutcome === 'RETURN') {
        this.isHoReturn = true;
      }
    }

    this.comments = token.comments;
  }

  /**
   * Method to set roles for view.
   * @param token token
   */
  getRolesForView(token: RouterData) {
    if (token) {
      if (
        token.assignedRole === ValidatorRoles.MEDICAL_MANAGER ||
        token.assignedRole === ValidatorRoles.MEDICAL_MANAGER_SPACE
      ) {
        this.canEdit = true;
        this.canReject = true;
        this.canReturn = true;
      }
      if (token.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO) {
        this.ambTransaction = true;
      }
    }
  }

  /** Method to set lookup values for component. */
  getLookupValues() {
    this.rejectReasonList$ = this.lookupService.getMedicalBoardRejectReasonList();
    this.returnReasonList$ = this.lookupService.getMedicalBoardReturnReasonList();
  }

  /** Method to get documents for the transaction. */
  getTransactionDocuments(
    transactionId: string,
    transactionType: string | string[],
    contractId: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(transactionId, transactionType, contractId).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  /** Method to navigate to inbox on error during view initialization. */
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.backToInbox();
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }

  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }

  /** Method to navigate to inbox. */
  backToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to get workflow action. */
  getWorkflowAction(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
      case 2:
        action = WorkFlowActions.RETURN;
        break;
    }
    return action;
  }

  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    if (this.validatorMemberForm.get('rejectionReason'))
      datas.rejectionReason = this.validatorMemberForm.get('rejectionReason').value;
    if (this.validatorMemberForm.get('returnReason'))
      datas.returnReason = this.validatorMemberForm.get('returnReason').value;
    if (this.validatorMemberForm.get('comments')) datas.comments = this.validatorMemberForm.get('comments').value;
    datas.taskId = routerData.taskId;
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    return datas;
  }

  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: ContributorBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.backToInbox();
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.SUBMIT:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-RETURN-MESSAGE';
        break;
      case WorkFlowActions.MODIFY_VISITING_DOCTOR:
      case WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
    }
    return messageKey;
  }
  setWorkFlowDataForConfirmation = function (
    routerData: RouterData,
    sessionId: number,
    sessionSlot: number,
    bpmContent
  ): OhBPMRequest {
    const workflowData = new OhBPMRequest();
    // const payload = JSON.parse(routerData.payload);
    workflowData.taskId = routerData.taskId;
    workflowData.user = routerData.assigneeId;
    bpmContent.Request.Body.sessionId = sessionId;
    bpmContent.TXNElement.Body.sessionId = sessionId;
    bpmContent.Request.Body.sessionSlot = sessionSlot;
    bpmContent.TXNElement.Body.sessionSlot = sessionSlot;
    workflowData.payload = bpmContent;
    if (routerData.resourceType === RouterConstants.TRANSACTION_MB_APPOINTMENT_REMINDER) {
      workflowData.outcome = WorkFlowActions.APPROVE;
      workflowData.sessionId = sessionId;
      workflowData.sessionSlot = sessionSlot;
      if (this.validatorMemberForm.get('comments'))
        workflowData.comments = this.validatorMemberForm.get('comments').value;
    }
    return workflowData;
  };
}
