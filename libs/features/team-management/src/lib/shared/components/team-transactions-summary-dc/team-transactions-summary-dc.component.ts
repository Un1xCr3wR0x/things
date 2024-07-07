/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tm-team-transactions-summary-dc',
  templateUrl: './team-transactions-summary-dc.component.html',
  styleUrls: ['./team-transactions-summary-dc.component.scss']
})
export class TeamTransactionsSummaryDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() highPriorityTransactions: number;
  @Input() mediumPriorityTransactions: number;
  @Input() lowPriorityTransactions: number;
  @Input() totalCount: number;
  @Input() pendingTransactions: number;
  @Input() olaExceededTransactions: number;

  constructor() {}

  ngOnInit(): void {}
}
