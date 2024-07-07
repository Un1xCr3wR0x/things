import {
  BPMUpdateRequest,
  RouterData,
  WorkFlowActions,
  AlertService,
  RouterConstants,
  BPMMergeUpdateParamEnum,
  BPMCommentScope
} from '@gosi-ui/core';
import { FormGroup } from '@angular/forms';
import { PaymentService } from '../../shared';
import { Router } from '@angular/router';

export abstract class ValidatorBaseScComponent {
  constructor(readonly alertService: AlertService, readonly paymentService: PaymentService, readonly router: Router) {}
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
  saveWorkflow(data: BPMUpdateRequest) {
    this.paymentService.handleAnnuityWorkflowActions(data).subscribe(
      response => {
        if (data.outcome === WorkFlowActions.APPROVE) {
          this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_APPROVED');
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
}
