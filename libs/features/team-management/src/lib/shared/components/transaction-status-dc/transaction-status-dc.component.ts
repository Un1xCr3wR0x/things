/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tm-transaction-status-dc',
  templateUrl: './transaction-status-dc.component.html',
  styleUrls: ['./transaction-status-dc.component.scss']
})
export class TransactionStatusDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() pendingCount = 0;
  @Input() olaExceededCount = 0;
  constructor() {}

  ngOnInit(): void {}
}