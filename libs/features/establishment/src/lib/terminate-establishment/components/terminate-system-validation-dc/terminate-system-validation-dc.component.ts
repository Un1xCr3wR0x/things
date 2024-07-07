/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TerminateResponse } from '../../../shared';

@Component({
  selector: 'est-terminate-system-validation-dc',
  templateUrl: './terminate-system-validation-dc.component.html',
  styleUrls: ['./terminate-system-validation-dc.component.scss']
})
export class TerminateSystemValidationDcComponent implements OnInit {
  @Input() terminateEligibilityStatus: TerminateResponse;
  balanceAmount: number;
  displayBalanceAmount: number;

  constructor() {}

  ngOnInit(): void {
    this.balanceAmount =
      this.terminateEligibilityStatus?.balance?.outStandingAmount -
      this.terminateEligibilityStatus?.balance?.creditBalance;
    this.displayBalanceAmount = Math.abs(this.balanceAmount);
  }
}
