/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TransactionStatus, TransactionWorkflowItem } from '@gosi-ui/core';

enum WORKFLOW_LINETYPE {
  HR_PASS = 'horizontal-pass',
  HR_FAIL = 'horizontal-fail',
  VR_PASS = 'vertical-pass',
  VR_FAIL = 'vertical-fail'
}

const enum TransactionWorkflowStatus {
  PENDING_EN = 'Pending',
  PENDING_AR = 'تحت الاجراء'
}
@Component({
  selector: 'gosi-workflow-progress-dc',
  templateUrl: './workflow-progress-dc.component.html',
  styleUrls: ['./workflow-progress-dc.component.scss']
})
export class WorkflowProgressDcComponent implements OnInit {
  @Input() workflowItems: TransactionWorkflowItem[] = [];
  transactionStatus = TransactionStatus;
  pendingColor = false;
  constructor() {}

  ngOnInit(): void {}

  workflowLineType(point: TransactionWorkflowItem, view: string) {
    const status = point.status?.english?.trim().toUpperCase();
    if (
      status === this.transactionStatus.PENDING.toUpperCase() ||
      status === this.transactionStatus.REASSIGNED.toUpperCase() ||
      status === this.transactionStatus.SUSPENDED.toUpperCase() ||
      status === this.transactionStatus.SEND_FOR_INSPECTION.toUpperCase()
    ) {
      point.status.english = TransactionWorkflowStatus.PENDING_EN;
      point.status.arabic = TransactionWorkflowStatus.PENDING_AR;
      return view === 'HR' ? WORKFLOW_LINETYPE.HR_FAIL : WORKFLOW_LINETYPE.VR_FAIL;
    } else {
      return view === 'HR' ? WORKFLOW_LINETYPE.HR_PASS : WORKFLOW_LINETYPE.VR_PASS;
    }
  }
}
