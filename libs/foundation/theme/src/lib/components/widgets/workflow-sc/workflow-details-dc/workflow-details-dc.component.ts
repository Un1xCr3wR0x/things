/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { TransactionStatus, StatusBadgeTypes, TransactionWorkflowItem } from '@gosi-ui/core';
@Component({
  selector: 'gosi-workflow-details-dc',
  templateUrl: './workflow-details-dc.component.html',
  styleUrls: ['./workflow-details-dc.component.scss']
})
export class WorkflowDetailsDcComponent implements OnInit, OnChanges {
  // local variables
  showContent = false;
  transactionStatus = TransactionStatus;

  /**Input variables */
  @Input() workflowItems: TransactionWorkflowItem[] = [];
  /**
   * Output variables
   */
  @Output() show: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.workflowItems?.currentValue) {
      this.workflowItems = changes?.workflowItems?.currentValue;
      this.workflowItems.forEach(item => {
        if (item.approverName?.arabic === null) {
          item.approverName.arabic = item.approverName.english;
        }
      });
      this.showContent = false;
    }
  }
  showContentMethod() {
    this.showContent = !this.showContent;
    if (this.showContent) this.show.emit();
  }

  statusBadgeType(wrk: TransactionWorkflowItem) {
    const status = wrk.status?.english?.trim().toUpperCase();
    if (
      status === this.transactionStatus.COMPLETED.toUpperCase() ||
      status === this.transactionStatus.APPROVED.toUpperCase() ||
      status === this.transactionStatus.RESUBMITTED.toUpperCase() ||
      status === this.transactionStatus.INITIATED.toUpperCase()
    ) {
      return StatusBadgeTypes.SUCCESS;
    } else if (
      status === this.transactionStatus.REJECTED.toUpperCase() ||
      status === this.transactionStatus.RETURNED.toUpperCase() ||
      status === this.transactionStatus.RETURN.toUpperCase()
    ) {
      return StatusBadgeTypes.DANGER;
    } else if (
      status === this.transactionStatus.IN_PROGRESS.toUpperCase() ||
      status === this.transactionStatus.DRAFT.toUpperCase() ||
      status === this.transactionStatus.PENDING.toUpperCase() ||
      status === this.transactionStatus.ASSIGNED.toUpperCase()
    ) {
      return StatusBadgeTypes.WARNING;
    } else {
      return StatusBadgeTypes.INFO;
    }
  }
}
