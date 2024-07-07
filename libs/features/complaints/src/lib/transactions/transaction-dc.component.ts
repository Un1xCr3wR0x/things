/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '@gosi-ui/core';

@Component({
  selector: 'ces-transaction-dc',
  templateUrl: './transaction-dc.component.html',
  styles: []
})
export class TransactionDcComponent implements OnInit {
  constructor(readonly transactionService: TransactionService, readonly route: ActivatedRoute) {}

  ngOnInit(): void {}
}
