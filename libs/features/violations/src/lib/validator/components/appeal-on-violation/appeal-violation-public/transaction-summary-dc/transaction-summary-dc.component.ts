import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BilingualText, Transaction} from "@gosi-ui/core";

@Component({
  selector: 'vol-transaction-summary-dc',
  templateUrl: './transaction-summary-dc.component.html',
  styleUrls: ['./transaction-summary-dc.component.scss']
})
export class TransactionSummaryDcComponent {
  @Input() transactionId: number;
  @Input() transactionName: BilingualText;
  @Input() channel : BilingualText;
  @Input() status: BilingualText

  constructor() {}

}
