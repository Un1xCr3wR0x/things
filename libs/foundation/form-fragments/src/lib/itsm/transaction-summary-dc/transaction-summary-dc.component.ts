/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '@gosi-ui/core';

@Component({
  selector: 'frm-transaction-summary-dc',
  templateUrl: './transaction-summary-dc.component.html',
  styleUrls: ['./transaction-summary-dc.component.scss']
})
export class TransactionSummaryDcComponent implements OnInit {
  /**
   * input variables
   */

  //Input Variables
  @Input() transactionSummary: Transaction;

  constructor() {}
  /**
   * Method to intialise tasks
   * */
  ngOnInit(): void {}
}
