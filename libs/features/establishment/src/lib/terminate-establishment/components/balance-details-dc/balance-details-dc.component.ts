/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BalanceAmount } from '../../../shared';

@Component({
  selector: 'est-balance-details-dc',
  templateUrl: './balance-details-dc.component.html',
  styleUrls: ['./balance-details-dc.component.scss']
})
export class BalanceDetailsDcComponent implements OnInit {
  //Local Variables
  @Output() trigerBillDashboard: EventEmitter<null> = new EventEmitter();
  balanceAmount: number;
  displayBalanceAmount: number;
  url: string;
  violationAmount: number;
  adjustmentAmount: number;
  lateFeeAmount: number;

  //Input Variables
  @Input() balance: BalanceAmount;
  @Input() isDebit: boolean;

  constructor() {}

  ngOnInit(): void {
    this.balanceAmount = this.balance?.outStandingAmount - this.balance?.creditBalance;
    this.displayBalanceAmount = Math.abs(this.balanceAmount);
    this.violationAmount =
      (this.balance?.unBilledViolationAmount || 0) + (this.balance?.unBilledViolationAdjustments || 0);
    this.adjustmentAmount = (this.balance?.unBilledAdjustments || 0) + (this.balance?.unBilledAdjustmentsPenalty || 0);
    this.lateFeeAmount = this.balance?.unBilledPenalty || 0;
  }
}
