/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BPMUpdateRequest,
  RouterData,
  WorkFlowActions,
  AlertService,
  RouterConstants,
  LovList,
  Role,
  RouterDataToken,
  DocumentService,
  LanguageToken,
  Channel,
  TransactionStatus,
  CoreBenefitService,
  CoreAdjustmentService,
  AuthTokenService,
  ApplicationTypeToken,
  CoreContributorService
} from '@gosi-ui/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService, AdjustmentService, AdjustmentConstants } from '../../../shared';
import { AdjustmentRepaymentValidator } from '../../../shared/models';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Directive, Inject, TemplateRef } from '@angular/core';
import { ValidatorBaseScComponent } from './validator-sc.base-component';

@Directive()
export abstract class ValidatorRepayBaseScComponent extends ValidatorBaseScComponent {
  adjustmentRepayId: number;
  adjustmentRepayDetails: AdjustmentRepaymentValidator;
  canApprove = true;
  disableApprove = false;
  canReject = false;
  canReturn = false;
  lang = 'en';
  personId: number;
  adjModificationId: number;
  returnReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  transactionNumber;
  registrationNo;
  requestId: number;
  referenceNo: number;
  socialInsuranceNo: number;
  workflowType;
  channel;
  taskId: string;
  user: string;
  validatorCanEdit: boolean;
  modalRef: BsModalRef;
  approveComments: boolean;
  comments?;
  transactionReference;
  userName;
  RoleConst = Role;
  rejectWarningMessage = 'PAYMENT.INFO-VALIDATOR-REJECTION-NO-CONTRIBUTOR';
  payload;
  isSadad: boolean;

