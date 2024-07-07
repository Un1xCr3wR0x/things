/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TransactionName } from '../../../../shared/enums';
import { EngagementDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-wage-content-heading-dc',
  templateUrl: './wage-content-heading-dc.component.html',
  styleUrls: ['./wage-content-heading-dc.component.scss']
})
export class WageContentHeadingDcComponent implements OnChanges {
  /** Local variables */
  transactionReferenceNo: number;
  info: string;
  //Input Variables
  @Input() displayIcon: string;
  @Input() headingLabel: string;
  @Input() canEdit = false;
  @Input() currentEngagement: EngagementDetails;
  @Input() isVic = false;
  @Input() disableEdit = false;
  @Input() showUnifiedHeader = false;

  //Output Vairables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /** Method to check for changes in input variables. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentEngagement && changes.currentEngagement.currentValue) this.checkForPendingTransactions();
  }

  /** Method to check for pending transactions. */
  checkForPendingTransactions() {
    this.currentEngagement.pendingTransaction.forEach(item => {
      if (item.type.english === TransactionName.MANAGE_WAGE) {
        this.disableEdit = true;
        this.transactionReferenceNo = item.referenceNo;
        this.info = 'CONTRIBUTOR.WAGE.UPDATE-CURRENT-WAGE-PENDING-INFO';
      } else if (item.type.english === TransactionName.CHANGE_ENGAGEMENT) {
        if((!item.draft)){this.disableEdit = true;
        this.transactionReferenceNo = item.referenceNo;
        this.info = 'CONTRIBUTOR.WAGE.UPDATE-CHANGE-ENGAGEMENT-PENDING-INFO';}
      } else if (item.type.english === TransactionName.MANAGE_VIC_WAGE) {
        this.disableEdit = true;
        this.transactionReferenceNo = item.referenceNo;
        this.info = 'CONTRIBUTOR.VIC-WAGE-UPDATE.VIC-WAGE-UPDATE-IN-PROGRESS';
      }
    });
  }

  // Method to emit to edit values
  onEditWageContent() {
    this.onEdit.emit();
  }
}
