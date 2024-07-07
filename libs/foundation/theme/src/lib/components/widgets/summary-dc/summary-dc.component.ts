/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction, getChannel } from '@gosi-ui/core';

@Component({
  selector: 'gosi-summary-dc',
  templateUrl: './summary-dc.component.html',
  styleUrls: ['./summary-dc.component.scss']
})
export class SummaryDcComponent implements OnInit, OnChanges {
  @Input() transaction: Transaction;

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transaction && changes.transaction.currentValue)
      this.transaction = changes.transaction.currentValue;
  }

  ngOnInit(): void {}
}