  constructor(
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly paymentService: PaymentService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public contributorService: CoreContributorService,
    readonly modalService: BsModalService,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly fb: FormBuilder
  ) {
    super(alertService, adjustmentService, coreBenefitService, paymentService, router);
  }
  initialiseView(routerData) {
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.adjustmentRepayId = payload?.adjustmentRepayId;
      this.personId = payload?.beneficiaryId;
      this.registrationNo = payload?.registrationNo;
      this.referenceNo = payload?.referenceNo;
      this.sin = payload?.socialInsuranceNo;
      this.requestId = +this.routerData.idParams.get('id');
      this.socialInsuranceNo = +this.routerData.idParams.get('socialInsuranceNo');
      this.workflowType = this.routerData.idParams.get('resource');
      this.transactionNumber = this.routerData.idParams.get('referenceNo');
      this.channel = payload.channel;
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.comments = this.routerData.comments;
      if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 && this.channel === Channel.FIELD_OFFICE) {
        this.validatorCanEdit = true; // Validator 1 can edit the transaction
      }
      this.trackTransaction();
      this.setButtonPrivilege(payload.assignedRole);
    }
    this.rejectReasonList = this.adjustmentService.getRejectReasonList();
    this.returnReasonList = this.adjustmentService.getReturnReasonList();
  }
  // Method to track transaction of Validator 1
  trackTransaction() {
    if (this.comments) {
      this.transactionReference = this.comments;
      if (this.comments.length > 0) {
        const transRefData = [];
        this.comments.forEach(data => {
          if (data.comments !== null) {
            transRefData.push(data);
          }
        });
        this.userName = this.comments[0].userName;
      }
      // todo: KP need to revisit transaction step status check
      this.transactionReference.forEach(item => {
        if (
          item &&
          item.role?.english === 'First Validator' &&
          item.transactionStepStatus?.toLowerCase() === 'validator submit'
        ) {
          if (item.transactionStatus?.toLowerCase() === TransactionStatus.COMPLETED.toLowerCase()) {
            if (this.routerData.assignedRole === Role.VALIDATOR_1) {
              this.approveComments = true;
              return;
            } else {
              this.approveComments = false;
            }
          } else if (item?.transactionStatus?.toLowerCase() === TransactionStatus.IN_PROGRESS.toLowerCase()) {
            if (this.routerData.assignedRole === Role.VALIDATOR_1) {
              this.disableApprove = true;
              return;
            } else {
              this.disableApprove = false;
            }
          }
        }
      });
    }
  }
  setButtonPrivilege(role) {
    if (role === Role.VALIDATOR_1 || role === 'Validator 1') {
      this.canReject = true;
    } else if (role === Role.VALIDATOR_2 || role === 'Validator 2') {
      this.canReturn = true;
      this.canReject = true;
    } else if (
      role === 'Finance Controller' ||
      role === Role.FC_CONTROLLER ||
      role === AdjustmentConstants.REPAY_FC_ROLE
    ) {
      this.canReturn = true;
    }
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false, { validators: Validators.required }]
    });
  }
  confirmApprovePayment(form: FormGroup, checkRepayForm: FormGroup) {
    const workflowData = this.setWorkFlowData(
      form,
      this.taskId,
      this.registrationNo,
      this.user,
      this.routerData,
      this.transactionNumber
    );
    workflowData.outcome = WorkFlowActions.APPROVE;
    this.saveWorkflow(workflowData, {
      personId: this.personId,
      adjustmentModificationId: this.adjModificationId,
      initiatePayment: checkRepayForm.get('checkBoxFlag').value
    });
    this.hideModal();
  }
  confirmRejectPayment(form: FormGroup) {
    // const workflowData = this.setWorkFlowData(
    //   form,
    //   this.taskId,
    //   this.registrationNo,
    //   this.user,
    //   this.routerData,
    //   this.transactionNumber
    // );
    // workflowData.outcome = WorkFlowActions.REJECT;
    const workflowData = this.setWorkFlowDataForMerge(this.routerData, form, WorkFlowActions.REJECT);
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  returnPayment(form: FormGroup) {
    const workflowData = this.setWorkFlowData(
      form,
      this.taskId,
      this.registrationNo,
      this.user,
      this.routerData,
      this.transactionNumber
    );
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  approveTransaction(template) {
    this.showModal(template);
  }
  rejectTransaction(template) {
    this.showModal(template);
  }
  returnTransaction(template) {
    this.showModal(template);
  }
  showCancelTemplate(template) {
    this.modalRef = this.modalService.show(template);
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  setWorkFlowData(
    childCompForm: FormGroup,
    taskId: string,
    registrationNo: number,
    user: string,
    routerData: RouterData,
    transactionNumber: number
  ) {
    const data = new BPMUpdateRequest();
    data.taskId = taskId;
    data.registrationNo = registrationNo;
    data.user = user;
    data.assignedRole = JSON.parse(routerData.payload).assignedRole;
    data.referenceNo = transactionNumber.toString();

    if (childCompForm && childCompForm.get('rejectionReason')) {
      data.rejectionReason = childCompForm.get('rejectionReason').value;
    }
    if (childCompForm && childCompForm.get('comments')) {
      data.comments = childCompForm.get('comments').value;
    }
    if (childCompForm && childCompForm.get('returnReason')) {
      data.returnReason = childCompForm.get('returnReason').value;
    }
    return data;
  }
  //Method to save workflow details.
  saveWorkflow(data: BPMUpdateRequest, request = null) {
    this.paymentService.handleAnnuityWorkflowActions(data).subscribe(
      () => {
        if (data.outcome === WorkFlowActions.APPROVE) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_APPROVED');
          if (data.assignedRole === 'Validator1' || data.assignedRole === 'Validator2') {
            this.adjustmentService
              .editDirectPayment(
                request?.personId,
                request?.adjustmentModificationId,
                request?.initiatePayment,
                this.sin
              )
              .subscribe();
          }
        } else if (data.outcome === WorkFlowActions.REJECT) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_REJECTED');
        } else if (data.outcome === WorkFlowActions.RETURN) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_RETURNED');
        } else if (data.outcome === WorkFlowActions.SUBMIT) {
          this.alertService.showSuccessByKey('PAYMENT.TRANSACTION-SUBMIT-MESSAGE');
        }
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        if (err.status === 400 || err.status === 422) {
          this.alertService.showError(err.error.message);
        }
        if (err.status === 500 || err.status === 404) {
          this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
        }
      }
    );
  }
  hideModal() {
    this.modalRef.hide();
  }
  confirmCancel() {
    this.modalRef.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
}
export const createDetailsForm = function (fb: FormBuilder) {
  let form: FormGroup;
  form = fb.group({
    taskId: [null],
    user: [null],
    status: [null],
    rejectionIndicator: [null]
  });
  return form;
};
export const bindQueryParamToForm = function (routerData: RouterData, childForm: FormGroup) {
  if (routerData) {
    childForm.get('taskId').setValue(routerData.taskId);
    childForm.get('user').setValue(routerData.assigneeId);
  }
};
