import { Component, Input, OnInit } from '@angular/core';
import { TerminateResponse } from '../../../shared';

@Component({
  selector: 'est-terminate-status-dc',
  templateUrl: './terminate-status-dc.component.html',
  styleUrls: ['./terminate-status-dc.component.scss']
})
export class TerminateStatusDcComponent implements OnInit {
  @Input() terminateStatus: TerminateResponse;
  @Input() transactionId: number;
  balanceAmount: number;
  displayBalanceAmount: number;

  constructor() {}

  ngOnInit(): void {
    this.balanceAmount =
      this.terminateStatus?.balance?.outStandingAmount - this.terminateStatus?.balance?.creditBalance;
    this.displayBalanceAmount = Math.abs(this.balanceAmount);
  }
}
