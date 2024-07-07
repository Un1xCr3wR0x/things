/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeToken, Transaction } from '@gosi-ui/core';
import { TransactionSummary } from '../../models';

@Component({
  selector: 'ces-complaint-against-details-dc',
  templateUrl: './complaint-against-details-dc.component.html',
  styleUrls: ['./complaint-against-details-dc.component.scss']
})
export class ComplaintAgainstDetailsDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() header = '';
  @Input() transactionSummary: TransactionSummary;

  @Output() navigate: EventEmitter<Transaction> = new EventEmitter();
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {}
  navigateToTransaction() {
    if (this.transactionSummary.transactionId) {
      const transaction = new Transaction();
      transaction.transactionId = this.transactionSummary.transactionId;
      transaction.status = this.transactionSummary.status;
      transaction.transactionRefNo = this.transactionSummary.referenceNo;
      this.navigate.emit(transaction);
    }
  }
}
