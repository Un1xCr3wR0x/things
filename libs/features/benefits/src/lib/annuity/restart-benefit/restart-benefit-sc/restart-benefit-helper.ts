import { Directive, HostListener } from '@angular/core';
import { BPMUpdateRequest, WorkFlowActions, DocumentItem } from '@gosi-ui/core';
import { HeirBaseComponent } from '../../base/heir.base-component';
import { showErrorMessage } from '../../../shared/utils';

@Directive()
export abstract class RestartBenefitHelperComponent extends HeirBaseComponent {
  inEditMode = false;
  transactionId: string;
  restartTransactionType: string;
  referenceNumber: number;
  documentuuid: string;

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comments) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.comments = comments.comments;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.benefitRequestId,
          this.transactionId,
          this.restartTransactionType,
          this.referenceNumber,
          undefined,
          this.documentuuid
        )
        .subscribe(res => {
          if (res) document = res;
        });
    }
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  initialisePayeeType() {
    this.lookUpService.initialisePayeeType().subscribe(payee => {
      this.payeeList = payee;
    });
  }
}
