import {
  BPMUpdateRequest,
  RouterData,
  WorkFlowActions,
  AlertService,
  RouterConstants,
  BPMMergeUpdateParamEnum,
  CoreActiveBenefits,
  CoreBenefitService,
  BPMCommentScope,
  Role,
  RoleIdEnum,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { FormGroup } from '@angular/forms';
import { PaymentService, AdjustmentService, PaymentRoutesEnum } from '../../../shared';
import { Router } from '@angular/router';
import { Directive } from '@angular/core';

@Directive({
  selector: '[pmtValidatorBase]'
})
export abstract class ValidatorBaseScComponent {
  personId: number;
  referenceNumber: number;
  requestId;
  sin: number;
  rolesEnum = Role;
  validatorAccess = BenefitsGosiShowRolesConstants.VALIDATOR_ROLES;

  constructor(
    readonly alertService: AlertService,
    readonly adjustmentService: AdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly paymentService: PaymentService,
    readonly router: Router
  ) {}
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

  setWorkFlowMergeData(childCompForm: FormGroup, routerData: RouterData, action: WorkFlowActions) {
    const workflowData = new BPMUpdateRequest();
    workflowData.taskId = routerData.taskId;
    workflowData.user = routerData.assigneeId;
    const formData = childCompForm.getRawValue();
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
    if (action === WorkFlowActions.REJECT || action === WorkFlowActions.RETURN) {
      workflowData.rejectionReason = formData.rejectionReason;
      workflowData.outcome = action;
      workflowData.comments = formData.comments;
      workflowData.commentScope = BPMCommentScope.BPM;
    }
    workflowData.payload = routerData.content;
    return workflowData;
  }
  //Method to save workflow details.
  saveWorkflow(data: BPMUpdateRequest, flag = true, request = null) {
    this.paymentService.handleAnnuityWorkflowActions(data).subscribe(
      () => {
        if (data.outcome === WorkFlowActions.APPROVE) {
          this.alertService.showSuccessByKey('ADJUSTMENT.TRANSACTION-APPROVED');
          if (flag === true) {
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
          }
        } else if (data.outcome === WorkFlowActions.REJECT) {
          this.alertService.showSuccessByKey('ADJUSTMENT.TRANSACTION-REJECTED');
        } else if (data.outcome === WorkFlowActions.RETURN) {
          this.alertService.showSuccessByKey('ADJUSTMENT.TRANSACTION-RETURNED');
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

  /** This method  to set workflow data For Merge and Update. */
  setWorkFlowDataForMerge = function (
    routerData: RouterData,
    childCompForm: FormGroup,
    action: WorkFlowActions
  ): BPMUpdateRequest {
    const workflowData = new BPMUpdateRequest();
    workflowData.taskId = routerData.taskId;
    workflowData.user = routerData.assigneeId;
    const formData = childCompForm.getRawValue();
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
    if (action === WorkFlowActions.REJECT || action === WorkFlowActions.RETURN) {
      workflowData.rejectionReason = formData.rejectionReason;
      workflowData.outcome = action;
      workflowData.comments = formData.comments;
      workflowData.commentScope = BPMCommentScope.BPM;
    }
    workflowData.payload = routerData.content;
    return workflowData;
  };
  /** Method to navigate to benefit details view */
  navigateToBenefitViewPage(type) {
    this.coreBenefitService.setActiveBenefit(
      new CoreActiveBenefits(this.sin, this.requestId, type, this.referenceNumber)
    );
    this.router.navigate([PaymentRoutesEnum.VIEW_BENEFIT_PAGE]);
  }
}
