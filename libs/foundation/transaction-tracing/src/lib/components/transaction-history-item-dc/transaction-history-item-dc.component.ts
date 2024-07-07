/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Transaction, TransactionStatus, statusBadgeType, ApplicationTypeToken } from '@gosi-ui/core';

@Component({
  selector: 'trn-transaction-history-item-dc',
  templateUrl: './transaction-history-item-dc.component.html',
  styleUrls: ['./transaction-history-item-dc.component.scss']
})
export class TransactionHistoryItemDcComponent implements OnInit {
  /** 
  Input variables to get values from transaction-history-sc component
*/
  @Input() transaction: Transaction;
  @Input() index = 0;
  @Input() lang;
  transactionStatus = TransactionStatus;
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {}

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(txn: Transaction) {
    return statusBadgeType(txn.status.english);
  }
}
