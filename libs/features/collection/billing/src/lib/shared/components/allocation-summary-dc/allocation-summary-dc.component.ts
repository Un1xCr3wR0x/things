/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CreditAllocation, AllocationDetails } from '../../../shared/models';

@Component({
  selector: 'blg-allocation-summary-dc',
  templateUrl: './allocation-summary-dc.component.html',
  styleUrls: ['./allocation-summary-dc.component.scss']
})
export class AllocationSummaryDcomponent implements OnInit, OnChanges {
  /** Local Variables */
  totalDebitAmount = 0;
  totalAllocatedAmount = 0;
  totalBalanceAmount = 0;
  creditToAnotherEstBalanceAmount = 0;
  currentCurrencyLable: string;
  balanceAmount = 0;
  debitFlag = false;

  /** Input Variables */
  @Input() creditSummaryValue: CreditAllocation[];
  @Input() allocationCreditTotal: number;
  @Input() allocationDetails: AllocationDetails;
  @Input() exchangeRate = 1;
  @Input() currentCurrency: string;
  constructor() {}

  /** Method to fetch details on inialising data */
  ngOnInit() {}

  /** Method to fetch details on input changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.creditSummaryValue && changes.creditSummaryValue.currentValue) {
      this.creditSummaryValue = changes.creditSummaryValue.currentValue;
      this.getAllocationSummaryDetails(this.creditSummaryValue);
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
  }

  /** Method to fetch allocation summary details */
  getAllocationSummaryDetails(creditSummaryValue: CreditAllocation[]) {
    this.totalDebitAmount = 0;
    this.totalAllocatedAmount = 0;
    this.totalBalanceAmount = 0;
    for (let i = 0; i < creditSummaryValue.length; i++) {
      this.totalDebitAmount +=
        creditSummaryValue[i].adjustmentForCurrent.debitAmount +
        creditSummaryValue[i].amountFromPreviousBill.debitAmount +
        creditSummaryValue[i].currentMonthDues.debitAmount;
      this.totalAllocatedAmount +=
        creditSummaryValue[i].adjustmentForCurrent.allocatedAmount +
        creditSummaryValue[i].amountFromPreviousBill.allocatedAmount +
        creditSummaryValue[i].currentMonthDues.allocatedAmount;

      this.totalBalanceAmount +=
        creditSummaryValue[i].adjustmentForCurrent.balance +
        creditSummaryValue[i].amountFromPreviousBill.balance +
        creditSummaryValue[i].currentMonthDues.balance;
    }
    if (this.allocationDetails.creditRefund) {
      this.totalDebitAmount = this.totalDebitAmount + this.allocationDetails.creditRefund?.debitAmount;
      this.totalAllocatedAmount = this.totalAllocatedAmount + this.allocationDetails.creditRefund?.allocatedAmount;
    }
    if (this.allocationDetails.creditToAnotherEst !== undefined) {
      this.creditToAnotherEstBalanceAmount =
        this.allocationDetails.creditToAnotherEst.debitAmount -
        this.allocationDetails.creditToAnotherEst.allocatedAmount;
      this.totalDebitAmount = this.totalDebitAmount + this.allocationDetails.creditToAnotherEst.debitAmount;
      this.totalAllocatedAmount = this.totalAllocatedAmount + this.allocationDetails.creditToAnotherEst.allocatedAmount;
    }

    this.totalBalanceAmount = this.totalBalanceAmount + this.creditToAnotherEstBalanceAmount;
    if (this.totalDebitAmount !== this.totalAllocatedAmount) {
      this.balanceAmount = this.totalBalanceAmount;
      this.debitFlag = true;
    } else {
      this.balanceAmount = this.allocationCreditTotal - this.totalAllocatedAmount;
      this.debitFlag = false;
    }
  }
}
